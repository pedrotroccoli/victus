import { HabitBox } from "../../ions/habit-box"

export const BoxesExplanation = () => {
  return (
    <div className="flex items-center justify-between w-full">
      <h1 className="font-[Recursive] text-lg font-medium">Informações</h1>

      <ul className="flex items-center gap-4 mr-4">
        <li className="flex items-center gap-2">
          <HabitBox type="checked" className="w-6 h-6" />
          <p className="text-xs text-neutral-500">Completado</p>
        </li>
        <li className="flex items-center gap-2">
          <HabitBox type="blocked" className="w-6 h-6" />
          <p className="text-xs text-neutral-500">Fora de data</p>
        </li>
        <li className="flex items-center gap-2">
          <HabitBox type="blocked-dark" className="w-6 h-6" />
          <p className="text-xs text-neutral-500">Fora da data de início ou fim</p>
        </li>
        <li className="flex items-center gap-2">
          <HabitBox type="empty" className="w-6 h-6" />
          <p className="text-xs text-neutral-500">Não completado</p>
        </li>
        <li className="flex items-center gap-2">
          <HabitBox type="none" className="w-6 h-6" />
          <p className="text-xs text-neutral-500">Habilitado</p>
        </li>
      </ul>
    </div>

  )
}