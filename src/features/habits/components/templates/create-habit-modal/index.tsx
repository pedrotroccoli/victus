import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { DeltaTab } from './delta-tab';
import { HabitTab } from './habit-tab';
import { CreateHabitForm, CreateHabitModalProps } from './types';
import { createHabitValidation, generateRrule, rruleParse } from './utils';


export const CreateHabitModal = ({ onSave, categories, habit }: CreateHabitModalProps) => {
  const [loading, setLoading] = useState(false);
  const [tabs, setTabs] = useState<string>('habit');

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
      deltas: [],
    } : {
      type: 'edit',
      name: habit.name,
      start_date: new Date(habit.start_date),
      end_date: habit.end_date ? new Date(habit.end_date) : addDays(new Date(), 1),
      infinite: !habit.end_date,
      frequency: recurrenceDetails?.type,
      week_days: recurrenceDetails?.week_days,
      category: habit?.habit_category?._id || null,
      deltas: habit?.habit_deltas?.map(item => ({
        id: item._id,
        name: item.name,
        type: item.type,
        state: 'active',
        delta_state: 'active',
      })) || [],
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
        deltas: data.deltas,
      });

      form.reset(defaultValues);
      setTabs('habit');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log('CreateHabitModal error:', error);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleError: SubmitErrorHandler<CreateHabitForm> = (errors) => {
    const habitTab = ['name', 'start_date', 'end_date', 'frequency', 'week_days', 'category'].some(key => !!errors[key as keyof CreateHabitForm]);
    const deltasTab = ['deltas'].some(key => !!errors[key as keyof CreateHabitForm]);

    console.log(habitTab, deltasTab, errors);

    if (habitTab) {
      setTabs('habit');
    }

    if (deltasTab) {
      setTabs('deltas');
    }
  }

  const endDate = form.watch('infinite') ? undefined : form.watch('end_date');


  return (
    <DialogContent className="bg-white rounded-x p-0 gap-0 sm:rounded w-[calc(100vw-2rem)] rounded-lg">
      <DialogHeader className="p-4 border-b text-left">
        <DialogTitle>{!habit ? 'Criar hábito' : `Editar hábito "${habit.name}"`}</DialogTitle>
        <DialogDescription className="text-black/70">
          {habit ? 'Edite as informações do hábito ou deltas' : 'Defina a data de início e fim do hábito e defina seus deltas'}
        </DialogDescription>
      </DialogHeader>
      <FormProvider {...form}>
        <Tabs defaultValue="habit" onValueChange={setTabs} value={tabs}>
          <TabsList className='mb-4 border border-neutral-300 ml-4 mt-6'>
            <TabsTrigger value="habit" className='data-[state=active]:bg-black data-[state=active]:text-white'>Hábito</TabsTrigger>
            <TabsTrigger value="deltas" className='data-[state=active]:bg-black data-[state=active]:text-white text-black'>Deltas</TabsTrigger>
          </TabsList>

          <TabsContent value="habit">
            <HabitTab categories={categories} habit={habit} endDate={endDate} />
          </TabsContent>
          <TabsContent value="deltas">
            <DeltaTab />
          </TabsContent>
        </Tabs>
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
