import { OpenAiLogo, GoogleLogo, MicrosoftOutlookLogo, Compass, Sparkle } from "@phosphor-icons/react/dist/ssr"
import { useTranslations } from "next-intl"
import { Grid } from "../grid"

const aiTools = [
  { name: "ChatGPT", icon: OpenAiLogo },
  { name: "Claude", icon: Sparkle },
  { name: "Gemini", icon: GoogleLogo },
  { name: "Perplexity", icon: Compass },
  { name: "Copilot", icon: MicrosoftOutlookLogo },
]

export const AiSummary = () => {
  const t = useTranslations('ai_summary');

  return (
    <section className="bg-transparent">
      <Grid className="py-8 md:py-12">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-display">
            {t('title')}
          </h2>

          <div className="flex items-center justify-center gap-8 md:gap-12 mt-12">
            {aiTools.map((tool) => (
              <div key={tool.name} className="opacity-70 hover:opacity-100 transition-opacity">
                <tool.icon size={40} weight="regular" className="text-neutral-800" />
              </div>
            ))}
          </div>

          <p className="mt-12 text-sm text-neutral-500">
            {t('copyright')}
          </p>
        </div>
      </Grid>
    </section>
  )
}
