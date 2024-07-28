'use client';

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

export default function SignIn() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) {
      loginWithRedirect();
    } else {
      window.location.href = 'https://app.victusjournal.com';
    }
  }, [isAuthenticated, loginWithRedirect]);

  return (
    <div/>
  );
}