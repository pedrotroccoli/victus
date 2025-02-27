import { z } from 'zod';

import { TextField } from '@/components/molecules/form/TextField';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';

const createCategoryValidation = z.object({
  name: z.string().min(2, 'Nome da categoria é obrigatório'),
})

export type CreateCategoryForm = z.infer<typeof createCategoryValidation>;

export interface CreateCategoryModalProps {
  onSave?: (data: CreateCategoryForm) => void;
}


export const CreateCategoryModal = ({ onSave }: CreateCategoryModalProps) => {
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    name: '',
  }

  const form = useForm<z.infer<typeof createCategoryValidation>>({
    resolver: zodResolver(createCategoryValidation),
    defaultValues,
  });


  const handleSubmit: SubmitHandler<CreateCategoryForm> = async (data) => {
    try {
      setLoading(true);

      await onSave?.(data);

      form.reset(defaultValues);
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
        <DialogTitle>Criar categoria</DialogTitle>
        <DialogDescription className="text-black/70">
          Defina o nome da categoria
        </DialogDescription>
      </DialogHeader>
      <FormProvider {...form}>
        <div className="grid gap-4 py-4 px-6 pb-8">
          <div>
            <TextField
              name="name"
              label="Nome da categoria"
              placeholder="Ex: Saúde"
            />
          </div>
        </div>
        <div className="flex justify-end p-2 px-6 border-t border-neutral-300">
          <Button variant="default" className="bg-black text-white rounded text-sm font-bold hover:bg-black/80 min-w-24 h-8"
            onClick={form.handleSubmit(handleSubmit, handleError)}
            disabled={loading}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Criar'}
          </Button>
        </div>
      </FormProvider>
    </DialogContent>

  )
}
