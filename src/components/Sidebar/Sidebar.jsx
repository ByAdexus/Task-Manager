import SidebarItem from './SidebarItem';

function Sidebar() {
  return (
    <aside className="bg-gray-100 border border-white rounded-lg w-64 h-screen p-4">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">Rene</span>
        </div>
        <h2 className="ml-3 font-semibold text-xl">TaskMaster</h2>
      </div>
      <nav>
        <SidebarItem text="Dashboard" />
        <SidebarItem text="My tasks" active />
        <SidebarItem text="Notifications" />
      </nav>
      <div className="mt-auto">
        <SidebarItem text="Settings" />
        <SidebarItem text="Log out" />
      </div>
    </aside>
  );
}

export default Sidebar;
