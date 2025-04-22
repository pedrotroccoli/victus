import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { BookOpenText, ChartLine, Chat, Gear } from "@phosphor-icons/react"
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router"

import { LogoWithText } from "@/assets/logo-with-text"
import { Header } from "@/components/organisms/header"
import { useMe } from "@/services/auth"
import { signOut } from "@/services/auth/services"
import { useCallback, useRef } from "react"
import packageJson from "../../../../package.json"

import MrHabbit from "@/assets/rabbit.png"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "sonner"

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

  const onClickSupport = () => {
    const message = encodeURIComponent(`Olá, gostaria de falar com o suporte. Meu nome é ${me?.name} e meu email é ${me?.email}`);

    window.open(`https://wa.me/5591989407261?text=${message}`, '_blank');

    toast.success('Mensagem enviada com sucesso!')
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
        <SidebarContent className="bg-white px-2 pt-10">
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
                    <SidebarMenuButton className={cn("text-neutral-500", pathname === "/analytics" && "text-black border border-black")}>
                      <ChartLine size={16} weight="bold" />
                      Analytics
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem title="Configurações">
                  <Link to="/account/general">
                    <SidebarMenuButton className={cn("text-neutral-500", pathname === "/account/general" && "text-black border  border-black")}>
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
          <div className="border-x border-neutral-300 min-h-full  bg-[url('/dashboard-bg.png')] bg-cover bg-repeat relative">
            <Outlet />
          </div>
          <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-16">
            <Popover>
              <HoverCard openDelay={200} closeDelay={0}>
                <HoverCardTrigger asChild>
                  <PopoverTrigger asChild>
                    <button className="w-12 h-12 sm:w-16 sm:h-16 bg-white border border-neutral-300 rounded-full flex items-center justify-center shadow-2xl">
                      <img src={MrHabbit} alt="Mr Habbit" className="w-10 h-10 sm:w-14 sm:h-14 rounded-full p-1" />
                    </button>
                  </PopoverTrigger>
                </HoverCardTrigger>
                <HoverCardContent className="bg-black text-white shadow-2xl px-2 py-1 w-auto h-auto text-sm max-w-32 text-center">
                  Converse com Mr. Habbit
                </HoverCardContent>
              </HoverCard>
              <PopoverContent className="p-0 max-w-[22rem] w-full" side="top" align="end">
                <ul className="grid divide-y divide-neutral-300 ">
                  <li >
                    <button className="w-full flex items-center gap-4 px-4 py-2.5 text-sm font-[Recursive] bg-neutral-100 opacity-50 transition-colors text-left hover:cursor-not-allowed" disabled>
                      <img src={MrHabbit} alt="Mr Habbit" className="w-6 h-6 rounded-full border border-neutral-300" />
                      Converse com Mr. Habbit
                      <span className="text-xs text-yellow-500 bg-yellow-500/20 p-1 rounded-full border border-yellow-500 text-center">Em breve</span>
                    </button>
                  </li>
                  <li >
                    <button className="w-full flex items-center gap-4 px-4 py-2.5 text-sm font-[Recursive] hover:bg-neutral-100 transition-colors text-left" onClick={onClickSupport}>
                      <div className="w-6 h-6 rounded-full bg-white border border-neutral-300 flex items-center justify-center">
                        <Chat size={14} weight="bold" />
                      </div>
                      Falar com o suporte
                    </button>
                  </li>
                </ul>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </main>
    </SidebarProvider>
  )
}