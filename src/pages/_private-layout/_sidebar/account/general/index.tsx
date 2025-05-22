import { TextField } from "@/components/molecules/form/TextField";
import { useMe, useUpdateMe } from "@/services/auth";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ions/button";
import { PasswordField } from "@/components/molecules/form";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const basicInfoSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  password: z.string().min(1),
  password_confirmation: z.string().min(1),
});

type SubscriptionForm = z.infer<typeof basicInfoSchema>;

export const AccountGeneralPage = () => {
  const { t } = useTranslation(['form', 'common', 'account']);

  const { data: me } = useMe();
  const { mutate: updateMe, isPending: isUpdatingMe } = useUpdateMe();
  const [updatingForm, setUpdatingForm] = useState<'basic_info' | 'password'>('basic_info');

  const form = useForm<SubscriptionForm>();

  useEffect(() => {
    form.reset({
      name: me?.name,
      email: me?.email,
      phone: me?.phone,
    });
  }, [me, form]);

  const onSubmit: SubmitHandler<SubscriptionForm> = async (data) => {
    try {
      setUpdatingForm('basic_info');

      await updateMe({
        name: data.name,
        phone: data.phone,
      });

      toast.success(t('account:toasts.success.basic_info'));
    } catch (error) {
      console.error(error);
      toast.error(t('account:toasts.error.basic_info'));
    } finally {
      setUpdatingForm('basic_info');
    }
  };

  const onPasswordSubmit: SubmitHandler<SubscriptionForm> = async (data) => {
    try {
      setUpdatingForm('password');

      await updateMe({
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

      toast.success(t('account:toasts.success.password'));
    } catch (error) {
      console.error(error);
      toast.error(t('account:toasts.error.password'));
    } finally {
      setUpdatingForm('password');
    }
  };

  return (
    <div className="px-4 flex-1 w-full">
      <h1 className="text-2xl font-medium font-[Recursive]">{t('account:hello', { name: me?.name })}</h1>

      <div className="flex flex-col gap-4 mt-4 border rounded-md bg-white border-neutral-300 pt-4 w-full p-4">
        <FormProvider {...form}>
          <h1 className="font-medium font-[Recursive]">{t('account:basic_info.title')}:</h1>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <TextField
                label={t('form:name.label')}
                placeholder={t('form:name.label')}
                name="name"
              />

              <TextField
                label={t('form:email.label')}
                placeholder={t('form:email.placeholder')}
                name="email"
                readOnly
                disabled
              />

              <TextField
                label={t('form:phone.label')}
                placeholder={t('form:phone.label')}
                name="phone"
              />

              <Button type="submit" disabled={isUpdatingMe} loading={isUpdatingMe && updatingForm === 'basic_info'} className="mt-4">
                {t('common:save')}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>

      <div className="flex flex-col gap-4 mt-4 border rounded-md bg-white border-neutral-300 pt-4 w-full p-4">
      <FormProvider {...form}>
        <h1 className="font-medium font-[Recursive]">{t('account:password.title')}:</h1>

          <form onSubmit={form.handleSubmit(onPasswordSubmit)}>
            <div className="flex flex-col gap-4">
              <PasswordField
                label={t('form:password.label')}
                placeholder={t('form:password.placeholder')}
                name="password"
              />

              <PasswordField
                label={t('form:password_confirmation.label')}
                placeholder={t('form:password_confirmation.placeholder')}
                name="password_confirmation"
              />

              <Button type="submit" disabled={isUpdatingMe} loading={isUpdatingMe && updatingForm === 'password'} className="mt-4">
                {t('common:save')}
              </Button>
            </div>
          </form>
        </FormProvider>
        </div>
    </div>
  )
}