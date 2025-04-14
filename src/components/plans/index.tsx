import { cn } from "@/lib/utils"
import { CaretCircleRight, CheckCircle } from "@phosphor-icons/react/dist/ssr"
import { Button } from "../ui/button"

const items = [
  {
    type: 'monthly',
    name: 'Mensal',
    after_name: '/ mês',
    price: 'R$ 15,00',
    key: 'victus_journal_monthly',
    features: [
      'Criação de 50 hábitos',
      'Criação de Deltas',
      'Analytics avançado',
      'Suporte via chat (Email)',
    ],
  },
  {
    type: 'yearly',
    recommended: true,
    name: 'Anual',
    after_name: '/ ano',
    price: 'R$ 8,33',
    oldPrice: 'R$ 180,00',
    key: 'victus_journal_yearly',
    features: [
      'Criação de infinitos hábitos',
      'Criação de Deltas',
      'Analytics avançado',
      'Suporte via chat (Email e WhatsApp)',
    ],
  },
]


export const Plans = () => {
  return (
    <section className="bg-[url('/bg-plans.png')] bg-cover bg-center border-y border-neutral-300">
      <div className="grid-container py-16">
        <h2 className="text-2xl md:text-4xl font-bold font-mono mb-16 mx-auto text-center">Planos e valores</h2>
        <ul className="flex gap-6 items-center md:items-end justify-center flex-col md:flex-row">
          {items.map((item) => (
            <li key={item.key} className={cn("max-w-[26rem] w-full", item.recommended && "shadow-green")} >
              {item.recommended && (
                <div className="w-full bg-victus-green/40 border-l border-t border-r border-victus-green rounded-t-md flex items-center justify-center py-4 translate-y-1 z-[-1]">
                  <h5 className="text-sm font-mono font-bold text-victus-green-dark ">Mais recomendado</h5>
                </div>
              )}
              <div className="w-full border border-neutral-300 rounded-md bg-white z-10">
                <div className="p-6">
                  <h4 className="text-base font-mono font-medium">
                    {item.name}
                  </h4>
                  <div className="flex items-end gap-2 mt-4">
                    <h1 className="text-3xl font-bold font-mono">{item.price}</h1>
                    <h5 className="text-base font-mono">{item.after_name}</h5>
                  </div>
                  <p className="mt-4 text-sm text-black/50">* Cobrado {item.type === 'monthly' ? 'mensalmente' : 'anualmente'}</p>
                </div>
                <div className="w-full border-t border-neutral-300"></div>
                <ul className="p-6 grid gap-2">
                  {item.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle size={24} />
                      <p className="text-victus-text">
                        {feature}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="px-6 pb-6">
                  <a href={`https://app.victusjournal.com/sign-up?key=${item.key}`} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full flex items-center justify-between px-6 gap-2 py-3 h-auto rounded-lg">
                      Teste grátis por 14 dias
                      <CaretCircleRight size={18} weight="bold" />
                    </Button>
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

    </section >
  )
}