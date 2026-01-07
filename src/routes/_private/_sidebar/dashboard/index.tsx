import { Home } from '@/pages/_private-layout/_sidebar/dashboard'
import { DashboardProvider } from '@/pages/_private-layout/_sidebar/dashboard/providers/dashboard-provider'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/_sidebar/dashboard/')({
  component: () => <DashboardProvider><Home /></DashboardProvider>,
})
