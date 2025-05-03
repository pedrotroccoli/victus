import { SignInPage } from '@/pages/sign-in'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { MiniKit } from '@worldcoin/minikit-js'

export const Route = createFileRoute('/')({
  component: SignInPage,
  beforeLoad: async () => {
    if (MiniKit.isInstalled()) {
      throw redirect({
        to: '/world-sign-in',
      })
    }
  },
  // You can keep the loader for other purposes or remove it if not needed
})
