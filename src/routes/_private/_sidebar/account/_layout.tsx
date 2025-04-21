import { AccountLayout } from '@/pages/_private-layout/account/_account-layout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/_sidebar/account/_layout')({
  component: AccountLayout,
})
