import { MoodValue } from "@/services/mood/types";
import { moodConfig } from "@/features/mood/utils";
import { cn } from "@/lib/utils";

interface MoodEmojiProps {
  value: MoodValue;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 20,
  md: 32,
  lg: 48,
};

export const MoodEmoji = ({ value, size = "md", showLabel = false, className }: MoodEmojiProps) => {
  const config = moodConfig[value];
  const Icon = config.icon;

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <Icon
        size={sizeMap[size]}
        className={cn(config.color)}
        strokeWidth={1.5}
        aria-label={config.label}
      />
      {showLabel && (
        <span className={cn("text-xs font-medium", config.color)}>
          {config.label}
        </span>
      )}
    </div>
  );
};
