declare global {
  interface HabitDelta {
    _id: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    description: string | null;
    enabled: boolean;
    name: string;
    type: 'number';
  }

  interface HabitDeltaCheck {
    _id: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    value: number;
    habit_delta_id: string;
  }

  interface Habit {
    _id: string;
    account_id: string;
    created_at: string;
    description: string | null;
    end_date: string;
    name: string;
    start_date: string;
    order: number;
    habit_category_id: string;
    habit_category: HabitCategory;
    updated_at: string;
    recurrence_type?: 'infinite' | 'daily' | 'weekly' | 'monthly' | 'yearly';
    recurrence_details?: {
      rule: string;
    };
    habit_deltas?: HabitDelta[];
  }

  interface HabitCheck {
    _id: string;
    account_id: string;
    checked: boolean;
    created_at: string;
    finished_at?: string;
    updated_at: string;
    habit_id: string;
    habit_check_deltas?: HabitDeltaCheck[];
  }
}

export { };
