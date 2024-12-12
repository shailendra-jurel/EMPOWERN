import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://labor-employement.onrender.com/api', // Replace with your API URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export { axiosInstance };

