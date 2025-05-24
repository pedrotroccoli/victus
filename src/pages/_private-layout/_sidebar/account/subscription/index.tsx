import { Button } from "@/components/ions/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAccountInformations } from "@/services/auth/use-account-informations";
import { useCreateSubscriptionSession } from "@/services/subscription/hooks";
import { MaskSad, Prohibit, Snowflake, TestTube } from "@phosphor-icons/react";
import { Smiley } from "@phosphor-icons/react/dist/ssr";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Frown, Laugh } from "lucide-react";
import { useMemo } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

interface SubscriptionParams {
  missingSubscription: string;
  checkoutResponse: string;
}

export default function Subscription() {
  const { data: me, informations } = useAccountInformations();
  const params = useSearch({ from: '/_private/_sidebar/account/_layout/subscription/' }) as SubscriptionParams;
  const navigate = useNavigate();
  const { mutateAsync: createSubscriptionSession, isPending } = useCreateSubscriptionSession();
  const { t } = useTranslation('subscription');

  const firstName = useMemo(() => {
    return me?.name?.split(' ')[0]
  }, [me?.name])

  const onCloseMissingPlanModal = () => {
    const oldParams = {
      ...params,
      missingSubscription: undefined,
    }

    navigate({
      to: '/account/subscription',
      search: oldParams,
    });
  }

  const goToJournal = () => {
    navigate({
      to: '/dashboard',
    });
  }

  const goToPlans = () => {
    navigate({
      to: '/account/plans',
    });
  }

  const openSubscriptionSession = async () => {
    const { session_url } = await createSubscriptionSession();

    window.open(session_url, '_blank');
  }

  const accountType = {
    'active': {
      icon: <Smiley size={48} />,
      title: t('subscription.active.title'),
      description: t('subscription.active.description'),
      button: t('subscription.active.button'),
      buttonAction: openSubscriptionSession,
    },
    'missing': {
      icon: <MaskSad size={48} />,
      title: t('subscription.missing.title'),
      description: t('subscription.missing.description'),
      button: t('subscription.missing.button'),
      buttonAction: goToPlans,
    },
    'trial': {
      icon: <TestTube size={48} />,
      title: t('subscription.trial.title'),
      description: t('subscription.trial.description'),
      button: t('subscription.trial.button'),
      buttonAction: goToPlans,
    },
    'freezed': {
      icon: <Snowflake size={48} />,
      title: t('subscription.freezed.title'),
      description: t('subscription.freezed.description'),
      button: t('subscription.freezed.button'),
      buttonAction: openSubscriptionSession,
    },
    'cancelled': {
      icon: <Prohibit size={48} />,
      title: t('subscription.cancelled.title'),
      description: t('subscription.cancelled.description'),
      button: t('subscription.cancelled.button'),
      buttonAction: goToPlans,
    }
  }

  return (
    <>
      <Helmet>
        <title>Victus Journal | Assinatura</title>
      </Helmet>


      <div className="px-4 flex-1 w-full">
        <h1 className="text-2xl font-medium font-[Recursive]">Assinatura</h1>

        <div className="flex flex-col mt-4 border rounded-md bg-white border-neutral-300 pt-4 w-full p-4">
          {/* <h1 className="font-medium font-[Recursive]">Plano atual:</h1> */}

          {accountType[informations.subscriptionType as keyof typeof accountType].icon}

          <h1 className="text-xl font-medium font-[Recursive] mt-6">{accountType[informations.subscriptionType as keyof typeof accountType].title}</h1>

          <p className="text-neutral-500 mt-2">{accountType[informations.subscriptionType as keyof typeof accountType].description}</p>

          <div className="w-full border-t border-t-neutral-300 my-6"></div>

          <Button loading={isPending} className="font-medium" onClick={accountType[informations.subscriptionType as keyof typeof accountType].buttonAction}>
            {accountType[informations.subscriptionType as keyof typeof accountType].button}
          </Button>
        </div>


      </div>


      <Dialog open={!!params.missingSubscription} onOpenChange={onCloseMissingPlanModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Opa, tivemos um problema {firstName}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <p>
              Você não possui uma assinatura ativa. Por favor, assine um plano para continuar usando o Victus Journal.
            </p>

            <Button onClick={goToPlans}>Ver planos</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={params.checkoutResponse === 'error'} onOpenChange={onCloseMissingPlanModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Opa, tivemos um problema {firstName}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <Frown size={48} />

            <p>
              Aparentemente ocorreu um erro ao processar seu pagamento, tente novamente.
            </p>

            <Button onClick={goToPlans}>Tentar novamente</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={params.checkoutResponse === 'success'} onOpenChange={onCloseMissingPlanModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Meus parabéns, {me?.name}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <Laugh size={48} />

            <p>
              Você deu o primeiro passo para completar seus objetivos.
            </p>

            <Button onClick={goToJournal}>Ir para o meu jornal</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
