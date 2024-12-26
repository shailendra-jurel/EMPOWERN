// src/utils/api/cache.js
/**
 * API Caching Class
 * Provides an in-memory caching mechanism for API responses
 * with time-to-live (TTL) functionality
 */
export class ApiCache {
constructor() {
    // Map to store cached data
    this.data = new Map();
    // Map to store timeout references for cache invalidation
    this.timeouts = new Map();
}
/**
 * Retrieve cached data or fetch new data
 * 
 * @param {string} key - Unique cache key
 * @param {Function} fetchFn - Function to fetch data if not in cache
 * @param {number} ttl - Time to live in milliseconds (default 5 minutes)
 * @returns {Promise} Cached or freshly fetched data
 */
async get(key, fetchFn, ttl = 5 * 60 * 1000) {
    // Check if data is already in cache
    if (this.data.has(key)) {
    return this.data.get(key);
    }

    // Fetch new data if not in cache
    const data = await fetchFn();
    // Store the new data in cache
    this.set(key, data, ttl);
    return data;
}

set(key, data, ttl) {
    // Store data in cache
    this.data.set(key, data);
    // Clear any existing timeout for this key
    if (this.timeouts.has(key)) {
    clearTimeout(this.timeouts.get(key));
    }

    // Set a timeout to remove the cache entry after TTL
    this.timeouts.set(key, setTimeout(() => {
    this.data.delete(key);
    this.timeouts.delete(key);
    }, ttl));
}
}

/*
*  cache.js is used to store the  api response in the cache memory for a certain time period.
*  It has two main functions get and set.
*  get function is used to get the data from the cache memory if it is already present in the memory.
*  If the data is not present in the cache memory then it fetches the data from the api and stores it in the cache memory.
*  set function is used to store the data in the cache memory with a certain time period.
*  It also has a timeout function which removes the cache entry after the time period is over.
*  The cache memory is stored in the form of a map.
*  The cache memory is cleared after the time period is over.
*  The cache memory is used to store the api response to reduce the time taken to fetch the data from the api.
*  It is used to store the data temporarily in the memory


*/
