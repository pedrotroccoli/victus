import Subscription from '@/pages/_private-layout/_sidebar/account/subscription'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_private/_sidebar/account/_layout/subscription/',
)({
  component: Subscription,
})
