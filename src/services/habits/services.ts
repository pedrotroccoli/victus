import { baseApi } from "../api";
import {
  CheckHabitRequest, CheckHabitResponse,
  CreateHabitRequest, CreateHabitResponse
} from "./types";

export const getHabits = async () => {
  const { data } = await baseApi.get('/habits');

  return data;
}

export const createHabit = async (habit: CreateHabitRequest): Promise<CreateHabitResponse[]> => {
  const { data } = await baseApi.post('/habits', habit);

  return data;
}
export const checkHabit = async (habit: CheckHabitRequest): Promise<CheckHabitResponse[]> => {
  const { data } = await baseApi.post(`/habits-check/${habit.habit_id}${habit.check_id ? `/${habit.check_id}` : ''}`);

  return data;
}