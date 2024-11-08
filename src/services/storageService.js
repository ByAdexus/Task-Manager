// Wrapper for caching service

// In-memory task storage (tasks are saved here when created)
let tasks = {}; // Store tasks in memory for fast access

// Helper function to store data in the cache
const storeInCache = async (key, data) => {
  const cache = await caches.open('data-cache-v1');
  await cache.put(key, new Response(JSON.stringify(data)));
};

// Helper function to retrieve data from the cache
const getFromCache = async (key) => {
  const cache = await caches.open('data-cache-v1');
  const response = await cache.match(key);
  return response ? await response.json() : null;
};

// Store a task in cache (and in memory)
const storeTask = async (task) => {
  const key = `task-${task.id}`; // Use task ID to create unique cache key
  await storeInCache(key, task);
  
  // Store task in memory (in the global tasks object)
  tasks[task.id] = task; // Now tasks are available in memory for faster access
};

// Get a task from cache (first checks memory, then cache if not found)
const getTask = async (taskId) => {
  // Check if the task exists in memory
  if (tasks[taskId]) {
    return tasks[taskId]; // Return from memory if available
  }
  
  // Fallback to cache if task is not in memory
  const key = `task-${taskId}`;
  return await getFromCache(key);
};

// Store a project in cache
const storeProject = async (project) => {
  const key = `project-${project.id}`; // Use project ID for unique cache key
  await storeInCache(key, project);
};

// Get a project from cache
const getProject = async (projectId) => {
  const key = `project-${projectId}`;
  return await getFromCache(key);
};

// Store all projects in cache (useful for managing multiple projects)
const storeAllProjects = async (projects) => {
  const key = 'projects'; // Cache all projects under a common key
  await storeInCache(key, projects);
};

// Get all projects from cache
const getAllProjects = async () => {
  const key = 'projects';
  return await getFromCache(key);
};

// Store user data and optionally an image
const storeUserData = async (userData, imageFile) => {
    const userKey = `user-${userData.id}`; // Unique cache key for user data
    await storeInCache(userKey, userData);
  
    // If an image is provided, store it as well
    if (imageFile) {
      const imgKey = `user-image-${userData.id}`;
      
      // Directly use the imageFile, which is already a Blob
      const imageData = await imageFile.arrayBuffer(); // This will return an ArrayBuffer
      await storeInCache(imgKey, imageData); // Store image as ArrayBuffer in the cache
    }
  };

// Get user data from cache
const getUserData = async (userId) => {
  const key = `user-${userId}`;
  return await getFromCache(key);
};

// Get user image from cache and convert it to an object URL
const getUserImage = async (userId) => {
    const key = `user-image-${userId}`;
    const imageData = await getFromCache(key);
    if (imageData) {
      const blob = new Blob([imageData]);
      return URL.createObjectURL(blob); // Convert image data to URL for displaying
    }
    return null;
  };

// Get all users from cache (returns an array of users)
const getAllUsers = async () => {
    const cache = await caches.open('data-cache-v1');
    const keys = await cache.keys();
  
    // Filter only the keys that start with 'user-'
    const userKeys = keys.filter(key => {
      if (key && typeof key === 'string') {
        return key.startsWith('user-');
      }
      return false; // Skip invalid keys
    });
  
    // Fetch and return the users based on the filtered keys
    const users = await Promise.all(
      userKeys.map(async (key) => {
        const response = await cache.match(key);
        const userData = await response.json();
        return userData;
      })
    );
  
    return users;
  };
  
  

export {
  storeTask,
  getTask,
  storeProject,
  getProject,
  storeAllProjects,
  getAllProjects,
  storeUserData,
  getUserData,
  getUserImage,
  getAllUsers,
};
