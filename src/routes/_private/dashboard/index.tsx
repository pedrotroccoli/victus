import { Home } from '@/pages/dashboard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/dashboard/')({
  component: Home,
})
