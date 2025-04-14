import { CaretCircleRight } from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"
import { Grid } from "../grid"
import { Button } from "../ui/button"

export const CTA = () => {
  return (
    <section>
      <Grid className="grid-container h-full md:pt-40 md:pb-20 pt-10 pb-10">
        <div className="w-full bg-victus-black rounded-lg flex flex-col-reverse md:flex-row justify-between h-full border border-neutral-300 bg-[url('/noise-1.png')] bg-cover bg-center relative">
          <div className="blur-block absolute bottom-60 left-4 md:top-0 md:left-32 w-20 h-20 z-[1]"></div>
          <div className="blur-block absolute bottom-4 left-1/2 w-20 h-20 z-[1]"></div>

          <div className="p-8 md:p-16 md:pl-20 max-w-[40rem] z-10">
            <h4 className="text-white text-lg sm:text-2xl font-bold">Você está a um passo de ter controle
              total do seu comportamento!</h4>
            <p className="text-white/70 mt-4">Dentro da plataforma você tem a oportunidade de saber onde melhorar na sua vida e atingir seus objetivos!</p>
            <Button className="mt-12 py-5 w-full md:w-80 h-auto flex items-center justify-between gap-2 px-6 rounded-md bg-victus-orange">
              Teste grátis por 14 dias
              <CaretCircleRight size={18} weight="bold" />
            </Button>
          </div>
          <div className="w-full md:w-[26rem] bg-victus-good-white rounded-t-md md:rounded-r-md flex items-center justify-center">
            <Image src="/tired.png" alt="tablet" width={256} height={256} />
          </div>
        </div>
      </Grid>
    </section>
  )
}