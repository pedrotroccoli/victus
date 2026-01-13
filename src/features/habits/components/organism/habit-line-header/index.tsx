import { IconDisplay } from "@/components/atoms/icon-picker";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { HabitDay } from "../../atoms/habit-day";

interface CollapsibleBarProps {
  collapsed: boolean;
  onClick: () => void;
}

const CollapsibleBar = ({ collapsed, onClick }: CollapsibleBarProps) => {
  if (collapsed) {
    // Chevron pointing down "v"
    return (
      <button
        onClick={onClick}
        className="relative w-[14px] h-[14px] flex items-center justify-center flex-shrink-0"
        title="Expand"
      >
        <span className="absolute w-[2px] h-[7px] bg-black rounded-full origin-bottom left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 rotate-[35deg]" />
        <span className="absolute w-[2px] h-[7px] bg-black rounded-full origin-bottom left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 -rotate-[35deg]" />
      </button>
    );
  }

  // Vertical bar with hover animation to chevron ">"
  return (
    <button
      onClick={onClick}
      className="relative w-[14px] h-[14px] flex items-center justify-center flex-shrink-0 group/bar"
      title="Collapse"
    >
      <span
        className={cn(
          "absolute w-[2px] bg-black rounded-full transition-all duration-200",
          "h-[7px] top-0 left-1/2 -translate-x-1/2 origin-bottom",
          "group-hover/bar:-rotate-[35deg]"
        )}
      />
      <span
        className={cn(
          "absolute w-[2px] bg-black rounded-full transition-all duration-200",
          "h-[7px] bottom-0 left-1/2 -translate-x-1/2 origin-top",
          "group-hover/bar:rotate-[35deg]"
        )}
      />
    </button>
  );
};

interface HabitLineHeaderProps {
  isFirstRow: boolean;
  category?: HabitCategory;
  hideHabits: boolean;
  onHideHabit: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onEditCategory?: () => void;
  onDeleteCategory?: () => void;
  daysInMonth: Date[];
  handleScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  currentDay: Date;
}

export const HabitLineHeader = ({
  isFirstRow,
  category,
  hideHabits,
  onHideHabit,
  collapsed,
  onToggleCollapse,
  onEditCategory,
  onDeleteCategory,
  daysInMonth,
  currentDay,
  handleScroll,
}: HabitLineHeaderProps) => {
  return (
    <div className="flex items-end justify-between relative">
      <div className={cn("h-10 md:h-7 flex items-center gap-1.5 group", !collapsed && "mb-3", isFirstRow ? "min-w-32 max-w-48 sm:max-w-none sm:min-w-48" : "")}>
        <CollapsibleBar collapsed={collapsed} onClick={onToggleCollapse} />
        {category?.icon && (
          <IconDisplay name={category.icon} size={16} className="flex-shrink-0" />
        )}
        <h6 className="text-sm font-medium font-[Recursive] truncate">{category?.name}</h6>

        <div className="flex items-center gap-1 group-hover:opacity-100 opacity-0 transition-opacity duration-200 flex-shrink-0">
          <button
            className="w-5 h-5 rounded-full flex items-center justify-center border border-neutral-400 hover:border-neutral-600 hover:bg-neutral-100 transition-colors"
            onClick={onHideHabit}
            title={hideHabits ? "Show habits" : "Hide habits"}
          >
            {hideHabits ? <EyeOff size={11} /> : <Eye size={12} />}
          </button>

          {onEditCategory && (
            <button
              className="w-5 h-5 rounded-full flex items-center justify-center border border-neutral-400 hover:border-neutral-600 hover:bg-neutral-100 transition-colors"
              onClick={onEditCategory}
              title="Edit category"
            >
              <Pencil size={11} />
            </button>
          )}

          {onDeleteCategory && (
            <button
              className="w-5 h-5 rounded-full flex items-center justify-center border border-neutral-400 hover:border-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              onClick={onDeleteCategory}
              title="Delete category"
            >
              <Trash2 size={11} />
            </button>
          )}
        </div>
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