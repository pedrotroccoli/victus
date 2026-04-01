import { Mood, MoodValue } from "@/services/mood/types";
import { MoodEmoji } from "../../atoms/mood-emoji";
import { moodConfig } from "@/features/mood/utils";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Pencil } from "lucide-react";

interface MoodCurrentProps {
  mood: Mood;
  onEdit?: () => void;
}

export const MoodCurrent = ({ mood, onEdit }: MoodCurrentProps) => {
  const { t } = useTranslation("dashboard");
  const config = moodConfig[mood.value as MoodValue];

  return (
    <div className={cn(
      "flex items-center gap-4 p-4 rounded-lg border border-neutral-200",
      config.bgColor
    )}>
      <MoodEmoji value={mood.value as MoodValue} size="md" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn("text-sm font-medium", config.color)}>
            {t(`mood.values.${mood.value}`)}
          </span>
          <span className="text-xs text-neutral-500">
            {t("mood.current_hour", { hour: mood.hour_block })}
          </span>
        </div>
        {mood.description && (
          <p className="text-sm text-neutral-600 truncate mt-1">
            {mood.description}
          </p>
        )}
      </div>

      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="p-2 rounded-md hover:bg-black/5 transition-colors"
          aria-label={t("mood.change")}
        >
          <Pencil size={16} className="text-neutral-500" />
        </button>
      )}
    </div>
  );
};
