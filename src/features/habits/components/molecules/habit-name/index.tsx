import { cn } from "@/lib/utils";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { TooltipProvider } from "@/components/ui/tooltip";

interface HabitNameProps {
  item: Habit;
  isHovering: boolean;
  hide: boolean;
  showHideButton: boolean;
}

export const HabitName = ({ item, isHovering, hide, showHideButton }: HabitNameProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <p className={cn(
            "text-xs font-bold whitespace-nowrap truncate mr-2 border-2 border-transparent p-1 rounded-md",
            showHideButton && "pb-1",
            isHovering && "border-black",
            hide && "blur-sm"
          )
          }>{item.name}</p>
        </TooltipTrigger>
        <TooltipContent>
          <p>{item.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

  )
}