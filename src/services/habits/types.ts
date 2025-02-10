export type DateFormat = `${number}-${number}-${number}`;

export interface GetHabitsRequest {
  start_date?: DateFormat;
  end_date?: DateFormat;
}

export type GetHabitsResponse = Habit[];

export interface CreateHabitRequest {
  name: string;
  start_date: Date;
  end_date: Date;
  infinite: boolean;
  recurrence_type?: string;
  recurrence_details?: {
    rule: string;
  };
}

export interface UpdateHabitRequest {
  _id: string;
  name?: string;
  order?: number;
}

export type CreateHabitResponse = Habit;

export interface CheckHabitRequest {
  habit_id: string;
  check_id?: string;
}

export type CheckHabitResponse = HabitCheck;

export interface GetAllHabitsCheckRequest {
  start_date?: DateFormat;
  end_date?: DateFormat;
}

export type GetAllHabitsCheckResponse = HabitCheck[];
