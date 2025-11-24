import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'
import { CarritoProvider } from './context/CarritoContext.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId= "84927553240-a025ucs2d1jcaq9kqk2a9mov5mm4ka97.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={clientId}>
        <CarritoProvider>
          <App />
        </CarritoProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
