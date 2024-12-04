import { InputText } from "primereact/inputtext";
import "primeicons/primeicons.css";
import React, { useState, useEffect, useRef } from "react";
import {
  storeUserData,
  getAllUsers,
  checkTasksDueDates,
  requestNotificationPermission,
  getOrGenerateSeed,
  updateBoardBySeed,
} from "../../services/storageService";
import { useFirebaseContext } from "../../services/FirebaseContext";

function Header() {
  const { seed } = useFirebaseContext();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false); // Separate state for the share modal
  const [showUserModal, setShowUserModal] = useState(false); // Separate state for the share modal
  const [showNotificationsModal, setShowNotificationsModal] = useState(false); // Separate state for notifications modal
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    image: null,
  });
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [boardSeed, setBoardSeed] = useState(seed); // New state for board seed

  const notificationsRef = useRef(null);

  // Load users and initialize notifications on mount
  const loadUsers = async () => {
    const cachedUsers = await getAllUsers(seed);
    if (cachedUsers.length > 0) {
      setUsers(cachedUsers);
      setCurrentUserId(cachedUsers[0].id); // Set the first user as current user
    }
  };

  useEffect(() => {
    loadUsers(seed);
    const initializeNotifications = async () => {
      await requestNotificationPermission();
      const dueNotifications = await checkTasksDueDates(seed);
      setNotifications(dueNotifications || []);
    };
    initializeNotifications();
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotificationsModal(false); // Close notifications modal if clicked outside
        setShowUserModal(false);
        setShowShareModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [seed]); // Re-run useEffect if seed changes

  const handleSharingClick = async () => {
    setBoardSeed(seed); // Set the seed for the board
    setShowShareModal(true); // Show sharing modal
  };

  // Handle storing board if the seed matches
  const handleStoreBoard = async () => {
    if (boardSeed) {
      try {
        // Save the board to the cache using a single function
        await updateBoardBySeed(boardSeed); // Call the service function
        console.log("Board stored successfully.");
        setShowShareModal(false); // Close the modal after storing
      } catch (error) {
        console.error("Error storing board:", error);
      }
    } else {
      console.error("Board seed does not match.");
    }
  };
  // Update new user data with selected profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewUserData((prev) => ({ ...prev, image: file }));
    }
  };
  const handleUserSelect = async () => {
    try {
      // Fetch users from the cache when modal is opened
      const cachedUsers = await getAllUsers(seed);

      if (cachedUsers.length > 0) {
        setUsers(cachedUsers);
      } else {
        console.log("No users found in cache for this seed.");
      }
      setShowUserModal(true);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  // Handle creating a new user
  const handleCreateUser = async () => {
    if (newUserData.name && newUserData.email) {
      const userId = `user-${Date.now()}`;
      const userData = { ...newUserData, id: userId }; // Ensure ID is generated

      try {
        // Store user with seed
        await storeUserData(seed, userData, newUserData.image);

        // Now fetch all users from the cache again after saving the new user
        const updatedUsers = await getAllUsers(seed);

        // Ensure the users state is updated with the latest user list
        setUsers(updatedUsers);

        // Set the newly created user as the current user
        setCurrentUserId(userId);

        // Close the modal and reset new user data
        setShowUserModal(false);
        setNewUserData({ name: "", email: "", image: null });
      } catch (error) {
        console.error("Error creating user: ", error);
      }
    } else {
      alert("Please fill in the name and email");
    }
  };

  // Handle selecting an existing user
  const handleUserPick = (userId) => {
    setCurrentUserId(userId);
    setShowUserModal(false); // Close the modal after user selection
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md top-0 sticky z-20 pl-64 
    dark:bg-gray-800 text-black dark:text-white dark:shadow-white">
      <div className="flex items-center mb-4 -ml-60 ">
        <div className="bg-yellow-main text-white p-4 rounded-full mr-3">
          📂
        </div>
        <span className="font-semibold text-xl/relaxed">Task-Magnament</span>
      </div>
      <div className="flex items-center space-x-2 w-1/3">
        <InputText
          className="p-2 w-full border border-gray-300 rounded-lg dark:text-black"
          placeholder="Search"
          icon="pi pi-search"
        />
      </div>

      <div className="flex items-center space-x-4">
        {/* Updated button for "Sharing" */}
        <button
          className="p-2 bg-yellow-500 text-black rounded-lg shadow-md border border-black"
          onClick={handleSharingClick} // Added handler for showing modal
        >
          <i className="pi pi-share-alt mr-2 text-black"></i> Sharing
        </button>

        <button
          className="p-2 bg-yellow-500 text-black rounded-lg shadow-md border border-black relative"
          onClick={() => setShowNotificationsModal((prev) => !prev)} // Toggle notifications modal
        >
          <i className="pi pi-bell"></i>
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>

        {showNotificationsModal && (
          <div
            ref={notificationsRef}
            className="absolute right-0 top-7 mt-10 bg-white border shadow-lg rounded-lg w-64 dark:bg-gray-800 text-black dark:text-white"
          >
            <ul>
              {notifications.length > 0 ? (
                notifications.map((task, index) => {
                  const dueDate = new Date(task.date);
                  const isValidDate = !isNaN(dueDate);
                  return (
                    <li
                      key={index}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
                    >
                      <strong className="dark:text-black">{task.title}</strong>
                      <p className="text-sm text-gray-600">
                        Due on:{" "}
                        {isValidDate
                          ? new Date(dueDate).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Invalid Date"}
                      </p>
                    </li>
                  );
                })
              ) : (
                <p className="text-sm text-gray-600 dark:bg-gray-900 dark:text-white">
                  No tasks due soon.
                </p>
              )}
            </ul>
          </div>
        )}

        <div className="relative">
          <button
            className="p-2 bg-blue-500 text-white rounded-lg"
            onClick={() => setShowUserModal(true)} // Set showShareModal to true for user modal
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

      {/* Modal for board sharing */}
      {showShareModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 dark:bg-gray-900 text-black dark:text-white">
            <h3 className="text-xl font-semibold mb-4">Share Board: {seed}</h3>
            <p className="mb-4">Enter the seed to share this board:</p>
            <input
              type="text"
              value={seed}
              readOnly
              className="p-2 border border-gray-300 rounded-lg w-full mb-4 dark:text-black"
            />
            <input
              type="text"
              placeholder="Place an external seed here."
              className="p-2 border border-gray-300 rounded-lg w-full mb-4 dark:text-black"
            />
            <div className="flex justify-between space-x-4">
              <button
                onClick={handleStoreBoard}
                className="p-2 bg-blue-500 text-white rounded-lg w-1/2"
              >
                Share
              </button>
              <button
                onClick={() => setShowShareModal(false)} // Close share modal
                className="p-2 bg-gray-500 text-white rounded-lg w-1/2 dark:text-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal for user creation or selection */}
      {showUserModal && (
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
                onClick={() => setShowUserModal(false)}
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
