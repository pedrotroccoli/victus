import { cn } from "@/lib/utils";
import { endOfDay, format, isAfter, isBefore, isSameDay, startOfDay } from "date-fns";
import { GripVertical } from "lucide-react";
import { useCallback, useState } from "react";
import { HabitDay } from "../../atoms/habit-day";
import { HabitVisibilityToggle } from "../../ions/habit-visibility-toggle";
import { HabitCheckbox } from "../../molecules/habit-checkbox";
import { HabitName } from "../../molecules/habit-name";

interface HabitLineCheckboxesProps {
  item: Habit;
  hideHabits: boolean;
  getHabitCheck: (habit: Habit, day: string) => HabitCheck;
  setHideHabits: (hideHabits: boolean) => void;
  daysInMonth: Date[];
  currentDay: Date;
  onCheckHabit: (habit: Habit, day: string) => void;
  isFirst: boolean;
  isLast: boolean;
  enableOrder: boolean;
}

export function HabitLineCheckboxes({ item, hideHabits, setHideHabits, daysInMonth, getHabitCheck, currentDay, onCheckHabit, isFirst, isLast, enableOrder }: HabitLineCheckboxesProps) {
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const handleCheckHabit = useCallback((habit: Habit, day: string) => () => {
    onCheckHabit(habit, day);
  }, [onCheckHabit]);

  return (
    <div className={
      cn(
        "flex justify-between items-center",
        isFirst && "items-end",
      )
    } >
      {enableOrder && (
        <button className={
          cn(
            "w-3 h-5 text-neutral-400 rounded-full flex items-center justify-center border-neutral-500 transition-colors duration-200",
            "hover:border hover:text-black",
            isFirst && "mb-1"
          )
        }>
          <GripVertical size={12} />
        </button>
      )}

      <div className="w-full min-w-12 flex-1" >
        {isFirst && (
          <HabitVisibilityToggle hideHabits={hideHabits} setHideHabits={setHideHabits} />
        )}

        <div className="flex items-center gap-4 min-w-12">
          <HabitName item={item} isHovering={isHovering} hide={hideHabits} showHideButton={isFirst} />
        </div>
      </div>

      <div className="flex">
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
          const day = format(monthDay, 'dd');

          return (
            <div className="flex flex-col items-center justify-end" key={`${item._id}-${formattedDay}`}>
              {isFirst && (
                <HabitDay monthDay={monthDay} day={day} currentDay={today} shouldShowArrow={isFirst} />
              )}

              <HabitCheckbox
                invertPattern={index % 2 === 0}
                onCheck={handleCheckHabit(item, formattedDay)}
                item={item}
                realDay={monthDay}
                isAPastDay={isAPastDay}
                today={today}
                isChecked={isChecked}
                isInTheHabitRange={isInTheHabitRange}
                setIsHovering={setIsHovering}
                range={daysInMonth}
                isFirst={isFirst}
                isLast={isLast}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}