import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import KanbanBoard from './KanbanBoard';

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
              <Switch>
                <Route path="/kanban" component={KanbanBoard} />
                {/* Otras rutas si las tienes */}
              </Switch>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default AppLayout;
