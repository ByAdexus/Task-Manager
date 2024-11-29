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
export const storeProject = async (boardSeed, project) => {
  if (!project || !project.id) {
    console.error("Invalid project object:", project);
    return;
  }
  const key = `${boardSeed}-project-${project.id}`;  // Use boardSeed to generate a unique key
  await storeInCache(key, project);  // Store project in cache
};

// Get a project specific to a board (using the board's seed)
export const getProject = async (boardSeed, projectId) => {
  const key = `${boardSeed}-project-${projectId}`;  // Use boardSeed to generate a unique key
  return await getFromCache(key);  // Retrieve project from cache
};

// Store all projects specific to a board
export const storeAllProjects = async (firebaseUrl, data) => {
  try {
    const response = await fetch(`${firebaseUrl}/boards/${data.seed}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to store projects: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error storing projects:", error);
  }
};


// Get all projects specific to a board
export const getAllProjects = async (boardSeed) => {
  const key = `${boardSeed}-projects`;  // Use boardSeed to generate a unique key for all projects
  return await getFromCache(key);  // Retrieve all projects for the board from cache
};
