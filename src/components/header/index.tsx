'use client';

import { Link } from "@/i18n/navigation";
import { CaretDown, CaretUp, SignIn, Tag } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import NextLink from "next/link";
import Flag from 'react-world-flags';
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

const flagByLocale = (locale: string) => {
  return {
    en: () => <Flag code="US" className="w-3 h-3" />,
    es: () => <Flag code="ES" className="w-3 h-3" />,
    pt: () => <Flag code="BR" className="w-3 h-3" />,
  }[locale] || (() => <Flag code="US" className="w-3 h-3" />);
}

interface HeaderProps {
  locale: string;
}

export const Header = ({ locale }: HeaderProps) => {
  const t = useTranslations('header');

  return (
    <div className="h-16 z-50">
      <header className="fixed top-0 left-0 right-0 z-[100] h-16 bg-white border-b border-neutral-200">
        <div className="h-full max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" lang={locale} className="flex items-center gap-2">
            <Image src="/brain-logo.svg" alt="Victus Journal" width={22} height={22} />
            <span className="font-semibold text-sm hidden sm:block">Victus</span>
          </Link>

          {/* Right side actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Language selector */}
            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 px-2 rounded-md flex items-center justify-center gap-1.5 group hover:bg-neutral-100 transition-colors">
                {flagByLocale(locale)()}
                <CaretDown size={10} className="text-neutral-400 group-data-[state=open]:hidden" />
                <CaretUp size={10} className="text-neutral-400 hidden group-data-[state=open]:block" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="z-[110] w-40" align="end">
                <DropdownMenuLabel className="text-xs text-neutral-500">{t('languages.title')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="font-display" asChild>
                  <NextLink href="/pt-BR" lang="pt-BR">
                    <Flag code="BR" className="w-4 h-4" />
                    {t('languages.items.pt')}
                  </NextLink>
                </DropdownMenuItem>
                <DropdownMenuItem className="font-display" asChild>
                  <NextLink href="/es" lang="es">
                    <Flag code="ES" className="w-4 h-4" />
                    {t('languages.items.es')}
                  </NextLink>
                </DropdownMenuItem>
                <DropdownMenuItem className="font-display" asChild>
                  <NextLink href="/en" lang="en">
                    <Flag code="US" className="w-4 h-4" />
                    {t('languages.items.en')}
                  </NextLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Action buttons */}
            <a href="https://app.victusjournal.com/sign-in" target="_blank" rel="noopener noreferrer">
              <Button
                className="h-8 px-3 md:px-4 text-sm font-medium rounded-md border-black bg-white text-black hover:bg-neutral-50 transition-colors flex items-center gap-1.5"
                variant="outline"
              >
                <SignIn size={14} weight="bold" />
                {t('button.access')}
              </Button>
            </a>
            <Link href="/plans" lang={locale}>
              <Button className="h-8 px-3 md:px-4 text-sm font-medium rounded-md bg-black hover:bg-neutral-800 transition-colors flex items-center gap-1.5">
                <Tag size={14} weight="bold" />
                {t('button.plans')}
              </Button>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};
