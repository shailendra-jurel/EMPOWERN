// const axiosInstance = require('./axiosInstance');

// const getLabourWorkerByUserId = async (user) => {
//     try {
//         const response = await axiosInstance.get(`/labourworkers/getbyuserid`, user);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching labour worker by user ID:', error);
//         return null;
//     }
// }

// const createLabourWorker = async (labourWorker) => {
//     try {
//         const response = await axiosInstance.post('/labourWorkerRoutes/create', labourWorker);
//         return response.data;
//     } catch (error) {
//         console.error('Error creating labour worker:', error);
//         return null;
//     }
// }