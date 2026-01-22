import { Target, CalendarCheck, ChartLineUp } from "@phosphor-icons/react/dist/ssr"
import { useTranslations } from "next-intl"
import { Grid } from "../grid"

const steps = [
  { icon: Target, key: 'step_1' },
  { icon: CalendarCheck, key: 'step_2' },
  { icon: ChartLineUp, key: 'step_3' },
];

export const HowItWorks = () => {
  const t = useTranslations('how_it_works');

  return (
    <section className="bg-neutral-50 border-y border-neutral-200">
      <Grid className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title area - top left */}
            <div className="p-6 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-semibold font-display">
                {t('title')}
              </h2>
              <p className="mt-3 text-neutral-500">
                {t('description')}
              </p>
            </div>

            {/* Cards */}
            {steps.map((step) => (
              <div
                key={step.key}
                className="rounded-lg p-6 bg-white border border-neutral-200"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-16 transition-colors group/icon border bg-neutral-100 border-neutral-200 hover:bg-orange-500 hover:border-orange-500">
                  <step.icon
                    size={16}
                    className="text-black group-hover/icon:text-white transition-colors"
                    weight="regular"
                  />
                </div>
                <h3 className="font-semibold text-neutral-800">
                  {t(`${step.key}_title`)}
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                  {t(`${step.key}_description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Grid>
    </section>
  )
}
