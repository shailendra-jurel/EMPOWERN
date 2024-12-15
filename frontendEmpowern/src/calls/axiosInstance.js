// import axios from 'axios';

// const axiosInstance = axios.create({
//     baseURL: 'https://labor-employement.onrender.com/api', // Replace with your API URL
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// export { axiosInstance };




// src/calls/axiosInstance.js
import axios from 'axios';
import { API_CONFIG } from '../utilities/api/config';
import { createInterceptors } from '../utilities/api/interceptors';

const getEnvironmentConfig = () => {
const env = import.meta.env.NODE_ENV || 'development';
return API_CONFIG.ENVIRONMENTS[env.toUpperCase()];
};

const axiosInstance = axios.create({
...getEnvironmentConfig(),
headers: {
'Content-Type': 'application/json',
'Accept': 'application/json',
},
withCredentials: true,
});

createInterceptors(axiosInstance);

export { axiosInstance };