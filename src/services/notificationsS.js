
export const checkTasksDueDates = async () => {
  // Open the cache
  const cache = await caches.open("data-cache-v1");
  const keys = await cache.keys();


  // Filter task keys
  const taskKeys = keys.filter((request) => request.url.includes("task-"));
 

  // Retrieve tasks from cache
  const tasks = await Promise.all(
    taskKeys.map(async (request) => {
      const response = await cache.match(request);
      if (!response) {
        console.warn("No response found for key:", request.url);
      }
      try {
        const taskData = response ? await response.json() : null;
        return taskData;
      } catch (error) {
        console.error("Error parsing JSON for key:", request.url, error);
        return null;
      }
    })
  );


  // Date calculation
  const currentDate = new Date();
  const twoDaysLater = new Date();
  twoDaysLater.setDate(currentDate.getDate() + 2);

  // Filter tasks by due date
  const dueTasks = tasks.filter((task) => {
    if (task && task.date) {
      const dueDate = new Date(`${task.date}T00:00:00Z`);
      const isDueSoon = dueDate >= currentDate && dueDate <= twoDaysLater;
      return isDueSoon;
    }
    return false;
  });

  return dueTasks;
};

  
  export const sendTaskDueNotification = (task) => {
    if (Notification.permission === "granted") {
      try {
        // Ensure the task.date is a valid string in the format YYYY-MM-DD
        const dueDate = new Date(task.date);
        
    
        // Check if the date is valid
        if (isNaN(dueDate)) {
          console.error("Invalid date for task:", task.date);
        } else {
          // Format the due date to a readable format
          const dueDateFormatted = dueDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
    
          // Create the notification
          const notification = new Notification(`Task "${task.title}" is due soon!`, {
            body: `Due on: ${dueDateFormatted}`,
            icon: "/path/to/your/icon.png",
          });
    
        }
      } catch (error) {
        console.error("Error creating notification for task:", task, error);
      }
    }
    
    
  };    
  
  export const requestNotificationPermission = async () => {
    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted.");
      } else {
        console.log("Notification permission denied.");
      }
    }
  };
  