import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createHabitCategory, deleteHabitCategory, getAllHabitCategories, updateHabitCategory } from "./services";
import { CreateHabitCategoryRequest, UpdateHabitCategoryRequest } from "./types";

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

export const useUpdateHabitCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateHabitCategoryRequest) => {
      const data = await updateHabitCategory(params);

      queryClient.setQueryData(['habit-categories'], (prev: HabitCategory[]) =>
        prev.map(category => category._id === params.id ? data : category)
      );

      queryClient.invalidateQueries({ queryKey: ['habits'] });

      return data;
    }
  });
}

export const useDeleteHabitCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteHabitCategory(id);

      queryClient.setQueryData(['habit-categories'], (prev: HabitCategory[]) =>
        prev.filter(category => category._id !== id)
      );
    }
  });
}
