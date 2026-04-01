import { z } from 'zod';

import { Button } from '@/components/ions/button';
import { InputWithIcon } from '@/components/molecules/input-with-icon';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CategoryIconName } from '@/lib/icons/category-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FormProvider, SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const createCategoryValidation = z.object({
  name: z.string().min(2, 'category_name.required'),
  icon: z.string().optional(),
})

export type CreateCategoryForm = z.infer<typeof createCategoryValidation>;

export interface CreateCategoryModalProps {
  onSave?: (data: CreateCategoryForm) => void;
  category?: HabitCategory;
}


export const CreateCategoryModal = ({ onSave, category }: CreateCategoryModalProps) => {
  const { t } = useTranslation(['habit', 'common']);
  const [loading, setLoading] = useState(false);
  const isEditMode = !!category;

  const defaultValues = {
    name: category?.name || '',
    icon: category?.icon || undefined as string | undefined,
  }

  const form = useForm<z.infer<typeof createCategoryValidation>>({
    resolver: zodResolver(createCategoryValidation),
    defaultValues,
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        icon: category.icon || undefined,
      });
    } else {
      form.reset({
        name: '',
        icon: undefined,
      });
    }
  }, [category, form]);


  const handleSubmit: SubmitHandler<CreateCategoryForm> = async (data) => {
    try {
      setLoading(true);

      await onSave?.(data);

      if (!isEditMode) {
        form.reset({ name: '', icon: undefined });
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log('CreateCategoryModal onSave error:', error);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleError: SubmitErrorHandler<CreateCategoryForm> = (errors) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('CreateCategoryModal form errors:', errors);
    }
  }

  return (
    <DialogContent className="bg-white rounded-x p-0 gap-0 sm:rounded w-[calc(100vw-2rem)] rounded-lg">
      <DialogHeader className="p-4 border-b text-left">
        <DialogTitle>
          {isEditMode ? t('create_category_modal.title_edit') : t('create_category_modal.title')}
        </DialogTitle>
        <DialogDescription className="text-black/70">
          {isEditMode ? t('create_category_modal.description_edit') : t('create_category_modal.description')}
        </DialogDescription>
      </DialogHeader>
      <FormProvider {...form}>
        <div className="grid gap-4 py-4 px-6 pb-8">
          <InputWithIcon
            label={t('create_category_modal.form.fields.name.label')}
            value={form.watch('name')}
            onChange={(value) => form.setValue('name', value)}
            icon={form.watch('icon') as CategoryIconName | undefined}
            onIconChange={(value) => form.setValue('icon', value)}
            placeholder={t('create_category_modal.form.fields.name.placeholder')}
            message={form.formState.errors.name?.message}
            messageClassName="text-red-500"
          />
        </div>
        <div className="flex justify-end p-2 px-6 border-t border-neutral-300">
          <Button variant="default" className="bg-black text-white rounded text-sm font-bold hover:bg-black/80 min-w-24 h-8"
            onClick={form.handleSubmit(handleSubmit, handleError)}
            disabled={loading}
            loading={loading}
          >
            {isEditMode ? t('common:save') : t('common:create')}
          </Button>
        </div>
      </FormProvider>
    </DialogContent>

  )
}
