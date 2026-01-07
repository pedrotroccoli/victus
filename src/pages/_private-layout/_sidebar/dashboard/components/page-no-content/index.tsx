import { Button } from "@/components/ions/button"
import { Box, PlusCircle } from "lucide-react"
import { useTranslation } from "react-i18next"

export const DashboardNoContent = () => {
  const { t } =useTranslation("dashboard")

  return (
   <div className="flex items-center justify-center h-full flex-col border-neutral-300 border rounded-md p-8 min-h-56">
     <Box size={32} strokeWidth={1.5} />

     <p className="text-lg text-black/75 font-medium mt-4 mb-8 font-[Recursive]">
       {t("habits.no_habits")}
     </p>

     <Button
       className="flex gap-4 bg-black rounded-md text-white font-[Recursive]"
       // onClick={() => setCreateHabitOpen(true)}
     >
       <PlusCircle size={16} />
       {t("habits.create_first_habit")}
     </Button>
   </div>
  )
}
