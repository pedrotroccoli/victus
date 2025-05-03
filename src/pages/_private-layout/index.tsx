import { useMe } from "@/services/auth";
import { Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef } from "react";

export default function PrivateLayout() {
  const { data: me } = useMe()
  const navigate = useNavigate()
  const location = useLocation()
  const isLoggingOut = useRef(false);

  const goToDashboard = useCallback(() => {
    if (me?.connected_providers?.includes('worldapp')) {
      navigate({
        to: '/dashboard',
        replace: true,
      })

      return;
    }

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

    if (me?.connected_providers?.includes('worldapp')) {
      return;
    }

    if (!me) return;

    const withoutSubscriptionPages = ['/account', '/freezed', '/checkout']

    if ((me?.subscription?.status !== 'active' || !me?.subscription) && !withoutSubscriptionPages.some(page => location.pathname.includes(page))) {
      goToDashboard();
    }
  }, [me, navigate, goToDashboard, location.pathname])

  return (
    <div className="w-full h-full">
      <Outlet />
    </div>
  )
}