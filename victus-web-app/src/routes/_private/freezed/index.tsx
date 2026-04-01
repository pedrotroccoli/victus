import FreezedPage from '@/pages/_private-layout/freezed'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/freezed/')({
  component: FreezedPage,
})
