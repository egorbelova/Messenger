// import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProviders } from './providers/AppProviders';

ReactDOM.createRoot(document.body!).render(
  // <React.StrictMode>
  <AppProviders>
    <App />
  </AppProviders>
  // </React.StrictMode>
);
