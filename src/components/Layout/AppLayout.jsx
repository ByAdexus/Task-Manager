import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import TaskList from '../TaskList/TaskList';

function AppLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6 bg-gray-100">
          <TaskList />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
