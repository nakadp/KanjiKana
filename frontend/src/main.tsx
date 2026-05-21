import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import VConsole from 'vconsole'

// Initialize vConsole for mobile debugging
if (import.meta.env.DEV) {
  new VConsole();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
