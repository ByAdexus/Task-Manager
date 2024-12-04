import React, { useState } from 'react'; // Importar React y useState
import { Link } from 'react-router-dom';


function Sidebar() {
  const [visible, setVisible] = useState(true); // Definir el estado 'visible'

  return (
    
<div
  className={`bg-white shadow-lg w-60 z-30 h-screen transform transition-transform duration-300 ${visible ? 'translate-x-0' : '-translate-x-full'}
    dark:bg-gray-800 text-black dark:text-white dark:shadow-white overflow-y-auto sticky top-0`}
  style={{ transition: 'transform 0.3s ease-in-out' }}
>
      <div className="p-4">
      
      <div className="flex flex-col h-full justify-between p-4">
        {/* Contenido del Sidebar */}
        <div>

          <nav>

          <ul>
        {/* Enlaces del Sidebar */}
        <li className="p-3 flex items-center text-gray-600 hover:bg-yellow-200 hover:text-black rounded dark:text-white dark:hover:bg-yellow-main">
          <Link to="/Dashboard" className="flex items-center w-full">
            <i className="pi pi-chart-line mr-2"></i> Dashboard
          </Link>
        </li>
        <li className="p-3 flex items-center text-gray-600 hover:bg-yellow-200 hover:text-black rounded dark:text-white dark:hover:bg-yellow-main">
          <Link to="/tasks" className="flex items-center w-full">
            <i className="pi pi-check-circle mr-2"></i> Mis tableros
          </Link>
        </li>
        <li className="p-3 flex items-center text-gray-600 hover:bg-yellow-200 hover:text-black rounded dark:text-white dark:hover:bg-yellow-main">
          <Link to="/Productivity" className="flex items-center w-full">
            <i className="pi pi-chart-bar mr-2"></i> Progresos
          </Link>
        </li>
        <li className="p-3 w-full flex items-center text-gray-600 hover:bg-yellow-200 hover:text-black rounded mb-2 dark:text-white dark:hover:bg-yellow-main">
        <Link to="/settings" className="flex items-center w-full">
            <i className="pi pi-cog mr-2"></i> Settings
          </Link>
        </li>
      </ul>

          </nav>
        </div>

        {/* Pie con configuraciones y logout */}
        <div>
          <button className="p-3 w-full flex items-center text-gray-600 hover:bg-yellow-200 hover:text-black rounded dark:text-white dark:hover:bg-yellow-main">
            <i className="pi pi-sign-out mr-2"></i> Log out
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Sidebar;
