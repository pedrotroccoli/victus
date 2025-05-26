'use client';

import { InstagramLogo } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { Grid } from "../grid";
import { Button } from "../ui/button";

/**
 * 
 * @returns 
 *fill: rgba(255, 255, 255, 0.80);

stroke-width: 1px;
stroke: var(--Tailwind-neutral-300, #D4D4D4);
filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.05));

backdrop-filter: blur(100px); 
 */

export const Header = () => {
  const t = useTranslations('header');

  return (
    <div className="h-24 z-50">
      <Grid></Grid>
      <div className="fixed top-2 md:top-8 left-0 right-0 z-[100] grid-container">
        <header className="shadow-xs h-16  bg-white border border-neutral-200 rounded-md px-6 backdrop-blur-sm drop-shadow-md">
          <div className="h-full flex items-center justify-between">
            <Link href="/">
              <Image src="/brain-logo.svg" alt="Victus Journal" width={32} height={32} />
            </Link>

            <div className='flex gap-4 items-center'>
              <a className="hidden md:block text-black" href="https://www.instagram.com/victusjournal/" target="_blank" rel="noopener noreferrer">
                <InstagramLogo size={24} />
              </a>
              <div className="w-1.5 h-1.5 border border-neutral-300 rounded-[1px] hidden md:block"></div>
              <a href="https://app.victusjournal.com/sign-in" target="_blank" rel="noopener noreferrer">
                <Button className='w-auto px-3 py-1.5 md:px-6 md:py-2 font-xs rounded-md border-black bg-white text-black' variant='outline'>
                  {t('button.access')}
                </Button>
              </a>
              <Link href="/plans">
                <Button className='w-auto px-3 py-1.5 md:px-6 md:py-2 rounded-md'>
                  {t('button.plans')}
                </Button>
              </Link>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};