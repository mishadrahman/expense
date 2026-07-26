import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { PWAProvider } from './context/PWAContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PWAProvider>
      <App />
    </PWAProvider>
  </StrictMode>
);
