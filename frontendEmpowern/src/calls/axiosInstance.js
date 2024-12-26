// src/calls/axiosInstance.js
// import axios from 'axios';
// import { API_CONFIG } from '../utilities/api/config';
// import { createInterceptors } from '../utilities/api/interceptors';

// const getEnvironmentConfig = () => {
// const env = import.meta.env.NODE_ENV || 'development';
// return API_CONFIG.ENVIRONMENTS[env.toUpperCase()];
// };
// const axiosInstance = axios.create({
// ...getEnvironmentConfig(),
// headers: {
// 'Content-Type': 'application/json',
// 'Accept': 'application/json',
// },
// withCredentials: true,
// });
// createInterceptors(axiosInstance);
// export { axiosInstance };

import axios from 'axios';
export const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 5000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});
// Add error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);