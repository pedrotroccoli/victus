'use client';

import { Auth0Provider as A0Provider } from "@auth0/auth0-react";

export const Auth0Provider = ({ children }: { children: React.ReactNode }) => {
  return      (
  <A0Provider
  domain="dev-mk8k2aspaux7v0r0.us.auth0.com"
  clientId="FsWNS57qqRmtLGsHvZmOV7h3LyJdClyE"
  authorizationParams={{
    redirect_uri: typeof window !== 'undefined' && window?.location?.origin || '',
  }}
>
    {children}
  </A0Provider>
  );
}