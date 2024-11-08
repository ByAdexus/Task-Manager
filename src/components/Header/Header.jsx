import { InputText } from 'primereact/inputtext';
import 'primeicons/primeicons.css';
import React, { useState, useEffect } from 'react';
import UserProfile from '../userProfile';
import { storeUserData, getAllUsers } from '../../services/storageService'; // Import getAllUsers function

function Header() {
  const [currentUserId, setCurrentUserId] = useState(null); // Track current user ID
  const [showModal, setShowModal] = useState(false); // Control the visibility of the modal
  const [newUserData, setNewUserData] = useState({ name: '', email: '', image: null }); // Data for creating a new user
  const [users, setUsers] = useState([]); // List of existing users

  // Fetch users from cache on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      const existingUsers = await getAllUsers(); // Get all users stored in cache
      setUsers(existingUsers);
    };
    fetchUsers();
  }, []);

  // Handle selecting or adding a user
  const handleUserSelect = () => {
    setShowModal(true); // Show the modal to either create or select a user
  };

  // Handle creating a new user
  const handleCreateUser = async () => {
    if (newUserData.name && newUserData.email) {
      const userId = `user-${Date.now()}`; // Create a unique ID for the user
      await storeUserData(newUserData, newUserData.image); // Save user data along with the image (if any)
      setCurrentUserId(userId); // Set the newly created user as the current user
      setShowModal(false); // Close the modal
    } else {
      alert('Please fill in the name and email');
    }
  };

  // Handle file change (for profile image)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewUserData(prev => ({ ...prev, image: file })); // Set the image file
    }
  };

  // Handle user pick from the list
  const handleUserPick = (userId) => {
    setCurrentUserId(userId); // Set the selected user as the current user
    setShowModal(false); // Close the modal
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md relative z-20 pl-64">
      {/* Search bar */}
      <div className="flex items-center space-x-2 w-1/3">
        <InputText
          className="p-2 w-full border border-gray-300 rounded-lg"
          placeholder="Search"
          icon="pi pi-search"
        />
      </div>

      {/* Buttons on the right */}
      <div className="flex items-center space-x-4">
        <button className="p-2 bg-yellow-500 text-black rounded-lg shadow-md border border-black">
          <i className="pi pi-plus mr-2 text-black"></i> Pending Functionality here Sercho ng
        </button>
        <button className="p-2 bg-yellow-500 text-black rounded-lg shadow-md border border-black">
          <i className="pi pi-bell"></i>
        </button>

        {/* User Profile Button */}
        <UserProfile userId={currentUserId} onUserSelect={handleUserSelect} />
      </div>

      {/* Modal for creating or selecting a user */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Create or Select User</h3>
            
            {/* Form for creating a new user */}
            <div>
              <label className="block text-sm font-medium">Name:</label>
              <input
                type="text"
                value={newUserData.name}
                onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                className="p-2 border border-gray-300 rounded-lg w-full mb-4"
                placeholder="Enter user name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Email:</label>
              <input
                type="email"
                value={newUserData.email}
                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                className="p-2 border border-gray-300 rounded-lg w-full mb-4"
                placeholder="Enter email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Profile Picture:</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="p-2 mb-4"
              />
            </div>

            {/* Select or pick existing users */}
            <div className="mb-4">
              <h4 className="font-semibold">Pick an Existing User</h4>
              <ul>
                {users.length > 0 ? (
                  users.map((user) => (
                    <li
                      key={user.id}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleUserPick(user.id)}
                    >
                      {user.name}
                    </li>
                  ))
                ) : (
                  <li>No existing users found</li>
                )}
              </ul>
            </div>

            <div className="flex justify-between space-x-4">
              <button
                onClick={handleCreateUser}
                className="p-2 bg-blue-500 text-white rounded-lg w-1/2"
              >
                Create User
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 bg-gray-500 text-white rounded-lg w-1/2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
