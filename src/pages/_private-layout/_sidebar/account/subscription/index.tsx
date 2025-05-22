import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMe } from "@/services/auth";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Frown, Laugh } from "lucide-react";
import { useMemo } from "react";
import { Helmet } from "react-helmet";

interface SubscriptionParams {
  missingSubscription: string;
  checkoutResponse: string;
}

export default function Subscription() {
  const { data: me } = useMe();
  const params = useSearch({ from: '/_private/_sidebar/account/_layout/subscription/' }) as SubscriptionParams;
  const navigate = useNavigate();

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

  return (
    <>
      <Helmet>
        <title>Victus Journal | Assinatura</title>
      </Helmet>


      <div className="px-4 flex-1 w-full">
        <h1 className="text-2xl font-medium font-[Recursive]">Assinatura</h1>

        <div className="flex flex-col mt-4 border rounded-md bg-white border-neutral-300 pt-4 w-full p-4">
          {/* <h1 className="font-medium font-[Recursive]">Plano atual:</h1> */}

          <Frown size={48} />

          <h1 className="text-2xl font-medium font-[Recursive] mt-6">Você não possui uma assinatura ativa</h1>

          <p className="text-neutral-500 mt-2">Aparentemente você não possui uma assinatura ativa. Por favor, assine um plano para continuar usando o Victus Journal.</p>

          <div className="w-full border-t border-t-neutral-300 my-8"></div>

          <Button className="font-medium">Ver planos</Button>
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
