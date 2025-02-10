import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createHabitCategory, getAllHabitCategories } from "./services";
import { CreateHabitCategoryRequest } from "./types";

export const useHabitCategories = () => useQuery({
  queryKey: ['habit-categories'],
  queryFn: getAllHabitCategories,
});

export const useCreateHabitCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateHabitCategoryRequest) => {
      const data = await createHabitCategory(params);

      queryClient.setQueryData(['habit-categories'], (prev: HabitCategory[]) => [...prev, data]);

      return data;
    }
  });
}
