import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import React from 'react'
import ReactDOM from 'react-dom/client'
import packageJson from '../package.json'
import { Toaster } from './components/ui/sonner'
import './globals.css'
import { routeTree } from './routeTree.gen'

// Import package version
console.log('v:', packageJson['version']);

// Import the generated route tree

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const queryClient = new QueryClient();


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position='top-center' richColors />
    </QueryClientProvider>
  </React.StrictMode>,
)
