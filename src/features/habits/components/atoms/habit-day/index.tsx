import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CircleArrowDown } from "lucide-react";

interface HabitDayProps {
  monthDay: Date;
  day: string;
  currentDay: boolean;
  shouldShowArrow: boolean;
}

export const HabitDay = ({ monthDay, day, currentDay, shouldShowArrow }: HabitDayProps) => {
  return (
    <div>
      {shouldShowArrow && currentDay && (
        <CircleArrowDown size={14} className="mb-4" />
      )}
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            <p className={cn(
              "text-xs mb-2 font-medium text-black rounded-sm",
            )}>{day}</p>
          </TooltipTrigger>
          <TooltipContent>
            <p>{format(monthDay, 'dd/MM/yyyy')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}