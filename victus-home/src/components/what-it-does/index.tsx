import { Eye, TrendDown, TrendUp, Sparkle, ChartLine, Timer, Target, Lightbulb } from "@phosphor-icons/react/dist/ssr"
import { useTranslations } from "next-intl"
import { Grid } from "../grid"

const floatingIcons = [
  { icon: ChartLine, position: "left-[15%] top-[20%] -rotate-12" },
  { icon: Timer, position: "left-[30%] top-[5%] rotate-6" },
  { icon: Target, position: "left-[50%] top-[0%] -translate-x-1/2" },
  { icon: Lightbulb, position: "right-[30%] top-[5%] -rotate-6" },
  { icon: Sparkle, position: "right-[15%] top-[20%] rotate-12" },
]

const cards = [
  { icon: TrendDown, key: 'item_1' },
  { icon: TrendUp, key: 'item_2' },
  { icon: Eye, key: 'item_3' },
  { icon: Sparkle, key: 'item_4' },
]

export const WhatItDoes = () => {
  const t = useTranslations('what_it_does');

  return (
    <section className="border-y border-neutral-200">
      <Grid className="pt-10 pb-16 md:pt-12 md:pb-24">
        {/* Floating icons */}
        <div className="relative h-24 md:h-28 max-w-2xl mx-auto -mb-2">
          {floatingIcons.map((item, i) => (
            <div
              key={i}
              className={`absolute ${item.position} w-10 h-10 md:w-12 md:h-12 bg-neutral-100 border border-neutral-200 rounded-xl flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-colors group`}
            >
              <item.icon size={20} className="text-black group-hover:text-white transition-colors" weight="regular" />
            </div>
          ))}
        </div>

        {/* Main icon */}
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 bg-black hover:bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg transition-colors">
            <Eye size={28} className="text-white" weight="fill" />
          </div>
        </div>

        {/* Title and subtitle */}
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-display leading-tight">
            {t('title_prefix')} <em className="italic">{t('title_emphasis')}</em> {t('title_suffix')}
          </h2>
          <p className="text-victus-text mt-4 text-lg">
            {t('subtitle')}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {cards.map((card) => (
            <div key={card.key} className="border border-neutral-200 rounded-lg p-6 bg-white">
              <div className="w-12 h-12 bg-neutral-100 border border-neutral-200 rounded-lg flex items-center justify-center mb-6 hover:bg-orange-500 hover:border-orange-500 transition-colors group/icon">
                <card.icon size={16} className="text-black group-hover/icon:text-white transition-colors" weight="bold" />
              </div>
              <h3 className="font-bold text-neutral-800 mb-2">{t(`${card.key}_title`)}</h3>
              <p className="text-sm text-neutral-500">{t(card.key)}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-neutral-500 text-sm">
          <span>{t('footer_1')} </span>
          <span>{t('footer_2')} </span>
          <span className="font-medium text-neutral-800">{t('footer_3')}</span>
        </div>
      </Grid>
    </section>
  )
}
