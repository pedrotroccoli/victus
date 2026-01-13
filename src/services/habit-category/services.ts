import { baseApi } from "../api";
import { CreateHabitCategoryRequest, CreateHabitCategoryResponse, UpdateHabitCategoryRequest, UpdateHabitCategoryResponse } from "./types";

export const getAllHabitCategories = async (): Promise<HabitCategory[]> => {
  const { data } = await baseApi.get('/habits_category');

  return data;
};


export const createHabitCategory = async (params: CreateHabitCategoryRequest): Promise<CreateHabitCategoryResponse> => {
  const { data } = await baseApi.post('/habits_category', params);

  return data;
};

export const updateHabitCategory = async ({ id, ...params }: UpdateHabitCategoryRequest): Promise<UpdateHabitCategoryResponse> => {
  const { data } = await baseApi.put(`/habits_category/${id}`, params);

  return data;
};

export const deleteHabitCategory = async (id: string): Promise<void> => {
  await baseApi.delete(`/habits_category/${id}`);
};

