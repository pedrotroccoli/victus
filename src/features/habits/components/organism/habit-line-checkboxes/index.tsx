import { cn } from "@/lib/utils";
import { isAcceptedByRRule } from "@/utils/habits";
import { sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format, isAfter, isBefore, subDays } from "date-fns";
import { ChevronRight, GripVertical, Pencil, Trash } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { HabitCheckbox } from "../../molecules/habit-checkbox";
import { HabitName } from "../../molecules/habit-name";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

export interface HabitLineCheckboxesProps {
  habit: Habit;
  category?: HabitCategory;
  getHabitCheck?: (habit: Habit, day: string) => HabitCheck;
  daysInMonth: Date[];
  currentDay: Date;
  onCheckHabit?: (habit: Habit, day: string) => void;
  isFirstRow: boolean;
  isLastRow: boolean;
  onDelete?: () => void;
  onDeleteHabit?: (habit: Habit) => void;
  enableOrder?: boolean;
  enableEdit?: boolean;
  enableDelete?: boolean;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  hideHabits: boolean;
  onHideHabit?: () => void;
  onEdit?: () => void;
  onEditHabit?: (habit: Habit) => void;
  isChild?: boolean;
  childSpan?: number;
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
  isFirstRow,
  isLastRow,
  onScroll,
  enableOrder,
  hideHabits,
  enableEdit,
  enableDelete,
  onDelete,
  onDeleteHabit,
  onEdit,
  onEditHabit,
  isChild,
  childSpan,
}: HabitLineCheckboxesProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [nameHovering, setNameHovering] = useState(false);
  const [checkboxHovering, setCheckboxHovering] = useState(false);

  const [hiddenHabits, setHiddenHabits] = useLocalStorage<Record<string, { hidden: boolean }>>(
    "@victus::hidden-habits",
    {}
  );

  const [collapsedHabits, setCollapsedHabits] = useLocalStorage<Record<string, boolean>>(
    "@victus::collapsed-habits",
    {}
  );

  const habitHidden = hiddenHabits[habit._id]?.hidden ?? false;
  const isHidden = hideHabits || habitHidden;

  const hasChildren = habit?.children_habits && habit.children_habits.length > 0;
  const isCollapsed = collapsedHabits[habit._id] ?? false;

  const toggleCollapsed = useCallback(() => {
    setCollapsedHabits((prev) => ({
      ...prev,
      [habit._id]: !isCollapsed,
    }));
  }, [habit._id, isCollapsed, setCollapsedHabits]);

  const toggleHabitHidden = useCallback(() => {
    setHiddenHabits((prev) => ({
      ...prev,
      [habit._id]: { hidden: !habitHidden },
    }));
  }, [habit._id, habitHidden, setHiddenHabits]);

  const handleCheckHabit = useCallback(
    (habit: Habit, day: string) => () => {
      onCheckHabit?.(habit, day);
    },
    [onCheckHabit],
  );

  function getHabitRange(habit: Habit, day: string): HabitRange {
    const isBeforeHabit = isBefore(day, subDays(habit.start_date, 1));
    const isAfterHabit = habit.end_date ? isAfter(day, habit.end_date) : false;
    const isAValidHabitDay = isAcceptedByRRule(habit, day);
    const isToday = format(currentDay, "MM/dd/yyyy") === day;

    return {
      isBefore: isBeforeHabit,
      isAfter: isAfterHabit,
      isValid: isAValidHabitDay,
      isAfterCurrentDay: isAfter(day, currentDay),
      isToday,
    };
  }

  const getType = (item: Habit, day: string, habitRange: HabitRange) => {
    if (habitRange.isBefore || habitRange.isAfter) return "blocked-dark";

    if (!habitRange.isValid) return "blocked";

    const isChecked = getHabitCheck?.(item, day)?.checked;

    if (isChecked) return "checked";

    if (habitRange.isAfterCurrentDay || habitRange.isToday) return "none";

    return "empty";
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit._id, data: { type: "habit", habit: habit } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn(isDragging && "opacity-0")}
      >
        <div
          id={`line-${habit._id}`}
          className={cn(
            "flex justify-between items-center w-full max-w-full",
            isDragging && "shadow-lg z-50",
          )}
        >
          <div className="w-full overflow-visible min-w-32 max-w-32 sm:max-w-auto sm:min-w-48 ">
            <div className="flex items-center gap-0.5">
              {hasChildren && (
                <button
                  onClick={toggleCollapsed}
                  className="h-5 text-neutral-500 flex items-center justify-center"
                >
                  <ChevronRight
                    size={14}
                    strokeWidth={3}
                    className={cn(
                      "transition-transform duration-200",
                      !isCollapsed && "rotate-90"
                    )}
                  />
                </button>
              )}
              {enableOrder && (
                <button
                  {...listeners}
                  ref={setActivatorNodeRef}
                  className={cn(
                    "w-3 h-5 text-neutral-400 rounded-full flex items-center justify-center border-neutral-500 transition-colors duration-200",
                    "hover:border hover:text-black ",
                  )}
                >
                  <GripVertical size={12} />
                </button>
              )}

              <div
                className="flex items-center min-w-24 w-full h-7 data-[edit-enabled=true]:max-w-40"
                data-edit-enabled={enableEdit || enableDelete}
              >
                <HabitName
                  onClick={onEdit}
                  item={habit}
                  isHovering={checkboxHovering}
                  hide={isHidden}
                  onMouseEnter={() => setNameHovering(true)}
                  onMouseLeave={() => setNameHovering(false)}
                  onToggleHide={toggleHabitHidden}
                  isChild={isChild}
                  childSpan={childSpan}
                  hasChildren={hasChildren}
                />

                <div className="flex items-center gap-px ml-auto sm:ml-1">
                  {enableEdit && (
                    <button
                      className="cursor-pointer border border-transparent hover:border-black rounded-full p-1 group"
                      onClick={onEdit}
                    >
                      <Pencil
                        size={12}
                        className="cursor-pointer text-neutral-400 group-hover:text-black"
                      />
                    </button>
                  )}
                  {enableDelete && (
                    <button
                      className="cursor-pointer border border-transparent hover:border-black rounded-full p-1 group hidden sm:block"
                      onClick={onDelete}
                    >
                      <Trash
                        size={12}
                        className="cursor-pointer text-neutral-400 group-hover:text-black"
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            className="relative flex justify-end overflow-x-auto no-scrollbar"
            onScroll={onScroll}
            data-scroll-line
            data-scroll-line-id={habit._id}
          >
            {habit.paused_at && (
              <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-10 cursor-not-allowed"></div>
            )}
            <div className="flex items-center w-full">
              {daysInMonth.map((monthDay, index) => {
                const formattedDay = format(monthDay, "MM/dd/yyyy");
                const isToday =
                  format(currentDay, "MM/dd/yyyy") === formattedDay;

                const habitRange = getHabitRange(habit, formattedDay);
                const type = getType(habit, formattedDay, habitRange);

                return (
                  <div className="flex flex-col justify-end">
                    <HabitCheckbox
                      isHovering={nameHovering}
                      key={`${habit._id}-${formattedDay}`}
                      disabled={
                        !habitRange.isToday ||
                        (type !== "none" && type !== "checked")
                      }
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
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {hasChildren && !isCollapsed && (
        <div className="relative">
          {/* Top circle - centered with first child habit */}
          <div className="absolute top-2.5 left-[3px] w-2 h-2 rounded-full bg-white border border-black"></div>
          {/* Vertical line */}
          <div className="absolute top-[18px] left-[6px] w-[1px] h-[calc(100%-36px)] bg-black"></div>
          {/* Bottom circle - centered with last child habit */}
          <div className="absolute bottom-2.5 left-[3px] w-2 h-2 rounded-full bg-white border border-black"></div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragOver={() => {}}
            onDragEnd={() => {}}
            onDragStart={() => {}}
            autoScroll={true}
          >
            {habit.children_habits!.map((childHabit) => (
              <HabitLineCheckboxes
                key={childHabit._id}
                habit={childHabit}
                isFirstRow={false}
                isLastRow={isLastRow}
                daysInMonth={daysInMonth}
                currentDay={currentDay}
                getHabitCheck={getHabitCheck}
                onCheckHabit={onCheckHabit}
                onDelete={() => onDeleteHabit?.(childHabit)}
                onDeleteHabit={onDeleteHabit}
                enableOrder={enableOrder}
                enableEdit={enableEdit}
                enableDelete={enableDelete}
                onScroll={onScroll}
                hideHabits={hideHabits}
                onHideHabit={() => {}}
                onEdit={() => onEditHabit?.(childHabit)}
                onEditHabit={onEditHabit}
                isChild
                childSpan={childSpan ? childSpan + 1 : 1}
              />
            ))}
          </DndContext>
        </div>
      )}
    </>
  );
}

