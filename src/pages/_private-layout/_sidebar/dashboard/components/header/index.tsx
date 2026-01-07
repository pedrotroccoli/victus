import { Button } from "@/components/ions/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateHabitModal } from "@/features/habits/components/templates/create-habit-modal";
import { PlusCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DeltaInfo } from "../..";
import { CreateHabitModalProps } from "@/features/habits/components/templates/create-habit-modal/types";

interface HeaderProps {
  onCreateHabit: CreateHabitModalProps["onSave"];
  habits: Habit[];
  habitCategories: HabitCategory[];
  deltaOpen?: DeltaInfo;
  setDeltaOpen: (deltaOpen: DeltaInfo) => void;
}

export const DashboardHeader = ({
  onCreateHabit,
  habits,
  habitCategories,
  deltaOpen,
  setDeltaOpen,
}: HeaderProps) => {
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("dashboard");

  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:gap-6">
      <h1 className="font-[Recursive] text-xl font-semibold">
        {t("greeting", { name })}
      </h1>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full flex gap-4 bg-black rounded-md text-white sm:max-w-40">
            <PlusCircle size={16} />
            {tCommon("add")}
          </Button>
        </DialogTrigger>

        <CreateHabitModal
          onSave={onCreateHabit}
          categories={habitCategories || []}
          habits={habits || []}
          newDeltas={deltaOpen?.newDeltas}
          onCreateDelta={() =>
            setDeltaOpen({
              open: true,
              type: "create",
              habit: undefined,
              deltaId: "",
              newDeltas: [],
            })
          }
        />
      </Dialog>
    </div>
  );
};
