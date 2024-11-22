// src/utils/cacheUtils.js

// Store data in the cache
export const storeInCache = async (key, data) => {
  const cache = await caches.open("data-cache-v1");
  await cache.put(key, new Response(JSON.stringify(data)));
};

// Retrieve data from the cache
export const getFromCache = async (key) => {
  const cache = await caches.open("data-cache-v1");
  const response = await cache.match(key);
  return response ? await response.json() : null;
};

// Delete data from teh cache
export const deleteFromCache = async (key) => {
  const cache = await caches.open("data-cache-v1");
  await cache.delete(key);
};
