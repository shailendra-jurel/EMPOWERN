import { axiosInstance } from "./axiosInstance";

export const getLabourWorkerById = async (user) => {
    try {
        const response = await axiosInstance.get(`/labourworkers/getbyuserid`, user);
        return response.data;
    } catch (error) {
        console.error('Error fetching labour worker by user ID:', error);
        return null;
    }
}

export const createLabourWorker = async (labourWorker) => {
    try {
        const response = await axiosInstance.post('/labourWorkerRoutes/create', labourWorker);
        return response.data;
    } catch (error) {
        console.error('Error creating labour worker:', error);
        return null;
    }
}
// export const getLabourWorkerById = async (workerId) => {
//     try {
//         const response = await axiosInstance.get(`/labourworkers/${workerId}`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching labour worker by ID:', error);
//         return null;
//     }
// }
