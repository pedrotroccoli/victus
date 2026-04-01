import { AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import Markdown from 'react-markdown'

import { AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

import { AlertDialogContent } from "@/components/ui/alert-dialog"
import { useTranslation } from "react-i18next"

interface DeleteHabitModalProps {
  habit?: Habit
  onConfirm?: () => void
  onCancel?: () => void
}

export const DeleteHabitModal = ({ habit, onConfirm, onCancel }: DeleteHabitModalProps) => {
  const { t } = useTranslation('habit');
  const { t: tCommon } = useTranslation('common');

  if (!habit) return null

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{t('delete_habit_modal.title')}</AlertDialogTitle>
        <AlertDialogDescription className="text-black/70">
          <Markdown>{t('delete_habit_modal.description', { name: habit.name })}</Markdown>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="hover:bg-red-500 hover:text-white duration-200 transition-colors hover:border-red-500"
          onClick={onConfirm}
        >{tCommon('delete')}</AlertDialogCancel>
        <AlertDialogAction onClick={onCancel}>{tCommon('cancel')}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}