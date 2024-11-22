import { storeInCache, getFromCache, deleteFromCache } from './cacheUtils';

// Tasks
export const storeTask = async (seed, task) => {
  const key = `${seed}-task-${task.id}`;
  await storeInCache(key, task);
};

export const getTask = async (seed, taskId) => {
  const key = `${seed}-task-${taskId}`;
  return await getFromCache(key);
};

// Edit a task
export const editTask = async (seed, taskId, updatedData) => {
  const task = await getTask(seed, taskId);
  if (task) {
    const updatedTask = { ...task, ...updatedData };
    await storeTask(seed, updatedTask);
  }
};

// Delete a task
export const deleteTask = async (seed, taskId) => {
  const key = `${seed}-task-${taskId}`;
  await deleteFromCache(key);
};

// Projects
export const storeProject = async (seed, project) => {
  if (!project || !project.id) {
    console.error("Invalid project object:", project);
    return;
  }
  const key = `${seed}-project-${project.id}`;
  await storeInCache(key, project);
};

export const getProject = async (seed, projectId) => {
  const key = `${seed}-project-${projectId}`;
  return await getFromCache(key);
};

export const storeAllProjects = async (seed, projects) => {
  const key = `${seed}-projects`;
  await storeInCache(key, projects);
};

export const getAllProjects = async (seed) => {
  const key = `${seed}-projects`;
  return await getFromCache(key);
};


