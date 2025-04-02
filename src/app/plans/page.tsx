import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const items = [
  {
    name: 'Plano mensal',
    price: 'R$ 15,00/mês',
    key: 'victus_journal_monthly',
    features: [
      'Criação de 50 hábitos',
      'Criação de Deltas',
      'Analytics avançado',
      'Suporte via chat (Email)',
    ],
  },
  {
    name: 'Plano anual',
    price: 'R$ 8,33/mês',
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

export default function Plans() {
  return (
    <main className="h-screen flex flex-col">
      <Header />

      <section className="bg-seasalt">
        <div className="max-w-screen-lg mx-auto flex justify-center items-center flex-col text-center">
          <h1 className="text-2xl font-bold my-16">Planos</h1>
          <ul className="grid md:grid-cols-2 gap-4 w-full">
            {items.map((item) => (
              <li key={item.name} className="border border-neutral-300 rounded-md p-6 text-left">
                <h2 className="text-lg font-bold">{item.name}</h2>
                <p className="text-sm text-black font-medium mt-2">{item.price}</p>

                <div className="my-6 w-full border-t border-neutral-300"></div>

                <ul className="mt-4 grid gap-2">
                  {item.features.map((feature) => (
                    <li key={feature} className="text-sm text-black flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <p>{feature}</p>
                    </li>
                  ))}
                </ul>

                <div className="my-6 w-full border-t border-neutral-300"></div>

                <a href={`https://app.victusjournal.com/sign-up?key=${item.key}`} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full">
                    Teste por 14 dias grátis
                  </Button>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}