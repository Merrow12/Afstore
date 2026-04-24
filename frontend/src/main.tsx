import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#0f2a30',
          border: '1px solid #e0f0f5',
          borderRadius: '12px',
          fontFamily: "'Roboto', sans-serif",
          fontSize: '14px',
          boxShadow: '0 4px 20px rgba(98,182,203,0.15)',
        },
        success: {
          iconTheme: { primary: '#62b6cb', secondary: '#fff' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#fff' },
        },
      }}
    />
    <App />
  </StrictMode>,
)