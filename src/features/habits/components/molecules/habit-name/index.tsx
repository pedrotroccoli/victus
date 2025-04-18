import { cn } from "@/lib/utils";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { TooltipProvider } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { Triangle } from "lucide-react";

interface HabitNameProps {
  item: Habit;
  isHovering: boolean;
  hide: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const typeToName = {
  infinite: 'Sem término',
  daily: 'Diário',
  weekly: 'Semanal',
  monthly: 'Mensal',
  yearly: 'Anual',
}

export const HabitName = ({ item, isHovering, hide, onMouseEnter, onMouseLeave }: HabitNameProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={250}>
        <TooltipTrigger asChild>
          <div className={cn(
            "text-xs font-bold whitespace-nowrap truncate border-2 border-transparent rounded-md hover:border-black max-w-full flex items-center gap-2 w-full",
            isHovering && "border-black",
            hide && "blur-sm"
          )
          }
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <p className="max-w-[calc(100%-24px)] text-ellipsis overflow-hidden">
              {item.name}
            </p>
            {item.habit_deltas && (
              <Triangle size={12} />
            )}

          </div>
        </TooltipTrigger>
        <TooltipContent className="p-2">
          <div className="flex flex-col gap-1">
            {process.env.NODE_ENV === 'development' && (
              <p className="text-xs text-black/75 font-medium">Id: {item._id}</p>
            )}
            <p className="text-sm text-bold text-black">Informações:</p>
            <span className="text-xs text-black/75 font-medium">Tipo: {typeToName[item.recurrence_type as keyof typeof typeToName] || 'Sem definição'}</span>
            <span className="text-xs text-black/75 font-medium">Iniciou em: {format(item.created_at, 'dd/MM/yyyy')}</span>
            {item.end_date && <span className="text-xs text-black/75 font-medium">Termina em: {format(item.end_date, 'dd/MM/yyyy')}</span>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

  )
}