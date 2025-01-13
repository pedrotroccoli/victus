
export interface CreateHabitRequest {
  name: string;
  start_date: Date;
  end_date: Date;
  infinite: boolean;
  recurrence_type?: string;
  recurrence_details?: Record<string, string>;
}

export type CreateHabitResponse = Habit;

export interface CheckHabitRequest {
  habit_id: string;
  check_id?: string;
}

export type CheckHabitResponse = HabitCheck;
