import { Button } from "@/components/ions/button";
import { useMe } from "@/services/auth";
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
  const { data: me } = useMe();

  const firstName = me?.name?.split(" ")[0] || "";

  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:gap-6">
      <h1 className="font-[Recursive] text-xl font-semibold">
        {t("greeting", { name: firstName })}
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
