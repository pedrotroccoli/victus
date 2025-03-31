import Subscription from '@/pages/_private-layout/account/subscription'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/account/_layout/subscription/')(
  {
    component: Subscription,
  },
)
