import { ChartLine, Broadcast, Heart, Eye } from "@phosphor-icons/react/dist/ssr"
import { useTranslations } from "next-intl"
import { Grid } from "../grid"

const cards = [
  { icon: ChartLine, key: 'card_1' },
  { icon: Broadcast, key: 'card_2' },
  { icon: Heart, key: 'card_3' },
  { icon: Eye, key: 'card_4' },
]

export const VisualFeatures = () => {
  const t = useTranslations('visual_features');

  return (
    <section className="bg-neutral-50">
      <Grid className="py-20 md:py-28">
        {/* Title */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-display leading-[1.3]">
            <span className="text-neutral-400">{t('title_line1')}</span>
            <br />
            <span className="text-neutral-800">{t('title_line2')}</span>
            <br />
            <span className="text-neutral-400">{t('title_line3')}</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {cards.map((card) => (
            <div
              key={card.key}
              className="bg-white border border-neutral-200 rounded-lg p-6"
            >
              <div className="w-12 h-12 bg-neutral-100 border border-neutral-200 rounded-lg flex items-center justify-center mb-4 hover:bg-orange-500 hover:border-orange-500 transition-colors group/icon">
                <card.icon size={16} className="text-black group-hover/icon:text-white transition-colors" weight="regular" />
              </div>
              <h3 className="font-semibold text-neutral-800 mb-1">
                {t(`${card.key}_title`)}
              </h3>
              <p className="text-sm text-neutral-500">
                {t(`${card.key}_description`)}
              </p>
            </div>
          ))}
        </div>
      </Grid>
    </section>
  )
}

// Keep old export for backwards compatibility during transition
export const Proofs = VisualFeatures
