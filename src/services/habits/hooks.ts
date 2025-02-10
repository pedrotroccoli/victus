import { QueryClient, useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { checkHabit, createHabit, getAllHabitsCheck, getHabits, updateHabit } from "./services";
import { CheckHabitRequest, CheckHabitResponse, CreateHabitRequest, CreateHabitResponse, GetAllHabitsCheckRequest, GetAllHabitsCheckResponse, GetHabitsRequest, GetHabitsResponse, UpdateHabitRequest } from "./types";

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
    mutationFn: async (params) => {
      const response = await checkHabit(params);

      applyCacheToCheckHabit(queryClient, params, response);

      return response;
    }
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