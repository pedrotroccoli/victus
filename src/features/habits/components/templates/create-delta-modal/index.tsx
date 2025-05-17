import { TextField } from '@/components/molecules/form';
import { SelectField } from '@/components/molecules/form/SelectField';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CreateDeltaForm, CreateDeltaModalProps } from './types';
import { createDeltaValidation } from './utils';


export const CreateDeltaModal = ({ onSave, habit, deltaId }: CreateDeltaModalProps) => {
  const { t } = useTranslation('habit');
  const { t: tCommon } = useTranslation('common');
  const [loading, setLoading] = useState(false);

  const defaultValues = useMemo(() => {
    const delta = habit?.habit_deltas?.find(item => item._id === deltaId);

    return !deltaId ? {
      name: '',
      type: '' as 'number' | 'time',
    } : {
      name: delta?.name,
      type: delta?.type as 'number' | 'time',
    } as CreateDeltaForm
  }, [habit, deltaId]);

  const form = useForm<CreateDeltaForm>({
    resolver: zodResolver(createDeltaValidation),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [form, defaultValues, habit]);


  const handleSubmit: SubmitHandler<CreateDeltaForm> = async (data) => {
    try {
      setLoading(true);

      await onSave?.({
        name: data.name,
        type: data.type,
      });


      form.reset(defaultValues);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log('CreateHabitModal error:', error);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleError: SubmitErrorHandler<CreateDeltaForm> = (errors) => {
    console.log(errors);
  }


  return (
    <DialogContent className="bg-white rounded-x p-0 gap-0 sm:rounded w-[calc(100vw-2rem)] rounded-lg">
      <DialogHeader className="p-4 border-b text-left">
        <DialogTitle>{!deltaId ? t('create_delta_modal.title.create') : t('create_delta_modal.title.edit', { name: habit?.name })}</DialogTitle>
        <DialogDescription className="text-black/70">
          {deltaId ? t('create_delta_modal.description.edit') : t('create_delta_modal.description.create')}
        </DialogDescription>
      </DialogHeader>
      <FormProvider {...form}>
        <div className='p-4 grid gap-4'>
          <TextField name="name" label={t('create_delta_modal.form.fields.name.label')} placeholder={t('create_delta_modal.form.fields.name.placeholder')} />

          <SelectField
            name="type"
            label={t('create_delta_modal.form.fields.type.label')}
            options={[{ label: t('create_delta_modal.form.fields.type.options.number'), value: 'number' }, { label: t('create_delta_modal.form.fields.type.options.time'), value: 'time' }]}
            placeholder={t('create_delta_modal.form.fields.type.placeholder')}
            disabled={!!deltaId}
          />
        </div>

        <div className="flex justify-end p-2 px-6 border-t border-neutral-300">
          <Button variant="default" className="bg-black text-white rounded text-sm font-bold hover:bg-black/80 min-w-24 h-8"
            onClick={form.handleSubmit(handleSubmit, handleError)}
            disabled={loading}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : !habit ? tCommon('create') : tCommon('edit')}
          </Button>
        </div>
      </FormProvider>
    </DialogContent>

  )
}
