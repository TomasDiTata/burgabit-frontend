import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'

// BrowserRouter conecta la app con la barra de direcciones: cada pantalla tiene su URL,
// y "Atrás" y "Adelante" del navegador se mueven entre las pantallas de BurgaBit.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
