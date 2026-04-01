import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CircleArrowDown } from "lucide-react";
import { useMemo } from "react";

import { useDate } from "@/lib/date-fns";

interface HabitDayProps {
  monthDay: Date;
  currentDay: boolean;
  shouldShowArrow: boolean;
}

export const HabitDay = ({ monthDay, currentDay, shouldShowArrow }: HabitDayProps) => {
  const { formatDate } = useDate();

  const monthDayFormatted = formatDate(monthDay, 'dd');
  const day = formatDate(monthDay, 'P');
  const weekDayName = useMemo(() => {
    const weekday = formatDate(monthDay, 'EEEE');

    return weekday[0].toLocaleUpperCase() + weekday.slice(1);
  }, [monthDay]);

  return (
    <div>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            {shouldShowArrow && currentDay ? (
              <CircleArrowDown size={14} className="mb-2 mt-3 mx-auto" />
            ) : (
              <>
                <p className="text-[0.5rem] mb-px font-bold text-black rounded-sm">
                  {weekDayName[0].toLocaleUpperCase()}
                </p>
                <p className={cn(
                  "text-xs mb-2 font-medium text-black rounded-sm",
                )}>{monthDayFormatted}</p>
              </>
            )}
          </TooltipTrigger>
          <TooltipContent className="bg-black text-white text-center px-2 py-1 rounded">
            <p className="text-xs font-bold font-[Recursive]">{weekDayName}</p>
            <p className="text-xs mt-1">{day}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}