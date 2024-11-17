'use client';

import { Auth0Provider as A0Provider } from "@auth0/auth0-react";

export const Auth0Provider = ({ children }: { children: React.ReactNode }) => {
  return      (
  <A0Provider
  domain="dev-dlb8fa4arobdavem.us.auth0.com"
  clientId="ViYknU38DPpdWodYW9sejBBzy0lxZsIH"
  authorizationParams={{
    redirect_uri: typeof window !== 'undefined' && window?.location?.origin || '',
  }}
>
    {children}
  </A0Provider>
  );
}