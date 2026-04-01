import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { BookOpenText, ChartLine, Chat, Gear, House, SignOut } from "@phosphor-icons/react"
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router"
import { motion } from "motion/react"
import { SageSupport } from "sage-support"

import { LogoWithText } from "@/assets/logo-with-text"
import { useMe } from "@/services/auth"
import { signOut } from "@/services/auth/services"
import { List } from "@phosphor-icons/react"
import packageJson from "../../../../package.json"

import MrHabbit from "@/assets/rabbit.png"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MiniKit } from "@worldcoin/minikit-js"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

const FloatingSidebarTrigger = () => {
  const { open, toggleSidebar } = useSidebar();

  if (open) return null;

  return (
    <button
      onClick={toggleSidebar}
      className="fixed left-0 top-24 z-50 w-8 h-8 bg-white border border-l-0 border-neutral-300 rounded-r-md flex items-center justify-center hover:bg-neutral-50 transition-colors hidden md:flex"
    >
      <List size={16} weight="bold" />
    </button>
  );
};

export const SidebarLayout = () => {
  const { t } = useTranslation('sidebar');

  const { data: me } = useMe()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate({ to: '/' })
  }

  const onClickSupport = () => {
    const message = encodeURIComponent(t('support.message', { name: me?.name }));

    window.open(`https://wa.me/5591989407261?text=${message}`, '_blank');

    toast.success(t('support.toast_message'))
  }

  return (
    <SidebarProvider defaultOpen={false}>
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
              {t('sidebar.general')}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-3">
                <SidebarMenuItem title={t('sidebar.journal')}>
                  <Link to="/dashboard">
                    <SidebarMenuButton className={cn("text-neutral-500", pathname === "/dashboard" && "text-black border border-neutral-300")}>
                      <BookOpenText size={16} weight="bold" />
                      {t('sidebar.journal')}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem title={t('sidebar.analytics')}>
                  <Link to="/analytics">
                    <SidebarMenuButton className={cn("text-neutral-500", pathname === "/analytics" && "text-black border border-neutral-300")}>
                      <ChartLine size={16} weight="bold" />
                      {t('sidebar.analytics')}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                {!MiniKit.isInstalled() && (
                <SidebarMenuItem title={t('sidebar.settings')}>
                  <Link to="/account/general">
                    <SidebarMenuButton className={cn("text-neutral-500", pathname.includes('/account') && "text-black border border-neutral-300")}>
                      <Gear size={16} weight="bold" />
                      {t('sidebar.settings')}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="bg-white border-t border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-neutral-100 text-neutral-600 text-sm font-medium">
                {me?.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">
                {me?.name}
              </p>
              <p className="text-xs text-neutral-500 truncate">
                {me?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 mt-4 px-2 py-1.5 -mx-2 rounded-md text-sm text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <SignOut size={16} weight="bold" />
            {t('sidebar.logout')}
          </button>
          <p className="text-xs text-neutral-300 text-center mt-4">
            v{packageJson.version}
          </p>
        </SidebarFooter>
      </Sidebar>
      <FloatingSidebarTrigger />
      <main className="w-full h-full bg-white bg-[url('/dashboard-bg.png')] overflow-y-auto bg-repeat bg-cover">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 h-screen">
          <div className="min-h-screen">
            <Outlet />
            <div className="h-20 w-full" />
          </div>
          <nav className="absolute bottom-6 left-1/2 -translate-x-1/2 md:hidden bg-transparent">
            <ul className="flex items-center gap-2 px-2.5 py-1 relative z-10 shadow-2xl rounded-full">
              <div
                className={
                  cn("absolute bottom-0 left-0 w-full h-full bg-white border border-neutral-300 rounded-full px-2.5 py-1 z-[-1] flex items-center",
                    pathname === "/analytics" && "justify-end"
                  )
                }
              >
                <motion.div className="w-10 h-9 bg-black rounded-full" layout transition={{ duration: 0.7, type: "spring", bounce: 0.5 }} />
              </div>
              <li>
                <Link to="/dashboard">
                  <motion.button className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    pathname === "/dashboard" && "text-white"
                  )} >
                    <House size={18} weight="bold" />
                  </motion.button>
                </Link>
              </li>
              <li>
                <Link to="/analytics">
                  <motion.button className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    pathname === "/analytics" && "text-white"
                  )} >
                    <ChartLine size={18} weight="bold" />
                  </motion.button>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-16">
            <Popover>
              <HoverCard openDelay={200} closeDelay={0}>
                <HoverCardTrigger asChild>
                  <PopoverTrigger asChild>
                    <button className="w-12 h-12 sm:w-16 sm:h-16 bg-white border border-neutral-300 rounded-full flex items-center justify-center shadow-2xl">
                      {/* <img src={MrHabbit} alt="Mr Habbit" className="w-10 h-10 sm:w-14 sm:h-14 rounded-full p-1" /> */}
                      <Chat size={24} weight="bold" />
                    </button>
                  </PopoverTrigger>
                </HoverCardTrigger>
                <HoverCardContent className="bg-black text-white shadow-2xl px-2 py-1 w-auto h-auto text-sm max-w-32 text-center">
                  {t('float_button.mr_habbit.talk')}
                </HoverCardContent>
              </HoverCard>
              <PopoverContent className="p-0 max-w-[22rem] w-full" side="top" align="end">
                <ul className="grid divide-y divide-neutral-300 ">
                  <li >
                    <button className="w-full flex items-center gap-4 px-4 py-2.5 text-sm font-[Recursive] bg-neutral-100 opacity-50 transition-colors text-left hover:cursor-not-allowed" disabled>
                      <img src={MrHabbit} alt="Mr Habbit" className="w-6 h-6 rounded-full border border-neutral-300" />
                      {t('float_button.mr_habbit.talk')}
                      <span className="text-xs text-yellow-500 bg-yellow-500/20 p-1 rounded-full border border-yellow-500 text-center">
                        {t('float_button.mr_habbit.coming_soon')}
                      </span>
                    </button>
                  </li>
                  <li >
                    <button className="w-full flex items-center gap-4 px-4 py-2.5 text-sm font-[Recursive] hover:bg-neutral-100 transition-colors text-left" onClick={onClickSupport}>
                      <div className="w-6 h-6 rounded-full bg-white border border-neutral-300 flex items-center justify-center">
                        <Chat size={14} weight="bold" />
                      </div>
                      {t('float_button.support.talk')}
                    </button>
                  </li>
                  {MiniKit.isInstalled() && (
                    
                  <li >
                      <SageSupport projectId={50}>
                        <button className="w-full flex items-center gap-4 px-4 py-2.5 text-sm font-[Recursive] hover:bg-neutral-100 transition-colors text-left">

                        <div className="w-6 h-6 rounded-full bg-white border border-neutral-300 flex items-center justify-center">
                          <Chat size={14} weight="bold" />
                        </div>
                        {t('float_button.sage.talk')}
                        </button>
                      </SageSupport>
                  </li>
                  )}
                </ul>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </main>
    </SidebarProvider>
  )
}
