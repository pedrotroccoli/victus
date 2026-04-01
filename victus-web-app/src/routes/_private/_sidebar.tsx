import { SidebarLayout } from '@/pages/_private-layout/_sidebar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/_sidebar')({
  component: SidebarLayout,
})
