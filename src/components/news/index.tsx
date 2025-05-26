import { cn } from "@/lib/utils"
import { Desktop, DeviceMobile } from "@phosphor-icons/react/dist/ssr"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { Grid } from "../grid"

export const items = (t: any) => [
  {
    icon: Desktop,
    enabled: true,
    title: t('items.desktop.title'),
    description: t('items.desktop.description'),
    image_url: '/news-desktop.png'
  },
  {
    icon: DeviceMobile,
    enabled: false,
    title: t('items.mobile.title'),
    description: t('items.mobile.description'),
    image_url: '/news-mobile.png'
  },
  {
    icon_url: '/world-logo.png',
    enabled: false,
    title: t('items.world.title'),
    description: t('items.world.description'),
    image_url: '/news-world.png'
  },
];

export const News = () => {
  const t = useTranslations('news');

  return (
    <section>
      <Grid className="pt-16" type="small">
        <h2 className="text-2xl md:text-4xl font-bold font-mono mx-auto text-center mb-16">
          {t('title')}
        </h2>
        <ul className="grid gap-8">
          {items(t).map((item) => (
            <li key={item.title}>
              <div className="w-full md:h-[19rem] bg-white border border-neutral-300 rounded-lg flex justify-between flex-1 md:flex-row flex-col">
                <div className="h-full flex flex-col justify-center md:items-center">
                  <div className="md:pl-10 p-8">
                    <div className="flex items-center gap-6">
                      {item.icon_url && <Image src={item.icon_url} alt={item.title} width={80} height={20} />}
                      {item.icon && <item.icon size={48} />}
                      {item.enabled && <p className="text-victus-dark-green bg-victus-dark-green/10 border border-victus-dark-green px-4 py-0.5 rounded-full font-mono font-medium">
                        {t('available')}
                      </p>}
                      {!item.enabled && <p className="text-yellow-400 bg-victus-yellow-400/10 border border-victus-yellow-400 px-4 py-0.5 rounded-full font-mono font-medium">
                        {t('soon')}
                      </p>}
                    </div>
                    <h3 className="text-2xl font-bold font-mono mt-6">
                      {item.title}
                    </h3>
                    <p className="text-victus-text mt-4 max-w-[32rem]">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className={cn("md:max-w-[33rem] w-full h-40 sm:h-60 lg:h-full bg-victus-good-white rounded-b-lg md:rounded-b-none md:rounded-r-lg bg-cover sm:bg-contain md:bg-cover bg-center",
                  "bg-no-repeat"


                )} style={{ backgroundImage: `url(${item.image_url})` }}></div>
              </div>
            </li>
          ))}
        </ul>
      </Grid>
    </section>
  )
}