import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { WorldEmailConnectModal } from "@/features/world/components/organisms/world-email-connect";
import { useStartSiweAuth } from "@/services/auth";
import { useVerifySiweAuth } from "@/services/auth/hooks";
import { CircleNotch } from "@phosphor-icons/react";
import { MiniKit } from "@worldcoin/minikit-js";
import { useEffect, useState } from "react";

import { Logo } from "@/assets/logo";
import MrHabitImage from "@/assets/mrhabit.png";
import { cn } from "@/lib/utils";

export const WorldSignInPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: startSiweAuth, isPending: isStartingSiweAuth } = useStartSiweAuth();
  const { mutateAsync: verifySiweAuth, isPending: isVerifyingSiweAuth } = useVerifySiweAuth();
  const [animate, setAnimate] = useState(false);

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
      const abc = await verifySiweAuth({
        payload: finalPayload,
        nonce
      })

      console.log({
        abc
      })
    } catch (error) {
      console.log("Método interno", error)
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
        <p className="text-sm font-[Recursive] font-bold">Victus Journal</p>
      </header>
      <div className="p-4 pt-8 h-[calc(100vh-4rem)] flex flex-col justify-between">
        <div className="border border-neutral-300 rounded-lg h-80">

          <div className={cn("relative w-full h-full group overflow-hidden")}>
            <img src={MrHabitImage} alt="Mr Habit" className={cn("w-full h-full object-cover object-[0_-40px] rounded-lg")} />
            <div className={
              cn(
                "absolute w-3/5 h-full top-0 left-[-125%] bg-white/30 skew-x-[45deg] backdrop-blur-lg",
                animate && "left-[150%]"
              )
            } style={{
              transition: "500ms"
            }}></div>

            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/50 to-transparent rounded-lg">


            </div>
          </div>
        </div>
        <div className="mt-8">
          <h1 className="text-2xl font-[Recursive] font-bold" >Bem-vindo ao Victus Journal</h1>
          <p className=" text-black/75 mt-4">
            Seu diário de hábitos, pensamentos e experiências. Tenha mais controle sobre sua vida.
          </p>
        </div>

        <div className="grid gap-4 w-full mt-auto pb-8">
          <Button className="w-full font-[Recursive] font-bold h-12 flex items-center justify-center gap-4" onClick={signInWithWallet} disabled={isStartingSiweAuth || isVerifyingSiweAuth}>
            <p>Conectar-se com World ID</p>
            {isLoading && <CircleNotch className="animate-spin" size={16} />}
          </Button>

          <Drawer >
            <DrawerTrigger>
              <Button className="w-full font-[Recursive] font-bold h-12" variant="outline">
                <p>Conectar-se com conta existente</p>
              </Button>
            </DrawerTrigger>
            <WorldEmailConnectModal />
          </Drawer>
        </div>
      </div>
    </main>
  );
};
