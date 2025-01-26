import { TooltipContent } from "@/components/ui/tooltip";

import { TooltipTrigger } from "@/components/ui/tooltip";

import { Tooltip } from "@/components/ui/tooltip";

import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface HabitCheckboxProps extends HTMLAttributes<HTMLButtonElement> {
  item: Habit;
  realDay: Date;
  today: boolean;
  isChecked: boolean;
  onCheck: () => void;
  isInTheHabitRange: boolean;
  setIsHovering: (isHovering: boolean) => void;
  range: Date[];
  isAPastDay: boolean;
  isFirst: boolean;
  isLast: boolean;

}

export const HabitCheckbox = ({ today, isChecked, onCheck, isInTheHabitRange, setIsHovering, isAPastDay, isFirst, isLast, ...rest }: HabitCheckboxProps) => {

  const handleCheckHabit = () => {
    onCheck();
  }

  return (
    <button
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={
        cn(
          "w-7 h-7 flex items-center justify-center border border-neutral-300",
          isFirst && today && "border-t-neutral-500",
          isLast && today && "border-b-neutral-500",
          "data-[is-current-day=true]:border-x-neutral-500",
          "enabled:hover:border-black enabled:hover:border-2 ",
          "disabled:cursor-not-allowed",
          "data-[is-checked=true]:bg-checked-box-01",
          "data-[is-out-of-range=true]:bg-neutral-200",
          // habitIndex % 2 === 0 && "rotate-90"
        )}
      data-is-current-day={today}
      data-is-checked={isChecked}
      data-is-out-of-range={!isInTheHabitRange}
      data-is-today={today}
      disabled={!isInTheHabitRange || !today}
      onClick={handleCheckHabit}
      {...rest}
    >
      {!isChecked && isAPastDay && isInTheHabitRange && (
        <div className="w-1 h-1 border border-black rounded-full">
        </div>
      )}

      {process.env.NODE_ENV === 'development' && false && (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="bg-red-500 w-full h-full rounded-full"></div>
            </TooltipTrigger>
            <TooltipContent>
              <p>isFirst: {String(isFirst)}</p>
              <p>isLast: {String(isLast)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </button>
  )
}