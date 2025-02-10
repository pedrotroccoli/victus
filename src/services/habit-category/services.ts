import { baseApi } from "../api";
import { CreateHabitCategoryRequest, CreateHabitCategoryResponse } from "./types";

export const getAllHabitCategories = async (): Promise<HabitCategory[]> => {
  const { data } = await baseApi.get('/habits_category');

  return data;
};


export const createHabitCategory = async (params: CreateHabitCategoryRequest): Promise<CreateHabitCategoryResponse> => {
  const { data } = await baseApi.post('/habits_category', params);

  return data;
};

