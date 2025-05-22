import { PlanBox } from "@/components/atoms/plan-box";
import { useCreateCheckoutSession } from "@/services/checkout";
import { useGetPlans } from "@/services/plans/hooks";
import { Snowflake } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function FreezedPage() {
  const { t } = useTranslation(['subscription', 'common']);
  const { data: plans } = useGetPlans();
  const { mutateAsync: createCheckoutSession } = useCreateCheckoutSession();
  const [isLoading, setIsLoading] = useState('');

  const handlePlanClick = async (plan: Plan.Item) => {
    try {
      toast.info('Criando seu plano...')
      setIsLoading(plan.key);

      const checkoutSession = await createCheckoutSession(plan.key);

      toast.success('Redirecionando para o checkout...')

      window.open(checkoutSession.url, '_blank');
    } catch (error) {
      toast.error('Erro ao criar seu plano')
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col  h-full">
      <div className="max-w-screen-lg mx-auto w-full px-4 sm:px-8 h-full">
        <div className="border border-neutral-300 rounded-md bg-white p-4 mt-8">

          <h1 className="text-2xl font-medium font-[Recursive]">Victus Journal</h1>

          <div className="w-full border-t border-t-neutral-300 my-8"></div>

          <div className="flex flex-col">
            <div className="flex items-center justify-center w-12 h-12 bg-neutral-100 rounded-full border border-neutral-300">
              <Snowflake size={32} className="text-blue-500" />
            </div>
            <h2 className="text-lg font-medium font-[Recursive] mt-8">
              Sua conta está congelada
            </h2>
            <p className="text-neutral-500 mt-4">
              Aparentemente você não possui uma assinatura ativa. Por favor, assine um plano para continuar usando o Victus Journal.
            </p>
          </div>

          <div className="w-full border-t border-t-neutral-300 my-8"></div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans?.map((plan, index) => (
              <li key={plan.key}>
                <PlanBox
                  loading={isLoading === plan.key}
                  disabled={!!isLoading}
                  title={t(`subscription:plans.${plan.plan_key}.title`)}
                  price={plan.price}
                  features={plan.features.map((feature) => ({
                    description: t(`subscription:plans.features.${feature.key}`)
                  }))}
                  progress={index === 0 ? 50 : 100}
                  onClick={() => handlePlanClick(plan)}
                  buttonText={t('subscription:plans.free_trial')}
                />
              </li>
            ))}
          </ul>

        </div>
      </div>
    </div>
  )
}