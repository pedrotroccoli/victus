import { cn } from "@/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Eye, EyeOff, Triangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { rrulestr } from "rrule";
import { useMemo } from "react";
import { useDate } from "@/lib/date-fns";
import { addDays } from "date-fns";

interface HabitNameProps {
  item: Habit;
  isHovering: boolean;
  hide: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  onToggleHide?: () => void;
  isChild?: boolean;
  childSpan?: number;
  hasChildren?: boolean;
}

const referenceMonday = new Date(2024, 0, 1);

export const HabitName = ({
  item,
  isChild,
  isHovering,
  hide,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onToggleHide,
  childSpan,
  hasChildren,
}: HabitNameProps) => {
  const { t } = useTranslation("components");
  const { formatDate } = useDate();

  const recurrenceLabel = useMemo(() => {
    if (!item.recurrence_details?.rule) return t("habit_name.tooltip.daily");

    try {
      const rrule = rrulestr(item.recurrence_details.rule);
      const byweekday = rrule.options.byweekday;

      if (!byweekday || byweekday.length === 0 || byweekday.length === 7) {
        return t("habit_name.tooltip.daily");
      }

      // Convert RRule weekday numbers (0=Mon) to formatted names using date-fns locale
      return byweekday
        .map((day: number) => {
          const date = addDays(referenceMonday, day);
          return formatDate(date, "EEE");
        })
        .join(", ");
    } catch {
      return t("habit_name.tooltip.daily");
    }
  }, [item.recurrence_details?.rule, formatDate, t]);

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
                "text-xs font-bold whitespace-nowrap truncate rounded-md outline outline-2 outline-transparent outline-offset-1 hover:outline-black flex items-center gap-1",
                !hasChildren && "px-1 ml-0.5",
                isChild && "ml-4",
                isHovering && "outline-black",
                hide && "blur-sm",
              )}
              onClick={onClick}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              <p className="text-ellipsis overflow-hidden">
                {item.name}
              </p>
              {item.habit_deltas && <Triangle size={12} />}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-black text-white px-2 py-1.5 rounded">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs">
              {t("habit_name.tooltip.type")}: {recurrenceLabel}
            </span>
            <span className="text-xs">
              {t("habit_name.tooltip.start")}: {formatDate(new Date(item.start_date), "P")}
            </span>
            {item.end_date && (
              <span className="text-xs">
                {t("habit_name.tooltip.end")}: {formatDate(new Date(item.end_date), "P")}
              </span>
            )}
            {onToggleHide && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleHide();
                }}
                className="flex items-center gap-1.5 text-xs mt-1 pt-1 border-t border-white/20 hover:text-white/80 transition-colors"
              >
                {hide ? <Eye size={12} /> : <EyeOff size={12} />}
                {hide ? t("habit_name.tooltip.show") : t("habit_name.tooltip.hide")}
              </button>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

