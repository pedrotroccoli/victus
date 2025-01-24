import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@tanstack/react-router';
import { BookMarked, CircleArrowRight, KeyRound, Mail, Phone, User } from 'lucide-react';
import { FormProvider, SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ions/button';
import { PasswordStrengthBars } from '@/components/ions/password-strength-bars';
import { PasswordStrengthList } from '@/components/ions/password-strength-list';
import { PasswordField } from '@/components/molecules/form/PasswordField';
import { TextField } from '@/components/molecules/form/TextField';
import { useSignUp } from '@/services/auth/hooks';
import { setToken } from '@/services/auth/services';
import { phoneParser } from '@/utils/parsers';
import { evaluatePasswordStrength } from '@/utils/validators/password';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { signUpSchema } from './schema';

type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUpPage = () => {
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });
  const navigate = useNavigate();

  const { mutateAsync: signUp, isPending: isLoading } = useSignUp();

  const onFormSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    const firstName = data.name.split(' ')[0];

    try {
      const { token } = await signUp({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        confirmPassword: data.password_confirmation,
      });

      await setToken(token);

      toast.success(
        `Olá ${firstName}, seja bem-vindo!`, {
        dismissible: true,
        description: 'Agora você pode acessar o sistema',
      }
      )

      navigate({ to: '/dashboard' });
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        toast.error('Essa conta já existe em nosso sistema', {
          dismissible: true,
        });
      } else {
        toast.error(`${firstName}, ocorreu um erro`, {
          description: 'Por favor, daqui a 10 segundos tente novamente',
        });
      }
    }
  }

  const onFormError: SubmitErrorHandler<SignUpFormData> = (error) => {
    const labelsHash = {
      name: 'Nome',
      email: 'Email',
      password: 'Senha',
      password_confirmation: 'Confirmação de senha',
      phone: 'Telefone',
    }

    toast.error(`Ei, se acalme`, {
      description: `Preencha o campo '${labelsHash[Object.entries(error)[0][0] as keyof SignUpFormData]}' corretamente`,
      duration: 2000
    });
  }

  const passwordStrength = evaluatePasswordStrength(form.watch('password'));

  return (
    <main className="w-full h-screen bg-[url('/sign-in-bg.webp')] flex items-center justify-center">
      <div className="bg-white/5 backdrop-blur-sm w-full h-full absolute"></div>
      <section className="max-w-[26rem] w-full z-10 relative border border-[#B3B3B3] bg-white px-6 py-10 rounded-lg mt-8">
        <div className="flex items-center justify-center gap-4 ">
          <BookMarked size={32} strokeWidth={1.5} />

          <h5 className="text-4xl text-black font-title font-normal">
            Criar sua conta
          </h5>
        </div>

        <FormProvider {...form}>
          <form className='flex flex-col gap-4 mt-8' onSubmit={form.handleSubmit(onFormSubmit, onFormError)}>
            <TextField name="name" iconLeft={<User size={16} />} label='Nome' placeholder='Nome e sobrenome' />

            <TextField name="email" iconLeft={<Mail size={16} />} label='Email' placeholder='emaildigno@gmail.com' />

            <TextField name="phone" iconLeft={<Phone size={16} />} label='Telefone' placeholder='(11) 99999-9999' parser={phoneParser} />

            <PasswordField name="password" iconLeft={<KeyRound size={16} />} label='Senha' placeholder='••••••••••' />

            <PasswordField name="password_confirmation" iconLeft={<KeyRound size={16} />} label='Confirmação de senha' placeholder='••••••••••' />

            <div className=''>
              <div className='flex items-center justify-between'>
                <p className='text-sm font-semibold mb-2 font-title'>Força da senha:</p>
                <span className='text-sm text-black/50 font-bold'>
                  {passwordStrength > 0 && passwordStrength < 3 && 'Fraca'}
                  {passwordStrength >= 3 && passwordStrength < 5 && 'Média'}
                  {passwordStrength === 5 && 'Forte'}
                </span>
              </div>

              <PasswordStrengthBars passwordStrength={passwordStrength} className='mt-2' />

              <PasswordStrengthList password={form.watch('password') || ''} passwordConfirmation={form.watch('password_confirmation') || ''} className='mt-4' />

              <span className='text-sm text-black/50 mt-4 block'>*A senha precisa ser "Forte"</span>
            </div>

            <Button type="submit" iconRight={CircleArrowRight} className='flex justify-between mt-4' loading={isLoading} disabled={!form.formState.isValid}>
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