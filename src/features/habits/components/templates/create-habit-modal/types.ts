import { z } from "zod";
import { createHabitValidation } from "./utils";

export interface CreateHabitModalProps {
  onSave?: (data: CreateHabitModalOnSaveProps) => void;
  onPause?: (data: { pause: boolean }) => void;
  onFinish?: () => void;
  habit?: Habit;
  categories?: HabitCategory[];
  onEditDelta?: (deltaId: string) => void;
  onCreateDelta?: () => void;
  newDeltas?: {
    _id: string;
    name: string;
    type: 'number' | 'time';
  }[];
}

export type CreateHabitForm = z.infer<typeof createHabitValidation>;

export type CreateHabitModalOnSaveProps = CreateHabitForm & {
  rrule: string;
}