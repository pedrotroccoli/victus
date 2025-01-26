declare global {
  interface Habit {
    _id: string;
    account_id: string;
    created_at: string;
    description: string | null;
    end_date: string;
    name: string;
    start_date: string;
    order: number;
    updated_at: string;
    recurrence_type?: 'infinite' | 'daily' | 'weekly' | 'monthly' | 'yearly';
    recurrence_details?: Record<string, string>;
  }

  interface HabitCheck {
    _id: string;
    account_id: string;
    checked: boolean;
    created_at: string;
    finished_at?: string;
    updated_at: string;
    habit_id: string;
  }
}

export { };
