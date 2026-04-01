import { z } from "zod";
import { createDeltaValidation } from "./utils";

export interface CreateDeltaModalProps {
  onSave?: (data: CreateDeltaModalOnSaveProps) => void;
  habit?: Habit;
  deltaId?: string;
}

export type CreateDeltaForm = z.infer<typeof createDeltaValidation>;

export type CreateDeltaModalOnSaveProps = CreateDeltaForm 