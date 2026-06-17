import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import WebApp from '@twa-dev/sdk';
import { Buffer } from 'buffer';

// Polyfills para TON
window.Buffer = Buffer;

// Inicializar Telegram WebApp
WebApp.ready();

// En Android/TMA, es vital que el manifest esté en HTTPS si se usa en producción.
// Para local, usamos la URL actual.
const manifestUrl = new URL('tonconnect-manifest.json', window.location.href).href;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>,
);
