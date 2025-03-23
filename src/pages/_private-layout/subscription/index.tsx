import { TextField } from "@/components/molecules/form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMe } from "@/services/auth";
import { CircleUser, CreditCard, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const basicInfoSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
});

type SubscriptionForm = z.infer<typeof basicInfoSchema>;

export default function Subscription() {
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
    <>
      <Helmet>
        <title>Victus Journal | Assinatura</title>
      </Helmet>

      <section className="max-w-screen-lg mx-auto bg-sign h-full flex">
        <Tabs className="w-full flex gap-8 pt-8" orientation="horizontal" defaultValue="account">
          <TabsList
            className="h-auto max-h-[40rem] flex flex-col justify-start items-center max-w-60 w-full border border-neutral-300 p-4 pt-6 gap-4 bg-white"
          >
            <TabsTrigger className="w-full border border-neutral-300 gap-2 flex hover:bg-neutral-100" value="account">
              <CircleUser size={16} />
              Conta
            </TabsTrigger>
            <TabsTrigger className="w-full border border-neutral-300 gap-2 flex hover:bg-neutral-100" value="subscription">
              <CreditCard size={16} />
              Assinatura
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="flex-1">
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
          </TabsContent>

          <TabsContent value="subscription" className="flex-1">
            <div className="px-4 flex-1">
              <h1 className="text-2xl font-medium font-[Recursive]">Assinatura</h1>

              <div className="flex flex-col gap-4 mt-4 border rounded-md bg-white border-neutral-300 pt-4 w-full p-4">
                <h1 className="font-medium font-[Recursive]">Plano atual:</h1>

              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
}
