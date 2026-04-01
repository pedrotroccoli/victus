import { useState } from "react";
import { MoodValue } from "@/services/mood/types";
import { moodValues, moodConfig, getMoodIndex } from "@/features/mood/utils";
import { MoodBar } from "../../molecules/mood-bar";
import { MoodEmoji } from "../../atoms/mood-emoji";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";

interface MoodSelectorProps {
  selectedMood?: MoodValue | null;
  onSelectMood: (value: MoodValue) => void;
  disabled?: boolean;
}

export const MoodSelector = ({
  selectedMood,
  onSelectMood,
  disabled = false,
}: MoodSelectorProps) => {
  const { t } = useTranslation("dashboard");
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);
  const selectedIndex = selectedMood ? getMoodIndex(selectedMood) : -1;
  const selectedConfig = selectedMood ? moodConfig[selectedMood] : null;

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className="flex items-end justify-center gap-1"
        onMouseLeave={() => setHoveredIndex(-1)}
      >
        {moodValues.map((value, index) => {
          const isFilled = selectedIndex >= 0 && index <= selectedIndex;
          const isSelected = index === selectedIndex;
          const isHovered = hoveredIndex >= 0 && index <= hoveredIndex;
          const fillColor = selectedConfig?.fillColor || moodConfig[value].fillColor;
          const hoveredMood = hoveredIndex >= 0 ? moodValues[hoveredIndex] : null;
          const hoverColor = hoveredMood ? moodConfig[hoveredMood].fillColor : moodConfig[value].fillColor;

          return (
            <Tooltip key={value}>
              <TooltipTrigger asChild>
                <div
                  className="flex flex-col items-center gap-2 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onClick={() => onSelectMood(value)}
                >
                  <div className={`transition-transform duration-200 ${hoveredIndex === index ? "scale-125" : ""}`}>
                    <MoodEmoji value={value} size="sm" />
                  </div>
                  <MoodBar
                    index={index}
                    isFilled={isFilled}
                    isSelected={isSelected}
                    isHovered={isHovered}
                    fillColor={fillColor}
                    hoverColor={hoverColor}
                    onClick={() => onSelectMood(value)}
                    disabled={disabled}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent sideOffset={8} className="bg-black text-white text-xs px-2 py-1">
                {t(`mood.values.${value}`)}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};
