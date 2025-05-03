import { Button } from "@/components/ui/button";
import { useState } from "react";

import { Logo } from "@/assets/logo";
import { cn } from "@/lib/utils";


import Step4Image from "@/assets/steps/analytics.png";
import Step3Image from "@/assets/steps/deltas.png";
import Step2Image from "@/assets/steps/journal-item.png";
import Step1Image from "@/assets/steps/journal.png";

import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
export const WorldAppWelcomePage = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const stepsInformation = [
    {
      title: "Olá, bem vindo ao Victus Journal!",
      description: <p>Seu diário de hábitos, pensamentos e experiências. Tenha mais controle sobre sua vida.</p>,
      image: Step1Image,
    },
    {
      title: "Crie seus hábitos e metas",
      description: <p>Crie um a um seus hábitos, crie metas e obtenha seu <strong>jornal geral</strong> para preencher.</p>,
      image: Step2Image,
    },
    {
      title: "Crie deltas para cada hábito",
      description: <p>Obtenha dados detalhados sobre seus comportamentos no seu analytics.</p>,
      image: Step3Image,
    },
    {
      title: "Veja seu analytics",
      description: <p>Com o analytics você pode ver sua performance e evolução dos seus objetivos.</p>,
      image: Step4Image,
    },
  ]

  const nextStep = () => {
    if (step === 3) {
      navigate({ to: "/dashboard" })
      setStep(0);
      return;
    }

    setStep(prev => prev + 1);
  }

  return (
    <main className="min-h-screen w-full flex flex-col">
      <header className="flex items-center gap-2  h-16 border-b border-neutral-300 px-4">
        <Logo width={24} height={24} />
        <p className="text-sm font-[Recursive] font-bold">Victus Journal</p>
      </header>
      <div className="p-4 pt-8 h-[calc(100vh-4rem)] flex flex-col justify-between">
        <div className="border border-neutral-300 rounded-lg h-80 max-w-[32rem]">
          <div className={cn("relative w-full h-full")}>
            <img src={stepsInformation[step].image} alt="Mr Habit" className={cn("w-full h-full object-cover rounded-lg")} />
            <div className={
              cn(
                "absolute w-3/5 h-full top-0 left-[-125%] bg-white/30 skew-x-[45deg] backdrop-blur-lg",
              )
            } style={{
              transition: "500ms"
            }}></div>

            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/50 to-transparent rounded-lg">


            </div>
          </div>
        </div>
        <div className="mt-8">
          <h1 className="text-2xl font-[Recursive] font-bold" >{stepsInformation[step].title}</h1>
          <p className=" text-black/75 mt-4 text-lg ">
            {stepsInformation[step].description}
          </p>
        </div>
        <div className="w-full h-px bg-neutral-300 my-8"></div>
        <div className="flex items-center justify-center gap-2">
          {stepsInformation.map((_, index) => (
            <div className="w-6 h-3 flex items-center justify-center rounded-full">
              <motion.div
                key={index}
                className={cn("h-2 border border-neutral-300 rounded-full", {
                  "bg-[#a87320] w-6": index <= step,
                })}
                initial={{ width: 16 }}
                animate={{ width: index === step ? 24 : 16 }}
                transition={{ duration: 0.3 }}
              >

              </motion.div>
            </div>
          ))}
        </div>


        <div className="grid gap-4 w-full mt-auto pb-8">
          <Button className="w-full font-[Recursive] font-bold h-12 flex items-center justify-center gap-4" onClick={nextStep} disabled={isLoading}>
            <p>Próximo</p>
          </Button>
        </div>
      </div>
    </main>
  );
};
