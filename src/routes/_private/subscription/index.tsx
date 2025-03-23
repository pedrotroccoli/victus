import Subscription from '@/pages/_private-layout/subscription'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/subscription/')({
  component: Subscription,
})

