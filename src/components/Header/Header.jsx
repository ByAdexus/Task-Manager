import { InputText } from "primereact/inputtext";
import "primeicons/primeicons.css";
import React, { useState, useEffect, useRef } from "react";
import {
  storeUserData,
  getAllUsers,
  checkTasksDueDates,
  requestNotificationPermission,
  getUserImage,
} from "../../services/storageService";

function Header() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    image: null,
  });
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationsRef = useRef(null);

  // Load users and initialize notifications on mount
  useEffect(() => {
    const loadUsers = async () => {
      const cachedUsers = await getAllUsers();
      if (cachedUsers.length > 0) {
        setUsers(cachedUsers);
        setCurrentUserId(cachedUsers[0].id);
      } else {
        const defaultUser = {
          id: `user-${Date.now()}`,
          name: "New User",
          email: "newuser@example.com",
          image: null,
        };
        await storeUserData(defaultUser);
        setUsers([defaultUser]);
        setCurrentUserId(defaultUser.id);
      }
    };

    const initializeNotifications = async () => {
      await requestNotificationPermission();
      const dueNotifications = await checkTasksDueDates();
      setNotifications(dueNotifications || []);
    };

    loadUsers();
    initializeNotifications();

    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch users whenever the modal opens to ensure we have the latest data
  const handleUserSelect = async () => {
    const cachedUsers = await getAllUsers();
    setUsers(cachedUsers);
    setShowModal(true);
  };

  // Handle creating a new user
  const handleCreateUser = async () => {
    if (newUserData.name && newUserData.email) {
      const userId = `user-${Date.now()}`;
      const userData = { ...newUserData, id: userId };
      await storeUserData(userData, newUserData.image);

      // Refetch users after storing new user data
      const updatedUsers = await getAllUsers();
      setUsers(updatedUsers); // Update state with the latest users
      setCurrentUserId(userId); // Set the new user as the current user
      setShowModal(false);
      setNewUserData({ name: "", email: "", image: null });
    } else {
      alert("Please fill in the name and email");
    }
  };

  // Handle selecting an existing user
  const handleUserPick = (userId) => {
    setCurrentUserId(userId);
    setShowModal(false);
  };

  // Toggle notifications visibility
  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  // Update new user data with selected profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewUserData((prev) => ({ ...prev, image: file }));
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md relative z-20 pl-64
    dark:bg-gray-800 text-black dark:text-white dark:shadow-white">
      <div className="flex items-center space-x-2 w-1/3">
        <InputText
          className="p-2 w-full border border-gray-300 rounded-lg dark:text-black"
          placeholder="Search"
          icon="pi pi-search"
        />
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 bg-yellow-500 text-black rounded-lg shadow-md border border-black">
          <i className="pi pi-plus mr-2 text-black"></i> Pending Functionality
          here Sercho ng
        </button>

        <button
          className="p-2 bg-yellow-500 text-black rounded-lg shadow-md border border-black relative"
          onClick={toggleNotifications}
        >
          <i className="pi pi-bell"></i>
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>

        {showNotifications && (
          <div
            ref={notificationsRef}
            className="absolute right-0 top-7 mt-10 bg-white border shadow-lg rounded-lg w-64 p-4
            dark:bg-gray-900 text-black dark:text-white"
          >
            <h4 className="font-semibold text-lg mb-2">Task Notifications</h4>
            {notifications.length > 0 ? (
              <ul className="space-y-2">
                {notifications.map((task, index) => {
                  // Make sure the 'date' exists and is valid
                  const dueDate = new Date(task.date); // Changed 'dueDate' to 'date'
                  const isValidDate = !isNaN(dueDate.getTime()); // Check if it's a valid date

                  return (
                    <li
                      key={index}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
                    >
                      <strong className="dark:text-black">{task.title}</strong>
                      <p className="text-sm text-gray-600">
                        Due on:{" "}
                        {isValidDate
                          ? dueDate.toLocaleDateString("en-US", {
                              weekday: "long", // Example: "Monday"
                              year: "numeric", // Example: "2024"
                              month: "long", // Example: "November"
                              day: "numeric", // Example: "11"
                            })
                          : "Invalid Date"}
                      </p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-gray-600 dark:bg-gray-900 dark:text-white">No tasks due soon.</p>
            )}
          </div>
        )}

        <div className="relative">
          <button
            className="p-2 bg-blue-500 text-white rounded-lg"
            onClick={handleUserSelect}
          >
            {currentUserId ? (
              <>
                <i className="pi pi-user mr-2"></i>
                {users.find((user) => user.id === currentUserId)?.name ||
                  "New User"}
              </>
            ) : (
              "Log in / Create User"
            )}
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 dark:bg-gray-900 text-black dark:text-white">
            <h3 className="text-xl font-semibold mb-4">
              Create or Select User
            </h3>
            <div>
              <label className="block text-sm font-medium">Name:</label>
              <input
                type="text"
                value={newUserData.name}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, name: e.target.value })
                }
                className="p-2 border border-gray-300 rounded-lg w-full mb-4 dark:text-black"
                placeholder="Enter user name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email:</label>
              <input
                type="email"
                value={newUserData.email}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, email: e.target.value })
                }
                className="p-2 border border-gray-300 rounded-lg w-full mb-4 dark:text-black"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Profile Picture:
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="p-2 mb-4"
              />
            </div>
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
                className="p-2 bg-gray-500 text-white rounded-lg w-1/2 dark:text-black"
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
