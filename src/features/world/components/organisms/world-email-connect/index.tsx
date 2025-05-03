import { TextField } from "@/components/molecules/form/TextField";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { WarningCircle } from "@phosphor-icons/react";
import { FormProvider, useForm } from "react-hook-form";

export const WorldEmailConnectModal = () => {
  const form = useForm();

  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Conectar-se com conta existente</DrawerTitle>
        <DrawerDescription>Insira seu e-mail para continuar</DrawerDescription>
      </DrawerHeader>
      <div className="p-4">
        <Alert variant="default" className="mb-4 text-yellow-500 bg-yellow-500/10 border-yellow-500">
          <WarningCircle className="fill-yellow-500" />
          <AlertTitle className="text-yellow-500">Atenção</AlertTitle>
          <AlertDescription className="text-black/75 text-xs mt-4">
            Uma mensagem será enviada para o e-mail informado, nela você receberá um link para conectar sua conta World com sua conta Victus.
          </AlertDescription>
        </Alert>
        <FormProvider {...form}>
          <TextField type="email" placeholder="E-mail" name="email" />
        </FormProvider>
      </div>
      <DrawerFooter>
        <Button>Confirmar</Button>
        <div className="w-full h-8"></div>
      </DrawerFooter>
    </DrawerContent>
  );
};