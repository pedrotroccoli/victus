import { cn } from "@/lib/utils";
import { format, getDay, isAfter, isBefore, subDays } from "date-fns";
import React, { useCallback } from "react";
import { rrulestr } from "rrule";
import { HabitCheckbox } from "../../molecules/habit-checkbox";

interface HabitLineCheckboxesProps {
  item: Habit;
  hideHabits: boolean;
  getHabitCheck: (habit: Habit, day: string) => HabitCheck;
  daysInMonth: Date[];
  currentDay: Date;
  onCheckHabit: (habit: Habit, day: string) => void;
  isFirst: boolean;
  isLast: boolean;
  enableOrder: boolean;
  before?: React.ReactNode;
  setIsHovering: (isHovering: boolean) => void;
  rowHovering: boolean;
}

export function HabitLineCheckboxes({ item, daysInMonth, getHabitCheck, currentDay, onCheckHabit, isFirst, isLast, before, setIsHovering, rowHovering }: HabitLineCheckboxesProps) {
  const handleCheckHabit = useCallback((habit: Habit, day: string) => () => {
    onCheckHabit(habit, day);
  }, [onCheckHabit]);

  const isAcceptedByRRule = (habit: Habit, monthDay: string) => {
    if (habit.recurrence_type === 'daily') return true;

    if (!habit.recurrence_details?.rule) return true;

    const rrule = rrulestr(habit.recurrence_details?.rule);
    const permittedWeekdays = rrule.options.byweekday;
    const currentWeekday = getDay(monthDay);

    const isAccepted = permittedWeekdays.includes(currentWeekday);

    return isAccepted;
  }

  function getHabitRange(habit: Habit, day: string) {
    const isBeforeHabit = isBefore(day, subDays(habit.start_date, 1));
    const isAfterHabit = habit.end_date ? isAfter(day, habit.end_date) : false;
    const isAValidHabitDay = isAcceptedByRRule(habit, day);
    const isAfterToday = isAfter(day, subDays(currentDay, 1));

    return {
      isBefore: isBeforeHabit,
      isAfter: isAfterHabit,
      isValid: isAValidHabitDay,
      isAfterToday,
    };
  }

  const getType = (item: Habit, day: string) => {
    const habitRange = getHabitRange(item, day);

    if (habitRange.isBefore || habitRange.isAfter || !habitRange.isValid) return 'blocked';

    if (habitRange.isAfterToday) return 'none';

    const isChecked = getHabitCheck(item, day)?.checked;

    if (isChecked) return 'checked';

    return 'empty';
  }

  return (
    <>
      <div className={
        cn(
          "flex justify-between items-center",
          isFirst && "items-end",
        )
      } >

        <div className="">
          {before}

          <div className={cn("flex")}>
            {daysInMonth.map((monthDay, index) => {
              const formattedDay = format(monthDay, 'MM/dd/yyyy');
              const isToday = format(currentDay, 'MM/dd/yyyy') === formattedDay;

              const isInTheHabitRange = getHabitRange(item, formattedDay);
              const type = getType(item, formattedDay);

              const disabled = !isToday || !isInTheHabitRange.isValid;

              console.log(isToday, formattedDay);

              return (
                <HabitCheckbox
                  key={`${item._id}-${formattedDay}`}
                  disabled={disabled}
                  invertPattern={index % 2 === 0}
                  type={type}
                  onCheck={handleCheckHabit(item, formattedDay)}
                  item={item}
                  today={isToday}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  isFirst={isFirst}
                  isLast={isLast}
                  className={cn(rowHovering && "border-y-black", rowHovering && index === 0 && "border-l-black", rowHovering && index === daysInMonth.length - 1 && "border-r-black")}
                />
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}