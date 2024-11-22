// src/services/usersS.js
import { storeInCache, getFromCache } from './cacheUtils';

export const storeUserData = async (userData, imageFile) => {
  const userKey = `user-${userData.id}`;
  await storeInCache(userKey, userData);

  if (imageFile) {
    const imgKey = `user-image-${userData.id}`;
    const imageData = await imageFile.arrayBuffer();
    await storeInCache(imgKey, imageData);
  }
};

export const getUserData = async (userId) => {
  const key = `user-${userId}`;
  return await getFromCache(key);
};

export const getUserImage = async (userId) => {
  const key = `user-image-${userId}`;
  const imageData = await getFromCache(key);
  if (imageData) {
    const blob = new Blob([imageData]);
    return URL.createObjectURL(blob);
  }
  return null;
};

export const getAllUsers = async () => {
  const cache = await caches.open("data-cache-v1");
  const keys = await cache.keys();

  const userKeys = keys.filter((request) => request.url.includes("user-"));

  const users = await Promise.all(
    userKeys.map(async (request) => {
      const response = await cache.match(request);
      return response ? await response.json() : null;
    })
  );

  return users.filter(user => user !== null);
};