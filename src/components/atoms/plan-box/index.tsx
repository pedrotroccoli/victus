import { CircleCheck, Loader2 } from "lucide-react";

import { CircleProgress } from "@/components/ions/circle-progress";
import { Button } from "@/components/ui/button";
import { CircleDashed } from "lucide-react";

interface PlanBoxProps {
  name: string;
  description?: string;
  price: string;
  features: {
    name: string;
  }[];
  progress: number;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const PlanBox = ({ name, price, features, progress, onClick, loading = false, disabled = false }: PlanBoxProps) => {
  return (
    <div className="border border-neutral-300 rounded-md p-4 bg-white h-full">
      <div className="w-16 h-16 bg-neutral-100 border border-neutral-300 rounded-full">
        <CircleProgress progress={progress}>
          <CircleDashed size={24} />
        </CircleProgress>
      </div>
      <h2 className="text-2xl font-medium font-[Recursive] mt-4">{name}</h2>
      <h3 className="text-lg font-[Recursive] font-bold mt-4">{price}</h3>
      <ul className="mt-4 grid gap-2">
        {features?.map((feature) => (
          <li className="text-sm text-neutral-600 flex items-center gap-2">
            <CircleCheck size={16} />
            {feature.name}
          </li>
        ))}
      </ul>
      <div className="w-full border-t border-neutral-300 my-4"></div>
      <Button className="w-full mt-auto font-[Recursive] font-medium" onClick={onClick} disabled={loading || disabled}>
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          'Teste grátis por 14 dias'
        )}
      </Button>
    </div>
  )
}