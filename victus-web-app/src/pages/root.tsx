import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { MiniKit } from "@worldcoin/minikit-js";
import Eruda from 'eruda';
import { useEffect } from "react";

export const RootPage = () => {
  useEffect(() => {
    if (MiniKit.isInstalled() && process.env.NODE_ENV === 'development') {
      Eruda.init()
    }

  }, []);
  return (
    (
      <>
        <Outlet />
        {process.env.NODE_ENV === 'development' && <TanStackRouterDevtools />}
      </>
    )
  )
}