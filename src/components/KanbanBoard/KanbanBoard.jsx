import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskCard from "../TaskCard/TaskCard";
import {
  storeProject,
  getAllProjects,
  storeTask,
  storeAllProjects,
  downloadBoardCacheFromFirebase,
  uploadBoardCacheToFirebase,
  syncCacheWithFirebase,
  isLocalCacheNewer,
} from "../../services/storageService";
import { useFirebaseContext } from "../../services/FirebaseContext";

const KanbanBoard = () => {
  const { seed, firebaseUrl } = useFirebaseContext();

  const boardUrl = `${firebaseUrl}/boards/${seed}`;

  const [data, setData] = useState({
    boards: {},
    projects: {},
    projectOrder: [],
    tasks: {},
  });

  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    date: "",
    priority: "medium",
    color: "#000000",
  });

  useEffect(() => {
    const loadProjects = async () => {
      const localCache = await getAllProjects(seed); // Get cached data
   
    
      if (!localCache || !localCache.projects) {
        console.log("Local cache is empty. Fetching from Firebase...");
        const remoteCache = await downloadBoardCacheFromFirebase(firebaseUrl, seed);
        if (remoteCache) {
          setData({
            projects: remoteCache.projects || {},
            projectOrder: remoteCache.projectOrder || [],
            tasks: remoteCache.tasks || {},
          });
    
          // Save the fetched data to cache for next use
          storeAllProjects(seed, remoteCache);
        }
      } else {
        setData({
          projects: localCache.projects || {},
          projectOrder: localCache.projectOrder || [],
          tasks: localCache.tasks || {},
        });
      }
    };
    
  
    loadProjects();
  
    // Define the sync function to be added as event listener
    const syncCache = () => syncCacheWithFirebase(getAllProjects(seed), firebaseUrl);
  
    // Add online event listener for sync
    window.addEventListener("online", syncCache);
  
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("online", syncCache);
    };
  }, [seed, firebaseUrl]); // Dependencies to watch
  

  const handleCreateProject = async () => {
    if (!newProjectTitle.trim()) {
      alert("Project title is required.");
      return;
    }

    const newProject = {
      id: `project-${seed}-${Date.now()}`,
      title: newProjectTitle,
      taskIds: [],
    };

    const updatedProjects = {
      ...data.projects,
      [newProject.id]: newProject,
    };

    const updatedProjectOrder = [...data.projectOrder, newProject.id];

    setData({
      projects: updatedProjects,
      projectOrder: updatedProjectOrder,
      tasks: data.tasks,
    });

    await storeProject(seed, newProject);
    await storeAllProjects(seed, {
      projects: updatedProjects,
      projectOrder: updatedProjectOrder,
      tasks: data.tasks,
    });
    await syncCacheWithFirebase(getAllProjects(seed), firebaseUrl);
    await uploadBoardCacheToFirebase(seed, data , firebaseUrl);

    setNewProjectTitle("");
    setShowProjectModal(false);
  };
  const handleCreateTask = async () => {
    const { title, description, date, priority, color } = taskForm;

    if (!title || !description || !date || !priority || !color) {
      alert("Please fill out all fields.");
      return;
    }

    const task = {
      id: `task-${seed}-${Date.now()}`, // Include the seed to associate it with the board
      title,
      description,
      date,
      priority,
      color,
    };

    const updatedProjects = { ...data.projects };
    const project = updatedProjects[currentProjectId];
    project.taskIds.push(task.id); // Add task to the project

    setData({
      ...data,
      projects: updatedProjects,
      tasks: { ...data.tasks, [task.id]: task },
    });

    await storeTask(seed, task); // Store task using the board's seed
    await storeProject(seed, project); // Store the updated project with the new task
    await storeAllProjects(seed, {
      projects: updatedProjects,
      projectOrder: data.projectOrder,
      tasks: { ...data.tasks, [task.id]: task },
    });
    await syncCacheWithFirebase(getAllProjects(seed), firebaseUrl);
    await uploadBoardCacheToFirebase(seed, data , firebaseUrl);

    setShowTaskModal(false);
    setTaskForm({
      title: "",
      description: "",
      date: "",
      priority: "medium",
      color: "#000000",
    });
  };

  // Drag-and-Drop Handling
  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const updatedProjects = { ...data.projects };
    const sourceProject = updatedProjects[source.droppableId];
    const destinationProject = updatedProjects[destination.droppableId];

    const [removed] = sourceProject.taskIds.splice(source.index, 1);
    destinationProject.taskIds.splice(destination.index, 0, removed);

    setData({
      ...data,
      projects: updatedProjects,
    });

    storeAllProjects(seed, {
      projects: updatedProjects,
      projectOrder: data.projectOrder,
      tasks: data.tasks,
    });
    syncCacheWithFirebase(boardUrl, seed);
    uploadBoardCacheToFirebase(seed, data , firebaseUrl);
  };
  const updateTaskInState = (taskId, updatedTask) => {
    setData((prevData) => {
      const updatedTasks = { ...prevData.tasks, [taskId]: updatedTask };
      return { ...prevData, tasks: updatedTasks };
    });
  };

  const deleteTaskInState = (taskId) => {
    setData((prevData) => {
      const updatedTasks = { ...prevData.tasks };
      delete updatedTasks[taskId];
      return { ...prevData, tasks: updatedTasks };
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
    <div className="flex p-6 space-x-4">
      {data.projectOrder.length > 0 ? (
        data.projectOrder.map((projectId) => {
          const project = data.projects[projectId];
          if (!project || !project.taskIds) {

            return null;
          }

          const tasks = project.taskIds
            .map((taskId) => data.tasks[taskId])
            .filter((task) => task); // Filter out null tasks


          return (
            <Droppable droppableId={project.id} key={project.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 p-4 rounded-lg w-80 dark:bg-gray-900 text-black"
                  style={{ minHeight: "300px" }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold text-lg text-gray-700 dark:text-white">
                      {project.title}
                    </h2>
                    <button
                      onClick={() => {
                        setCurrentProjectId(project.id);
                        setShowTaskModal(true);
                      }}
                      className="bg-blue-500 text-white p-2 rounded-full"
                    >
                      + {/* Add task button */}
                    </button>
                  </div>

                  <hr className="border-t-2 border-gray-300 mb-4" />

                  {tasks.length > 0 ? (
                    tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-4 rounded-lg shadow-md mb-4 dark:bg-indigo-900"
                          >
                            <TaskCard
                              task={task}
                              updateTaskInState={updateTaskInState}
                              deleteTaskInState={deleteTaskInState}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <div>No tasks in this project</div>
                  )}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        })
      ) : (
        <div className="text-center w-full">
          <p className="text-gray-500 text-lg dark:text-gray-300">
            No projects available. Click the + button to create a new project.
          </p>
        </div>
      )}


        {/* Project Modal */}
        {showProjectModal && (
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setShowProjectModal(false)}
          >
            <div
              className="bg-white p-6 rounded-lg dark:bg-gray-900 text-black dark:text-white relative"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                className="p-2 border-b border-gray-300 focus:outline-none dark:text-black"
                placeholder="Enter project title"
              />
              <button
                onClick={handleCreateProject}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full"
              >
                Create Project
              </button>
            </div>
          </div>
        )}

        {/* Task Modal */}
        {showTaskModal && (
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setShowTaskModal(false)}
          >
            <div
              className="bg-white p-6 rounded-lg dark:bg-gray-900 text-black dark:text-white relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowTaskModal(false)}
                className="absolute top-2 right-2 text-gray-700 dark:text-white"
              >
                X
              </button>
              <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
              <input
                type="text"
                value={taskForm.title}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, title: e.target.value })
                }
                className="w-full p-2 mb-4 border border-gray-300 rounded-md dark:text-black"
                placeholder="Task Title"
              />
              <textarea
                value={taskForm.description}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, description: e.target.value })
                }
                className="w-full p-2 mb-4 border border-gray-300 rounded-md dark:text-black"
                placeholder="Task Description"
              />
              <input
                type="date"
                value={taskForm.date}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, date: e.target.value })
                }
                className="w-full p-2 mb-4 border border-gray-300 rounded-md dark:text-black"
              />
              <select
                value={taskForm.priority}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, priority: e.target.value })
                }
                className="w-full p-2 mb-4 border border-gray-300 rounded-md dark:text-black"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <input
                type="color"
                value={taskForm.color}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, color: e.target.value })
                }
                className="w-full p-2 mb-4 border border-gray-300 rounded-md dark:text-black"
              />
              <button
                onClick={handleCreateTask}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full"
              >
                Add Task
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Button for Adding Projects */}
      <button
        onClick={() => setShowProjectModal(true)}
        className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-full shadow-lg z-60"
      >
        +
      </button>
    </DragDropContext>
  );
};

export default KanbanBoard;
