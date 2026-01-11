import { QueryClient, useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { checkHabit, createHabit, deleteHabit, getAllHabitsCheck, getHabits, updateHabit, updateHabitCheck } from "./services";
import { CheckHabitRequest, CheckHabitResponse, CreateHabitRequest, CreateHabitResponse, GetAllHabitsCheckRequest, GetAllHabitsCheckResponse, GetHabitsRequest, GetHabitsResponse, UpdateHabitCheckRequest, UpdateHabitRequest } from "./types";

type UseGetHabitsProps = Partial<UseQueryOptions<GetHabitsResponse, Error, GetHabitsResponse, string[]>>;

export const useGetHabits = (params: GetHabitsRequest, options: Partial<UseGetHabitsProps>) => useQuery({
  ...options,
  queryKey: ['habits'],
  queryFn: () => getHabits(params)
})

type UseGetHabitsCheckProps = Partial<UseQueryOptions<GetAllHabitsCheckResponse, Error, GetAllHabitsCheckResponse, string[]>>;

export const useGetHabitsCheck = (params: GetAllHabitsCheckRequest, options: Partial<UseGetHabitsCheckProps>) => useQuery({
  ...options,
  queryKey: ['habits-check'],
  queryFn: () => getAllHabitsCheck(params)
})


export const useCreateHabit = (options?: Partial<UseMutationOptions<CreateHabitResponse[], Error, CreateHabitRequest>>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: async (params) => {
      const cache = queryClient.getQueryData(['habits']) as CreateHabitResponse[] || [];

      const response = await createHabit(params);

      queryClient.setQueryData(['habits'], [...cache, response]);

      return response;
    }
  })
}

const applyCacheToCheckHabit = (queryClient: QueryClient, params: CheckHabitRequest, response: CheckHabitResponse) => {
  const cache = queryClient.getQueryData(['habits-check']) as CheckHabitResponse[] || [];

  if (!params?.check_id) {
    const newCache = [...cache, response];

    queryClient.setQueryData(['habits-check'], newCache);

    return
  }

  const newCache = cache.map(item => {
    if (item.habit_id === params.habit_id) {
      return response;
    }

    return item;
  });

  queryClient.setQueryData(['habits-check'], newCache);
}

export const useCheckHabit = (options?: Partial<UseMutationOptions<CheckHabitResponse, Error, CheckHabitRequest>>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: checkHabit,
    onMutate: async (params) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['habits-check'] });

      // Snapshot previous value
      const previousChecks = queryClient.getQueryData<CheckHabitResponse[]>(['habits-check']);

      // Optimistically update cache
      const optimisticCheck: CheckHabitResponse = {
        _id: params.check_id || `temp-${Date.now()}`,
        account_id: '',
        habit_id: params.habit_id,
        checked: params.checked ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      queryClient.setQueryData<CheckHabitResponse[]>(['habits-check'], (old = []) => {
        if (!params.check_id) {
          // New check - add to list
          return [...old, optimisticCheck];
        }
        // Update existing check
        return old.map(item =>
          item._id === params.check_id ? { ...item, checked: params.checked ?? !item.checked } : item
        );
      });

      return { previousChecks };
    },
    onError: (_err, _params, context) => {
      // Rollback on error
      if (context?.previousChecks) {
        queryClient.setQueryData(['habits-check'], context.previousChecks);
      }
    },
    onSuccess: (response, params) => {
      // Update cache with real response
      applyCacheToCheckHabit(queryClient, params, response);
    },
  })
}

export const useUpdateHabit = (options?: Partial<UseMutationOptions<Habit, Error, UpdateHabitRequest>>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: async (params) => {
      const response = await updateHabit(params);

      queryClient.setQueryData(['habits'], (prev: Habit[]) => prev.map(habit => habit._id === params._id ? response : habit));

      return response;
    }
  })
}

export const useUpdateHabitCheck = (options?: Partial<UseMutationOptions<HabitCheck, Error, UpdateHabitCheckRequest>>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: async (params) => {
      const response = await updateHabitCheck(params);

      queryClient.setQueryData(['habits-check'], (prev: HabitCheck[]) => prev.map(habitCheck => habitCheck._id === params.check_id ? response : habitCheck));

      return response;
    }
  })
}

export const useDeleteHabit = (options?: Partial<UseMutationOptions<void, Error, string>>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: async (id) => {
      await deleteHabit(id);

      queryClient.setQueryData(['habits'], (prev: Habit[]) => prev.filter(habit => habit._id !== id));
    }
  })
}
