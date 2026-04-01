import { CircleCheck } from "lucide-react";

import { Button } from "@/components/ions/button";
import { CircleProgress } from "@/components/ions/circle-progress";
import { CircleDashed } from "lucide-react";

interface PlanBoxProps {
  title: string;
  description?: string;
  price: string;
  features: {
    description: string;
  }[];
  progress: number;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  buttonText: string;
}

export const PlanBox = ({ title, price, features, progress, onClick, loading = false, disabled = false, buttonText }: PlanBoxProps) => {

  return (
    <div className="border border-neutral-300 rounded-md p-4 bg-white h-full">
      <div className="w-16 h-16 bg-neutral-100 border border-neutral-300 rounded-full">
        <CircleProgress progress={progress}>
          <CircleDashed size={24} />
        </CircleProgress>
      </div>
      <h2 className="text-2xl font-medium font-[Recursive] mt-4">{title}</h2>
      <h3 className="text-lg font-[Recursive] font-bold mt-4">{price}</h3>
      <ul className="mt-4 grid gap-2">
        {features?.map((feature) => (
          <li className="text-sm text-neutral-600 flex items-center gap-2">
            <CircleCheck size={16} />
            {feature.description}
          </li>
        ))}
      </ul>
      <div className="w-full border-t border-neutral-300 my-4"></div>
      <Button className="w-full mt-auto font-[Recursive] font-medium" onClick={onClick} disabled={loading || disabled}
      loading={loading}
      >
        {buttonText}
      </Button>
    </div>
  )
}