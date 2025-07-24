// js/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js'; // Let op de .js extensie

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
