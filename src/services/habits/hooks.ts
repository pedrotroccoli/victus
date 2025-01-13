import { UndefinedInitialDataInfiniteOptions, useMutation, UseMutationOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateHabitRequest, CreateHabitResponse } from ".";
import { createHabit, getHabits } from "./services";

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
