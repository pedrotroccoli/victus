import { Frequency, RRule, Weekday } from "rrule";
import { z } from "zod";
import { CreateHabitForm } from "./types";

export const daysOfWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const

export const createHabitValidation = z.object({
  name: z.string().min(2, 'Nome do hábito é obrigatório'),
  start_date: z.date(),
  end_date: z.date(),
  infinite: z.boolean().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  week_days: z.array(z.enum(daysOfWeek)).optional(),
  category: z.string().nullable(),
  deltas: z.array(z.object({
    id: z.string().optional(),
    state: z.enum(['deleted', 'active']),
    name: z.string({ message: 'O nome do delta é obrigatório' }).min(2, 'Mínimo de 2 caracteres'),
    type: z.enum(['number', 'string']),
  })).optional(),
}).refine((data) => {
  if (data.frequency === 'weekly' && !data.week_days?.length) {
    return false;
  }

  return true;
}, {
  path: ['week_days'],
  message: 'Selecione pelo menos um dia'
})


export const daysOfWeekTranslation = {
  monday: 'S',
  tuesday: 'T',
  wednesday: 'Q',
  thursday: 'Q',
  friday: 'S',
  saturday: 'S',
  sunday: 'D',
}

export const rruleParse = (rrule?: string) => {
  if (!rrule) {
    return;
  }

  const rruleObject = RRule.fromString(rrule);

  const weekDaysFormatted = rruleObject.options?.byweekday?.map(item => daysOfWeek[item]);

  const byDayType = rrule.includes('BYDAY') ? 'weekly' : 'daily';

  return {
    type: byDayType,
    week_days: rruleObject.options?.byweekday?.length ? weekDaysFormatted : [],
  };
}


export const generateRrule = (data: CreateHabitForm) => {


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

  const byweekday = data.week_days && data.frequency === 'weekly' ? data.week_days.map((day: string) => daysMap[day]) : undefined;

  const rrule = new RRule({
    freq: frequencyMap[data.frequency] || RRule.DAILY,
    until: !infinite ? end_date : undefined,
    byweekday,
  });

  return rrule.toString().replace('RRULE:', '');
}

export const isInAEditingState = (type: string) => {
  return type === 'edit' || type === 'draft';
}