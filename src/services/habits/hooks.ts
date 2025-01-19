import { UndefinedInitialDataInfiniteOptions, useMutation, UseMutationOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkHabit, createHabit, getAllHabitsCheck, getHabits } from "./services";
import { CheckHabitRequest, CheckHabitResponse, CreateHabitRequest, CreateHabitResponse } from "./types";

type UseGetHabitsProps = UndefinedInitialDataInfiniteOptions<any, Error, any, string[]>;

export const useGetHabits = (options: Partial<UseGetHabitsProps>) => useQuery({
  ...options,
  queryKey: ['habits'],
  queryFn: getHabits
})

export const useGetHabitsCheck = (options: Partial<UseGetHabitsProps>) => useQuery({
  ...options,
  queryKey: ['habits-check'],
  queryFn: getAllHabitsCheck
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
    mutationFn: async (params) => {
      const cache = queryClient.getQueryData(['habits-check']) as CheckHabitResponse[] || [];

      const response = await checkHabit(params);

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

      return response;
    }
  })
}
