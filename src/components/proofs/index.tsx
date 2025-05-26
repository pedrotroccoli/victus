import { cn } from "@/lib/utils"
import { CaretCircleRight, ChartBar, ChartPieSlice, Fire, ProjectorScreenChart } from "@phosphor-icons/react/dist/ssr"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import { Grid } from "../grid"
import { Button } from "../ui/button"

const proofs = (t: any) => [
  {
    icon: ChartBar,
    title: t('items.proof_01.title'),
    description: t('items.proof_01.description'),
    image: "/proofs/proof-01.png"
  },
  {
    icon: ProjectorScreenChart,
    title: t('items.proof_02.title'),
    description: t('items.proof_02.description'),
    image: "/proofs/calendar.png"
  }, {
    icon: Fire,
    title: t('items.proof_03.title'),
    description: t('items.proof_03.description'),
    image: "/proofs/journal.png"
  }, {
    icon: ChartPieSlice,
    title: t('items.proof_04.title'),
    description: t('items.proof_04.description'),
    image: "/proofs/analytics.png"
  },

]
export const Proofs = () => {
  const t = useTranslations('proofs');

  return (
    <section>
      <Grid className="grid gap-16 pt-20 md:pt-40" type="small">
        {proofs(t).map((item, index) => (
          <div className="grid lg:grid-cols-2 gap-8" key={item.title}>
            <div className="">
              <div className="flex items-center justify-center w-12 h-12 border border-black bg-white rounded-full">
                <item.icon size={24} />
              </div>

              <h3 className="text-xl lg:text-2xl font-bold mt-6 lg:max-w-[24rem]">{item.title}</h3>

              <p className="mt-4 whitespace-pre-line lg:max-w-[28rem] text-victus-text">{item.description}</p>

              <Link href="/plans">
                <Button className="mt-12 py-5 w-80 h-auto items-center justify-between gap-2 px-6 rounded-md hidden lg:flex">
                  {t('trial_button')}
                  <CaretCircleRight size={24} />
                </Button>
              </Link>
            </div>
            <div className={cn(index % 2 === 0 ? "lg:-order-1" : "", "flex items-center justify-center flex-col")}>
              <Image src={item.image} alt={item.title} width={528} height={400} className="rounded-md max-lg:w-full" />
              <Link href="/plans" className="w-full">
                <Button className="mt-8 py-5 w-full h-auto flex items-center justify-between gap-2 px-6 rounded-md lg:hidden">
                  {t('trial_button')}
                  <CaretCircleRight size={24} />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </Grid>
    </section>
  )
}