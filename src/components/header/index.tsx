'use client';

import { Button } from "../ui/button";

export const Header = () => {
  return (
    <header className="shadow-md h-16">
      <div className="max-w-screen-lg mx-auto h-full flex items-center justify-between px-8">
        <div></div>

        <div className='flex gap-4 items-center'>
          <Button className='w-32 h-8' variant='outline' onClick={() => window.open('https://app.victusjournal.com/sign-up', '_blank')}>
            Crie sua conta
          </Button>

          <Button className='w-32 h-8 font-xs' onClick={() => window.open('https://app.victusjournal.com/sign-in', '_blank')}>
            Acessar
          </Button>
        </div>
      </div>
    </header>
  );
};