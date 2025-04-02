import { CheckoutPage } from '@/pages/_private-layout/checkout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/checkout/')({
  component: CheckoutPage,
})

