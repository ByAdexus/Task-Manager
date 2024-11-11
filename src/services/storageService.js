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

  // Now filter tasks based on their due date
  const currentDate = new Date();
  const dueTasks = tasks.filter(task => {
    if (task && task.date) {
      const dueDate = new Date(`${task.date}T00:00:00Z`);
      return dueDate < currentDate.setDate(currentDate.getDate() + 1); // Check if due date is within the next 3 days
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
  checkTasksDueDates,
  sendTaskDueNotification,
  requestNotificationPermission,
};
