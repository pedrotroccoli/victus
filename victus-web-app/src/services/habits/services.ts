import { baseApi } from "../api";
import {
  CheckHabitRequest, CheckHabitResponse,
  CreateHabitRequest, CreateHabitResponse,
  GetAllHabitsCheckRequest,
  GetAllHabitsCheckResponse,
  GetHabitsRequest,
  GetHabitsResponse,
  UpdateHabitCheckRequest,
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
    habit: {
      ...params,
      delta_enabled: params.habit_deltas && params.habit_deltas.length > 0,
      recurrence_type: infinite ? 'infinite' : 'daily',
      end_date: infinite ? undefined : params.end_date
    }
  });

  return data;
}

export const deleteHabit = async (id: string): Promise<void> => {
  await baseApi.delete(`/habits/${id}`);
}

export const updateHabit = async (params: UpdateHabitRequest): Promise<Habit> => {
  const { data } = await baseApi.put(`/habits/${params._id}`, {
    habit: {
      ...params,
    }
  });

  return data;
}
export const checkHabit = async (habit: CheckHabitRequest): Promise<CheckHabitResponse> => {
  if (habit.check_id) {
    const { data } = await baseApi.put(`/habits/${habit.habit_id}/checks/${habit.check_id}`, {
      checked: habit.checked
    });

    return data;
  }

  const { data } = await baseApi.post(`/habits/${habit.habit_id}/checks`, {
    checked: habit.checked
  });

  return data;
}

export const updateHabitCheck = async (habitCheck: UpdateHabitCheckRequest): Promise<HabitCheck> => {
  const { data } = await baseApi.put(`/habits/${habitCheck.habit_id}/checks/${habitCheck.check_id}`, habitCheck);

  return data;
}

export const getAllHabitsCheck = async (params: GetAllHabitsCheckRequest): Promise<GetAllHabitsCheckResponse> => {
  const { data } = await baseApi.get('/checks', {
    params
  });

  return data;
}