import { Grid } from "@/components/grid";
import { Plans as PlansComponent } from "@/components/plans";

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
    <main className="">
      <section className="w-full h-20">
        <Grid />
      </section>
      <PlansComponent />
      <section className="w-full h-20">
        <Grid />
      </section>

    </main>
  );
}