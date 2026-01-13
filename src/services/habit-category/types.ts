export interface CreateHabitCategoryRequest {
  name: string;
  order: number;
  icon?: string;
}

export type CreateHabitCategoryResponse = HabitCategory;