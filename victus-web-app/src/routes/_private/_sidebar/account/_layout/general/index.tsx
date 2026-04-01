import { AccountGeneralPage } from '@/pages/_private-layout/_sidebar/account/general'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_private/_sidebar/account/_layout/general/',
)({
  component: AccountGeneralPage,
})
