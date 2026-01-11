import { Button } from "@/components/ions/button";
import { useMe } from "@/services/auth";
import { CircleHelp, PlusCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MoodValue } from "@/services/mood/types";
import { moodConfig } from "@/features/mood/utils";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onCreateHabit: () => void;
  currentMood?: MoodValue | null;
  moodSectionOpen: boolean;
  onToggleMoodSection: () => void;
}

export const DashboardHeader = ({
  onCreateHabit,
  currentMood,
  moodSectionOpen,
  onToggleMoodSection,
}: HeaderProps) => {
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("dashboard");
  const { data: me } = useMe();

  const firstName = me?.name?.split(" ")[0] || "";
  const MoodIcon = currentMood ? moodConfig[currentMood].icon : null;
  const moodColor = currentMood ? moodConfig[currentMood].color : "";

  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:gap-6">
      <h1 className="font-[Recursive] text-xl font-semibold">
        {t("greeting", { name: firstName })}
      </h1>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          type="button"
          onClick={onToggleMoodSection}
          className={cn(
            "w-10 h-10 shrink-0 flex items-center justify-center rounded-md border border-neutral-300 bg-white",
            !moodSectionOpen && "opacity-70"
          )}
          aria-label={t("mood.title")}
        >
          {currentMood && MoodIcon ? (
            <MoodIcon size={20} className={moodColor} strokeWidth={1.5} />
          ) : (
            <CircleHelp size={20} className="text-neutral-400" strokeWidth={1.5} />
          )}
        </button>

        <Button
          className="w-full flex gap-4 bg-black rounded-md text-white sm:max-w-40"
          onClick={onCreateHabit}
        >
          <PlusCircle size={16} />
          {tCommon("add")}
        </Button>
      </div>
    </div>
  );
};
