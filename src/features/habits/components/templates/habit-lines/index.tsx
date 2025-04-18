import { cn } from '@/lib/utils';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { format } from 'date-fns';
import { omit } from 'lodash';
import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useRef, useState } from "react";
import { HabitDay } from '../../atoms/habit-day';
import { HabitEmptyBox } from '../../molecules/habit-empty-box';
import { HabitLineCheckboxes } from "../../organism/habit-line-checkboxes";
import { groupByCategory, HabitGroup } from './utils';

export type HabitLineChange = {
  type: ('check' | 'order' | 'category')[];
  habit: Habit;
}

interface HabitLinesProps {
  habits: Habit[];
  categories: HabitCategory[];
  orderEnabled: boolean;
  daysInMonth: Date[];
  getHabitCheck: (habit: Habit, day: string) => HabitCheck;
  currentDay: Date;
  onHabitChange: (habitChange: HabitLineChange) => void;
  editEnabled: boolean;
  onDeleteHabit: (habit: Habit) => void;
  onEditHabit: (habit: Habit) => void;
}

export const HabitLines = ({ habits: initialHabits, categories, orderEnabled, daysInMonth, getHabitCheck, currentDay, onHabitChange, editEnabled, onDeleteHabit, onEditHabit }: HabitLinesProps) => {
  const currentLineId = useRef<string | undefined>('');
  const [hideHabits, setHideHabits] = useState<Record<string, boolean>>({});
  const timeOut = useRef<NodeJS.Timeout | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [habits, setHabits] = useState<Record<string, HabitGroup>>(groupByCategory(initialHabits, categories));

  useEffect(() => {
    setHabits(groupByCategory(initialHabits, categories));
  }, [initialHabits, categories]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const current = event.currentTarget['dataset']['scrollLineId'];
    if (currentLineId.current && currentLineId.current.length > 0 && current !== currentLineId.current) return;

    currentLineId.current = event.currentTarget['dataset']['scrollLineId'];

    const allElements = Array.from(document.querySelectorAll('[data-scroll-line]')) as HTMLDivElement[];
    const filteredElements = allElements
      .filter((element) => element.dataset['scrollLineId'] !== event.currentTarget['dataset']['scrollLineId']);

    filteredElements.forEach((element) => {
      element.scroll({
        left: event.currentTarget.scrollLeft,
        behavior: 'instant'
      })
    });

    timeOut.current = setTimeout(() => {
      currentLineId.current = '';
    }, 500);
  }

  useEffect(() => {
    const handleResize = () => {
      const allElements = Array.from(document.querySelectorAll('[data-scroll-line]')) as HTMLDivElement[];

      console.log('allElements', allElements);

      const days = 12;

      allElements.forEach((element) => {
        element.scroll({
          left: (days - 1) * 28,
          behavior: 'instant'
        })
      });
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleHideHabits = (id: string) => () => {
    setHideHabits((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function subtractOrder(order: number) {
    return Number((Number(order) - 0.0001).toFixed(4));
  }

  function addOrder(order: number) {
    return Number((Number(order) + 0.0001).toFixed(4));
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id === over?.id) {

      if (active.data.current?.habit.changed_category) {
        const categoryId = active.data.current?.habit.habit_category_id || 'general';

        setHabits((prev) => {
          const newHabits = {
            ...prev,
            [categoryId]: {
              ...prev[categoryId],
              list: prev[categoryId].list.map((habit) => omit(habit, 'changed_category'))
            }
          }

          return newHabits;
        })
      }

      onHabitChange?.({
        type: ['order', 'category'],
        habit: active.data.current?.habit,
      });

      return;
    }

    if (over?.data.current?.type === 'empty-box') {
      const newCategoryId = over?.data.current?.category?._id;
      const oldCategoryId = active.data.current?.habit.habit_category_id || 'general';

      const newHabit = {
        ...active.data.current?.habit,
        habit_category_id: newCategoryId,
        habit_category: over?.data.current?.category,
        order: 1000
      }

      setHabits((prev) => {
        const newHabits = {
          ...prev,
          [oldCategoryId]: {
            ...prev[oldCategoryId],
            list: prev[oldCategoryId].list.filter((habit) => habit._id !== active.data.current?.habit._id)
          },
          [newCategoryId]: {
            ...prev[newCategoryId],
            category: newHabit.habit_category,
            list: [...(prev[newCategoryId]?.list || []), newHabit]
          }
        }

        return newHabits;
      })

      onHabitChange?.({
        type: ['category'],
        habit: newHabit,
      });


      return;
    }

    const categoryId = active.data.current?.habit.habit_category_id || 'general';

    setHabits((prev) => {
      const items = prev[categoryId].list.slice() as Habit[];

      const oldIndex = items.findIndex(item => item._id === active.id);
      const newIndex = items.findIndex(item => item._id === over?.id);

      const newItems = arrayMove(items, oldIndex, newIndex);

      let newOrder = 0;
      const currentElement = newItems[newIndex];
      const nextElement = newItems[newIndex + 1];
      const previousElement = newItems[newIndex - 1];

      if (nextElement) {
        newOrder = subtractOrder(nextElement.order);
      } else if (previousElement) {
        newOrder = addOrder(previousElement.order);
      } else if (!nextElement) {
        newOrder = addOrder(currentElement.order);
      } else if (!previousElement) {
        newOrder = subtractOrder(currentElement.order);
      } else {
        newOrder = 1000;
      }


      newItems[newIndex].order = newOrder;

      console.log('newItems[newIndex]', newItems[newIndex]);

      onHabitChange({
        type: ['order', 'category'],
        habit: newItems[newIndex],
      });

      return ({
        ...prev,
        [categoryId]: {
          ...prev[categoryId],
          list: newItems
        }
      })
    });

    setDraggingHabit(null);
  }

  const onCheckHabit = (habit: Habit) => {
    onHabitChange({
      type: ['check'],
      habit: habit,
    });
  }

  const [draggingHabit, setDraggingHabit] = useState<Habit | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setDraggingHabit(event.active.data.current?.habit);
  }

  const handleDragOver = (event: DragOverEvent) => {
    if (event.over?.data.current?.type === 'empty-box') {
      return;
    }

    if (event.over?.data.current?.habit?.habit_category_id !== event.active?.data.current?.habit?.habit_category_id) {
      const { active, over } = event;

      const newCategoryId = over?.data.current?.habit['habit_category_id'];
      const oldCategoryId = active.data.current?.habit['habit_category_id'];

      const activeHabit = active.data.current?.habit;
      const newHabit = {
        ...activeHabit,
        habit_category_id: newCategoryId,
        habit_category: over?.data.current?.habit.habit_category || undefined,
        order: addOrder(over?.data.current?.habit.order || 0),
        changed_category: true,
      };


      setHabits((prev) => {
        const oldCategory = prev[oldCategoryId || 'general'];

        const oldCategoryList = oldCategory.list.filter((habit) => habit._id !== activeHabit['_id']);

        return {
          ...prev,
          [oldCategoryId || 'general']: {
            ...prev[oldCategoryId || 'general'],
            list: oldCategoryList
          },
          [newCategoryId || 'general']: {
            ...prev[newCategoryId || 'general'],
            list: [...prev[newCategoryId || 'general'].list, newHabit]
          }
        }
      })
    }
  }

  const onHideHabit = (categoryId: string) => () => {
    setHideHabits((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  }

  return (
    <div className="flex justify-between flex-col gap-4" >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        autoScroll={true}
      >
        {Object.entries(habits).map(([id, categorizedHabits], index) => (
          <div>
            <div className="flex items-end justify-between relative">
              <div className={cn("w-full h-7 flex items-center gap-2 mb-3 group", index === 0 && "w-full min-w-32 max-w-32 sm:max-w-auto sm:min-w-48 sm:w-auto")}>
                <div className="w-[2px] rounded-md h-full bg-black"></div>
                <h6 className="text-sm font-medium font-[Recursive] truncate">{categorizedHabits.category?.name}</h6>

                <button className="group-hover:opacity-100 opacity-0 transition-opacity duration-200 w-5 h-5 rounded-full flex items-center justify-center border border-neutral-500"
                  onClick={onHideHabit(id)}
                >
                  {hideHabits ? <EyeOff size={12} /> : <Eye size={14} />}
                </button>
              </div>

              {index === 0 && (
                <div className="overflow-x-auto no-scrollbar  flex items-end" onScroll={handleScroll} data-scroll-line-id={id}>
                  {daysInMonth.map((day) => {
                    const formattedDay = format(day, 'MM/dd/yyyy');
                    const isToday = format(currentDay, 'MM/dd/yyyy') === formattedDay;

                    return (
                      <div className="min-w-7 min-h-7 border border-transparent flex items-center justify-center">
                        <HabitDay monthDay={day} currentDay={isToday} shouldShowArrow />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <>
              {categorizedHabits && categorizedHabits?.list?.length === 0 && (
                <HabitEmptyBox category={categorizedHabits.category} />
              )}
              {categorizedHabits && categorizedHabits?.list?.length > 0 && (

                <SortableContext
                  items={categorizedHabits?.list?.sort((a: Habit, b: Habit) => (a.order || 0) - (b.order || 0)).map(item => item._id)}
                  strategy={verticalListSortingStrategy}
                >
                  {categorizedHabits?.list?.sort((a: Habit, b: Habit) => (a.order || 0) - (b.order || 0)).map((item: Habit, habitIndex: number, currentArray) => (
                    <HabitLineCheckboxes
                      enableEdit={editEnabled}
                      enableDelete={editEnabled}
                      category={categorizedHabits.category}
                      key={item._id}
                      onScroll={handleScroll}
                      enableOrder={orderEnabled}
                      habit={item}
                      daysInMonth={daysInMonth}
                      getHabitCheck={getHabitCheck}
                      currentDay={currentDay}
                      onCheckHabit={onCheckHabit}
                      onDelete={() => onDeleteHabit?.(item)}
                      isFirstRow={habitIndex === 0}
                      isLastRow={habitIndex === currentArray.length - 1}
                      hideHabits={hideHabits[id]}
                      onHideHabit={handleHideHabits(id)}
                      onEdit={() => onEditHabit?.(item)}
                    />
                  ))}
                </SortableContext>

              )}
            </>
          </div>

        ))}
        <DragOverlay modifiers={[restrictToWindowEdges]}>
          {draggingHabit && (
            <HabitLineCheckboxes
              enableEdit={false}
              isFirstRow={false}
              isLastRow={false}
              hideHabits={false}
              onScroll={handleScroll}
              enableOrder={orderEnabled}
              habit={draggingHabit}
              daysInMonth={daysInMonth}
              getHabitCheck={getHabitCheck}
              currentDay={currentDay}
              onCheckHabit={onCheckHabit}
            />
          )}
        </DragOverlay>

      </DndContext>
    </div>
  )
}