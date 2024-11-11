import React, { useState } from 'react'; // Importar React y useState
import { Link } from 'react-router-dom';

function Sidebar() {
  const [visible, setVisible] = useState(true); // Definir el estado 'visible'

  return (
    <div
      className={`bg-white shadow-lg w-64 h-full fixed left-0 top-0 z-30 transform transition-transform duration-300 ${visible ? 'translate-x-0' : '-translate-x-full'}`}
      style={{ transition: 'transform 0.3s ease-in-out' }}
    >
      <div className="flex flex-col h-full justify-between p-4">
        {/* Contenido del Sidebar */}
        <div>
          {/* Título y navegación */}
          <div className="flex items-center mb-4">
            <div className="bg-yellow-main text-white p-2 rounded-full mr-3">AZ</div>
            <span className="font-semibold text-lg">Task-Magnament</span>
          </div>
          <nav>

          <ul>
        {/* Enlaces del Sidebar */}
        <li className="p-3 flex items-center text-gray-600 hover:bg-yellow-200 hover:text-black rounded">
          <Link to="/Dashboard" className="flex items-center w-full">
            <i className="pi pi-chart-line mr-2"></i> Dashboard
          </Link>
        </li>
        <li className="p-3 flex items-center text-gray-600 hover:bg-yellow-200 hover:text-black rounded">
          <Link to="/Tasks" className="flex items-center w-full">
            <i className="pi pi-check-circle mr-2"></i> My Tasks
          </Link>
        </li>
        <li className="p-3 flex items-center text-gray-600 hover:bg-yellow-200 hover:text-black rounded">
          <Link to="/Productivity" className="flex items-center w-full">
            <i className="pi pi-chart-bar mr-2"></i> Productivity Charts
          </Link>
        </li>
      </ul>

          </nav>
        </div>

        {/* Pie con configuraciones y logout */}
        <div>
          <button className="p-3 w-full flex items-center text-gray-600 hover:bg-yellow-200 hover:text-black rounded mb-2">
            <i className="pi pi-cog mr-2"></i> Settings
          </button>
          <button className="p-3 w-full flex items-center text-gray-600 hover:bg-yellow-200 hover:text-black rounded">
            <i className="pi pi-sign-out mr-2"></i> Log out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
