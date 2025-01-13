import { SignUpPage } from '@/pages/sign-up'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/(public)/_auth/sign-up/')({
  component: SignUpPage,
})
