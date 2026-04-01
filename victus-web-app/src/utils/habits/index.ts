import { getDay } from "date-fns";
import { rrulestr } from "rrule";

/**
 * @description Format the weekday to be used in the RRule
 * The date-fns uses 0 for Sunday, 1 for Monday, etc.
 * The RRule uses 0 for Monday, 1 for Tuesday, etc.
 * This function formats the weekday to be used in the RRule
 * 
 * @example
 * formatWeekDay(1) // 0
 * formatWeekDay(2) // 1
 * formatWeekDay(3) // 2
 * formatWeekDay(4) // 3
 * formatWeekDay(5) // 4
 * @param weekday - The weekday to format
 * @returns The formatted weekday
 */

function formatWeekDay(weekday: number) {
  const sum = weekday - 1;

  return sum === -1 ? 6 : sum;
}

export const isAcceptedByRRule = (habit: Habit, date: Date | string) => {
  if (!habit.recurrence_details?.rule) return true;

  const rrule = rrulestr(habit.recurrence_details?.rule);
  const permittedWeekdays = rrule.options.byweekday;

  if (!permittedWeekdays) return true;

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const currentWeekday = formatWeekDay(getDay(dateObj));

  const isAccepted = permittedWeekdays.includes(currentWeekday);

  return isAccepted;
}

export const isInfiniteHabit = (habit: Habit) => {
  if (!habit.recurrence_details?.rule) return false;

  const rrule = rrulestr(habit.recurrence_details?.rule);

  return rrule.options.until === null;
}