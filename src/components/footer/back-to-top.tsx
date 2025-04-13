'use client'
import { CaretCircleUp } from "@phosphor-icons/react/dist/ssr"

export const BackToTop = () => {
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 text-white/70 font-mono font-medium text-xs md:text-base">
      Voltar para o topo
      <CaretCircleUp size={18} weight="bold" />
    </button>
  )
}