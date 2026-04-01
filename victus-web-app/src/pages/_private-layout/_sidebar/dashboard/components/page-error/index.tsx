import FixingBug from "@/assets/fixing.svg?react";
import { useTranslation } from "react-i18next";

export const DashboardPageError = () => {
  const { t } = useTranslation("dashboard");

  return (
    <div className="flex items-center justify-center h-full flex-col border-neutral-300 border rounded-md p-8 min-h-56">
      <FixingBug className="w-full h-full max-w-60" />

      <h3 className="text-lg font-[Recursive] font-medium mt-4">
        {t("page.error.title")}
      </h3>

      <p className="text-neutral-500 mt-2 text-center">
        {t("page.error.description")}
      </p>
    </div>
  )
}
