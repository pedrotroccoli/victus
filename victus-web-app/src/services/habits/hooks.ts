import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
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
  queryKey: ['checks', params.start_date, params.end_date],
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

export const useCheckHabit = (options?: Partial<UseMutationOptions<CheckHabitResponse, Error, CheckHabitRequest>>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: checkHabit,
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: ['checks'] });

      const previousChecks = queryClient.getQueriesData<CheckHabitResponse[]>({ queryKey: ['checks'] });

      const optimisticCheck: CheckHabitResponse = {
        _id: params.check_id || `temp-${Date.now()}`,
        account_id: '',
        habit_id: params.habit_id,
        checked: params.checked ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      queryClient.setQueriesData<CheckHabitResponse[]>({ queryKey: ['checks'] }, (old = []) => {
        if (!params.check_id) {
          return [...old, optimisticCheck];
        }
        return old.map(item =>
          item._id === params.check_id ? { ...item, checked: params.checked ?? !item.checked } : item
        );
      });

      return { previousChecks };
    },
    onError: (_err, _params, context) => {
      if (context?.previousChecks) {
        context.previousChecks.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checks'] });
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
    mutationFn: updateHabitCheck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checks'] });
    },
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
