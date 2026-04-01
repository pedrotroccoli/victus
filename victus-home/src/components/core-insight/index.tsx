import { useTranslations } from "next-intl"
import { Grid } from "../grid"

export const CoreInsight = () => {
  const t = useTranslations('core_insight');

  return (
    <section>
      <Grid className="py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-semibold font-display">
            {t('title')}
          </h2>

          <p className="mt-8 text-2xl md:text-3xl font-semibold text-black italic">
            &ldquo;{t('question')}&rdquo;
          </p>

          <p className="mt-8 text-victus-text">
            {t('answer_1')}
          </p>
          <p className="text-victus-text font-bold">
            {t('answer_2')}
          </p>
        </div>
      </Grid>
    </section>
  )
}
