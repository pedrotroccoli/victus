'use client';

import { InstagramLogo } from "@phosphor-icons/react";
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
  return (
    <div className="h-24 z-50">
      <Grid></Grid>
      <div className="fixed top-8 left-0 right-0 z-[100] grid-container">
        <header className="shadow-xs h-16  bg-white border border-neutral-200 rounded-md px-6 backdrop-blur-sm drop-shadow-md">
          <div className="h-full flex items-center justify-between">
            <div>
              <Image src="/brain-logo.svg" alt="Victus Journal" width={32} height={32} />
            </div>

            <div className='flex gap-4 items-center'>
              <a>
                <InstagramLogo size={24} />
              </a>
              <div className="w-1.5 h-1.5 border border-neutral-300 rounded-[1px]"></div>
              <Button className='w-auto px-6 py-2 font-xs rounded-md border-black' onClick={() => window.open('https://app.victusjournal.com/sign-in', '_blank')} variant='outline'>
                Acessar
              </Button>
              <Link href="/plans">
                <Button className='w-auto px-6 py-2 rounded-md'>
                  Ver planos
                </Button>
              </Link>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};