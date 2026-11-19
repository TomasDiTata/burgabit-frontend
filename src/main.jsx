import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.jsx'

// BrowserRouter conecta la app con la barra de direcciones: cada pantalla tiene su URL,
// y "Atrás" y "Adelante" del navegador se mueven entre las pantallas de BurgaBit.
// useTransitions={false}: el cambio de dirección se aplica junto con los demás cambios de estado.
// Si no, al cerrar sesión se vería un instante el error 401 (ya sin sesión, pero todavía en la dirección vieja).
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter useTransitions={false}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
