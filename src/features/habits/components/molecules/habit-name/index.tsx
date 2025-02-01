import { cn } from "@/lib/utils";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { TooltipProvider } from "@/components/ui/tooltip";
import { format } from "date-fns";

interface HabitNameProps {
  item: Habit;
  isHovering: boolean;
  hide: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const HabitName = ({ item, isHovering, hide, onMouseEnter, onMouseLeave }: HabitNameProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <p className={cn(
            "text-xs font-bold whitespace-nowrap truncate border-2 border-transparent rounded-md",
            isHovering && "border-black",
            hide && "blur-sm"
          )
          }
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >{item.name}</p>
        </TooltipTrigger>
        <TooltipContent>
          <p>{item.name} {process.env.NODE_ENV === 'development' && <span className="text-xs text-neutral-500">({item._id})</span>}</p>
          <p>{format(item.start_date, 'dd/MM/yyyy')} - {item.end_date && format(item.end_date, 'dd/MM/yyyy')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

  )
}