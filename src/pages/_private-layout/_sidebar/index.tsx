import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { BookOpenText, ChartLine, Gear } from "@phosphor-icons/react"
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router"

import { LogoWithText } from "@/assets/logo-with-text"
import { Header } from "@/components/organisms/header"
import { useMe } from "@/services/auth"
import { signOut } from "@/services/auth/services"
import { useCallback, useRef } from "react"
import packageJson from "../../../../package.json"

export const SidebarLayout = () => {
  const { data: me } = useMe()
  const { pathname } = useLocation()
  const navigate = useNavigate()
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
    <SidebarProvider>
      <Sidebar className="">
        <SidebarHeader className="bg-white h-20 border-b border-neutral-300" >
          <div className="flex w-full h-full justify-between items-center px-2 ">
            <LogoWithText className="max-w-16" />

            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent className="bg-white px-2">
          <SidebarGroup >
            <SidebarGroupLabel>
              Geral
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-3">
                <SidebarMenuItem title="Jornal">
                  <Link to="/dashboard">
                    <SidebarMenuButton className={cn("text-neutral-500", pathname === "/dashboard" && "text-black border border-black")}>
                      <BookOpenText size={16} weight="bold" />
                      Jornal
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem title="Analytics">
                  <Link to="/analytics">
                    <SidebarMenuButton className={cn("text-neutral-500", pathname === "/analytics" && "text-black border font-bold border-black")}>
                      <ChartLine size={16} weight="bold" />
                      Analytics
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem title="Configurações">
                  <Link to="/account/general">
                    <SidebarMenuButton>
                      <Gear size={16} weight="bold" />
                      Configurações
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="bg-white" >
          <SidebarMenu className="mt-4">
            <p className="text-xs text-neutral-300 text-center">
              v{packageJson.version}
            </p>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <main className="w-full h-full bg-red-20">
        <Header account={me} handleSignOut={handleSignOut} goTo={goTo} />
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="border-x border-neutral-300 min-h-full  bg-[url('/dashboard-bg.png')] bg-cover bg-repeat">
            <Outlet />
          </div>
        </div>
      </main>
    </SidebarProvider>
  )
}