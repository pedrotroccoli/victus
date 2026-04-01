import { useMemo } from "react";
import { useMe } from "./hooks";

export const useAccountInformations = () => {
  const all = useMe();

  const subscriptionType = useMemo(() => {
    const me = all.data;

    if (!me?.subscription || !me?.subscription.status || !me?.subscription.service_details.customer_id) return 'missing';

    if (me?.subscription?.status === 'active' && me?.subscription.sub_status === 'success') return 'active';

    if (me?.subscription?.status === 'cancelled') return 'cancelled';

    if (me?.subscription?.sub_status === 'trial') return 'trial';
  }, [all.data?.subscription])

  return {
    ...all,
    informations: {
      subscriptionType
    }
  };
};