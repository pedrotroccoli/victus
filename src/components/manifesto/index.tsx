import { useTranslations } from "next-intl"
import { Grid } from "../grid"

export const Manifesto = () => {
  const t = useTranslations('manifesto');

  return (
    <section className="bg-victus-black">
      <Grid className="py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white">
            {t('title')}
          </h2>

          <div className="mt-8 space-y-2">
            <p className="text-white/80">{t('line_1')}</p>
            <p className="text-white font-medium">{t('line_2')}</p>
          </div>

          <p className="mt-8 text-white/80">
            {t('line_3')}
          </p>

          <div className="mt-8 space-y-2">
            <p className="text-white/80">{t('line_4')}</p>
            <p className="text-white/80">{t('line_5')}</p>
            <p className="text-white font-medium">{t('line_6')}</p>
          </div>
        </div>
      </Grid>
    </section>
  )
}
