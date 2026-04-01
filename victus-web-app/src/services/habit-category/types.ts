export interface CreateHabitCategoryRequest {
  name: string;
  order: number;
  icon?: string;
}

export type CreateHabitCategoryResponse = HabitCategory;

export interface UpdateHabitCategoryRequest {
  id: string;
  name: string;
  icon?: string;
}

export type UpdateHabitCategoryResponse = HabitCategory;