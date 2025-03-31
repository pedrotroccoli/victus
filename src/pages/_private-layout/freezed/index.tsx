import { PlanBox } from "@/components/atoms/plan-box";
import { useGetPlans } from "@/services/plans/hooks";

export default function FreezedPage() {
  const { data: plans } = useGetPlans();

  const handlePlanClick = (plan: Plan.Item) => {
    console.log(plan);
  }

  return (
    <div className="flex flex-col  h-full bg-red-100">
      <div className="max-w-screen-lg mx-auto bg-blue-100 w-full px-4 sm:px-8 h-full">
        <div className="border border-neutral-300 rounded-md bg-white p-4 mt-8">

          <h1 className="text-2xl font-medium font-[Recursive]">Victus Journal</h1>

          <div className="w-full border-t border-t-neutral-300 my-8"></div>

          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-medium font-[Recursive]">
              Sua conta está congelada
            </h2>
            <p className="text-neutral-500">
              Aparentemente você não possui uma assinatura ativa. Por favor, assine um plano para continuar usando o Victus Journal.
            </p>
          </div>

          <div className="w-full border-t border-t-neutral-300 my-8"></div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans?.map((plan, index) => (
              <li key={plan.key}>
                <PlanBox
                  name={plan.name}
                  price={plan.price}
                  features={plan.features}
                  progress={index === 0 ? 50 : 100}
                  onClick={() => handlePlanClick(plan)}
                />
              </li>
            ))}
          </ul>

        </div>
      </div>
    </div>
  )
}