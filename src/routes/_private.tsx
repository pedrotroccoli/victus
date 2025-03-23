import PrivateLayout from '@/pages/_private-layout';
import { baseApi } from '@/services/api';
import { getToken } from '@/services/auth/services';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_private')({
  component: PrivateLayout,
  beforeLoad: async () => {
    const token = getToken();

    if (!token) {
      throw redirect({ to: '/sign-in' });
    }

    // Session Management

    if (!baseApi.defaults.headers.common.Authorization) {
      baseApi.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  },
})

