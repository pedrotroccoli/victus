import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { createMood, deleteMood, getMoods, updateMood } from "./services";
import {
  CreateMoodRequest,
  CreateMoodResponse,
  GetMoodsResponse,
  Mood,
  UpdateMoodRequest,
  UpdateMoodResponse
} from "./types";

type UseGetMoodsProps = Partial<UseQueryOptions<GetMoodsResponse, Error, GetMoodsResponse, string[]>>;

export const useGetMoods = (options?: UseGetMoodsProps) => useQuery({
  ...options,
  queryKey: ['moods'],
  queryFn: getMoods
});

export const useCreateMood = (options?: Partial<UseMutationOptions<CreateMoodResponse, Error, CreateMoodRequest>>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: async (params) => {
      const response = await createMood(params);

      const cache = queryClient.getQueryData(['moods']) as Mood[] || [];
      queryClient.setQueryData(['moods'], [...cache, response]);

      return response;
    }
  });
};

export const useUpdateMood = (options?: Partial<UseMutationOptions<UpdateMoodResponse, Error, { id: string; params: UpdateMoodRequest }>>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: async ({ id, params }) => {
      const response = await updateMood(id, params);

      queryClient.setQueryData(['moods'], (prev: Mood[]) =>
        prev.map(mood => mood._id === response._id ? response : mood)
      );

      return response;
    }
  });
};

export const useDeleteMood = (options?: Partial<UseMutationOptions<void, Error, string>>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: async (id) => {
      await deleteMood(id);

      queryClient.setQueryData(['moods'], (prev: Mood[]) =>
        prev.filter(mood => mood._id !== id)
      );
    }
  });
};
