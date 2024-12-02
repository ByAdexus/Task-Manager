import { storeProject, getProject, storeAllProjects, getAllProjects, storeTask, getTask, deleteTask, editTask } from './projectsS';
import { storeUserData, getUserData, getUserImage, getAllUsers } from './usersS';
import { checkTasksDueDates, sendTaskDueNotification, requestNotificationPermission } from './notificationsS';
import { 
  consolidateCacheBySeed, 
  uploadBoardCacheToFirebase, 
  downloadBoardCacheFromFirebase, 
  syncCacheWithFirebase, 
  setupEventListeners, 
  getOrGenerateSeed, 
  isLocalCacheNewer 
} from './firebaseSyncsS';

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

  consolidateCacheBySeed,  // Corrected name
  uploadBoardCacheToFirebase,  // Corrected name
  downloadBoardCacheFromFirebase,  // Corrected name
  syncCacheWithFirebase,
  setupEventListeners,
  getOrGenerateSeed,
  isLocalCacheNewer,

};
