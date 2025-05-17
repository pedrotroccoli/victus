import { Button } from "@/components/ui/button";
import Flag from "react-world-flags";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";
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
        <Avatar className="cursor-pointer border hover:border-black duration-200 transition-colors">
          <AvatarImage src={undefined} />
          <AvatarFallback>
            {shortname}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild className="h-auto">
          <Button variant="ghost" className="w-full justify-start py-1 cursor-pointer" onClick={() => goTo('/dashboard')}>
            Dashboard
          </Button>
        </DropdownMenuItem>
          <DropdownMenuSub >
            <DropdownMenuSubTrigger>
              <span>{t('language')}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={changeLanguage('pt-BR')}>
                <Flag code="BR" size={16} width={16} />
                <span>{t('portuguese')}</span>
                {currentLanguage === 'pt-BR' && <Check size={16} />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={changeLanguage('en')}>
                <Flag code="US" size={16} width={16} />
                <span>{t('english')}</span>
                {currentLanguage === 'en' && <Check size={16} />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={changeLanguage('es')}>
                <Flag code="ES" size={16} width={16} />
                <span>{t('spanish')}</span>
                {currentLanguage === 'es' && <Check size={16} />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        <DropdownMenuItem asChild className="h-auto">
          <Button variant="ghost" className="w-full justify-start py-1 cursor-pointer" onClick={signOut}>
            {t('logout')}
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
