import { v4 as uuidv4 } from 'uuid';
import { storeInCache, getFromCache } from './cacheUtils';

// Generate and manage seeds (board identifiers)
export const createNewBoard = async (firebaseUrl) => {
  const seed = uuidv4().slice(0, 8);  // Generate unique seed
  const seedKey = `${firebaseUrl}/boards/${seed}`;

  // Store seed information for the new board in Firebase and cache
  try {
    await storeInCache("current-seed", seed);  // Store the seed in the local cache
    await fetch(seedKey, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seed }),
    });
    console.log("New board (seed) created:", seed);
    return seed;
  } catch (error) {
    console.error("Error creating new board:", error);
    return null;
  }
};

// List all boards
export const listAllBoards = async (firebaseUrl) => {
  try {
    const response = await fetch(`${firebaseUrl}/boards.json`);
    if (response.ok) {
      return await response.json(); // Return list of all board seeds
    }
    return null;
  } catch (error) {
    console.error("Error listing boards:", error);
    return null;
  }
};

export const getOrGenerateSeed = async (firebaseUrl) => {
  const seedKey = "current-seed";
  let seed = await getFromCache(seedKey);

  if (!seed) {


    try {
      const response = await fetch(`${firebaseUrl}/boards/${seedKey}.json`);
      if (response.ok) {
        const remoteSeed = await response.json();
        if (remoteSeed) {
          seed = remoteSeed;
          console.log("Seed fetched from Firebase:", seed);

          await storeInCache(seedKey, seed);
        }
      }
    } catch (error) {
      console.error("Error fetching seed from Firebase:", error);
    }
  }

  if (!seed) {
    seed = uuidv4().slice(0, 8);
    console.log("Generated new seed:", seed);

    await storeInCache(seedKey, seed);
    try {
      await fetch(`${firebaseUrl}/boards/${seedKey}.json`, {
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

// Consolidate cache data per board (seed)
export const consolidateCacheBySeed = async (seed) => {
  const cache = await caches.open("data-cache-v1");
  const keys = await cache.keys();

  const consolidatedData = {};

  for (const key of keys) {
    if (key.url.includes(seed)) {
      const response = await cache.match(key);
      if (response) {
        const data = await response.json();
        const keyName = key.url.split('/').pop(); // Extract key name
        consolidatedData[keyName] = data;
      }
    }
  }

  return consolidatedData;
};

// Upload board-specific cache data to Firebase
export const uploadBoardCacheToFirebase = async (firebaseUrl, seed, cacheData) => {
  const url = `${firebaseUrl}/boards/${seed}.json`;
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cacheData),
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to upload board cache to Firebase:", error);
    return false;
  }
};

// Download board-specific cache from Firebase
export const downloadBoardCacheFromFirebase = async (firebaseUrl, seed) => {
  const url = `${firebaseUrl}/boards/${seed}.json`;

  try {
    const response = await fetch(url);
    const contentType = response.headers.get('Content-Type');


    if (response.ok) {
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        const responseText = await response.text();
        console.error(`Unexpected content type: ${contentType}`);
        console.error(`Response body: ${responseText}`);
        return null;
      }
    } else {
      const errorText = await response.text();
      console.error(`Error response: ${response.status} - ${errorText}`);
      return null;
    }
  } catch (error) {
    console.error("Failed to download board cache from Firebase:", error);
    return null;
  }
};





export const syncCacheWithFirebase = async (firebaseUrl, conditionFn) => {
  const seed = await getOrGenerateSeed(firebaseUrl);
  const localCache = await consolidateCacheBySeed(seed);
  const remoteCache = await downloadBoardCacheFromFirebase(firebaseUrl, seed);

  if (conditionFn(localCache, remoteCache)) {
    await uploadBoardCacheToFirebase(firebaseUrl, seed, localCache);
  } else {
    for (const [key, value] of Object.entries(remoteCache)) {
      await storeInCache(key, value);
    }
  }
};

export const setupEventListeners = (firebaseUrl) => {
  window.addEventListener('online', async () => {
    console.log("Internet connection restored. Syncing cache...");
    await syncCacheWithFirebase(firebaseUrl, isLocalCacheNewer);
  });
};

export const isLocalCacheNewer = (localCache, remoteCache) => {
  if (!remoteCache) return true;
  return localCache.timestamp > remoteCache.timestamp;  // Compare timestamps
};
