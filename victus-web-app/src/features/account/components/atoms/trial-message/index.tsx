import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { addDays, format, isAfter } from "date-fns";
import { CircleAlert, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface TrialMessageProps {
  subscription: Account.Subscription;
}

export const TrialMessage = ({ subscription }: TrialMessageProps) => {
  const { t } = useTranslation("account");

  const [trialAlert, setTrialAlert] = useState(() => {
    const vjta = localStorage.getItem("@victus::vjta");

    if (!vjta) return true;

    return isAfter(new Date(), new Date(vjta));
  });

  const disable = () => {
    localStorage.setItem("@victus::vjta", addDays(new Date(), 1).toISOString());
    setTrialAlert(false);
  };

  if (!trialAlert) return null;

  return (
    <div className="relative">
      <Alert className="border-yellow-600 bg-yellow-500/10 mb-12">
        <CircleAlert className="h-4 w-4 fill-yellow-500" />
        <AlertTitle>{t("trial_period.title")}</AlertTitle>
        <AlertDescription className="mt-2 leading-[150%]">
          {t("trial_period.description", {
            date: subscription?.service_details?.trial_ends_at
              ? format(subscription.service_details.trial_ends_at, "dd/MM/yyyy")
              : "",
          })}
        </AlertDescription>
      </Alert>
      <X
        size={16}
        className="cursor-pointer absolute top-2.5 right-2.5 "
        onClick={disable}
      />
    </div>
  );
};
