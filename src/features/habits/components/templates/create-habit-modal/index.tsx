import { RRule } from 'rrule';
import { z } from 'zod';

import { CheckboxField } from '@/components/molecules/form/CheckboxField';
import { DatePickerField } from '@/components/molecules/form/DatePickerField';
import { TextField } from '@/components/molecules/form/TextField';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays, isBefore, sub } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';


const createHabitValidation = z.object({
  name: z.string().min(2),
  start_date: z.date(),
  end_date: z.date(),
  infinite: z.boolean().optional(),
})

type CreateHabitForm = z.infer<typeof createHabitValidation>;

export type CreateHabitModalOnSaveProps = CreateHabitForm & {
  rrule: string;
}

export interface CreateHabitModalProps {
  onSave?: (data: CreateHabitModalOnSaveProps) => void;
}


export const CreateHabitModal = ({ onSave }: CreateHabitModalProps) => {
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    name: '',
    start_date: new Date(),
    end_date: addDays(new Date(), 1),
    infinite: false,
  }

  const form = useForm<z.infer<typeof createHabitValidation>>({
    resolver: zodResolver(createHabitValidation),
    defaultValues,
  });

  const generateRrule = (data: CreateHabitForm) => {
    const { end_date, infinite } = data;

    const rrule = new RRule({
      freq: RRule.DAILY,
      until: !infinite ? end_date : undefined,
    });

    return rrule.toString();
  }

  const handleSubmit: SubmitHandler<CreateHabitForm> = async (data) => {
    try {
      setLoading(true);

      const rrule = generateRrule(data);

      await onSave?.({
        ...data,
        rrule,
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

  const handleError: SubmitErrorHandler<CreateHabitForm> = (errors) => {
    console.log(errors);
  }

  const endDate = form.watch('infinite') ? undefined : form.watch('end_date');

  return (
    <DialogContent className="bg-white rounded-x p-0 gap-0 sm:rounded">
      <DialogHeader className="p-4 border-b">
        <DialogTitle>Criar hábito</DialogTitle>
        <DialogDescription className="text-black/70">
          Defina a data de início e fim do hábito
        </DialogDescription>
      </DialogHeader>
      <FormProvider {...form}>
        <div className="space-y-4 py-4 px-6 pb-8">
          <div>
            <TextField
              name="name"
              label="Nome do hábito"
              placeholder="Ex: Beber água"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <DatePickerField name="start_date" label="Data de início"
                disabled={(date) => {
                  if (isBefore(date, sub(new Date(), { days: 1 }))) {
                    return true;
                  }

                  if (endDate && isBefore(date, endDate)) {
                    return false;
                  }

                  return false;
                }} />
            </div>
            <div>
              <DatePickerField name="end_date" label="Data de fim" disabled={(date) => {
                if (isBefore(date, sub(new Date(), { days: 0 }))) {
                  return true;
                }

                if (isBefore(date, form.getValues('start_date'))) {
                  return true;
                }

                return false;
              }}
                disabledMessage={form.watch('infinite') ? 'Sem fim' : undefined}
              />
              <div className="flex items-center gap-2 mt-2">
                <CheckboxField className="rounded" name="infinite" />
                <p className="text-sm font-medium">Infinito</p>
              </div>
            </div>
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
