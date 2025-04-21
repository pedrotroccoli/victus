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
  isFirstRow: boolean;
  isLastRow: boolean;
  isFirstColumn: boolean;
  isLastColumn: boolean;
  invertPattern?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  disabled?: boolean;
  type: HabitBoxType;
  isHovering?: boolean;
}

export const HabitCheckbox = ({ today, onCheck, isFirstRow, isLastRow, isFirstColumn, isLastColumn, invertPattern = false, disabled, type, isHovering, ...rest }: HabitCheckboxProps) => {
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
          isFirstRow && today && "border-t-neutral-500",
          isLastRow && today && "border-b-neutral-500",
          "data-[is-current-day=true]:border-x-neutral-500",
          "disabled:cursor-not-allowed",
          isHovering && "border-t-black border-b-black",
          isHovering && today && "border-x-black",
          isFirstColumn && today && "border-l-black",
          isLastColumn && today && "border-r-black",
        )}
      checkedPattern={invertPattern ? '02' : '01'}
      data-is-current-day={!!today}
      data-is-today={today}
      disabled={disabled}
      onClick={disabled ? undefined : handleCheckHabit}
      {...rest}
    >
      {process.env.NODE_ENV === 'development' && false && (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="w-full h-full rounded-full"></div>
            </TooltipTrigger>
            <TooltipContent>
              <p>isFirst: {String(isFirstRow)}</p>
              <p>isLast: {String(isLastRow)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </HabitBox>
  )
}