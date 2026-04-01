import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Outlet, useNavigate, useSearch } from "@tanstack/react-router";
import { CircleUser, CreditCard } from "lucide-react";

interface AccountLayoutParams {
  view: 'account' | 'subscription' | 'plans';
}

export const AccountLayout = () => {

  const params = useSearch({ from: '/_private/_sidebar/account/_layout' }) as AccountLayoutParams;
  const navigate = useNavigate();

  return (
    <div>
      <section className="max-w-screen-lg mx-auto bg-sign h-full flex px-4">
        <Tabs
          className="w-full flex gap-8 pt-8"
          orientation="horizontal"
          defaultValue={params.view || 'account'}
          value={params.view || 'account'}
        >
          <TabsList
            className="h-auto flex flex-col justify-start items-center max-w-60 w-full border border-neutral-300 p-4 pt-6 gap-4 bg-white"
          >
            <TabsTrigger
              className="w-full border border-neutral-300 gap-2 flex hover:bg-neutral-100"
              value="account"
              onClick={() => navigate({
                to: '/account/general', search: {
                  ...params,
                  view: 'account',
                }
              })}
            >
              <CircleUser size={16} />
              Conta
            </TabsTrigger>
            <TabsTrigger className="w-full border border-neutral-300 gap-2 flex hover:bg-neutral-100" value="subscription"
              onClick={() => navigate({
                to: '/account/subscription', search: {
                  ...params,
                  view: 'subscription',
                }
              })}
            >
              <CreditCard size={16} />
              Assinatura
            </TabsTrigger>
            <TabsTrigger className="w-full border border-neutral-300 gap-2 flex hover:bg-neutral-100" value="plans"
              onClick={() => navigate({
                to: '/account/plans', search: {
                  ...params,
                  view: 'plans',
                }
              })}
            >
              <CreditCard size={16} />
              Planos
            </TabsTrigger>
          </TabsList>
          <TabsContent value={params.view || 'account'} className="flex-1 px-4">
            <Outlet />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}