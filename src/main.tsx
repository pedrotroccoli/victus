import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './globals.css'
import { Auth0Provider } from '@auth0/auth0-react'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
  domain="dev-mk8k2aspaux7v0r0.us.auth0.com"
  clientId="FsWNS57qqRmtLGsHvZmOV7h3LyJdClyE"
  authorizationParams={{
    redirect_uri: window.location.origin,
  }}
>
      <App />
    </Auth0Provider>
  </React.StrictMode>,
)
