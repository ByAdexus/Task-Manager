import { storeInCache, getFromCache } from './cacheUtils';

// Store user data with seed as prefix
export const storeUser = async (seed, user) => {
  const key = `${seed}-user-${user.id}`;  // Prefix user with seed

  await storeInCache(key, user);
};

// Get user data with seed as prefix
export const getUser = async (seed, userId) => {
  const key = `${seed}-user-${userId}`;  // Prefix user with seed

  return await getFromCache(key);
};

// Store user data and image with seed as prefix
export const storeUserData = async (seed, userData, imageFile) => {
  if (!userData || !userData.id) {
    console.error("Missing user data or user ID", userData);
    return;
  }

  const userKey = `${seed}-user-${userData.id}`; // Ensure user data is stored with the correct key


  // Store user data in cache
  await storeInCache(userKey, userData);

  // Store image data if provided
  if (imageFile) {
    const imgKey = `${seed}-user-image-${userData.id}`;
    const imageData = await imageFile.arrayBuffer();

    await storeInCache(imgKey, imageData);
  }
};

// Get user data with seed as prefix
export const getUserData = async (seed, userId) => {
  const key = `${seed}-user-${userId}`;  // Prefix user with seed

  return await getFromCache(key);
};

// Get user image with seed as prefix
export const getUserImage = async (seed, userId) => {
  const key = `${seed}-user-image-${userId}`;  // Prefix image with seed
  const imageData = await getFromCache(key);
  if (imageData) {
    const blob = new Blob([imageData]);
    return URL.createObjectURL(blob);
  }
  return null;
};

// Get all users from cache
// Get all users from cache
export const getAllUsers = async (seed) => {
  try {
    const cache = await caches.open("data-cache-v1"); // Same cache name
    const keys = await cache.keys();


    // Filter keys that contain the user data, ensuring we match the seed in the key
    const userKeys = keys.filter((request) => {
      const url = request.url;
      const userKeyPattern = new RegExp(`${seed}-user-`); // Create a pattern to match seed
      return userKeyPattern.test(url);
    });


    if (userKeys.length === 0) {
      console.warn("No users found in cache for this seed.");
      return []; // Return empty array if no users are found
    }

    // Fetch users from cache
    const users = await Promise.all(
      userKeys.map(async (request) => {
        const response = await cache.match(request);
        if (response) {
          try {
            return await response.json();
          } catch (e) {
            console.error("Error parsing user data", e);
            return null;
          }
        }
        return null;
      })
    );

    return users.filter(user => user !== null); // Filter out null values
  } catch (error) {
    console.error("Error loading users from cache:", error);
    return []; // Return empty array in case of error
  }
};

