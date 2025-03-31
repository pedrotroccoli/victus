import { Header } from "@/components/organisms/header";
import { useMe } from "@/services/auth";
import { signOut } from "@/services/auth/services";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect } from "react";

export default function PrivateLayout() {
  const { data: me } = useMe()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut();

    navigate({
      to: '/',
    });
  }

  const goToDashboard = useCallback(() => {
    const missingSubscription = me?.subscription?.status !== 'active' || !me?.subscription ? true : undefined;


    if (missingSubscription) {
      navigate({
        to: '/freezed',
        search: {
          missingSubscription: true,
          view: 'subscription',
        },
        replace: true,
      });

      return;
    }

    navigate({
      to: '/dashboard',
    });
  }, [me, navigate])

  useEffect(() => {
    const withoutSubscriptionPages = ['/account']

    if ((me?.subscription?.status !== 'active' || !me?.subscription) && !withoutSubscriptionPages.some(page => location.pathname.includes(page))) {
      goToDashboard();
    }
  }, [me, navigate, goToDashboard, location.pathname])

  const goTo = (path: string) => {
    switch (path) {
      case '/dashboard':
        goToDashboard();
        break;
      default:
        break;
    }
  }

  return (
    <main className="max-w-screen-xl mx-auto border-x border-neutral-300 h-screen bg-[url('/dashboard-bg.png')]">
      <Header account={me} handleSignOut={handleSignOut} goTo={goTo} />
      <div className="w-full overflow-y-auto  h-[calc(100vh-5rem)]">
        <Outlet />
      </div>
    </main>
  )
}