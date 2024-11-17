import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { BookMarked, CircleArrowRight, KeyRound, Mail, Phone, User } from 'lucide-react';
import { FormProvider, SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ions/button';
import { PasswordField } from '@/components/molecules/form/PasswordField';
import { TextField } from '@/components/molecules/form/TextField';
import { useState } from 'react';

const signUpSchema = z.object({
  name: z.string({
    required_error: 'Um nome por favor',
  }).min(3, 'Seu nome e sobrenome querido :)'),
  email: z.string({
    required_error: 'Um email por favor',
  }).email('O email com certeza não é válido'),
  password: z.string({
    required_error: 'Uma senha por favor',
  }).min(3, 'Deve ter pelo menos alguns caracteres a mais né?'),
  password_confirmation: z.string({
    required_error: 'Uma senha, se possível a mesma que a anterior heheh',
  }).min(3, 'Deve ter pelo menos alguns caracteres a mais né?'),
  phone: z.string({
    required_error: 'Um telefone por favor',
  }).min(11, 'Deve ter pelo menos alguns caracteres a mais né?'),
}).refine(data => data.password === data.password_confirmation, {
  message: 'As senhas não coincidem',
  path: ['password_confirmation'],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUpPage = () => {
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  //  const { mutateAsync: signUp, isPending: isLoading } = useMutation({
  //    mutationFn: async (formData: SignUpFormData) => {
  //      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/sign-up`, {
  //        account: formData
  //      });

  //      return data;
  //    },
  //  });

  const onFormSubmit: SubmitHandler<SignUpFormData> = async () => {
    setIsLoading(true);
    // await signUp(data);

    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsLoading(false);
  }

  const onFormError: SubmitErrorHandler<SignUpFormData> = (error) => {
    console.log(error, 'error');
  }

  return (
    <main className="w-full h-screen bg-[url('/sign-in-bg.webp')] flex items-center justify-center">
      <div className="bg-white/5 backdrop-blur-sm w-full h-full absolute"></div>
      <section className="max-w-[26rem] w-full z-10 relative border border-[#B3B3B3] bg-white px-6 py-10 rounded-lg">
        <div className="flex items-center justify-center gap-4">
          <BookMarked size={32} strokeWidth={1.5} />

          <h5 className="text-4xl text-black font-title font-normal">
            Criar sua conta
          </h5>
        </div>

        <FormProvider {...form}>
          <form className='flex flex-col gap-4 mt-8' onSubmit={form.handleSubmit(onFormSubmit, onFormError)}>
            <TextField name="name" iconLeft={<User size={16} />} label='Nome' placeholder='Nome e sobrenome' />

            <TextField name="email" iconLeft={<Mail size={16} />} label='Email' placeholder='emaildigno@gmail.com' />

            <PasswordField name="password" iconLeft={<KeyRound size={16} />} label='Senha' placeholder='••••••••••' />

            <PasswordField name="password_confirmation" iconLeft={<KeyRound size={16} />} label='Confirmação de senha' placeholder='••••••••••' />

            <TextField name="phone" iconLeft={<Phone size={16} />} label='Telefone' placeholder='(11) 99999-9999' />

            <Button type="submit" iconRight={CircleArrowRight} className='flex justify-between mt-4' loading={isLoading}>
              Criar conta
            </Button>
          </form>
        </FormProvider>

        <p className='text-sm text-black/50 mt-4 font-title text-center'>
          Já tem uma conta?{' '}
          <Link to="/sign-in" className='text-[#2C7DA0] underline cursor-pointer hover:text-[#014F86] duration-200 transition-colors'>
            Acessar
          </Link>
        </p>
      </section>
    </main >
  )
}
