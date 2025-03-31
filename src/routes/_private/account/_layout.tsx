import { AccountLayout } from '@/pages/_private-layout/account/_account-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/account/_layout')({
  component: AccountLayout,
})

