import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Asegúrate de que la ruta sea correcta
import './index.css'; // Asegúrate de importar tu CSS de Tailwind aquí
import './App.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
