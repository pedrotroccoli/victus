import { Check, CaretCircleRight } from "@phosphor-icons/react/dist/ssr"
import { useTranslations } from "next-intl"
import { Grid } from "../grid"
import { Button } from "../ui/button"

const monthlyFeatures = ['feature_1', 'feature_2', 'feature_3', 'feature_4'] as const;
const annualFeatures = ['feature_1', 'feature_2', 'feature_3', 'feature_4'] as const;

export const Plans = () => {
  const t = useTranslations('plans');

  return (
    <section className="border-y border-neutral-200">
      <Grid className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold font-display">
            {t('title')}
          </h2>
          <p className="mt-2 text-neutral-400 text-base">
            {t('subtitle')}
          </p>

          {/* Pricing Grid */}
          <div className="grid md:grid-cols-2 mt-12 border border-neutral-200 rounded-lg overflow-hidden">
            {/* Monthly Plan */}
            <div className="p-8 border-b md:border-b-0 md:border-r border-neutral-200 bg-white">
              <h3 className="text-xl font-semibold font-display">
                {t('items.monthly.title')}
              </h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-semibold text-neutral-400">{t('items.monthly.price')}</span>
                <span className="text-neutral-400">{t('items.monthly.period')}</span>
              </div>

              <p className="mt-8 text-sm text-neutral-500">
                {t('items.monthly.includes')}
              </p>
              <ul className="mt-4 space-y-3">
                {monthlyFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check size={16} weight="bold" className="text-neutral-400" />
                    <span>{t(`items.monthly.${feature}`)}</span>
                  </li>
                ))}
              </ul>

              <a href="https://app.victusjournal.com/sign-up?key=victus_journal_monthly" target="_blank" rel="noopener noreferrer" className="block mt-8">
                <Button variant="outline" className="w-full flex items-center justify-between px-6 gap-2 py-3 h-auto rounded-lg">
                  {t('start')}
                  <CaretCircleRight size={18} weight="bold" />
                </Button>
              </a>
            </div>

            {/* Annual Plan */}
            <div className="p-8 relative bg-white">
              <div className="absolute top-0 right-0 bg-victus-green/40 text-victus-green-dark text-xs font-semibold px-3 py-1 rounded-bl-lg">
                {t('recommended')}
              </div>

              <h3 className="text-xl font-semibold font-display">
                {t('items.annual.title')}
              </h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-semibold">{t('items.annual.price')}</span>
                <span className="text-neutral-400">{t('items.annual.period')}</span>
              </div>

              <p className="mt-8 text-sm text-neutral-500">
                {t('items.annual.includes')}
              </p>
              <ul className="mt-4 space-y-3">
                {annualFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check size={16} weight="bold" className="text-black" />
                    <span>{t(`items.annual.${feature}`)}</span>
                  </li>
                ))}
              </ul>

              <a href="https://app.victusjournal.com/sign-up?key=victus_journal_yearly" target="_blank" rel="noopener noreferrer" className="block mt-8">
                <Button className="w-full flex items-center justify-between px-6 gap-2 py-3 h-auto rounded-lg">
                  {t('start')}
                  <CaretCircleRight size={18} weight="bold" />
                </Button>
              </a>
            </div>
          </div>

          <p className="mt-8 text-center text-victus-text italic">
            {t('clarity_message')}
          </p>
        </div>
      </Grid>
    </section>
  )
}
