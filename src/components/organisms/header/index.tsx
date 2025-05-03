import { LogoWithText } from "@/assets/logo-with-text";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AccountAvatar } from "@/features/account/components/ions";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export interface HeaderProps {
  account: Account;
  handleSignOut: () => void;
  goTo: (path: string) => void;
}

export const Header = ({ account, handleSignOut, goTo }: HeaderProps) => {
  const sidebar = useSidebar();

  const formattedShortname = useMemo(() => {
    if (!account || !account.name) return 'X';

    const divided = account.name.split(' ').slice(0, 2).map((item: string) => String(item[0]).toUpperCase()).join('');

    return divided;
  }, [account])



  return (
    <header className="w-full border-neutral-300 border-b bg-white h-20 relative">
      <div
        className={cn(
          "flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-8 w-full h-full",
          sidebar.open && "justify-end"
        )}
      >
        <div className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2",
          sidebar.open && "sm:hidden"
        )}>
          <SidebarTrigger />
        </div>
        {!sidebar.open && (
          <div className="flex items-center">
            <LogoWithText className="max-w-16" />
          </div>
        )}

        <div className="flex items-center">
          {/* <button className="flex items-center justify-center gap-1 h-10 w-16 rounded-full">
            <Fire size={24} />
            <p className="text-sm font-medium font-[Recursive]">0</p>
          </button>
          <div className="w-px h-4 bg-neutral-300 ml-2 mr-4"></div> */}
          <AccountAvatar shortname={formattedShortname} signOut={handleSignOut} goTo={goTo} />
        </div>
      </div>
    </header>
  )
}