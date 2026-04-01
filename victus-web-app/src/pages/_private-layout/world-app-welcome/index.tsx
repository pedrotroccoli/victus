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
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
export const WorldAppWelcomePage = () => {
  const { t } = useTranslation('welcome');
  const { t: tCommon } = useTranslation('common');
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const stepsInformation = [
    {
      title: t('welcome.step1.title'),
      description: t('welcome.step1.description'),
      image: Step1Image,
    },
    {
      title: t('welcome.step2.title'),
      description: t('welcome.step2.description'),
      image: Step2Image,
    },
    {
      title: t('welcome.step3.title'),
      description: t('welcome.step3.description'),
      image: Step3Image,
    },
    {
      title: t('welcome.step4.title'),
      description: t('welcome.step4.description'),
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
      <div className="p-4 flex flex-col">
        <SquareImage image={stepsInformation[step].image} alt={stepsInformation[step].title} className="mx-auto w-full" />

        <div className="mt-8">
          <h1 className="text-2xl font-[Recursive] font-bold" >{stepsInformation[step].title}</h1>
          <p className=" text-black/75 mt-2">
          <Markdown>
            {stepsInformation[step].description}
          </Markdown>
          </p>
        </div>

        <StepsBullet numberOfSteps={stepsInformation.length} currentStep={step} className="mt-12" />

        <div className="h-32 w-full"></div>
      </div>
      <div className="fixed bottom-0 w-full bg-white p-4 pt-6 pb-10 border-t border-neutral-300 rounded-t-3xl shadow-2xl">
        <div className="grid gap-4 w-full">
          <Button className="w-full font-[Recursive] font-bold h-12 flex items-center justify-center gap-4" onClick={nextStep}>
            <p>{tCommon('next')}</p>
          </Button>
        </div>
      </div>
    </main>
  );
};
