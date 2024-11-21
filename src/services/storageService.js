import { v4 as uuidv4 } from 'uuid'; // For generating unique seeds
// Wrapper for caching service

// In-memory task storage (tasks are saved here when created)
let tasks = {}; // Store tasks in memory for fast access

// Helper function to store data in the cache
const storeInCache = async (key, data) => {
  const cache = await caches.open("data-cache-v1");
  await cache.put(key, new Response(JSON.stringify(data)));
};

// Helper function to retrieve data from the cache
const getFromCache = async (key) => {
  const cache = await caches.open("data-cache-v1");
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
  const key = "projects"; // Cache all projects under a common key
  console.log (key, projects);
  await storeInCache(key, projects);
};

// Get all projects from cache
const getAllProjects = async () => {
  const key = "projects";
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
  const cache = await caches.open("data-cache-v1");
  const keys = await cache.keys();

  // Filter only the keys whose URL contains 'user-'
  const userKeys = keys.filter((request) => request.url.includes("user-"));

  // Fetch and return the users based on the filtered keys
  const users = await Promise.all(
    userKeys.map(async (request) => {
      const response = await cache.match(request);
      return response ? await response.json() : null;
    })
  );

  return users.filter(user => user !== null); // Filter out any null values
};

// Check and notify tasks nearing their due date
const checkTasksDueDates = async () => {
  const cache = await caches.open("data-cache-v1");
  const keys = await cache.keys();

  // Filter only the keys whose URL contains 'task-'
  const taskKeys = keys.filter((request) => request.url.includes("task-"));

  // Fetch tasks using the filtered taskKeys
  const tasks = await Promise.all(
    taskKeys.map(async (request) => {
      const response = await cache.match(request);
      return response ? await response.json() : null;
    })
  );

  // Current date and date range (next 2 days)
  const currentDate = new Date();
  const twoDaysLater = new Date();
  twoDaysLater.setDate(currentDate.getDate() + 2);

  // Filter tasks based on their due date
  const dueTasks = tasks.filter(task => {
    if (task && task.date) {
      const dueDate = new Date(`${task.date}T00:00:00Z`);
      // Ensure the due date falls within the next two days
      return dueDate >= currentDate && dueDate <= twoDaysLater;
    }
    return false;
  });

  return dueTasks;
};


// Function to send a notification about the task
const sendTaskDueNotification = (task) => {
  if (Notification.permission === "granted") {
    // Format the due date for display
    const dueDateFormatted = new Date(`${task.date}T00:00:00Z`).toLocaleDateString('en-US', {
      weekday: 'long',   // Example: "Monday"
      year: 'numeric',   // Example: "2024"
      month: 'long',     // Example: "November"
      day: 'numeric',    // Example: "11"
    });

    const notification = new Notification(`Task "${task.title}" is due soon!`, {
      body: `Due on: ${dueDateFormatted}`, // Display the formatted due date
      icon: "/path/to/your/icon.png", // Optional: icon for the notification
    });

    notification.onclick = () => {
      // Optionally, add logic here to focus on the task page
    };
  } else {
    console.log("Notification permission not granted.");
  }
};

// Request notification permission
const requestNotificationPermission = async () => {
  if (Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    } else {
      console.log('Notification permission denied.');
    }
  }
};

// Edit task in cache and memory
const editTask = async (taskId, updatedData) => {
  const task = await getTask(taskId);
  if (task) {
    const updatedTask = { ...task, ...updatedData };
    await storeTask(updatedTask); // Updates task in cache
    tasks[taskId] = updatedTask; // Updates in-memory as well
  }
};

// Delete task from cache and memory
const deleteTask = async (taskId) => {
  delete tasks[taskId]; // Remove from memory
  const cache = await caches.open("data-cache-v1");
  await cache.delete(`task-${taskId}`); // Remove from cache
};








//Event sync with firebase realtime database made by the fucking fuchsy







// Event sync with Firebase Realtime Database

// Check if a seed already exists in the cache or Firebase
const getOrGenerateSeed = async (firebaseUrl) => {
  const seedKey = "current-seed";

  // Check if the seed exists in the cache
  let seed = await getFromCache(seedKey);

  if (!seed) {
    console.log("Seed not found in cache. Checking Firebase...");

    // Fetch seed from Firebase if it exists
    try {
      const response = await fetch(`${firebaseUrl}/${seedKey}.json`);
      if (response.ok) {
        const remoteSeed = await response.json();
        if (remoteSeed) {
          seed = remoteSeed;
          console.log("Seed fetched from Firebase:", seed);

          // Store the fetched seed in the cache for future use
          await storeInCache(seedKey, seed);
        }
      }
    } catch (error) {
      console.error("Error fetching seed from Firebase:", error);
    }
  }

  if (!seed) {
    // Generate a new seed if none exists
    seed = uuidv4().slice(0, 8);
    console.log("Generated new seed:", seed);

    // Save the new seed in both cache and Firebase
    await storeInCache(seedKey, seed);
    try {
      await fetch(`${firebaseUrl}/${seedKey}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seed),
      });
      console.log("Seed saved to Firebase.");
    } catch (error) {
      console.error("Error saving seed to Firebase:", error);
    }
  }

  return seed;
};

// Consolidate all cached data into a single object
const consolidateCache = async () => {
  const cache = await caches.open("data-cache-v1");
  const keys = await cache.keys();

  const consolidatedData = {};

  // Fetch and aggregate all cached data
  for (const key of keys) {
    const response = await cache.match(key);
    if (response) {
      const data = await response.json();
      const keyName = key.url.split('/').pop(); // Extract key name
      consolidatedData[keyName] = data;
    }
  }

  return consolidatedData;
};

// Upload consolidated cache to Firebase
const uploadCacheToFirebase = async (firebaseUrl, seed, cacheData) => {
  const url = `${firebaseUrl}/${seed}.json`;
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cacheData),
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to upload cache to Firebase:", error);
    return false;
  }
};

// Download the latest version of the cache from Firebase
const downloadCacheFromFirebase = async (firebaseUrl, seed) => {
  const url = `${firebaseUrl}/${seed}.json`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Failed to download cache from Firebase:", error);
    return null;
  }
};

// Sync cache with Firebase (update or upload based on conditions)
const syncCacheWithFirebase = async (firebaseUrl, conditionFn) => {
  const seed = await getOrGenerateSeed(firebaseUrl); // Ensure consistent seed
  const localCache = await consolidateCache();
  const remoteCache = await downloadCacheFromFirebase(firebaseUrl, seed);

  if (conditionFn(localCache, remoteCache)) {
    await uploadCacheToFirebase(firebaseUrl, seed, localCache);
  } else {
    // Update local cache with remote data
    for (const [key, value] of Object.entries(remoteCache)) {
      await storeInCache(key, value);
    }
  }
};

// Example condition function: Check if local cache has more recent data
const isLocalCacheNewer = (localCache, remoteCache) => {
  if (!remoteCache) return true; // No remote data, upload local cache
  return localCache.timestamp > remoteCache.timestamp; // Compare timestamps
};

// Trigger cache sync on specific events
const setupEventListeners = (firebaseUrl) => {
  window.addEventListener('online', async () => {
    console.log("Internet connection restored. Syncing cache...");
    await syncCacheWithFirebase(firebaseUrl, isLocalCacheNewer);
  });
};

export {
  storeTask,
  getTask,
  editTask,
  deleteTask,
  storeProject,
  getProject,
  storeAllProjects,
  getAllProjects,


  storeUserData,
  getUserData,
  getUserImage,
  getAllUsers,


  checkTasksDueDates,
  sendTaskDueNotification,
  requestNotificationPermission,


  consolidateCache,
  uploadCacheToFirebase,
  downloadCacheFromFirebase,
  syncCacheWithFirebase,
  setupEventListeners,
  getOrGenerateSeed, 
  isLocalCacheNewer,
};
