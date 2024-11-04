import Header from "./components/Header/Header.jsx";
import KanbanBoard from "./components/KanbanBoard/KanbanBoard.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-col">
        <Sidebar />
          <KanbanBoard />
      </div>
    </div>
  );
}

export default App;
