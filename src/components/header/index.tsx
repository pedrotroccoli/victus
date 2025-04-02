'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export const Header = () => {
  return (
    <header className="shadow-md h-16">
      <div className="max-w-screen-lg mx-auto h-full flex items-center justify-between px-8">
        <div>
          <Image src="/logo-with-text.svg" alt="Victus Journal" width={80} height={24} />
        </div>

        <div className='flex gap-4 items-center'>
          <Link href="/plans">
            <Button className='w-32 h-8' variant='outline'>
              Ver planos
            </Button>
          </Link>

          <Button className='w-32 h-8 font-xs' onClick={() => window.open('https://app.victusjournal.com/sign-in', '_blank')}>
            Acessar
          </Button>
        </div>
      </div>
    </header>
  );
};