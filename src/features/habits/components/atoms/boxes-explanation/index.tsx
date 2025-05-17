import { useTranslation } from "react-i18next"
import { HabitBox } from "../../ions/habit-box"

export const BoxesExplanation = () => {
  const { t } = useTranslation('dashboard')

  return (
    <div className="flex items-center justify-between w-full flex-wrap">
      <h1 className="font-[Recursive] text-lg font-medium">{t('explanation.title')}</h1>

      <ul className="flex items-center gap-4 before-lg:mr-4 flex-wrap mt-4 before-lg:mt-0">
        <li className="flex items-center gap-2">
          <HabitBox type="checked" className="w-6 h-6" />
          <p className="text-xs text-neutral-500">{t('explanation.boxes.checked')}</p>
        </li>
        <li className="flex items-center gap-2">
          <HabitBox type="blocked" className="w-6 h-6" />
          <p className="text-xs text-neutral-500">{t('explanation.boxes.blocked')}</p>
        </li>
        <li className="flex items-center gap-2">
          <HabitBox type="blocked-dark" className="w-6 h-6" />
          <p className="text-xs text-neutral-500">{t('explanation.boxes.blocked-dark')}</p>
        </li>
        <li className="flex items-center gap-2">
          <HabitBox type="empty" className="w-6 h-6" />
          <p className="text-xs text-neutral-500">{t('explanation.boxes.empty')}</p>
        </li>
        <li className="flex items-center gap-2">
          <HabitBox type="none" className="w-6 h-6" />
          <p className="text-xs text-neutral-500">{t('explanation.boxes.none')}</p>
        </li>
      </ul>
    </div>

  )
}