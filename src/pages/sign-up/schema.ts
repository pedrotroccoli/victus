import { phoneValidator } from "@/utils/validators";
import { z } from "zod";


export const signUpSchema = z.object({
  name: z.string({
    required_error: 'Um nome por favor',
  }).min(3, 'Seu nome e sobrenome querido :)'),
  email: z.string({
    required_error: 'Um email por favor',
  }).email('O email com certeza não é válido'),
  password: z.string({
    required_error: 'Uma senha por favor',
  }).min(8, 'Deve ter pelo menos 8 caracteres'),
  password_confirmation: z.string({
    required_error: 'Uma senha, se possível a mesma que a anterior heheh',
  }).min(8, 'Deve ter pelo menos 8 caracteres'),
  phone: z.string({
    required_error: 'Um telefone por favor',
  }).min(11, 'Um telefone válido por favor').refine(phoneValidator, {
    message: 'O telefone não é válido',
  }),
}).refine(data => data.password === data.password_confirmation, {
  message: 'As senhas não coincidem',
  path: ['password_confirmation'],
});