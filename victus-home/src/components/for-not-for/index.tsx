import { useTranslations } from "next-intl"
import { Grid } from "../grid"

export const ForNotFor = () => {
  const t = useTranslations('for_not_for');

  const forItems = ['for_1', 'for_2', 'for_3', 'for_4'] as const;
  const notForItems = ['not_for_1', 'not_for_2', 'not_for_3', 'not_for_4'] as const;

  return (
    <section className="border-l border-r border-t border-neutral-200">
      <Grid className="py-16 md:py-24">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            {t('section_label')}
          </span>
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            / {t('section_tag')}
          </span>
        </div>
        <div className="border-t border-dashed border-neutral-300 mb-12"></div>

        {/* Title */}
        <div className="max-w-2xl mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold font-display text-neutral-800 leading-tight">
            {t('title_main')}
          </h2>
          <p className="text-2xl md:text-3xl font-semibold font-display text-neutral-400 leading-tight">
            {t('title_sub')}
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl">
          {/* For column */}
          <div>
            <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-6">
              {t('for_title')}
            </h3>
            <ul className="space-y-4">
              {forItems.map((key) => (
                <li key={key} className="flex items-start gap-3 border-l-2 border-neutral-800 pl-4">
                  <span className="text-neutral-800 font-medium">{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not for column */}
          <div>
            <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-6">
              {t('not_for_title')}
            </h3>
            <ul className="space-y-4">
              {notForItems.map((key) => (
                <li key={key} className="flex items-start gap-3 border-l-2 border-neutral-300 pl-4">
                  <span className="text-neutral-500">{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Grid>
    </section>
  )
}
