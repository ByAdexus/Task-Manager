import { storeInCache, getFromCache } from './cacheUtils';
const tasks = {};



export const storeTask = async (task) => {
  const key = `task-${task.id}`;
  await storeInCache(key, task);
  tasks[task.id] = task;
};

export const getTask = async (taskId) => {
  if (tasks[taskId]) return tasks[taskId];
  const key = `task-${taskId}`;
  return await getFromCache(key);
};

export const editTask = async (taskId, updatedData) => {
  const task = await getTask(taskId);
  if (task) {
    const updatedTask = { ...task, ...updatedData };
    await storeTask(updatedTask);
    tasks[taskId] = updatedTask;
  }
};

export const deleteTask = async (taskId) => {
  delete tasks[taskId];
  const cache = await caches.open("data-cache-v1");
  await cache.delete(`task-${taskId}`);
};

//Projects:

export const storeProject = async (project) => {
    const key = `project-${project.id}`;
    await storeInCache(key, project);
  };
  
  export const getProject = async (projectId) => {
    const key = `project-${projectId}`;
    return await getFromCache(key);
  };
  
  export const storeAllProjects = async (projects) => {
    const key = "projects";
    await storeInCache(key, projects);
  };
  
  export const getAllProjects = async () => {
    const key = "projects";
    return await getFromCache(key);
  };