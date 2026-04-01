import { WorldAppWelcomePage } from '@/pages/_private-layout/world-app-welcome'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private/world-app/welcome/')({
  component: WorldAppWelcomePage,
})

