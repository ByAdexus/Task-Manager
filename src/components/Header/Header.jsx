import { useState } from 'react';

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-lg">
      <h1 className="text-xl font-bold">Kanban Board</h1>
      <div className="relative">
        <button onClick={toggleDropdown} className="flex items-center p-2">
          <span className="material-icons">account_circle</span>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 w-48 mt-2 bg-white border rounded-md shadow-lg">
            <ul>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Share Project</li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Log out</li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
