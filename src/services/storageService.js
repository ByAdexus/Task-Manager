// src/services/storageService.js
import { storeProject, getProject, storeAllProjects, getAllProjects, storeTask, getTask, deleteTask, editTask } from './projectsS';
import { storeUserData, getUserData, getUserImage, getAllUsers } from './usersS';
import {   checkTasksDueDates,
  sendTaskDueNotification,
  requestNotificationPermission} from './notificationsS'
  import {  consolidateCache,
    uploadCacheToFirebase,
    downloadCacheFromFirebase,
    syncCacheWithFirebase,
    setupEventListeners,
    getOrGenerateSeed, 
    isLocalCacheNewer,} from './firebaseSyncsS'
// Import other modules similarly...

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
