import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { BookMarked, CircleArrowRight, KeyRound, Mail, Phone, User } from 'lucide-react';
import { FormProvider, SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Button } from '@/components/ions/button';
import { PasswordStrengthBars } from '@/components/ions/password-strength-bars';
import { PasswordStrengthList } from '@/components/ions/password-strength-list';
import { PasswordField } from '@/components/molecules/form/PasswordField';
import { TextField } from '@/components/molecules/form/TextField';
import { useSignUp } from '@/services/auth/hooks';
import { phoneParser } from '@/utils/parsers';
import { evaluatePasswordStrength } from '@/utils/validators/password';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { signUpSchema } from './schema';

type SignUpFormData = z.infer<typeof signUpSchema>;

interface SignUpSearchParams {
  key: string;
}

export const SignUpPage = () => {
  const { t } = useTranslation('auth');
  const { t: tForm } = useTranslation('form');
  const search = useSearch({ from: '/(public)/_auth/sign-up/' }) as SignUpSearchParams;
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });
  const navigate = useNavigate();

  const { mutateAsync: signUp, isPending: isLoading } = useSignUp();

  const onFormSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    const firstName = data.name.split(' ')[0];

    try {
      const { checkout_url } = await signUp({
        account: {
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,
          password_confirmation: data.password_confirmation,
        },
        lookup_key: search?.key || '',
      });

      if (checkout_url) {
        window.location.href = checkout_url;
      } else {
        navigate({ to: '/dashboard' });
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        toast.error(t('sign_up.toast.account_exists'), {
          dismissible: true,
        });
      } else {
        toast.error(t('sign_up.toast.error', { name: firstName }), {
          description: t('sign_up.toast.error_description'),
        });
      }
    }
  }

  const onFormError: SubmitErrorHandler<SignUpFormData> = (error) => {
    const fieldKey = Object.entries(error)[0][0] as keyof SignUpFormData;
    const fieldLabel = t(`sign_up.fields.${fieldKey}`);

    toast.error(t('sign_up.toast.fill_field'), {
      description: t('sign_up.toast.fill_field_description', { field: fieldLabel }),
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
            {t('sign_up.title')}
          </h5>
        </div>

        <FormProvider {...form}>
          <form className='flex flex-col gap-4 mt-8' onSubmit={form.handleSubmit(onFormSubmit, onFormError)}>
            <TextField name="name" iconLeft={<User size={16} />} label={tForm('name.label')} placeholder={tForm('name.placeholder')} />

            <TextField name="email" iconLeft={<Mail size={16} />} label={tForm('email.label')} placeholder={tForm('email.placeholder')} />

            <TextField name="phone" iconLeft={<Phone size={16} />} label={tForm('phone.label')} placeholder={tForm('phone.placeholder')} parser={phoneParser} />

            <PasswordField name="password" iconLeft={<KeyRound size={16} />} label={tForm('password.label')} placeholder={tForm('password.placeholder')} />

            <PasswordField name="password_confirmation" iconLeft={<KeyRound size={16} />} label={tForm('password_confirmation.label')} placeholder={tForm('password_confirmation.placeholder')} />

            <div className=''>
              <div className='flex items-center justify-between'>
                <p className='text-sm font-semibold mb-2 font-title'>{t('sign_up.password_strength.title')}</p>
                <span className='text-sm text-black/50 font-bold'>
                  {passwordStrength > 0 && passwordStrength < 3 && t('sign_up.password_strength.weak')}
                  {passwordStrength >= 3 && passwordStrength < 5 && t('sign_up.password_strength.medium')}
                  {passwordStrength === 5 && t('sign_up.password_strength.strong')}
                </span>
              </div>

              <PasswordStrengthBars passwordStrength={passwordStrength} className='mt-2' />

              <PasswordStrengthList password={form.watch('password') || ''} passwordConfirmation={form.watch('password_confirmation') || ''} className='mt-4' />

              <span className='text-sm text-black/50 mt-4 block'>{t('sign_up.password_strength.requirement')}</span>
            </div>

            <Button type="submit" iconRight={CircleArrowRight} className='flex justify-between mt-4' loading={isLoading} disabled={!form.formState.isValid}>
              {t('sign_up.submit')}
            </Button>
          </form>
        </FormProvider>

        <p className='text-sm text-black/50 mt-4 font-title text-center'>
          {t('sign_up.already_have_account')}{' '}
          <Link to="/sign-in" className='text-[#2C7DA0] underline cursor-pointer hover:text-[#014F86] duration-200 transition-colors'>
            {t('sign_up.access')}
          </Link>
        </p>
      </section>
    </main >
  )
}