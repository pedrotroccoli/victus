import { useMe } from "@/services/auth";
import { signOut } from "@/services/auth/services";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef } from "react";

export default function PrivateLayout() {
  const { data: me } = useMe()
  const navigate = useNavigate()
  const location = useLocation()
  const isLoggingOut = useRef(false);

  const handleSignOut = async () => {
    isLoggingOut.current = true;

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
    if (isLoggingOut.current) return;

    const withoutSubscriptionPages = ['/account', '/freezed', '/checkout']

    console.log(me, (me?.subscription?.status !== 'active' || !me?.subscription), !withoutSubscriptionPages.some(page => location.pathname.includes(page)));

    if (!me) return;

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
    <div className="w-full h-full">
      <Outlet />
    </div>
  )
}