import PlansPage from '@/pages/_private-layout/account/plans'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/account/_layout/plans/')({
  component: PlansPage,
})
