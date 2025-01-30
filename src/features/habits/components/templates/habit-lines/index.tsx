import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { GripVertical } from "lucide-react";
import { useState } from "react";
import { HabitDay } from "../../atoms/habit-day";
import { HabitName } from "../../molecules/habit-name";
import { HabitLineCheckboxes } from "../../organism/habit-line-checkboxes";

interface HabitLinesProps {
  habits: Habit[];
  orderEnabled: boolean;
  hideHabits: boolean;
  setHideHabits: (hideHabits: boolean) => void;
  daysInMonth: Date[];
  getHabitCheck: (habit: Habit, day: string) => HabitCheck;
  currentDay: Date;
  onCheckHabit: (habit: Habit, day: string) => void;
}

export const HabitLines = ({ habits, orderEnabled, hideHabits, daysInMonth, getHabitCheck, currentDay, onCheckHabit }: HabitLinesProps) => {
  const [itemHovering, setItemHovering] = useState<string | null>(null);
  const [rowHovering, setRowHovering] = useState<string | null>(null);

  return (
    <div className="flex justify-between gap-4" >
      <div className="flex flex-col justify-end">

        {habits && habits.map((item) => (
          <div className="flex items-center gap-1">
            {orderEnabled && (
              <button className={
                cn(
                  "w-3 h-5 text-neutral-400 rounded-full flex items-center justify-center border-neutral-500 transition-colors duration-200",
                  "hover:border hover:text-black ",
                )
              }>
                <GripVertical size={12} />
              </button>
            )}

            <div className="flex items-center gap-4 min-w-12 h-7">
              <HabitName
                item={item}
                isHovering={itemHovering === item._id}
                hide={hideHabits}
                onMouseEnter={() => setRowHovering(item._id)}
                onMouseLeave={() => setRowHovering(null)}
              />
            </div>
          </div>
        ))}
      </div>


      <ScrollArea>
        <ScrollBar orientation="horizontal" />
        {habits && habits?.sort((a: Habit, b: Habit) => (a.order || 0) - (b.order || 0)).map((item: Habit, habitIndex: number) => (
          <HabitLineCheckboxes
            key={item._id}
            setIsHovering={(state) => setItemHovering(state ? item._id : null)}
            rowHovering={rowHovering === item._id}
            before={habitIndex === 0 && (
              <div className="flex items-end justify-end">
                {daysInMonth.map(monthDay => {
                  const day = format(monthDay, 'dd');
                  const today = format(currentDay, 'dd/MM/yyyy') === format(monthDay, 'dd/MM/yyyy');

                  return (
                    <div className="w-7 min-h-7 border border-transparent flex items-center justify-center">
                      <HabitDay monthDay={monthDay} day={day} currentDay={today} shouldShowArrow />
                    </div>
                  )
                })}
              </div>
            )}
            enableOrder={orderEnabled}
            item={item}
            hideHabits={hideHabits}
            daysInMonth={daysInMonth}
            getHabitCheck={getHabitCheck}
            currentDay={currentDay}
            onCheckHabit={onCheckHabit}
            isFirst={habitIndex === 0}
            isLast={habitIndex === habits.length - 1}
          />
        ))}
      </ScrollArea>
    </div>
  )
}