import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCard from '../TaskCard/TaskCard';
import { 
  storeProject, 
  getAllProjects, 
  storeTask, 
  storeAllProjects, 
  getTask,
  getOrGenerateSeed,
  syncCacheWithFirebase,
  isLocalCacheNewer,
  downloadCacheFromFirebase,
 } from '../../services/storageService';

/*
const clearCache = () => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage('clearCache');
  }
};

// Call this function when you want to reset the cache (for example, when the page loads or through a button)
clearCache();
*/

const KanbanBoard = () => {
  const [data, setData] = useState({ projects: {}, projectOrder: [], tasks: {} });
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    date: '',
    priority: 'medium',
    color: '#000000',
  });

  const firebaseUrl = 'https://your-firebase-url.firebaseio.com'; // Replace with your Firebase URL
  const [seed, setSeed] = useState(null);

  // Load all projects and tasks from cache or Firebase on component mount
  const loadProjects = async () => {
    const localCache = await getAllProjects();

    if (!localCache) {
      console.log('Local cache is empty. Fetching from Firebase...');
      const remoteCache = await downloadCacheFromFirebase(firebaseUrl, seed);
      if (remoteCache) {
        setData({
          projects: remoteCache.projects,
          projectOrder: remoteCache.projectOrder,
          tasks: remoteCache.tasks || {},
        });
      }
    } else {
      setData({
        projects: localCache.projects,
        projectOrder: localCache.projectOrder,
        tasks: localCache.tasks || {},
      });
    }
  };

  useEffect(() => {
    const initialize = async () => {
      // Ensure seed exists and is consistent
      const resolvedSeed = await getOrGenerateSeed(firebaseUrl);
      setSeed(resolvedSeed);

      // Load projects and tasks
      await loadProjects();

      // Set up cache synchronization
      window.addEventListener('online', async () => {
        console.log('Internet connection restored. Syncing cache...');
        await syncCacheWithFirebase(firebaseUrl, isLocalCacheNewer);
      });
    };

    initialize();

    return () => {
      window.removeEventListener('online', syncCacheWithFirebase);
    };
  }, []);

  const handleCreateProject = async () => {
    const newProject = {
      id: `project-${Date.now()}`, // Simple unique ID based on timestamp
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

    // Save the new project to the cache and sync with Firebase
    await storeProject(newProject);
    await storeAllProjects({
      projects: updatedProjects,
      projectOrder: updatedProjectOrder,
      tasks: data.tasks,
    });
    await syncCacheWithFirebase(firebaseUrl, isLocalCacheNewer);

    setNewProjectTitle('');
    setShowProjectModal(false);
  };

  const handleCreateTask = async () => {
    const { title, description, date, priority, color } = taskForm;

    if (!title || !description || !date || !priority || !color) {
      alert('Please fill out all fields.');
      return;
    }

    const task = {
      id: `task-${Date.now()}`,
      title,
      description,
      date,
      priority,
      color,
    };

    const updatedProjects = { ...data.projects };
    const project = updatedProjects[currentProjectId];
    project.taskIds.push(task.id);

    setData({
      ...data,
      projects: updatedProjects,
      tasks: { ...data.tasks, [task.id]: task },
    });

    // Save the task and sync with Firebase
    await storeTask(task);
    await storeProject(project);
    await storeAllProjects({
      projects: updatedProjects,
      projectOrder: data.projectOrder,
      tasks: { ...data.tasks, [task.id]: task },
    });
    await syncCacheWithFirebase(firebaseUrl, isLocalCacheNewer);

    setShowTaskModal(false);
    setTaskForm({
      title: '',
      description: '',
      date: '',
      priority: 'medium',
      color: '#000000',
    });
  };

  // Efecto  para recargar las tareas del cache cuando se modifique
useEffect(() => {
  const loadTasksFromCache = async () => {
    const loadedTasks = await getAllProjects();
    setData(loadedTasks);
  };

  loadTasksFromCache();
}, [data.tasks]); // Actualizar cuando cambie `data.tasks`

const updateTaskInState = (taskId, updatedTask) => {
  setData((prevData) => ({
    ...prevData,
    tasks: {
      ...prevData.tasks,
      [taskId]: updatedTask
    }
  }));
  storeAllProjects({
    ...data,
    tasks: {
      ...data.tasks,
      [taskId]: updatedTask
    }
  });
};

const deleteTaskInState = (taskId) => {
  setData((prevData) => {
    const updatedTasks = { ...prevData.tasks };
    delete updatedTasks[taskId];

    const updatedProjects = { ...prevData.projects };
    Object.values(updatedProjects).forEach((project) => {
      project.taskIds = project.taskIds.filter((id) => id !== taskId);
    });

    return {
      ...prevData,
      projects: updatedProjects,
      tasks: updatedTasks
    };
  });

  storeAllProjects({
    ...data,
    tasks: data.tasks,
    projects: data.projects
  });
  syncCacheWithFirebase(firebaseUrl, isLocalCacheNewer);
};


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex p-6 space-x-4 ml-64">
        {data.projectOrder.map((projectId) => {
          const project = data.projects[projectId];
          const tasks = project.taskIds.map((taskId) => data.tasks[taskId]);

          return (
            <Droppable droppableId={project.id} key={project.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-100 p-4 rounded-lg w-80 dark:bg-gray-900 text-black "
                  style={{ minHeight: '300px' }}
                >
                  <div className="flex justify-between items-center mb-2 ">
                    <h2 className="font-semibold text-lg text-gray-700 dark:text-white">{project.title}</h2>
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

                  {tasks.map((task, index) => (
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
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        })}

        {/* Project Modal */}
        {showProjectModal && (
          <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setShowProjectModal(false)} // Detecta clics en el fondo
        >
          <div
            className="bg-white p-6 rounded-lg dark:bg-gray-900 text-black dark:text-white relative"
            onClick={(e) => e.stopPropagation()} // Evita cerrar el modal al hacer clic dentro de él
          >
              <input
                type="text"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                className="p-2 border-b border-gray-300 focus:outline-none"
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
          onClick={() => setShowTaskModal(false)} // Detecta clics en el fondo
        >
          <div
            className="bg-white p-6 rounded-lg dark:bg-gray-900 text-black dark:text-white relative"
            onClick={(e) => e.stopPropagation()} // Evita cerrar el modal al hacer clic dentro de él
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
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                className="w-full p-2 mb-4 border border-gray-300 rounded-md dark:text-black"
                placeholder="Task Title"
              />
              <textarea
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                className="w-full p-2 mb-4 border border-gray-300 rounded-md dark:text-black"
                placeholder="Task Description"
              />
              <input
                type="date"
                value={taskForm.date}
                onChange={(e) => setTaskForm({ ...taskForm, date: e.target.value })}
                className="w-full p-2 mb-4 border border-gray-300 rounded-md dark:text-black"
              />
              <select
                value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                className="w-full p-2 mb-4 border border-gray-300 rounded-md dark:text-black"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <input
                type="color"
                value={taskForm.color}
                onChange={(e) => setTaskForm({ ...taskForm, color: e.target.value })}
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
        className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-full shadow-lg z-50"
      >
        +
      </button>
    </DragDropContext>
  );
}

export default KanbanBoard;
