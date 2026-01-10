import { z } from "zod";
import { createHabitValidation } from "./utils";

export interface CreateHabitModalProps {
  onSave?: (data: CreateHabitModalOnSaveProps) => void;
  onPause?: (data: { pause: boolean }) => void;
  onFinish?: () => void;
  habit?: Habit;
  habits?: Habit[];
  categories?: HabitCategory[];
  onEditDelta?: (deltaId: string) => void;
  onCreateDelta?: () => void;
  newDeltas?: {
    _id: string;
    name: string;
    type: "number" | "time";
  }[];
}

export type CreateHabitForm = z.infer<typeof createHabitValidation>;

export type RuleEngineAnd = {
  type: "and";
  and?: string[];
};

export type RuleEngineOr = {
  type: "or";
  or?: string[];
};

export type CreateHabitModalOnSaveProps = CreateHabitForm & {
  rrule: string;
  children_habit_ids?: string[];
  rule_engine_enabled?: boolean;
  rule_engine_details?: {
    logic: RuleEngineAnd | RuleEngineOr;
  };
};
