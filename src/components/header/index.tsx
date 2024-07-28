'use client';

import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "../ui/button";

export const Header = () => {
  const { loginWithRedirect, isAuthenticated, logout,  } = useAuth0();
  return (
    <header className="shadow-md h-16">
      <div className="max-w-screen-lg mx-auto h-full flex items-center justify-between px-8">
        <div></div>

          <div className='flex gap-4 items-center'>
            <Button className='w-32 h-8' variant='outline'>
              Crie sua conta
            </Button>

            <Button className='w-32 h-8 font-xs' onClick={() => loginWithRedirect()}>
              Acessar
            </Button>

{isAuthenticated && (
  <>

<div className='h-6 bg-neutral-400 w-0.5 mx-1'>

</div>

            <Button className='w-16 h-8 font-xs' onClick={() => logout()}>
              Sair
            </Button>
  </>
)}


          </div>
        </div>
      </header>
  );
};