import { cn } from "@/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { TooltipProvider } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { Triangle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HabitNameProps {
  item: Habit;
  isHovering: boolean;
  hide: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  isChild?: boolean;
  childSpan?: number;
}

const typeToName = {
  infinite: "Sem término",
  daily: "Diário",
  weekly: "Semanal",
  monthly: "Mensal",
  yearly: "Anual",
};

export const HabitName = ({
  item,
  isChild,
  isHovering,
  hide,
  onMouseEnter,
  onMouseLeave,
  onClick,
  childSpan,
}: HabitNameProps) => {
  const { t } = useTranslation("components");

  return (
    <TooltipProvider>
      <Tooltip delayDuration={250}>
        <TooltipTrigger asChild>
          <div
            className="max-w-full flex items-center"
            style={{
              paddingLeft: isChild ? `${childSpan || 0}px` : `0`,
            }}
          >
            <div
              className={cn(
                "text-xs font-bold whitespace-nowrap truncate border-2 border-transparent rounded-md hover:border-black flex items-center gap-1 px-1",
                isHovering && "border-black",
                hide && "blur-sm",
              )}
              onClick={onClick}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              <p
                className={cn(
                  "text-ellipsis overflow-hidden",
                  isChild && "pl-2",
                )}
              >
                {item.name}
              </p>
              {item.habit_deltas && <Triangle size={12} />}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="p-2">
          <div className="flex flex-col gap-1">
            {process.env.NODE_ENV === "development" && (
              <p className="text-xs text-black/75 font-medium">
                Id: {item._id}
              </p>
            )}
            <p className="text-sm text-bold text-black">
              {t("habit_name.information.title")}
            </p>
            <span className="text-xs text-black/75 font-medium">
              {t("habit_name.information.type")}:{" "}
              {typeToName[item.recurrence_type as keyof typeof typeToName] ||
                t("habit_name.information.no_definition")}
            </span>
            <span className="text-xs text-black/75 font-medium">
              {t("habit_name.information.started_at")}:{" "}
              {format(item.created_at, "dd/MM/yyyy")}
            </span>
            {item.end_date && (
              <span className="text-xs text-black/75 font-medium">
                {t("habit_name.information.ended_at")}:{" "}
                {format(item.end_date, "dd/MM/yyyy")}
              </span>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

