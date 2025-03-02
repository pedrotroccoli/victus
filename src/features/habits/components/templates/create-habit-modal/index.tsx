import { Frequency, RRule, Weekday } from 'rrule';
import { z } from 'zod';

import { CheckboxField } from '@/components/molecules/form/CheckboxField';
import { DatePickerField } from '@/components/molecules/form/DatePickerField';
import { SelectField } from '@/components/molecules/form/SelectField';
import { TextField } from '@/components/molecules/form/TextField';
import { ToggleGroupField } from '@/components/molecules/form/ToggleGroupField';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays, isBefore, sub } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';

const daysOfWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const

const daysOfWeekTranslation = {
  monday: 'S',
  tuesday: 'T',
  wednesday: 'Q',
  thursday: 'Q',
  friday: 'S',
  saturday: 'S',
  sunday: 'D',
}

const daysOfWeekOptions = daysOfWeek.map(item => ({
  label: daysOfWeekTranslation[item as keyof typeof daysOfWeekTranslation],
  value: item,
}))

const createHabitValidation = z.object({
  name: z.string().min(2, 'Nome do hábito é obrigatório'),
  start_date: z.date(),
  end_date: z.date(),
  infinite: z.boolean().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  week_days: z.array(z.enum(daysOfWeek)).optional(),
}).refine((data) => {
  if (data.frequency === 'weekly' && !data.week_days?.length) {
    return false;
  }

  return true;
}, {
  path: ['week_days'],
  message: 'Selecione pelo menos um dia'
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
    frequency: 'daily' as const,
    week_days: [],
  }

  const form = useForm<z.infer<typeof createHabitValidation>>({
    resolver: zodResolver(createHabitValidation),
    defaultValues,
  });

  const generateRrule = (data: CreateHabitForm) => {
    const { end_date, infinite } = data;

    const frequencyMap = {
      daily: RRule.DAILY,
      weekly: RRule.WEEKLY,
    } as Record<string, Frequency>;

    const daysMap = {
      monday: RRule.MO,
      tuesday: RRule.TU,
      wednesday: RRule.WE,
      thursday: RRule.TH,
      friday: RRule.FR,
      saturday: RRule.SA,
      sunday: RRule.SU,
    } as Record<string, Weekday>;

    const byweekday = data.week_days && data.frequency === 'weekly' ? data.week_days.map((day) => daysMap[day]) : undefined;

    const rrule = new RRule({
      freq: frequencyMap[data.frequency] || RRule.DAILY,
      until: !infinite ? end_date : undefined,
      byweekday,
    });

    return rrule.toString().replace('RRULE:', '');
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
    <DialogContent className="bg-white rounded-x p-0 gap-0 sm:rounded w-[calc(100vw-2rem)] rounded-lg">
      <DialogHeader className="p-4 border-b text-left">
        <DialogTitle>Criar hábito</DialogTitle>
        <DialogDescription className="text-black/70">
          Defina a data de início e fim do hábito
        </DialogDescription>
      </DialogHeader>
      <FormProvider {...form}>
        <div className="grid gap-4 py-4 px-6 pb-8">
          <div>
            <TextField
              name="name"
              label="Nome do hábito"
              placeholder="Ex: Beber água"
            />
          </div>

          <div className="border-t border-neutral-200 my-px"></div>

          <div>
            <SelectField
              name="frequency"
              label='Frequência'
              placeholder='Selecione a frequência'
              defaultValue='daily'
              options={[
                { label: 'Diário', value: 'daily' },
                { label: 'Semanal', value: 'weekly' },
                // { label: 'Mensal', value: 'monthly' },
                // { label: 'Anual', value: 'yearly' },
              ]}
            />

            {form.watch('frequency') === 'weekly' && (

              <div className="mt-4 flex justify-start">
                <ToggleGroupField
                  name="week_days"
                  options={daysOfWeekOptions}
                />
              </div>
            )}

          </div>


          <div className="border-t border-neutral-200 my-px"></div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
