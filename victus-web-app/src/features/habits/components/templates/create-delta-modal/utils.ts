import { z } from "zod";

export const createDeltaValidation = z.object({
  name: z.string().min(2, 'Nome do delta é obrigatório'),
  type: z.enum(['number', 'time']),
})