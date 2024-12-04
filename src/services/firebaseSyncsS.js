import { v4 as uuidv4 } from 'uuid';
import { storeInCache, getFromCache } from './cacheUtils';

// Store or retrieve a unique device-specific key
export const getDeviceKey = async () => {
  let deviceKey = await getFromCache('device-key');
  if (!deviceKey) {
    deviceKey = uuidv4();
    await storeInCache('device-key', deviceKey);
  }
  return deviceKey;
};

// List boards for the current device
// List boards for the current device with cache check
// List boards for the current device, with proper seed handling
export const listDeviceBoards = async (firebaseUrl) => {
  let deviceKey = await getDeviceKey();

  // If no deviceKey is found, generate a new one and store it in cache
  if (!deviceKey) {
    deviceKey = uuidv4(); // Generate a new UUID as the device key
    await storeInCache('device-key', deviceKey); // Store the new device key in cache
  }

  try {
    // Retrieve the boards from local cache first
    let cachedBoards = await getFromCache('boards');
    
    if (!cachedBoards) {
      // If not in cache, fetch data from Firebase
      const response = await fetch(`${firebaseUrl}/boards/.json`);
      if (!response.ok) {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        return [];
      }

      const data = await response.text();
      let allBoards = {};
      
      // Try parsing the response as JSON
      try {
        allBoards = JSON.parse(data);
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        console.error("Response data:", data);
        return [];
      }

      // Store the boards locally in cache
      await storeInCache('boards', allBoards);
      return Object.entries(allBoards).filter(
        ([key, board]) => board.deviceKey === deviceKey
      ); // Return boards from Firebase
    }

    // If boards are available in cache, return them
    return Object.entries(cachedBoards);

  } catch (error) {
    console.error("Error listing device-specific boards:", error);
    return [];
  }
};



// Create a new board for the current device
// Modify createNewBoard to accept a name
// Create a new board for the current device and store it in Firebase and cache
export const createNewBoard = async (firebaseUrl, boardName) => {
  const seed = uuidv4().slice(0, 4); // Generate a unique seed for the board
  const deviceKey = await getDeviceKey();

  if (!firebaseUrl) {
    console.error("Firebase URL is not defined.");
    return null;
  }

  const boardData = { seed, deviceKey, name: boardName }; // Ensure seed is part of the board data

  try {
    // Create the board in Firebase using the seed
    const response = await fetch(`${firebaseUrl}/boards/${seed}/.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(boardData),
    });

    if (!response.ok) {
      console.error(`Error creating board: ${response.status} - ${response.statusText}`);
      return null;
    }

    // After successful creation in Firebase, store it locally as well
    await storeInCache('board-' + seed, boardData);

    // Update the boards list in local cache
    let boardsFromCache = await getFromCache('boards') || {};
    boardsFromCache[seed] = boardData;
    await storeInCache('boards', boardsFromCache); // Update boards cache

    return boardData; // Return the newly created board data
  } catch (error) {
    console.error("Error creating new board:", error);
    return null;
  }
};





// Consolidate cache using a specific seed
// Consolidate cache using a specific seed
export const consolidateCacheBySeed = async (seed, localCache, firebaseUrl) => {
  try {
    const response = await fetch(`${firebaseUrl}/boards/${seed}.json`);
    if (response.ok) {
      const remoteCache = await response.json();
      
      // Compare timestamps to decide which version is newer
      if (localCache && isLocalCacheNewer(localCache.timestamp, remoteCache.timestamp)) {
        // Local cache is newer, keep it and update Firebase if necessary
        await uploadBoardCacheToFirebase(seed, localCache, firebaseUrl);
      } else {
        // Remote cache is newer, update the local cache
        await storeInCache(`board-${seed}`, remoteCache);
      }
      return remoteCache;
    }
    return localCache; // Return local cache if no response
  } catch (error) {
    console.error("Error consolidating cache by seed:", error);
    return localCache;
  }
};


// Download board cache from Firebase
// Download board cache from Firebase and store locally
export const downloadBoardCacheFromFirebase = async (firebaseUrl, seed) => {

  try {
    const response = await fetch(`${firebaseUrl}/boards/${seed}.json`);
    if (response.ok) {
      const boardData = await response.json();
      await storeInCache(`board-${seed}`, boardData); // Store locally
      return boardData;
    }
    return null; // Return null if failed
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
export const syncCacheWithFirebase = async (localCache, firebaseUrl) => {
  try {
    await fetch(`${firebaseUrl}/boards/.json`, {
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




// New function to find a board by seed, update if needed, and store in cache
export const updateBoardBySeed = async (firebaseUrl, seed) => {
  try {
    // Fetch the board data from Firebase using the seed
    const response = await fetch(`${firebaseUrl}/boards/${seed}.json`);
    if (!response.ok) {
      console.error(`Error fetching board with seed ${seed}: ${response.status} - ${response.statusText}`);
      return null; // Return null if there's an error
    }

    const firebaseBoardData = await response.json();

    // Check if board is already cached
    const cachedBoardData = await getFromCache(`board-${seed}`);

    if (!cachedBoardData) {
      // If no cached data, store the board in the cache
      await storeInCache(`board-${seed}`, firebaseBoardData);
      console.log(`Board with seed ${seed} cached successfully.`);
      return firebaseBoardData; // Return the Firebase board data if it wasn't in cache
    }

    // If cached board data exists, check if the cache is newer
    if (isLocalCacheNewer(cachedBoardData.timestamp, firebaseBoardData.timestamp)) {
      // Cache is newer, update Firebase with the cached data
      const updateResponse = await fetch(`${firebaseUrl}/boards/${seed}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cachedBoardData), // Upload cached data to Firebase
      });

      if (!updateResponse.ok) {
        console.error(`Error updating board with seed ${seed} in Firebase.`);
        return null;
      }

      console.log(`Board with seed ${seed} updated in Firebase with cached data.`);
      return cachedBoardData;
    }

    // Otherwise, return the Firebase board data (it's up-to-date or newer)
    console.log(`Board with seed ${seed} is up-to-date.`);
    return firebaseBoardData;
  } catch (error) {
    console.error("Error in updateBoardBySeed:", error);
    return null;
  }
};

