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
import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useRef, useState } from "react";
import { HabitDay } from '../../atoms/habit-day';
import { HabitEmptyBox } from '../../molecules/habit-empty-box';
import { HabitLineCheckboxes } from "../../organism/habit-line-checkboxes";
import { groupByCategory, HabitGroup } from './utils';

interface HabitLinesProps {
  habits: Habit[];
  categories: HabitCategory[];
  orderEnabled: boolean;
  daysInMonth: Date[];
  getHabitCheck: (habit: Habit, day: string) => HabitCheck;
  currentDay: Date;
  onCheckHabit: (habit: Habit, day: string) => void;
  onOrderChange?: (habit: Habit, newOrder: number) => void;
  onCategoryChange?: (habit: Habit, newCategory: HabitCategory, order: number) => void;
  editEnabled: boolean;
}

export const HabitLines = ({ habits: initialHabits, categories, orderEnabled, daysInMonth, getHabitCheck, currentDay, onCheckHabit, onOrderChange, onCategoryChange, editEnabled }: HabitLinesProps) => {
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

    if (over && active.id === over.id) return;

    if (over?.data.current?.type === 'empty-box') {
      console.log('Dropou no box vazio', active, over);
      const categoryId = over.id;
      const oldCategoryId = active.data.current?.habit.habit_category_id || 'general';
      const newHabit = {
        ...active.data.current?.habit,
        habit_category_id: categoryId,
        order: 1000
      }

      setHabits((prev) => {
        return {
          ...prev,
          [oldCategoryId]: {
            ...prev[oldCategoryId],
            list: prev[oldCategoryId].list.filter((habit) => habit._id !== active.data.current?.habit._id)
          },
          [categoryId]: {
            ...prev[categoryId],
            list: [...prev[categoryId].list, newHabit]
          }
        }
      })

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

      // onOrderChange?.(newItems[newIndex], newOrder);

      newItems[newIndex].order = newOrder;

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

  const [draggingHabit, setDraggingHabit] = useState<Habit | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setDraggingHabit(event.active.data.current?.habit);
  }

  const handleDragOver = (event: DragOverEvent) => {
    if (event.over?.data.current?.type === 'empty-box') return;

    if (event.over?.data.current?.habit?.habit_category_id !== event.active?.data.current?.habit?.habit_category_id) {
      const { active, over } = event;

      const newCategoryId = over?.data.current?.habit['habit_category_id'];
      const oldCategoryId = active.data.current?.habit['habit_category_id'];

      const activeHabit = active.data.current?.habit;
      const newHabit = {
        ...activeHabit,
        habit_category_id: newCategoryId,
        order: addOrder(over?.data.current?.habit.order || 0)
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

  return (
    <div className="flex justify-between flex-col gap-4" >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        {Object.entries(habits).map(([id, categorizedHabits], index) => (
          <div>
            <div className="flex items-end justify-between">
              <div className="w-48 h-7 flex items-center gap-2 mb-3 group">
                <div className="w-[2px] rounded-md h-full bg-black"></div>
                <h6 className="text-sm font-medium font-[Recursive]">{categorizedHabits.name}</h6>

                <button className="group-hover:opacity-100 opacity-0 transition-opacity duration-200 w-5 h-5 rounded-full flex items-center justify-center border border-neutral-500"
                // onClick={onHideHabit}
                >
                  {hideHabits ? <EyeOff size={12} /> : <Eye size={14} />}
                </button>
              </div>

              {index === 0 && (

                <div className={"flex-1 overflow-x-auto md:max-w-full"}>
                  <div className='flex items-end justify-end w-full'>

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
                </div>
              )}
            </div>

            <>

              {categorizedHabits && categorizedHabits?.list?.length === 0 && (
                <HabitEmptyBox id={id} />
              )}
              {categorizedHabits && categorizedHabits?.list?.length > 0 && (

                <SortableContext
                  items={categorizedHabits?.list?.sort((a: Habit, b: Habit) => (a.order || 0) - (b.order || 0)).map(item => item._id)}
                  strategy={verticalListSortingStrategy}
                >
                  {categorizedHabits?.list?.sort((a: Habit, b: Habit) => (a.order || 0) - (b.order || 0)).map((item: Habit, habitIndex: number, currentArray) => (
                    <HabitLineCheckboxes
                      editEnabled={editEnabled}
                      category={{
                        id,
                        name: categorizedHabits.name
                      }}
                      key={item._id}
                      onScroll={handleScroll}
                      enableOrder={orderEnabled}
                      habit={item}
                      daysInMonth={daysInMonth}
                      getHabitCheck={getHabitCheck}
                      currentDay={currentDay}
                      onCheckHabit={onCheckHabit}
                      isFirstRow={habitIndex === 0}
                      isLastRow={habitIndex === currentArray.length - 1}
                      hideHabits={hideHabits[id]}
                      onHideHabit={handleHideHabits(id)}
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
              isFirstRow={false}
              isLastRow={false}
              hideHabits={false}
              editEnabled={editEnabled}
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