import { Button } from "@/components/ions/button";
import { PlusCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  onCreateHabit: () => void;
}

export const DashboardHeader = ({
  onCreateHabit,
}: HeaderProps) => {
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("dashboard");

  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:gap-6">
      <h1 className="font-[Recursive] text-xl font-semibold">
        {t("greeting", { name })}
      </h1>

      <Button
        className="w-full flex gap-4 bg-black rounded-md text-white sm:max-w-40"
        onClick={onCreateHabit}
      >
        <PlusCircle size={16} />
        {tCommon("add")}
      </Button>
    </div>
  );
};
