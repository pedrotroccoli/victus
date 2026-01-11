import { MoodValue } from "@/services/mood/types";
import { Frown, Meh, Smile, SmilePlus, LucideIcon } from "lucide-react";

export interface MoodConfig {
  icon: LucideIcon;
  label: string;
  color: string;
  bgColor: string;
  fillColor: string;
}

export const moodConfig: Record<MoodValue, MoodConfig> = {
  terrible: { icon: Frown, label: "terrible", color: "text-[#E53935]", bgColor: "bg-red-100", fillColor: "bg-[#E53935]/50" },
  bad: { icon: Frown, label: "bad", color: "text-red-500", bgColor: "bg-red-50", fillColor: "bg-red-500/50" },
  neutral: { icon: Meh, label: "neutral", color: "text-gray-500", bgColor: "bg-gray-100", fillColor: "bg-gray-500/50" },
  good: { icon: Smile, label: "good", color: "text-green-500", bgColor: "bg-green-50", fillColor: "bg-green-500/50" },
  great: { icon: Smile, label: "great", color: "text-green-600", bgColor: "bg-green-100", fillColor: "bg-green-600/50" },
  amazing: { icon: SmilePlus, label: "amazing", color: "text-green-700", bgColor: "bg-green-200", fillColor: "bg-green-700/50" },
};

// Bar heights as percentages (15% to 100%)
export const moodHeights = [15, 30, 50, 70, 85, 100];

export const getMoodIndex = (value: MoodValue): number => {
  return moodValues.indexOf(value);
};

export const moodValues: MoodValue[] = ['terrible', 'bad', 'neutral', 'good', 'great', 'amazing'];

export const getCurrentHourBlock = (): number => new Date().getHours();

export const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const getMoodForCurrentHour = (moods: { hour_block: number; date: string }[]) => {
  const currentHour = getCurrentHourBlock();
  const today = getTodayDate();

  return moods.find(mood => mood.hour_block === currentHour && mood.date === today);
};
