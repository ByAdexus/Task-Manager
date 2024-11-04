import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import KanbanBoard from '../KanbanBoard/KanbanBoard'; // Importa el nuevo componente KanbanBoard

function AppLayout() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6 bg-gray-100">
            <Switch>
              <Route path="/kanban" component={KanbanBoard} />
              {/* Otras rutas si las tienes */}
            </Switch>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default AppLayout;
