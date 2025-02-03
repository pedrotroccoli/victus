import { cn } from "@/lib/utils";
import { isAcceptedByRRule } from "@/utils/habits";
import { format, isAfter, isBefore, subDays } from "date-fns";
import { Eye, EyeOff, GripVertical } from "lucide-react";
import React, { useCallback, useState } from "react";
import { HabitDay } from "../../atoms/habit-day";
import { HabitCheckbox } from "../../molecules/habit-checkbox";
import { HabitName } from "../../molecules/habit-name";

export interface HabitLineCheckboxesProps {
  item: Habit;
  category: {
    id: string;
    name: string;
  };
  getHabitCheck: (habit: Habit, day: string) => HabitCheck;
  daysInMonth: Date[];
  currentDay: Date;
  onCheckHabit: (habit: Habit, day: string) => void;
  isFirstRow: boolean;
  isLastRow: boolean;
  enableOrder: boolean;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  hideHabits: boolean;
  onHideHabit: () => void;
}

interface HabitRange {
  isBefore: boolean;
  isAfter: boolean;
  isValid: boolean;
  isAfterCurrentDay: boolean;
  isToday: boolean;
}


export function HabitLineCheckboxes({
  item,
  daysInMonth,
  getHabitCheck,
  currentDay,
  onCheckHabit,
  isFirstRow, isLastRow, onScroll, enableOrder,
  hideHabits,
  onHideHabit,
  category
}: HabitLineCheckboxesProps) {
  const [nameHovering, setNameHovering] = useState(false);
  const [checkboxHovering, setCheckboxHovering] = useState(false);

  const handleCheckHabit = useCallback((habit: Habit, day: string) => () => {
    onCheckHabit(habit, day);
  }, [onCheckHabit]);


  function getHabitRange(habit: Habit, day: string): HabitRange {
    const isBeforeHabit = isBefore(day, subDays(habit.start_date, 1));
    const isAfterHabit = habit.end_date ? isAfter(day, habit.end_date) : false;
    const isAValidHabitDay = isAcceptedByRRule(habit, day);
    const isToday = format(currentDay, 'MM/dd/yyyy') === day;

    return {
      isBefore: isBeforeHabit,
      isAfter: isAfterHabit,
      isValid: isAValidHabitDay,
      isAfterCurrentDay: isAfter(day, currentDay),
      isToday,
    };
  }

  const getType = (item: Habit, day: string, habitRange: HabitRange) => {
    if (habitRange.isBefore || habitRange.isAfter) return 'blocked-dark';

    if (!habitRange.isValid) return 'blocked';

    const isChecked = getHabitCheck(item, day)?.checked;

    if (isChecked) return 'checked';

    if (habitRange.isAfterCurrentDay || habitRange.isToday) return 'none';

    return 'empty';
  }

  const habitsContainerClassname = cn("flex justify-end flex-1 overflow-x-auto md:max-w-full ");

  return (
    <div >
      {isFirstRow && (

        <div className="flex items-end justify-between ">
          <div className="min-w-32 h-7 flex items-center gap-2 mb-3 group">
            <div className="w-[2px] rounded-md h-full bg-black"></div>
            <h6 className="text-sm font-medium font-[Recursive]">{category.name}</h6>

            <button className="group-hover:opacity-100 opacity-0 transition-opacity duration-200 w-5 h-5 rounded-full flex items-center justify-center border border-neutral-500" onClick={onHideHabit}>
              {hideHabits ? <EyeOff size={12} /> : <Eye size={14} />}
            </button>
          </div>

          <div className={cn(habitsContainerClassname, 'items-end')}>

            {isFirstRow && daysInMonth.map((day) => {
              const formattedDay = format(day, 'MM/dd/yyyy');
              const isToday = format(currentDay, 'MM/dd/yyyy') === formattedDay;

              return (
                <div className="w-7 min-h-7 border border-transparent flex items-center justify-center">
                  <HabitDay monthDay={day} currentDay={isToday} shouldShowArrow />
                </div>

              )
            })}
          </div>
        </div>
      )}
      <div
        id={`line-${item._id}`}
        className={
          cn(
            "flex justify-between items-center ",
            isFirstRow && "items-end",
          )
        } >


        <div>

          <div className="flex items-center gap-1 w-32">

            {enableOrder && (
              <button className={
                cn(
                  "w-3 h-5 text-neutral-400 rounded-full flex items-center justify-center border-neutral-500 transition-colors duration-200",
                  "hover:border hover:text-black ",
                )
              }>
                <GripVertical size={12} />
              </button>
            )}

            <div className="flex items-center gap-4 min-w-12 w-ful h-7">
              <HabitName
                item={item}
                isHovering={checkboxHovering}
                hide={hideHabits}
                onMouseEnter={() => setNameHovering(true)}
                onMouseLeave={() => setNameHovering(false)}
              />
            </div>
          </div>

        </div>

        <div className={habitsContainerClassname} onScroll={onScroll}
          data-scroll-line
          data-scroll-line-id={item._id}
        >
          {daysInMonth.map((monthDay, index) => {
            const formattedDay = format(monthDay, 'MM/dd/yyyy');
            const isToday = format(currentDay, 'MM/dd/yyyy') === formattedDay;

            const habitRange = getHabitRange(item, formattedDay);
            const type = getType(item, formattedDay, habitRange);

            return (
              <div className="flex flex-col justify-end">
                <HabitCheckbox
                  isHovering={nameHovering}
                  key={`${item._id}-${formattedDay}`}
                  disabled={!habitRange.isToday}
                  invertPattern={index % 2 === 0}
                  type={type}
                  onCheck={handleCheckHabit(item, formattedDay)}
                  item={item}
                  today={isToday}
                  onMouseEnter={() => setCheckboxHovering(true)}
                  onMouseLeave={() => setCheckboxHovering(false)}
                  isFirstColumn={index === 0}
                  isLastColumn={index === daysInMonth.length - 1}
                  isFirstRow={isFirstRow}
                  isLastRow={isLastRow}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}