// src/calls/axiosInstance.js
import axios from 'axios';
import { API_CONFIG } from '../utilities/api/config';
import { createInterceptors } from '../utilities/api/interceptors';

/**
 * Determine the appropriate environment configuration
 * @returns {Object} Environment-specific API configuration
 */
const getEnvironmentConfig = () => {
// Get current environment, default to development
const env = import.meta.env.NODE_ENV || 'development';
return API_CONFIG.ENVIRONMENTS[env.toUpperCase()];
};
/**
 * Create a configured Axios instance
 * Includes environment-specific settings and default headers
 */
const axiosInstance = axios.create({
// Spread environment-specific configuration
...getEnvironmentConfig(),

// Default headers for all requests
headers: {
'Content-Type': 'application/json',
'Accept': 'application/json',
},
// Enable sending cookies cross-origin
withCredentials: true,
});
// Apply request/response interceptors
createInterceptors(axiosInstance);

export { axiosInstance };