import { PlanBox } from "@/components/atoms/plan-box";
import { useGetPlans } from "@/services/plans/hooks";
import { useTranslation } from "react-i18next";

const PlansPage = () => {
  const { data } = useGetPlans();
  const { t } = useTranslation(['subscription', 'sidebar']);
  
  const handlePlanClick = (plan: Plan.Item) => {
    console.log(plan);
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-2xl font-medium font-[Recursive]">
      {t('sidebar:account_sidebar.plans')}
      </h1>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.map((plan, index) => (
          <li key={plan.key}>
            <PlanBox
              title={t(`subscription:plans.${plan.plan_key}.title`)}
              price={plan.price}
              features={plan.features.map((feature) => ({
                description: t(`subscription:plans.features.${feature.key}`)
              }))}
              buttonText={t('subscription:plans.free_trial')}
              progress={index === 0 ? 50 : 100}
              onClick={() => handlePlanClick(plan)}
            />
          </li>
        ))}

      </ul>
    </div>
  );
};

export default PlansPage;