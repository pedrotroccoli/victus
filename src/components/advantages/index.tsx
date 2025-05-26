import { cn } from "@/lib/utils";
import { ChartBar, ChartPieSlice, Fire, ProjectorScreenChart } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "next-intl";
import { Grid } from "../grid";

const advantages = (t: any) => [
  {
    icon: ChartBar,
    title: t('items.advantage_01.title'),
    description: t('items.advantage_01.description'),
  },
  {
    icon: ProjectorScreenChart,
    title: t('items.advantage_02.title'),
    description: t('items.advantage_02.description'),
  },
  {
    icon: Fire,
    title: t('items.advantage_03.title'),
    description: t('items.advantage_03.description'),
  },
  {
    icon: ChartPieSlice,
    title: t('items.advantage_04.title'),
    description: t('items.advantage_04.description'),
  }
];

export const Advantages = () => {
  const t = useTranslations('advantages');

  return (
    <section id="advantages">
      <Grid className="pt-20 md:pt-40">
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 divide-y sm:divide-y-0 lg:divide-x divider-neutral-300 border border-neutral-300 rounded-md w-full bg-white shadow-sm">
          {advantages(t).map((advantage, index) => (
            <li key={advantage.title} className={
              cn(
                "p-8 border-neutral-300 ",
                index === 0 && "max-lg:border-r max-lg:border-b max-sm:border-r-0 max-sm:border-b-0",
                index === 1 && "max-lg:border-b max-sm:border-b-0",
                index === 2 && "max-lg:border-r max-sm:border-r-0"
              )
            }>
              <advantage.icon size={24} />
              <h6 className="font-bold mt-6">{advantage.title}</h6>
              <p className="mt-4 text-victus-text text-sm">{advantage.description}</p>
            </li>
          ))}

        </ul>
      </Grid>
    </section>
  );
};