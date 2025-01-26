import { Eye } from "lucide-react";

import { EyeOff } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { TooltipProvider } from "@/components/ui/tooltip";

interface HabitVisibilityToggleProps {
  hideHabits: boolean;
  setHideHabits: (hideHabits: boolean) => void;
}

export const HabitVisibilityToggle = ({ hideHabits, setHideHabits }: HabitVisibilityToggleProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger>
          <button
            className="w-6 h-6 flex items-center justify-center border border-black rounded-full mb-2 hover:bg-black hover:text-white duration-200 transition-colors"
            onClick={() => setHideHabits(!hideHabits)}
          >
            {hideHabits ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{hideHabits ? 'Mostrar' : 'Esconder'} hábitos</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}