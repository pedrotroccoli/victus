import { TooltipContent } from "@/components/ui/tooltip";

import { TooltipTrigger } from "@/components/ui/tooltip";

import { Tooltip } from "@/components/ui/tooltip";

import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { HTMLAttributes, useMemo, useState } from "react";
import { HabitBox } from "../../ions/habit-box";

interface HabitCheckboxProps extends HTMLAttributes<HTMLButtonElement> {
  item: Habit;
  realDay: Date;
  today: boolean;
  isChecked: boolean;
  onCheck: () => void;
  isInTheHabitRange: boolean;
  range: Date[];
  isAPastDay: boolean;
  isFirst: boolean;
  isLast: boolean;
  invertPattern?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;

}

export const HabitCheckbox = ({ today, isChecked, onCheck, isInTheHabitRange, isAPastDay, isFirst, isLast, invertPattern = false, ...rest }: HabitCheckboxProps) => {
  const [checked, setChecked] = useState(isChecked);

  const handleCheckHabit = async () => {
    try {
      setChecked(prev => !prev);
      await onCheck();
    } catch (error) {
      setChecked(prev => !prev);
    }
  }

  const type = useMemo(() => {
    if (!isInTheHabitRange) return 'out-of-range';

    if (checked) return 'checked';

    if (isAPastDay) return 'empty';

    return 'none';
  }, [isInTheHabitRange, checked, isAPastDay]);

  return (
    <HabitBox
      type={type}
      className={
        cn(
          isFirst && today && "border-t-neutral-500",
          isLast && today && "border-b-neutral-500",
          "data-[is-current-day=true]:border-x-neutral-500",
          "disabled:cursor-not-allowed",
        )}
      checkedPattern={invertPattern ? '02' : '01'}
      data-is-current-day={today}
      data-is-today={today}
      disabled={!isInTheHabitRange || !today}
      onClick={handleCheckHabit}

      {...rest}
    >
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
    </HabitBox>
  )
}