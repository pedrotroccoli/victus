import { EnvelopeSimple, PaperPlaneTilt } from "@phosphor-icons/react/dist/ssr"
import { useTranslations } from "next-intl"
import { Grid } from "../grid"
import { Button } from "../ui/button"

export const EmailCapture = () => {
  const t = useTranslations('email_capture')

  return (
    <section>
      <Grid className="py-16 md:py-20">
        <div className="w-full max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-black mb-2">
            <EnvelopeSimple size={18} className="text-black" weight="regular" />
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-black mb-3">
            {t('title')}
          </h2>

          <p className="text-victus-text mb-8">
            {t('description')}
          </p>

          <form
            action="https://buttondown.com/api/emails/embed-subscribe/victus"
            method="post"
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input type="hidden" name="tag" value="website" />
            <input
              type="email"
              name="email"
              id="bd-email"
              required
              placeholder={t('placeholder')}
              className="flex-1 px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
            />
            <Button
              type="submit"
              className="px-6 py-3 h-auto bg-black hover:bg-black/80 text-white rounded-lg font-medium flex items-center justify-center gap-2"
            >
              {t('button')}
              <PaperPlaneTilt size={18} weight="bold" />
            </Button>
          </form>
        </div>
      </Grid>
    </section>
  )
}
