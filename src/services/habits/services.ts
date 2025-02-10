import { baseApi } from "../api";
import {
  CheckHabitRequest, CheckHabitResponse,
  CreateHabitRequest, CreateHabitResponse,
  GetAllHabitsCheckRequest,
  GetAllHabitsCheckResponse,
  GetHabitsRequest,
  GetHabitsResponse,
  UpdateHabitRequest
} from "./types";

export const getHabits = async (params: GetHabitsRequest): Promise<GetHabitsResponse> => {
  const { data } = await baseApi.get('/habits', {
    params
  });

  return data;
}

export const createHabit = async ({ infinite, ...params }: CreateHabitRequest): Promise<CreateHabitResponse[]> => {
  const { data } = await baseApi.post('/habits', {
    ...params,
    recurrence_type: infinite ? 'infinite' : 'daily',
    end_date: infinite ? undefined : params.end_date
  });

  return data;
}

export const updateHabit = async (params: UpdateHabitRequest): Promise<Habit> => {
  const { data } = await baseApi.put(`/habits/${params._id}`, {
    ...params,
  });

  return data;
}
export const checkHabit = async (habit: CheckHabitRequest): Promise<CheckHabitResponse> => {
  if (habit.check_id) {
    const { data } = await baseApi.put(`/habits-check/${habit.habit_id}/${habit.check_id}`);

    return data;
  }

  const { data } = await baseApi.post(`/habits-check/${habit.habit_id}`);

  return data;
}

export const getAllHabitsCheck = async (params: GetAllHabitsCheckRequest): Promise<GetAllHabitsCheckResponse> => {
  const { data } = await baseApi.get('/habits-check', {
    params
  });

  return data;
}