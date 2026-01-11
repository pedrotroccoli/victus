import { Advantages } from "@/components/advantages";
import { CTA } from "@/components/cta";
import { EmailCapture } from "@/components/email-capture";
import { Grid } from "@/components/grid";
import { Plans } from "@/components/plans";
import { Proofs } from "@/components/proofs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CaretCircleRight } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";

export default function Home() {
  const t = useTranslations('home');

  return (
    <main className="">
      <section className="relative">
        <Grid className="flex justify-between items-center pt-8 md:pt-16 lg:flex-row flex-col gap-12">
          <div className="lg:max-w-[32rem] flex flex-col items-start justify-start">
            <div className={
              cn(
                "border border-black bg-white rounded-full px-4 py-1 font-display leading-[1.3] font-medium text-neutral-600",
                "text-sm"
              )
            }>
              Victus Journal
            </div>
            <Markdown
              components={{
                p: ({ children }) => <h1 className="text-2xl font-bold text-black lg:text-3xl mt-8">{children}</h1>,
                strong: ({ children }) => <span className="text-[#707070]">{children}</span>
              }}
            >
              {t('hero.title')}
            </Markdown>

            <Markdown
              components={{
                p: ({ children }) => <p className="text-base text-victus-text mt-4">{children}</p>
              }}
            >
              {t('hero.description')}
            </Markdown>

            <Link href="/plans" className="w-[90%] sm:w-auto">
              <div className="relative z-20 w-full sm:w-auto">
                <Button
                  className={
                    cn(
                      "mt-16 relative font-display font-bold p-0 px-0 py-0 w-full sm:w-auto h-auto",
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
                    {t('hero.button')}
                    <CaretCircleRight size={18} weight="bold" />
                  </div>
                </Button>
              </div>
            </Link>
          </div>

          <div className={
            cn(
              "lg:max-w-[32rem] lg:max-h-[22rem] max-h-[16rem] w-full h-full border border-neutral-200 rounded-md flex items-center justify-center",
              "bg-neutral-50 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:24px_24px]"
            )
          }>
            <Image
              src="/tablet.png"
              alt="slide2"
              width={480}
              height={320}
              className="max-w-[22rem] max-h-[18rem] md:max-w-none md:max-h-none"
            />
          </div>
        </Grid>
      </section>

      <EmailCapture />

      <Advantages />

      <Proofs />

      <CTA />


      <Plans />
    </main>
  );
}
