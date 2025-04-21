import { AccountGeneralPage } from '@/pages/_private-layout/account/general'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_private/_sidebar/account/_layout/general/',
)({
  component: AccountGeneralPage,
})
