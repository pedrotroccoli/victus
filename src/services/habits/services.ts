import { CreateHabitRequest, CreateHabitResponse } from ".";
import { baseApi } from "../api";

export const getHabits = async () => {
  const { data } = await baseApi.get('/habits');

  return data;
}

export const createHabit = async (habit: CreateHabitRequest): Promise<CreateHabitResponse[]> => {
  const { data } = await baseApi.post('/habits', habit);

  return data;
}