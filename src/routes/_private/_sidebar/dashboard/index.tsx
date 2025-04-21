import { Home } from '@/pages/_private-layout/dashboard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/_sidebar/dashboard/')({
  component: Home,
})
