import { useMemo, useRef } from "react";
import { HabitLineCheckboxes } from "../../organism/habit-line-checkboxes";

interface HabitLinesProps {
  habits: Habit[];
  orderEnabled: boolean;
  daysInMonth: Date[];
  getHabitCheck: (habit: Habit, day: string) => HabitCheck;
  currentDay: Date;
  onCheckHabit: (habit: Habit, day: string) => void;
}

export const HabitLines = ({ habits, orderEnabled, daysInMonth, getHabitCheck, currentDay, onCheckHabit }: HabitLinesProps) => {
  const currentLineId = useRef<string | undefined>('');
  const timeOut = useRef<NodeJS.Timeout | null>(null);

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

  const habitsByCategory = useMemo((): Record<string, { name: string, list: Habit[] }> => {
    return habits.reduce((acc: Record<string, { name: string, list: Habit[] }>, habit: Habit) => {
      if (!acc[habit.habit_category_id] && habit.habit_category_id) {
        acc[habit.habit_category_id] = {
          name: habit?.habit_category?.name || '',
          list: []
        };
      }

      if (!acc['general']) {
        acc['general'] = {
          name: 'Geral',
          list: []
        };
      }

      if (habit.habit_category_id) {
        acc[habit.habit_category_id].name = habit.habit_category.name || '';
        acc[habit.habit_category_id].list.push(habit);
      } else {
        acc['general'].list.push(habit);
      }

      return acc;
    }, {});


  }, [habits]);

  return (
    <div className="flex justify-between flex-col gap-4" >
      {Object.entries(habitsByCategory).map(([_, categorizedHabits]) => (
        <div>
          <div className="text-sm font-medium border-b border-neutral-300 pb-4 mb-4">{categorizedHabits.name}</div>
          {categorizedHabits && categorizedHabits?.list?.sort((a: Habit, b: Habit) => (a.order || 0) - (b.order || 0)).map((item: Habit, habitIndex: number) => (
            <HabitLineCheckboxes
              key={item._id}
              onScroll={handleScroll}
              enableOrder={orderEnabled}
              item={item}
              daysInMonth={daysInMonth}
              getHabitCheck={getHabitCheck}
              currentDay={currentDay}
              onCheckHabit={onCheckHabit}
              isFirstRow={habitIndex === 0}
              isLastRow={habitIndex === habits.length - 1}
            />
          ))}
        </div>
      ))}
    </div>
  )
}