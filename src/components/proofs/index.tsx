import { cn } from "@/lib/utils"
import { CaretCircleRight, ChartBar, ChartPieSlice, Fire, ProjectorScreenChart } from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"
import { Grid } from "../grid"
import { Button } from "../ui/button"

const proofs = [
  {
    icon: ChartBar,
    title: "Como você pode acompanhar a evolução dos seus hábitos?",
    description: "Dentro da plataforma você tem o seu jornal, diariamente você precisa preencher os hábitos completados.\n\n Com o passar do tempo você vai começar a perceber onde você falha mais e onde você é consistente.",
    image: "/proofs/proof-01.png"
  },
  {
    icon: ProjectorScreenChart,
    title: "Como você pode acompanhar a evolução dos seus hábitos?",
    description: "Dentro da plataforma você tem o seu jornal,diariamente você precisa preencher os hábitos completados.\n\n Com o passar do tempo você vai começar a perceber onde você falha mais e onde você é consistente.",
    image: "/proofs/calendar.png"
  }, {
    icon: Fire,
    title: "Como você pode acompanhar a evolução dos seus hábitos?",
    description: "Dentro da plataforma você tem o seu jornal, diariamente você precisa preencher os hábitos completados.\n\n Com o passar do tempo você vai começar a perceber onde você falha mais e onde você é consistente.",
    image: "/proofs/journal.png"
  }, {
    icon: ChartPieSlice,
    title: "Como você pode acompanhar a evolução dos seus hábitos?",
    description: "Dentro da plataforma você tem o seu jornal, diariamente você precisa preencher os hábitos completados.\n\n Com o passar do tempo você vai começar a perceber onde você falha mais e onde você é consistente.",
    image: "/proofs/analytics.png"
  },

]
export const Proofs = () => {
  return (
    <section>
      <Grid className="grid gap-16 pt-40" type="small">
        {proofs.map((item, index) => (
          <div className="grid grid-cols-2 gap-8" key={item.title}>
            <div className="">
              <div className="flex items-center justify-center w-12 h-12 border border-black bg-white rounded-full">
                <item.icon size={24} />
              </div>

              <h3 className="text-2xl font-bold mt-6 max-w-[24rem]">{item.title}</h3>

              <p className="mt-4 whitespace-pre-line max-w-[28rem] text-victus-text">{item.description}</p>

              <Button className="mt-12 py-5 w-80 h-auto flex items-center justify-between gap-2 px-6 rounded-md">
                Teste grátis por 14 dias
                <CaretCircleRight size={24} />
              </Button>
            </div>
            <div className={cn(index % 2 === 0 ? "-order-1" : "")}>
              <div className="max-w-[32rem] max-h-[28rem] w-full h-full bg-neutral-50 border border-neutral-300 rounded-md p-2">
                <Image src={item.image} alt={item.title} width={528} height={400} className="rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </Grid>
    </section>
  )
}