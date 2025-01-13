import { getToken } from '@/services/auth/services';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/(public)/_auth')({
  component: Outlet,
  beforeLoad: async () => {
    const token = getToken();

    if (token) {
      throw redirect({ to: '/dashboard' });
    }
  },
})

