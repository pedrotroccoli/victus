import { cn } from "@/lib/utils";
import { isAcceptedByRRule } from "@/utils/habits";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { format, isAfter, isBefore, subDays } from "date-fns";
import { GripVertical } from "lucide-react";
import React, { useCallback, useState } from "react";
import { HabitCheckbox } from "../../molecules/habit-checkbox";
import { HabitName } from "../../molecules/habit-name";

export interface HabitLineCheckboxesProps {
  habit: Habit;
  category?: HabitCategory;
  getHabitCheck?: (habit: Habit, day: string) => HabitCheck;
  daysInMonth: Date[];
  currentDay: Date;
  onCheckHabit?: (habit: Habit, day: string) => void;
  isFirstRow: boolean;
  isLastRow: boolean;
  enableOrder: boolean;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  hideHabits: boolean;
  onHideHabit?: () => void;
  editEnabled: boolean;
}

interface HabitRange {
  isBefore: boolean;
  isAfter: boolean;
  isValid: boolean;
  isAfterCurrentDay: boolean;
  isToday: boolean;
}


export function HabitLineCheckboxes({
  habit,
  daysInMonth,
  getHabitCheck,
  currentDay,
  onCheckHabit,
  isFirstRow, isLastRow, onScroll, enableOrder,
  hideHabits,
}: HabitLineCheckboxesProps) {
  const [nameHovering, setNameHovering] = useState(false);
  const [checkboxHovering, setCheckboxHovering] = useState(false);

  const handleCheckHabit = useCallback((habit: Habit, day: string) => () => {
    onCheckHabit?.(habit, day);
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

    const isChecked = getHabitCheck?.(item, day)?.checked;

    if (isChecked) return 'checked';

    if (habitRange.isAfterCurrentDay || habitRange.isToday) return 'none';

    return 'empty';
  }


  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit._id, data: { type: 'habit', habit: habit } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


  return (
    <div ref={setNodeRef} style={style} {...attributes} className={cn(isDragging && "opacity-0")}>

      <div
        id={`line-${habit._id}`}
        className={
          cn(
            "flex justify-between items-center w-full max-w-full",
            isDragging && "shadow-lg z-50"
          )
        } >
        <div className="max-w-full overflow-hidden min-w-24 md:min-w-48">
          <div className="flex items-center gap-1 ">

            {enableOrder && (
              <button
                {...listeners}
                ref={setActivatorNodeRef}
                className={
                  cn(
                    "w-3 h-5 text-neutral-400 rounded-full flex items-center justify-center border-neutral-500 transition-colors duration-200",
                    "hover:border hover:text-black ",
                  )
                }>
                <GripVertical size={12} />
              </button>
            )}

            <div className="flex items-center gap-4 min-w-24 md:min-w-24 w-full h-7 pl-1">
              <HabitName
                item={habit}
                isHovering={checkboxHovering}
                hide={hideHabits}
                onMouseEnter={() => setNameHovering(true)}
                onMouseLeave={() => setNameHovering(false)}
              />
              {/* {isOver && (
                <div className="w-4 h-4 bg-red-500"></div>
              )} */}
              {/* {editEnabled && (
                <Edit size={14} />
              )} */}
            </div>
          </div>
        </div>

        <div className="flex justify-end overflow-x-auto md:max-w-full max-w-full flex-1 no-scrollbar" onScroll={onScroll}
          data-scroll-line
          data-scroll-line-id={habit._id}
        >
          <div className="flex items-center w-full">

            {daysInMonth.map((monthDay, index) => {
              const formattedDay = format(monthDay, 'MM/dd/yyyy');
              const isToday = format(currentDay, 'MM/dd/yyyy') === formattedDay;

              const habitRange = getHabitRange(habit, formattedDay);
              const type = getType(habit, formattedDay, habitRange);

              return (
                <div className="flex flex-col justify-end">
                  <HabitCheckbox
                    isHovering={nameHovering}
                    key={`${habit._id}-${formattedDay}`}
                    disabled={!habitRange.isToday || type !== 'none'}
                    invertPattern={index % 2 === 0}
                    type={type}
                    onCheck={handleCheckHabit(habit, formattedDay)}
                    item={habit}
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
    </div>
  )
}