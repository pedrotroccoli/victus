import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface StepsBulletProps {
  numberOfSteps: number;
  currentStep: number;
}

export const StepsBullet = ({ numberOfSteps, currentStep }: StepsBulletProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: numberOfSteps }).map((_, index) => (
        <div className="w-6 h-3 flex items-center justify-center rounded-full">
          <motion.div
            key={index}
            className={cn("h-2 border border-neutral-300 rounded-full", {
              "bg-[#a87320] w-6": index <= currentStep,
            })}
            initial={{ width: 16 }}
            animate={{ width: index === currentStep ? 24 : 16 }}
            transition={{ duration: 0.3 }}
          >

          </motion.div>
        </div>
      ))}
    </div>
  )
}