import { cn } from "@/lib/utils";
import { moodHeights } from "@/features/mood/utils";

interface MoodBarProps {
  index: number;
  isFilled: boolean;
  isSelected: boolean;
  isHovered: boolean;
  fillColor: string;
  hoverColor: string;
  onClick: () => void;
  disabled?: boolean;
}

export const MoodBar = ({
  index,
  isFilled,
  isSelected,
  isHovered,
  fillColor,
  hoverColor,
  onClick,
  disabled = false,
}: MoodBarProps) => {
  const heightPercent = moodHeights[index];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-10 rounded-sm transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black",
        isHovered && !disabled ? hoverColor : isFilled ? fillColor : "border border-neutral-300 bg-transparent",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      style={{ height: `${(heightPercent / 100) * 60}px` }}
      aria-pressed={isSelected}
    />
  );
};
