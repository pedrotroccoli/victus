import { Button } from "@/components/ui/button";
import { useMe } from "@/services/auth";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Frown, Loader2, Smile } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PageCheckoutParams {
  checkout_success?: string;
  checkout_cancel?: string;
}

export const CheckoutPage = () => {
  const params = useSearch({ from: '/_private/checkout/' }) as PageCheckoutParams;
  const [status, setStatus] = useState<'success' | 'error' | 'loading'>('loading');
  const navigate = useNavigate();
  const { isLoading } = useMe();

  const checkoutSuccess = params.checkout_success;
  const checkoutCancel = params.checkout_cancel;

  useEffect(() => {
    (async () => {
      if (isLoading) {
        return;
      }

      if (checkoutSuccess === undefined && checkoutCancel === undefined) {
        navigate({ to: '/dashboard' });
      }

      if (checkoutCancel) {
        setStatus('error');
        toast.error('Plano não ativado');
        return;
      }

      toast.success('Plano ativado com sucesso');

      setStatus('success');
      toast.success('Plano ativado com sucesso');
    })();
  }, [checkoutSuccess, checkoutCancel, navigate, isLoading]);

  return (
    <main className="w-full h-full flex items-center justify-center">
      {status === 'loading' && (
        <div className="flex items-center justify-center h-full ">
          <Loader2 size={24} className="animate-spin" />
        </div>
      )}

      {status === 'success' && (
        <div className="flex items-center justify-center flex-col bg-white border border-neutral-300 rounded-lg p-8">
          <Smile size={48} strokeWidth={1.5} />
          <h1 className="text-xl font-bold mt-8">Plano ativado com sucesso</h1>
          <Button className="mt-4" onClick={() => navigate({ to: '/dashboard' })}>Ir para o dashboard</Button>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center justify-center flex-col bg-white border border-neutral-300 rounded-lg p-8">
          <Frown size={48} strokeWidth={1.5} />
          <h1 className="text-xl font-bold font-[Recursive] mt-8">Plano não ativado</h1>
          <p className="text-sm mt-2">Por favor, tente novamente</p>

          <Button onClick={() => navigate({ to: '/checkout' })} className="mt-8">Tentar novamente</Button>
        </div>
      )}
    </main>
  );
};
