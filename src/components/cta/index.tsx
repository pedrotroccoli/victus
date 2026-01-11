import { CaretCircleRight } from "@phosphor-icons/react/dist/ssr"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import { Grid } from "../grid"
import { Button } from "../ui/button"

export const CTA = () => {
  const t = useTranslations('cta');

  return (
    <section>
      <Grid className="h-full py-16 md:py-20">
        <div className="w-full bg-victus-black rounded-lg flex flex-col-reverse md:flex-row justify-between h-full border border-neutral-300 bg-[url('/noise-1.png')] bg-cover bg-center relative">
          <div className="blur-block absolute bottom-60 left-4 md:top-0 md:left-32 w-20 h-20 z-[1]"></div>
          <div className="blur-block absolute bottom-4 left-1/2 w-20 h-20 z-[1]"></div>

          <div className="p-8 md:p-16 md:pl-20 max-w-[40rem] z-10">
            <h4 className="text-white text-lg sm:text-2xl font-bold">
              {t('title')}
            </h4>
            <p className="text-white/70 mt-4">
              {t('description')}
            </p>
            <Link href="/plans">
              <Button className="mt-12 py-5 w-full md:w-80 h-auto flex items-center justify-between gap-2 px-6 rounded-md bg-victus-orange hover:bg-victus-orange/80">
                {t('button')}
                <CaretCircleRight size={18} weight="bold" />
              </Button>
            </Link>
          </div>
          <div className="w-full md:w-[26rem] bg-victus-good-white rounded-t-md md:rounded-r-md flex items-center justify-center">
            <Image src="/tired.png" alt="tablet" width={256} height={256} />
          </div>
        </div>
      </Grid>
    </section>
  )
}