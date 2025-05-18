import { phoneValidator } from "@/utils/validators";
import { z } from "zod";


export const signUpSchema = z.object({
  name: z.string({
    required_error: 'name.required',
  }).min(3, 'name.at_least_3_characters'),
  email: z.string({
    required_error: 'email.required',
  }).email('email.invalid'),
  password: z.string({
    required_error: 'password.required',
  }).min(8, 'password.invalid'),
  password_confirmation: z.string({
    required_error: 'password_confirmation.required',
  }).min(8, 'password_confirmation.invalid'),
  phone: z.string({
    required_error: 'phone.required',
  }).min(11, 'phone.invalid').refine(phoneValidator, {
    message: 'phone.invalid',
  }),
}).refine(data => data.password === data.password_confirmation, {
  message: 'password.not_match',
  path: ['password_confirmation'],
});