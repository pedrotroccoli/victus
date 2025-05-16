import { z } from "zod";
import { createHabitValidation } from "./utils";

export interface CreateHabitModalProps {
  onSave?: (data: CreateHabitModalOnSaveProps) => void;
  habit?: Habit;
  categories?: HabitCategory[];
  onEditDelta?: (deltaId: string) => void;
}

export type CreateHabitForm = z.infer<typeof createHabitValidation>;

export type CreateHabitModalOnSaveProps = CreateHabitForm & {
  rrule: string;
}