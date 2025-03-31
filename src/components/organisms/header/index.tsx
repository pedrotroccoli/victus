import { LogoWithText } from "@/assets/logo-with-text";
import { AccountAvatar } from "@/features/account/components/ions";
import { useMemo } from "react";

export interface HeaderProps {
  account: Account;
  handleSignOut: () => void;
  goTo: (path: string) => void;
}

export const Header = ({ account, handleSignOut, goTo }: HeaderProps) => {

  const formattedShortname = useMemo(() => {
    if (!account) return 'X';

    const divided = account.name.split(' ').slice(0, 2).map((item: string) => String(item[0]).toUpperCase()).join('');

    return divided;
  }, [account])



  return (
    <header className="w-full border-neutral-300 border-b bg-white h-20">
      <div className="flex items-center justify-between max-w-screen-lg mx-auto px-4 sm:px-8 w-full h-full">
        <div className="flex items-center">
          <LogoWithText className="max-w-20" />
        </div>

        <div className="">
          <AccountAvatar shortname={formattedShortname} signOut={handleSignOut} goTo={goTo} />
        </div>
      </div>
    </header>
  )
}