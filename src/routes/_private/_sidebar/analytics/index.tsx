import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/_sidebar/analytics/')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Hello /_private/_sidebar/analytics/!'
}
