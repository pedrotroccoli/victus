import { PlanBox } from "@/components/atoms/plan-box";
import { useGetPlans } from "@/services/plans/hooks";

const PlansPage = () => {
  const { data } = useGetPlans();

  const handlePlanClick = (plan: Plan.Item) => {
    console.log(plan);
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-medium font-[Recursive]">Planos</h1>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.map((plan, index) => (
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
  );
};

export default PlansPage;