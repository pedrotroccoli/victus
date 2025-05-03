import { Button } from "@/components/ui/button";
import { useState } from "react";

import { Logo } from "@/assets/logo";

import Step4Image from "@/assets/steps/analytics.png";
import Step3Image from "@/assets/steps/deltas.png";
import Step2Image from "@/assets/steps/journal-item.png";
import Step1Image from "@/assets/steps/journal.png";

import { SquareImage } from "@/features/world/components/ions/SquareImage";
import { StepsBullet } from "@/features/world/components/ions/steps-bullet";
import { useNavigate } from "@tanstack/react-router";
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
      <div className="p-4 h-[calc(100vh-4rem)] flex flex-col">
        <SquareImage image={stepsInformation[step].image} alt={stepsInformation[step].title} />

        <div className="mt-8">
          <h1 className="text-2xl font-[Recursive] font-bold" >{stepsInformation[step].title}</h1>
          <p className=" text-black/75 mt-2">
            {stepsInformation[step].description}
          </p>
        </div>

        <div className="w-full h-px bg-neutral-300 my-8"></div>

        <StepsBullet numberOfSteps={stepsInformation.length} currentStep={step} />

        <div className="h-40 bg-transparent w-full"></div>
      </div>
      <div className="fixed bottom-0 w-full bg-white p-4 pt-6 pb-8 border-t border-neutral-300 rounded-t-3xl shadow-2xl">
        <div className="grid gap-4 w-full mt-auto">
          <Button className="w-full font-[Recursive] font-bold h-12 flex items-center justify-center gap-4" onClick={nextStep}>
            <p>Próximo</p>
          </Button>
        </div>
      </div>
    </main>
  );
};
