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
  habit_category_id?: string;
  recurrence_details?: {
    rule: string;
  };
  habit_deltas?: {
    name: string;
    type: string;
  }[];
  rule_engine_enabled: boolean;
}

export interface UpdateHabitRequest {
  _id: string;
  name?: string;
  order?: number;
  habit_category_id?: string;
  recurrence_type?: string;
  recurrence_details?: {
    rule: string;
  };
  habit_deltas_attributes?: {
    id?: string;
    type: string;
    name: string;
    enabled: boolean;
    _destroy?: boolean;
  }[];
  paused?: boolean;
  finished?: boolean;
}

export type CreateHabitResponse = Habit;

export interface CheckHabitRequest {
  habit_id: string;
  check_id?: string;
  checked?: boolean;
}

export type CheckHabitResponse = HabitCheck;

export interface GetAllHabitsCheckRequest {
  start_date?: DateFormat;
  end_date?: DateFormat;
}

export type GetAllHabitsCheckResponse = HabitCheck[];


export interface UpdateHabitCheckRequest {
  habit_id: string;
  check_id: string;
  habit_check_deltas_attributes: {
    _id?: string;
    habit_delta_id: string;
    value: number | string;
    _destroy?: boolean;
  }[];
}

export type UpdateHabitCheckResponse = HabitCheck;
