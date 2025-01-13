import { UndefinedInitialDataInfiniteOptions, useMutation, UseMutationOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkHabit, createHabit, getHabits } from "./services";
import { CheckHabitRequest, CheckHabitResponse, CreateHabitRequest, CreateHabitResponse } from "./types";

type UseGetHabitsProps = UndefinedInitialDataInfiniteOptions<any, Error, any, string[]>;

export const useGetHabits = (options: Partial<UseGetHabitsProps>) => useQuery({
  ...options,
  queryKey: ['habits'],
  queryFn: getHabits
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
      // const cache = queryClient.getQueryData(['habits']) as CreateHabitResponse[] || [];

      const response = await checkHabit(params);

      //queryClient.setQueryData(['habits'], [...cache, response]);

      return response;
    }
  })
}
