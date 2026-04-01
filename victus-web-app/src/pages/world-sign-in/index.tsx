import { Button } from "@/components/ions/button";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { WorldEmailConnectModal } from "@/features/world/components/organisms/world-email-connect";
import { useStartSiweAuth } from "@/services/auth";
import { useVerifySiweAuth } from "@/services/auth/hooks";
import { MiniKit } from "@worldcoin/minikit-js";
import { useEffect, useMemo, useState } from "react";

import { Logo } from "@/assets/logo";
import MrHabitImage from "@/assets/mrhabit.png";
import { SquareImage } from "@/features/world/components/ions/SquareImage";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
export const WorldSignInPage = () => {
  const { t } = useTranslation('auth');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { mutateAsync: startSiweAuth, isPending: isStartingSiweAuth } = useStartSiweAuth();
  const { mutateAsync: verifySiweAuth, isPending: isVerifyingSiweAuth } = useVerifySiweAuth();
  const [animate, setAnimate] = useState(false);

  const generalLoading = useMemo(() => isStartingSiweAuth || isVerifyingSiweAuth || isLoading, [isStartingSiweAuth, isVerifyingSiweAuth, isLoading]);

  const signInWithWallet = async () => {
    if (!MiniKit.isInstalled()) {
      return
    }

    const { nonce } = await startSiweAuth();

    const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
      nonce: nonce,
      requestId: '0', // Optional
      expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      statement: 'This is my statement and here is a link https://worldcoin.com/apps',
    })

    try {
      await verifySiweAuth({
        payload: finalPayload,
        nonce
      })

      toast.success(t('sign_in.world_app.toast.success'))

      navigate({ to: "/world-app/welcome" })
    } catch (error) {
      console.log(error)
      toast.error(t('sign_in.world_app.toast.error'))
    }

    setIsLoading(false)
  }

  useEffect(() => {
    setTimeout(() => {
      setAnimate(true)
    }, 300)
  }, []);

  return (
    <main className="min-h-screen w-full flex flex-col">
      <header className="flex items-center gap-2  h-16 border-b border-neutral-300 px-4">
        <Logo width={24} height={24} />
        <p className="text-sm font-[Recursive] font-bold">{t('title')}</p>
      </header>
      <div className="p-4 flex flex-col">
        <SquareImage image={MrHabitImage} alt="Mr Habit" animate={animate} imgClassName="object-[0_-40px]" />
        <div className="mt-8">
          <h1 className="text-2xl font-[Recursive] font-bold" >{t('sign_in.world_app.title')}</h1>
          <p className=" text-black/75 mt-2">
            {t('sign_in.world_app.description')}
          </p>
        </div>
        <div className="h-40 bg-transparent w-full"></div>
      </div>

      <div className="fixed bottom-0 w-full bg-white p-4 pt-6 pb-10 border-t border-neutral-300 rounded-t-3xl shadow-2xl">
        <div className="grid gap-4 w-full">
          <Button onClick={signInWithWallet} loading={generalLoading}>
            <p>{t('sign_in.world_app.connect_with_world_id')}</p>
          </Button>

          <Drawer>
            <DrawerTrigger disabled>
              <Button variant="outline" className="w-full" disabled>
                <p>{t('sign_in.world_app.connect_with_existing_account')}</p>
              </Button>
            </DrawerTrigger>
            <WorldEmailConnectModal />
          </Drawer>
        </div>
      </div>
    </main>
  );
};
