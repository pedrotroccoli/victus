import { Advantages } from "@/components/advantages";
import { CTA } from "@/components/cta";
import { Grid } from "@/components/grid";
import { Plans } from "@/components/plans";
import { Proofs } from "@/components/proofs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CaretCircleRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
// https://coolors.co/palette/f8f9fa-e9ecef-dee2e6-ced4da-adb5bd-6c757d-495057-343a40-212529

export default function Home() {
  return (
    <main className="">
      <section className="relative">
        <Grid className="grid-container flex justify-between items-center pt-8 md:pt-16 lg:flex-row flex-col gap-12">
          <div className="lg:max-w-[32rem] flex flex-col items-start justify-start">
            <div className={
              cn(
                "border border-victus-yellow-400 bg-victus-yellow-400/10 rounded-full px-5 py-1 font-mono leading-[1.3] font-medium text-victus-yellow-400",
                "lg:text-lg"
              )
            }>
              Victus Journal
            </div>
            <h1
              className={`text-4xl font-bold text-black lg:text-4xl mt-8`}
            >
              Organizar sua mente é
              nosso <span className="text-[#707070]">único trabalho</span>.
            </h1>

            <p className="lg:text-lg text-victus-text mt-4">
              Temos como propósito simplificar e harmonizar a vida
              das pessoas, promovendo <strong>organização e minimalismo </strong>
              para uma mente mais <strong>leve e produtiva</strong>.
            </p>

            <Link href="/plans" className="w-[90%] sm:w-auto">
              <div className="relative z-20 w-full sm:w-auto">
                <Button
                  className={
                    cn(
                      "mt-16 relative font-mono font-bold p-0 px-0 py-0 w-full sm:w-auto h-auto",
                    )
                  }
                  variant="outline"
                >
                  <div className="w-full h-full rounded-lg border-2 border-black bg-neutral-50 absolute inset-0">
                  </div>
                  <div className={cn(
                    "h-full flex items-center justify-between translate-x-2 -translate-y-2 border-2 border-black rounded-lg py-5 w-full sm:w-auto sm:min-w-72 bg-white px-6",
                    "hover:translate-x-0 hover:translate-y-0 hover:shadow-md transition-all duration-100 ease-in-out hover:bg-black hover:text-white"
                  )}>
                    Teste grátis por 14 dias
                    <CaretCircleRight size={18} weight="bold" />
                  </div>
                </Button>
              </div>
            </Link>
          </div>

          <div className={
            cn(
              "lg:max-w-[40rem] lg:max-h-[28rem] max-h-[20rem] w-full h-full bg-[url('/hero-bg.png')] bg-cover bg-center border border-neutral-300 rounded-md flex items-center justify-center",
            )
          }>
            <Image
              src="/tablet.png"
              alt="slide2"
              width={600}
              height={400}
              className="max-w-[28rem] max-h-[24rem] md:max-w-none md:max-h-none"
            />
          </div>
        </Grid>
      </section>

      <Advantages />

      <Proofs />

      <CTA />


      <Plans />
    </main>
  );
}
