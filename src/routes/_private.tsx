import PrivateLayout from '@/pages/_private-layout';
import { baseApi } from '@/services/api';
import { getToken } from '@/services/auth/services';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { MiniKit } from '@worldcoin/minikit-js';

export const Route = createFileRoute('/_private')({
  component: PrivateLayout,
  beforeLoad: async () => {
    const token = getToken();

    if (!token) {
      if (MiniKit.isInstalled()) {
        throw redirect({ to: '/world-sign-in' });
      } else {
        throw redirect({ to: '/sign-in' });
      }
    }

    // Session Management

    if (!baseApi.defaults.headers.common.Authorization) {
      baseApi.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  },
})

