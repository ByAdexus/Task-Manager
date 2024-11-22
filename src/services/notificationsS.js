
export const checkTasksDueDates = async () => {
    const cache = await caches.open("data-cache-v1");
    const keys = await cache.keys();
    const taskKeys = keys.filter((request) => request.url.includes("task-"));
  
    const tasks = await Promise.all(
      taskKeys.map(async (request) => {
        const response = await cache.match(request);
        return response ? await response.json() : null;
      })
    );
  
    const currentDate = new Date();
    const twoDaysLater = new Date();
    twoDaysLater.setDate(currentDate.getDate() + 2);
  
    return tasks.filter((task) => {
      if (task && task.date) {
        const dueDate = new Date(`${task.date}T00:00:00Z`);
        return dueDate >= currentDate && dueDate <= twoDaysLater;
      }
      return false;
    });
  };
  
  export const sendTaskDueNotification = (task) => {
    if (Notification.permission === "granted") {
      const dueDateFormatted = new Date(`${task.date}T00:00:00Z`).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
  
      const notification = new Notification(`Task "${task.title}" is due soon!`, {
        body: `Due on: ${dueDateFormatted}`,
        icon: "/path/to/your/icon.png",
      });
  
      notification.onclick = () => {
        // Optionally handle click
      };
    } else {
      console.log("Notification permission not granted.");
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
  