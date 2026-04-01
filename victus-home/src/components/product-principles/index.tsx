import { useTranslations } from "next-intl"
import { Grid } from "../grid"

const rows = ['row_1', 'row_2', 'row_3', 'row_4', 'row_5'] as const;

export const ProductPrinciples = () => {
  const t = useTranslations('product_principles');

  return (
    <section>
      <Grid className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold font-display text-center mb-12">
            {t('title')}
          </h2>

          {/* Table */}
          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3">
              <div className="p-4 bg-neutral-50" />
              <div className="p-4 bg-black text-center">
                <span className="text-white font-display font-semibold">Victus</span>
              </div>
              <div className="p-4 bg-neutral-50 text-center text-sm font-medium text-neutral-500">
                {t('column_others')}
              </div>
            </div>

            {/* Rows */}
            {rows.map((row, index) => (
              <div
                key={row}
                className={`grid grid-cols-3 ${index !== rows.length - 1 ? 'border-b border-neutral-200' : ''}`}
              >
                <div className="p-4 bg-neutral-50 flex items-center">
                  <span className="font-medium text-neutral-800 text-sm">
                    {t(`${row}_label`)}
                  </span>
                </div>
                <div className="p-4 bg-orange-500 text-white text-sm">
                  {t(`${row}_victus`)}
                </div>
                <div className="p-4 bg-white text-neutral-500 text-sm">
                  {t(`${row}_others`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Grid>
    </section>
  )
}
