import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { BookMarked, CircleArrowRight, KeyRound, Mail } from 'lucide-react';
import { FormProvider, SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ions/button';
import { PasswordField } from '@/components/molecules/form/PasswordField';
import { TextField } from '@/components/molecules/form/TextField';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const signInSchema = z.object({
  email: z.string({
    required_error: 'Um email por favor',
  }).email('O email com certeza não é válido'),
  password: z.string({
    required_error: 'Uma senha por favor',
  }).min(3, 'Deve ter pelo menos alguns caracteres a mais né?'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export const SignInPage = () => {
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });
  const [isLoading, setIsLoading] = useState(false);

  const onFormSubmit: SubmitHandler<SignInFormData> = async (data) => {
    setIsLoading(true);
    console.log(data, 'data');

    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsLoading(false);
  }

  const onFormError: SubmitErrorHandler<SignInFormData> = (error) => {
    console.log(error, 'error');
  }

  return (
    <main className="w-full h-screen bg-[url('/sign-in-bg.webp')] flex items-center justify-center">
      <div className="bg-white/5 backdrop-blur-sm w-full h-full absolute"></div>
      <section className="max-w-[26rem] w-full z-10 relative border border-[#B3B3B3] bg-white px-6 py-10 rounded-lg">
        <div className="flex items-center justify-center gap-4">
          <BookMarked size={32} strokeWidth={1.5} />

          <h5 className="text-4xl text-black font-title font-normal">
            Acessar seu jornal
          </h5>
        </div>

        <FormProvider {...form}>
          <form className='flex flex-col gap-4 mt-8' onSubmit={form.handleSubmit(onFormSubmit, onFormError)}>
            <TextField name="email" iconLeft={<Mail size={16} />} label='Email' placeholder='emaildigno@gmail.com' />

            <div className='relative'>
              <Link to="/sign-up" className={
                cn(
                  ' absolute right-0 top-0 font-title text-sm underline text-black/50 cursor-pointer hover:text-black/70 duration-200 transition-colors'
                )
              }>
                Esqueceu sua senha?
              </Link>

              <PasswordField name="password" iconLeft={<KeyRound size={16} />} label='Senha' placeholder='••••••••••' />
            </div>

            <Button type="submit" iconRight={CircleArrowRight} className='flex justify-between mt-4' loading={isLoading}>
              Acessar
            </Button>
          </form>
        </FormProvider>

        <p className='text-sm text-black/50 mt-4 font-title text-center'>
          Não tem uma conta?{' '}
          <Link to="/sign-up" className='text-[#2C7DA0] underline cursor-pointer hover:text-[#014F86] duration-200 transition-colors'>
            Criar conta
          </Link>
        </p>
      </section>
    </main >
  )
}
