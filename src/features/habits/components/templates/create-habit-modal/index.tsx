import { CheckboxField } from '@/components/molecules/form/CheckboxField';
import { ComboBoxField } from '@/components/molecules/form/combo-box-field';
import { DatePickerField } from '@/components/molecules/form/DatePickerField';
import { SelectField } from '@/components/molecules/form/SelectField';
import { TextField } from '@/components/molecules/form/TextField';
import { ToggleGroupField } from '@/components/molecules/form/ToggleGroupField';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays, format, isBefore, sub } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { CreateHabitForm, CreateHabitModalProps } from './types';
import { createHabitValidation, daysOfWeek, daysOfWeekTranslation, generateRrule, rruleParse } from './utils';

const daysOfWeekOptions = daysOfWeek.map(item => ({
  label: daysOfWeekTranslation[item as keyof typeof daysOfWeekTranslation],
  value: item,
}))

export const CreateHabitModal = ({ onSave, categories, habit }: CreateHabitModalProps) => {
  const [loading, setLoading] = useState(false);


  const defaultValues = useMemo(() => {
    const recurrenceDetails = rruleParse(habit?.recurrence_details?.rule);

    return !habit ? {
      type: 'create',
      name: '',
      start_date: new Date(),
      end_date: addDays(new Date(), 1),
      infinite: false,
      frequency: 'daily' as const,
      week_days: [],
      category: null,
    } : {
      type: 'edit',
      name: habit.name,
      start_date: new Date(habit.start_date),
      end_date: habit.end_date ? new Date(habit.end_date) : addDays(new Date(), 1),
      infinite: !habit.end_date,
      frequency: recurrenceDetails?.type,
      week_days: recurrenceDetails?.week_days,
      category: habit?.habit_category?._id || null,
    } as CreateHabitForm
  }, [habit]);

  const form = useForm<CreateHabitForm>({
    resolver: zodResolver(createHabitValidation),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [form, defaultValues, habit]);


  const handleSubmit: SubmitHandler<CreateHabitForm> = async (data) => {
    try {
      setLoading(true);

      const rrule = generateRrule(data);


      await onSave?.({
        infinite: data.infinite ? true : false,
        name: data.name,
        start_date: data.start_date,
        frequency: data.frequency,
        end_date: data.end_date,
        category: data.category,
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
  const categoriesOptions = useMemo(() => {
    const list = [{ label: 'Sem categoria', value: null }] as { label: string; value: string | null }[];

    list.push(...categories?.map(category => ({ label: category.name, value: category._id })) || []);

    return list;
  }, [categories]);



  return (
    <DialogContent className="bg-white rounded-x p-0 gap-0 sm:rounded w-[calc(100vw-2rem)] rounded-lg">
      <DialogHeader className="p-4 border-b text-left">
        <DialogTitle>{!habit ? 'Criar hábito' : 'Editar hábito'}</DialogTitle>
        <DialogDescription className="text-black/70">
          {habit ? 'Edite as informações do hábito' : 'Defina a data de início e fim do hábito'}
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

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <SelectField
              wrapperClassName={categories && categories.length > 0 ? '' : 'col-span-2'}
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

            {categories && categories.length > 0 && (
              <ComboBoxField
                label='Categoria'
                name="category"
                options={categoriesOptions}
                placeholder="Selecione a categoria"
                commandPlaceholder="Pesquisar categoria"
                commandEmpty="Nenhuma categoria encontrada"
              />
            )}

            {form.watch('frequency') === 'weekly' && (
              <div className="mt-4 flex justify-start col-span-2">
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
                disabledMessage={habit ? format(habit.start_date, 'dd/MM/yyyy') : undefined}
                disabled={(date) => {
                  if (isBefore(date, sub(new Date(), { days: 1 }))) {
                    return true;
                  }

                  if (endDate && isBefore(date, endDate)) {
                    return false;
                  }

                  return false;
                }}
              />
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
                disabledMessage={habit ? habit.end_date ? format(habit.end_date, 'dd/MM/yyyy') : 'Sem fim' : form.watch('infinite') ? 'Sem fim' : undefined}
              />
              <div className="flex items-center gap-2 mt-2">
                <CheckboxField className="rounded" name="infinite" disabled={!!habit} />
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
            {loading ? <Loader2 size={16} className="animate-spin" /> : !habit ? 'Criar' : 'Salvar'}
          </Button>
        </div>
      </FormProvider>
    </DialogContent>

  )
}
