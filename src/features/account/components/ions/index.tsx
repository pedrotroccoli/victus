import { Button } from "@/components/ui/button";
import Flag from "react-world-flags";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Check, Globe, LayoutDashboard, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AccountAvatarProps {
  shortname: string;
  signOut: () => void;
  goTo: (path: string) => void;
}

export const AccountAvatar = ({ shortname, signOut, goTo }: AccountAvatarProps) => {
  const { t, i18n } = useTranslation('common');

  const currentLanguage = i18n.resolvedLanguage;

  const changeLanguage = (language: string) => () => {
    i18n.changeLanguage(language);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer border hover:border-black duration-200 transition-colors size-8">
          <AvatarImage src={undefined} />
          <AvatarFallback>
            {shortname}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild className="h-auto">
          <Button variant="ghost" className="w-full justify-start py-1 cursor-pointer gap-2" onClick={() => goTo('/dashboard')}>
            <LayoutDashboard size={14} />
            Dashboard
          </Button>
        </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              <Globe size={14} className="mr-2" />
              <span>{t('language')}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem className="cursor-pointer" onClick={changeLanguage('pt-BR')}>
                <Flag code="BR" size={16} width={16} />
                <span>{t('portuguese')}</span>
                {currentLanguage === 'pt-BR' && <Check size={16} />}
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={changeLanguage('en')}>
                <Flag code="US" size={16} width={16} />
                <span>{t('english')}</span>
                {currentLanguage === 'en' && <Check size={16} />}
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={changeLanguage('es')}>
                <Flag code="ES" size={16} width={16} />
                <span>{t('spanish')}</span>
                {currentLanguage === 'es' && <Check size={16} />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        <DropdownMenuItem asChild className="h-auto">
          <Button variant="ghost" className="w-full justify-start py-1 cursor-pointer gap-2" onClick={signOut}>
            <LogOut size={14} />
            {t('logout')}
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
