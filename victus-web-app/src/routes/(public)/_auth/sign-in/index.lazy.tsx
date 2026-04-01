import { SignInPage } from '@/pages/sign-in'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/(public)/_auth/sign-in/')({
  component: SignInPage,
})
