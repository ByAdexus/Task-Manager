import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import KanbanBoard from './KanbanBoard';
import Dashboard from '../Dashboard';

function AppLayout() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Contenido Principal */}
        <div className="flex-1 flex flex-col ml-64"> {/* Ajuste margen izquierdo para evitar superposición */}
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="flex justify-center">
              <Routes>
                {/* Definición de rutas */}
                <Route path="/kanban" element={<KanbanBoard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Ruta para manejo de ruta no encontrada */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

// Componente para la ruta no encontrada
function NotFound() {
  const location = useLocation(); // Hook para obtener la ubicación actual
  console.log(`Ruta no encontrada: ${location.pathname}`);
  return <h2>404 - Página no encontrada</h2>;
}

export default AppLayout;
