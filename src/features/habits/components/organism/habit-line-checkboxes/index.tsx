import { cn } from "@/lib/utils";
import { endOfDay, format, isAfter, isBefore, isSameDay, startOfDay } from "date-fns";
import React, { useCallback } from "react";
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
              const isChecked = !!getHabitCheck(item, formattedDay)?.checked;

              const habitStartDate = startOfDay(item.start_date);
              const habitEndDate = endOfDay(item.end_date);
              const sameDay = isSameDay(monthDay, habitStartDate);

              const isInfinite = item.recurrence_type === 'infinite';

              const today = format(currentDay, 'dd/MM/yyyy') === format(monthDay, 'dd/MM/yyyy');

              const isAPastDay = isBefore(monthDay, startOfDay(currentDay));

              const isInTheHabitRange = sameDay || (isAfter(monthDay, habitStartDate) && (isInfinite ? true : isBefore(monthDay, habitEndDate)));

              return (
                <HabitCheckbox
                  key={`${item._id}-${formattedDay}`}
                  invertPattern={index % 2 === 0}
                  onCheck={handleCheckHabit(item, formattedDay)}
                  item={item}
                  realDay={monthDay}
                  isAPastDay={isAPastDay}
                  today={today}
                  isChecked={isChecked}
                  isInTheHabitRange={isInTheHabitRange}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  range={daysInMonth}
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