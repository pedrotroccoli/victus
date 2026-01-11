'use client'
import { CaretCircleUp } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";

export const BackToTop = () => {
  const t = useTranslations('footer');

  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 text-white/70 font-display font-medium text-xs md:text-base">
      {t('back_to_top')}
      <CaretCircleUp size={18} weight="bold" />
    </button>
  )
}