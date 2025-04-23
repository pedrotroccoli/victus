import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Eye, EyeOff } from "lucide-react";
import { HabitDay } from "../../atoms/habit-day";

interface HabitLineHeaderProps {
  isFirstRow: boolean;
  category?: HabitCategory;
  hideHabits: boolean;
  onHideHabit: () => void;
  daysInMonth: Date[];
  handleScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  currentDay: Date;
}

export const HabitLineHeader = ({ isFirstRow, category, hideHabits, onHideHabit, daysInMonth, currentDay, handleScroll }: HabitLineHeaderProps) => {
  return (
    <div className="flex items-end justify-between relative">
      <div className={cn("w-full h-10 md:h-7 flex items-center gap-2 mb-3 group", isFirstRow && "w-full min-w-32 max-w-32 sm:max-w-auto sm:min-w-48 sm:w-auto")}>
        <div className="w-[2px] rounded-md h-full bg-black"></div>
        <h6 className="text-sm font-medium font-[Recursive] truncate">{category?.name}</h6>

        <button className="group-hover:opacity-100 opacity-0 transition-opacity duration-200 w-5 h-5 rounded-full flex items-center justify-center border border-neutral-500"
          onClick={onHideHabit}
        >
          {hideHabits ? <EyeOff size={12} /> : <Eye size={14} />}
        </button>
      </div>

      {isFirstRow && (
        <div className="overflow-x-auto no-scrollbar  flex items-end" onScroll={handleScroll} data-scroll-line-id={category?._id} data-scroll-line={true}>
          {daysInMonth.map((day) => {
            const formattedDay = format(day, 'MM/dd/yyyy');
            const isToday = format(currentDay, 'MM/dd/yyyy') === formattedDay;

            return (
              <div className="min-w-10 min-h-10 md:min-w-7 md:min-h-7 border border-transparent flex items-center justify-center">
                <HabitDay monthDay={day} currentDay={isToday} shouldShowArrow />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}