import { cn } from "@/lib/utils";
import { isAcceptedByRRule } from "@/utils/habits";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { HabitLineChange } from "../../templates/habit-lines";

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
  onHabitChange?: (habitChange: HabitLineChange) => void;
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
  onHabitChange,
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

  // State for managing child habits order
  const [childHabits, setChildHabits] = useState<Habit[]>(
    () => [...(habit.children_habits || [])].sort((a, b) => (a.order || 0) - (b.order || 0))
  );

  // Update child habits when prop changes
  React.useEffect(() => {
    setChildHabits(
      [...(habit.children_habits || [])].sort((a, b) => (a.order || 0) - (b.order || 0))
    );
  }, [habit.children_habits]);

  // Helper functions for fractional ordering
  const subtractOrder = (order: number) => Number((Number(order) - 0.0001).toFixed(4));
  const addOrder = (order: number) => Number((Number(order) + 0.0001).toFixed(4));

  // State for tracking which child is being dragged
  const [draggingChild, setDraggingChild] = useState<Habit | null>(null);

  // Handle drag start for child habits
  const handleChildDragStart = useCallback((event: DragStartEvent) => {
    const draggedHabit = childHabits.find((h) => h._id === event.active.id);
    setDraggingChild(draggedHabit || null);
  }, [childHabits]);

  // Handle drag end for child habits reordering
  const handleChildDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    setDraggingChild(null);

    if (!over || active.id === over.id) return;

    setChildHabits((items) => {
      const oldIndex = items.findIndex((item) => item._id === active.id);
      const newIndex = items.findIndex((item) => item._id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);

      // Calculate new order
      let newOrder = 0;
      const nextElement = newItems[newIndex + 1];
      const previousElement = newItems[newIndex - 1];

      if (nextElement) {
        newOrder = subtractOrder(nextElement.order);
      } else if (previousElement) {
        newOrder = addOrder(previousElement.order);
      } else {
        newOrder = 1000;
      }

      newItems[newIndex] = { ...newItems[newIndex], order: newOrder };

      // Notify parent about the change
      onHabitChange?.({
        type: ["order"],
        habit: newItems[newIndex],
      });

      return newItems;
    });
  }, [onHabitChange]);

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
            <div
              className="flex items-center gap-0.5"
              style={{
                paddingLeft: isChild ? `${(childSpan || 0) + 16}px` : '0',
              }}
            >
              {enableOrder && (
                <button
                  {...listeners}
                  ref={setActivatorNodeRef}
                  className={cn(
                    "w-4 h-5 text-neutral-400 flex items-center justify-center transition-colors duration-200 flex-shrink-0",
                    "hover:text-black cursor-grab active:cursor-grabbing",
                  )}
                >
                  <GripVertical size={12} />
                </button>
              )}
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
                  isChild={false}
                  childSpan={0}
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
            onDragStart={handleChildDragStart}
            onDragEnd={handleChildDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={childHabits.map((h) => h._id)}
              strategy={verticalListSortingStrategy}
            >
              {childHabits.map((childHabit) => (
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
                  onHabitChange={onHabitChange}
                />
              ))}
            </SortableContext>
            <DragOverlay modifiers={[restrictToVerticalAxis]}>
              {draggingChild && (
                <HabitLineCheckboxes
                  habit={draggingChild}
                  isFirstRow={false}
                  isLastRow={false}
                  daysInMonth={daysInMonth}
                  currentDay={currentDay}
                  getHabitCheck={getHabitCheck}
                  enableOrder={false}
                  enableEdit={false}
                  enableDelete={false}
                  hideHabits={false}
                  isChild
                  childSpan={childSpan ? childSpan + 1 : 1}
                />
              )}
            </DragOverlay>
          </DndContext>
        </div>
      )}
    </>
  );
}

