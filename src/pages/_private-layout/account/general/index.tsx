import { TextField } from "@/components/molecules/form/TextField";
import { useMe } from "@/services/auth";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const basicInfoSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
});

type SubscriptionForm = z.infer<typeof basicInfoSchema>;

export const AccountGeneralPage = () => {
  const { data: me } = useMe();
  const form = useForm<SubscriptionForm>();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    form.reset({
      name: me?.name,
      email: me?.email,
      phone: me?.phone,
    });
  }, [me, form]);

  const onSubmit: SubmitHandler<SubscriptionForm> = async () => {
    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 3000));

      setLoading(false);

      // TODO: Update user

      toast.success("Informações atualizadas com sucesso!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="px-4 flex-1 ">
      <h1 className="text-2xl font-medium font-[Recursive]">Olá, {me?.name}</h1>

      <div className="flex flex-col gap-4 mt-4 border rounded-md bg-white border-neutral-300 pt-4 w-full p-4">
        <FormProvider {...form}>
          <h1 className="font-medium font-[Recursive]">Informações básicas:</h1>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <TextField
                label="Nome"
                placeholder="Nome"
                name="name"
              />

              <TextField
                label="Email"
                placeholder="Email"
                name="email"
              />

              <TextField
                label="Telefone"
                placeholder="Telefone"
                name="phone"
              />

              <Button type="submit" disabled={loading}>Salvar {loading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}</Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}