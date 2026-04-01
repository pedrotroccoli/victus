import { Analytics } from '@/pages/_private-layout/_sidebar/analytics'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/_sidebar/analytics/')({
  component: Analytics,
})

