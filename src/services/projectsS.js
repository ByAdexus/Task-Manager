import { storeInCache, getFromCache, deleteFromCache } from './cacheUtils';

// Tasks
export const storeTask = async (boardSeed, task) => {
  const key = `${boardSeed}-task-${task.id}`;  // Use boardSeed to generate a unique key
  await storeInCache(key, task);  // Store task in cache
};

// Get task specific to a board (using the board's seed)
export const getTask = async (boardSeed, taskId) => {
  const key = `${boardSeed}-task-${taskId}`;  // Use boardSeed to generate a unique key
  return await getFromCache(key);  // Retrieve task from cache
};

// Edit task specific to a board
export const editTask = async (boardSeed, taskId, updatedData) => {
  const task = await getTask(boardSeed, taskId);
  if (task) {
    const updatedTask = { ...task, ...updatedData };
    await storeTask(boardSeed, updatedTask);
  }
};

// Delete task specific to a board
export const deleteTask = async (boardSeed, taskId) => {
  const key = `${boardSeed}-task-${taskId}`;
  await deleteFromCache(key);  // Delete task from cache
};

// Projects
// Store project specific to a board (using the board's seed)
// Projects
// Store project specific to a board (using the board's seed)
export const storeProject = async (boardSeed, project) => {
  if (!project || !project.id) {
    console.error("Invalid project object:", project);
    return;
  }

  // Ensure the project is stored under the board's seed
  const key = `${boardSeed}-project-${project.id}`;  // Use boardSeed to generate a unique key
  await storeInCache(key, project);  // Store project in cache

  // Update project order in cache (keeping track of project order within the board)
  const currentProjects = await getAllProjects(boardSeed);

  // Check if currentProjects is an array and initialize it if it's not
  const updatedProjects = Array.isArray(currentProjects) ? [...currentProjects, project.id] : [project.id];

  // Store updated project order after adding the new project
  await storeAllProjects(boardSeed, updatedProjects);
};


// Get a project specific to a board (using the board's seed)
export const getProject = async (boardSeed, projectId) => {
  const key = `${boardSeed}-project-${projectId}`;  // Use boardSeed to generate a unique key
  return await getFromCache(key);  // Retrieve project from cache
};

// Store all projects specific to a board
export const storeAllProjects = async (boardSeed, cacheData) => {
  try {
    // Store the entire data object (projects, projectOrder, tasks)
    const dataToStore = {
      board: "board-"+boardSeed,
      projects: cacheData.projects,
      projectOrder: cacheData.projectOrder,
      tasks: cacheData.tasks,
    };

    // Store the updated data for the board
    await storeInCache(`${boardSeed}-projects`, dataToStore);

    // Optionally, store this data remotely if needed (e.g., in Firebase or a DB)

  } catch (error) {
    console.error("Error storing all projects:", error);
  }
};


// Get all projects specific to a board
export const getAllProjects = async (seed) => {
  const cacheKey = `${seed}-projects`; // Ensure this matches what you're using
  const cachedProjects = await getFromCache(cacheKey);

  if (!cachedProjects) {
    console.log("No valid cache data found.");
    return null; // Or return default data structure
  }

  return cachedProjects;
};
