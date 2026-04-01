import PlansPage from '@/pages/_private-layout/_sidebar/account/plans'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_private/_sidebar/account/_layout/plans/',
)({
  component: PlansPage,
})
