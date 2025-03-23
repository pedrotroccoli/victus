import { Header } from "@/components/organisms/header";
import { useMe } from "@/services/auth";
import { signOut } from "@/services/auth/services";
import { Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export default function PrivateLayout() {
  const { data: me } = useMe()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut();

    navigate({
      to: '/',
    });
  }

  useEffect(() => {
    if (me?.subscription?.status !== 'active' || !me?.subscription) {
      navigate({
        to: '/subscription',
      });
    }
  }, [me, navigate])

  return (
    <main className="max-w-screen-xl mx-auto border-x border-neutral-300 h-screen bg-[url('/dashboard-bg.png')]">
      <Header account={me} handleSignOut={handleSignOut} />
      <div className="w-full overflow-y-auto  h-[calc(100vh-5rem)]">
        <Outlet />
      </div>
    </main>
  )
}