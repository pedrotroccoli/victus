import { Clock, Flame, Gauge } from "@phosphor-icons/react/dist/ssr"
import { useTranslations } from "next-intl"
import { Grid } from "../grid"

const cards = [
  { icon: Clock, key: 'point_1' },
  { icon: Flame, key: 'point_2' },
  { icon: Gauge, key: 'point_3' },
]

export const ProblemReframe = () => {
  const t = useTranslations('problem_reframe');

  return (
    <section>
      <Grid className="py-12 md:py-16">
        <div className="bg-[#e8ebe4] border border-[#c5cabb] rounded-2xl p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12">
            {/* Left side - Headlines */}
            <div className="lg:max-w-md flex-shrink-0">
              <h2 className="text-lg md:text-xl font-bold font-display leading-tight">
                <span className="text-neutral-500 font-semibold">{t('title_1')}</span><br />
                <span className="text-neutral-800 font-semibold">{t('title_2')}</span>
              </h2>
              <p className="mt-6 text-neutral-600 leading-relaxed">
                {t('insight')}
              </p>
            </div>

            {/* Right side - Cards */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3 justify-end">
              {cards.map((card) => (
                <div
                  key={card.key}
                  className="bg-white/80 border border-neutral-300 rounded-xl p-4 flex flex-col items-center text-center w-28"
                >
                  <card.icon size={28} weight="light" className="text-neutral-700 mb-3" />
                  <p className="text-xs text-neutral-700 leading-snug">
                    {t(card.key)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Grid>
    </section>
  )
}
