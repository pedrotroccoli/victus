import { MoodValue } from "@/services/mood/types";
import { moodConfig } from "@/features/mood/utils";
import { MoodEmoji } from "../../atoms/mood-emoji";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface MoodCardProps {
  value: MoodValue;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const MoodCard = ({ value, selected = false, disabled = false, onClick }: MoodCardProps) => {
  const { t } = useTranslation("dashboard");
  const config = moodConfig[value];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all duration-200",
        "hover:scale-105 hover:shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black",
        selected && "border-black ring-2 ring-black ring-offset-1",
        !selected && "border-neutral-200 hover:border-neutral-300",
        disabled && "opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none",
        config.bgColor
      )}
    >
      <MoodEmoji value={value} size="lg" />
      <span className={cn("text-xs font-medium", config.color)}>
        {t(`mood.values.${value}`)}
      </span>
    </button>
  );
};
