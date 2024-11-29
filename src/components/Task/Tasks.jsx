import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebaseContext } from "../../services/FirebaseContext"; // Import context
import { createNewBoard, listDeviceBoards } from "../../services/firebaseSyncsS"; // Ensure correct path

const Task = () => {
  const { firebaseUrl, setSeed } = useFirebaseContext(); // Get firebaseUrl from context
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]); // Initialize boards as an empty array
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  useEffect(() => {
    const fetchBoards = async () => {
      // Pass firebaseUrl to listDeviceBoards function
      const boardsFromCache = await listDeviceBoards(firebaseUrl);
      if (boardsFromCache) {
        setBoards(boardsFromCache);
      }
    };

    fetchBoards();
  }, [firebaseUrl]);

  const handleBoardClick = (seed) => {
    // Set the seed in the context and navigate to the Kanban board
    setSeed(seed);
    navigate(`/kanban/${seed}`); // Only pass the seed in the URL, firebaseUrl is already stored in the context
  };

  const handleCreateBoard = async () => {
    // Create the board with the name provided by the user
    const newBoard = await createNewBoard(firebaseUrl, newBoardName); 
    if (newBoard) {
      setBoards((prevBoards) => [...prevBoards, newBoard]); // Add new board to the state
    }
    setIsModalOpen(false); // Close modal after creating a board
    setNewBoardName(""); // Clear the input field after board creation
  };

  return (
    <div className="p-6 flex justify-center">
      <h1 className="text-2xl font-semibold mb-4">Boards:</h1>

      {/* + Button to open modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white p-3 rounded-full fixed bottom-10 right-10 shadow-lg hover:bg-blue-600"
      >
        +
      </button>

      {/* Modal for creating new board */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl mb-4">Create a New Board</h2>
            <input
              type="text"
              placeholder="Board Name"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              className="border p-2 w-full mb-4 dark:text-black"
            />
            <button
              onClick={handleCreateBoard} // Call handleCreateBoard
              className="bg-green-500 text-white p-2 rounded"
            >
              Create
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-red-500 text-white p-2 rounded ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Check if boards is not undefined and is an array before mapping */}
      <div className="grid grid-cols-3 gap-6">
        {Array.isArray(boards) && boards.length > 0 ? (
          boards.map((board) => (
            <div
              key={board.seed} // Use `seed` as a unique key
              onClick={() => handleBoardClick(board.seed)} // Navigate to selected board
              className="cursor-pointer bg-gray-100 p-4 rounded-lg shadow-md dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            >
              <h2 className="text-lg font-bold text-gray-700 dark:text-white">
                {board.name || "Untitled Board"} {/* Display board name */}
              </h2>
            </div>
          ))
        ) : (
          <p>No boards available</p> // Show message if no boards exist
        )}
      </div>
    </div>
  );
};

export default Task;
