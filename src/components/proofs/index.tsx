import { ChartBar, ChartPieSlice, Fire, ProjectorScreenChart } from "@phosphor-icons/react/dist/ssr"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { Grid } from "../grid"

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
  const proofItems = proofs(t);

  return (
    <section>
      <Grid className="py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-8">
          {proofItems.map((item) => (
            <div key={item.title} className="flex flex-col">
              {/* Imagem */}
              <Image
                src={item.image}
                alt={item.title}
                width={400}
                height={280}
                className="rounded-md w-full max-h-48 object-cover"
              />

              {/* Ícone + Título */}
              <div className="flex items-center gap-3 mt-6">
                <div className="w-10 h-10 border border-black bg-white rounded-full flex items-center justify-center shrink-0">
                  <item.icon size={18} />
                </div>
                <h3 className="text-lg font-bold">{item.title}</h3>
              </div>

              {/* Descrição */}
              <p className="mt-3 text-victus-text text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </Grid>
    </section>
  )
}