import { AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"

import { AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

import { AlertDialogContent } from "@/components/ui/alert-dialog"

interface DeleteHabitModalProps {
  habit?: Habit
  onConfirm?: () => void
  onCancel?: () => void
}

export const DeleteHabitModal = ({ habit, onConfirm, onCancel }: DeleteHabitModalProps) => {
  if (!habit) return null

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Você tem absoluta certeza?</AlertDialogTitle>
        <AlertDialogDescription className="text-black/70">
          Esta ação não pode ser revertida. Isso irá deletar o hábito <strong className="text-black">{habit.name}</strong> permanentemente e remover seus dados dos nossos servidores.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="hover:bg-red-500 hover:text-white duration-200 transition-colors hover:border-red-500"
          onClick={onConfirm}
        >Deletar</AlertDialogCancel>
        <AlertDialogAction onClick={onCancel}>Cancelar</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}