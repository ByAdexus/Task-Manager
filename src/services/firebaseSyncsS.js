import { v4 as uuidv4 } from 'uuid';
import { storeInCache, getFromCache } from './cacheUtils';


// Event sync with Firebase Realtime Database

// Check if a seed already exists in the cache or Firebase
export const getOrGenerateSeed = async (firebaseUrl) => {
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
  export const consolidateCache = async () => {
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
  export const uploadCacheToFirebase = async (firebaseUrl, seed, cacheData) => {
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
  export const downloadCacheFromFirebase = async (firebaseUrl, seed) => {
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
 export const syncCacheWithFirebase = async (firebaseUrl, conditionFn) => {
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
 export const isLocalCacheNewer = (localCache, remoteCache) => {
    if (!remoteCache) return true; // No remote data, upload local cache
    return localCache.timestamp > remoteCache.timestamp; // Compare timestamps
  };
  
  // Trigger cache sync on specific events
 export  const setupEventListeners = (firebaseUrl) => {
    window.addEventListener('online', async () => {
      console.log("Internet connection restored. Syncing cache...");
      await syncCacheWithFirebase(firebaseUrl, isLocalCacheNewer);
    });
  };