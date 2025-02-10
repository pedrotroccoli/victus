export interface CreateHabitCategoryRequest {
  name: string;
  order: number;
}

export type CreateHabitCategoryResponse = HabitCategory;