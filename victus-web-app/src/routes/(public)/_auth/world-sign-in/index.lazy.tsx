import { WorldSignInPage } from '@/pages/world-sign-in';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/(public)/_auth/world-sign-in/')({
  component: WorldSignInPage,
});

