import { cn } from "@/lib/utils"
import { CaretCircleRight, CheckCircle } from "@phosphor-icons/react/dist/ssr"
import { useTranslations } from "next-intl"
import { Grid } from "../grid"
import { Button } from "../ui/button"

const items = (t: any) => [
  {
    type: 'monthly',
    name: t('items.monthly.title'),
    after_name: t('items.monthly.after_name'),
    price: t('items.monthly.price'),
    key: 'victus_journal_monthly',
    features: [
      t('items.monthly.features.habit_creation'),
      t('items.monthly.features.delta_creation'),
      t('items.monthly.features.analytics'),
      t('items.monthly.features.support'),
    ],
  },
  {
    type: 'yearly',
    recommended: true,
    name: t('items.yearly.title'),
    after_name: t('items.yearly.after_name'),
    price: t('items.yearly.price'),
    oldPrice: t('items.yearly.oldPrice'),
    key: 'victus_journal_yearly',
    features: [
      t('items.yearly.features.habit_creation'),
      t('items.yearly.features.delta_creation'),
      t('items.yearly.features.analytics'),
      t('items.yearly.features.support'),
    ],
  },
]


export const Plans = () => {
  const t = useTranslations('plans');

  return (
    <section className="bg-[url('/bg-plans.png')] bg-cover bg-center border-y border-neutral-300">
      <Grid className="py-16 md:py-20">
        <h2 className="text-2xl md:text-4xl font-bold font-display mb-16 mx-auto text-center">
          {t('title')}
        </h2>
        <ul className="flex gap-6 items-center md:items-end justify-center flex-col md:flex-row">
          {items(t).map((item) => (
            <li key={item.key} className={cn("max-w-[26rem] w-full", item.recommended && "shadow-green")} >
              {item.recommended && (
                <div className="w-full bg-victus-green/40 border-l border-t border-r border-victus-green rounded-t-md flex items-center justify-center py-4 translate-y-1 z-[-1]">
                  <h5 className="text-sm font-display font-bold text-victus-green-dark ">
                    {t('recommended')}
                  </h5>
                </div>
              )}
              <div className="w-full border border-neutral-300 rounded-md bg-white z-10">
                <div className="p-6">
                  <h4 className="text-base font-display font-medium">
                    {item.name}
                  </h4>
                  <div className="flex items-end gap-2 mt-4">
                    <h1 className="text-3xl font-bold font-display">{item.price}</h1>
                    <h5 className="text-base font-display">{item.after_name}</h5>
                  </div>
                  <p className="mt-4 text-sm text-black/50">* Cobrado {item.type === 'monthly' ? 'mensalmente' : 'anualmente'}</p>
                </div>
                <div className="w-full border-t border-neutral-300"></div>
                <ul className="p-6 grid gap-2">
                  {item.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle size={24} />
                      <p className="text-victus-text">
                        {feature}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="px-6 pb-6">
                  <a href={`https://app.victusjournal.com/sign-up?key=${item.key}`} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full flex items-center justify-between px-6 gap-2 py-3 h-auto rounded-lg">
                      {t('trial')}
                      <CaretCircleRight size={18} weight="bold" />
                    </Button>
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Grid>
    </section>
  )
}