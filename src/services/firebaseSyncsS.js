import { v4 as uuidv4 } from 'uuid';
import { storeInCache, getFromCache } from './cacheUtils';

// Store or retrieve a unique device-specific key
const getDeviceKey = async () => {
  let deviceKey = await getFromCache('device-key');
  if (!deviceKey) {
    deviceKey = uuidv4();
    await storeInCache('device-key', deviceKey);
  }
  return deviceKey;
};

// List boards for the current device
export const listDeviceBoards = async (firebaseUrl) => {
  let deviceKey = await getDeviceKey();

  // If no deviceKey is found, generate a new one and store it in cache
  if (!deviceKey) {
    deviceKey = uuidv4(); // Generate a new UUID as the device key
    await storeInCache('device-key', deviceKey); // Store the new device key in cache
  }

  try {
    // Fetch data from Firebase
    const response = await fetch(`${firebaseUrl}/boards.json`);
    
    // Check if response is not OK (not 2xx status)
    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      return []; // Return empty array if the response is not OK
    }

    // Read the response as text first
    const data = await response.text();

    let allBoards = {};
    
    // Try to parse the text as JSON
    try {
      allBoards = JSON.parse(data);
    } catch (jsonError) {
      console.error("Error parsing JSON:", jsonError);
      console.error("Response data:", data); // Log the actual response to inspect it
      return []; // Return empty array if parsing fails
    }

    // Filter the boards based on the deviceKey
    return Object.values(allBoards).filter(board => board.deviceKey === deviceKey);
  } catch (error) {
    console.error("Error listing device-specific boards:", error);
    return [];
  }
};

// Create a new board for the current device
// Modify createNewBoard to accept a name
export const createNewBoard = async (firebaseUrl, boardName) => {
  const seed = uuidv4().slice(0, 8); // Generate unique seed
  const deviceKey = await getDeviceKey();

  if (!firebaseUrl) {
    console.error("Firebase URL is not defined.");
    return null;
  }

  const boardData = { seed, deviceKey, name: boardName }; // Use boardName here

  try {
    const response = await fetch(`${firebaseUrl}/boards/${seed}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(boardData),
    });

    if (!response.ok) {
      console.error(`Error creating board: ${response.status} - ${response.statusText}`);
      return null;
    }

    return boardData; // Return the newly created board data
  } catch (error) {
    console.error("Error creating new board:", error);
    return null;
  }
};



// Consolidate cache using a specific seed
export const consolidateCacheBySeed = async (seed, localCache, firebaseUrl) => {
  try {
    const response = await fetch(`${firebaseUrl}/boards/${seed}.json`);
    if (response.ok) {
      const remoteCache = await response.json();
      const updatedCache = { ...localCache, ...remoteCache };
      await storeInCache(`board-${seed}`, updatedCache);
      return updatedCache;
    }
    return localCache;
  } catch (error) {
    console.error("Error consolidating cache by seed:", error);
    return localCache;
  }
};

// Download board cache from Firebase
export const downloadBoardCacheFromFirebase = async (firebaseUrl, seed) => {
  try {
    const response = await fetch(`${firebaseUrl}/boards/${seed}.json`);
    if (response.ok) {
      const boardData = await response.json();
      await storeInCache(`board-${seed}`, boardData);
      return boardData;
    }
    return null;
  } catch (error) {
    console.error("Error downloading board cache from Firebase:", error);
    return null;
  }
};

// Generate or retrieve a unique seed
export const getOrGenerateSeed = async (cacheKey) => {
  let seed = await getFromCache(cacheKey);
  if (!seed) {
    seed = uuidv4().slice(0, 8);
    await storeInCache(cacheKey, seed);
  }
  return seed;
};

// Check if the local cache is newer than the remote version
export const isLocalCacheNewer = (localTimestamp, remoteTimestamp) => {
  return new Date(localTimestamp) > new Date(remoteTimestamp);
};

// Setup event listeners for real-time updates (placeholder implementation)
export const setupEventListeners = (firebaseUrl, onUpdateCallback) => {
  console.log("Event listeners not implemented yet. Use polling or Firebase listeners.");
};

// Sync local cache with Firebase
export const syncCacheWithFirebase = async (seed, localCache, firebaseUrl) => {
  try {
    await fetch(`${firebaseUrl}/boards/${seed}.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(localCache),
    });
    console.log("Cache synced with Firebase.");
  } catch (error) {
    console.error("Error syncing cache with Firebase:", error);
  }
};

// Upload local cache to Firebase
export const uploadBoardCacheToFirebase = async (seed, cacheData, firebaseUrl) => {
  try {
    await fetch(`${firebaseUrl}/boards/${seed}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cacheData),
    });
    console.log("Cache uploaded to Firebase.");
  } catch (error) {
    console.error("Error uploading board cache to Firebase:", error);
  }
};
