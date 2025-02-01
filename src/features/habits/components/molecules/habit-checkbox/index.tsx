import { TooltipContent } from "@/components/ui/tooltip";

import { TooltipTrigger } from "@/components/ui/tooltip";

import { Tooltip } from "@/components/ui/tooltip";

import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { HTMLAttributes, useMemo, useState } from "react";
import { HabitBox, HabitBoxType } from "../../ions/habit-box";

interface HabitCheckboxProps extends HTMLAttributes<HTMLButtonElement> {
  item: Habit;
  today: boolean;
  onCheck: () => void;
  isFirst: boolean;
  isLast: boolean;
  invertPattern?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  disabled?: boolean;
  type: HabitBoxType;
}

export const HabitCheckbox = ({ today, onCheck, isFirst, isLast, invertPattern = false, disabled, type, ...rest }: HabitCheckboxProps) => {
  const [checked, setChecked] = useState(type === 'checked');

  const handleCheckHabit = async () => {
    try {
      setChecked(prev => !prev);
      await onCheck();
    } catch (error) {
      setChecked(prev => !prev);
    }
  }

  const internalType = useMemo(() => {
    if (checked) return 'checked';

    return type;
  }, [checked, type]);

  return (
    <HabitBox
      type={internalType}
      className={
        cn(
          isFirst && today && "border-t-neutral-500",
          isLast && today && "border-b-neutral-500",
          "data-[is-current-day=true]:border-x-neutral-500",
          "disabled:cursor-not-allowed",
        )}
      checkedPattern={invertPattern ? '02' : '01'}
      data-is-current-day={!!today}
      data-is-today={today}
      disabled={disabled}
      onClick={handleCheckHabit}
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