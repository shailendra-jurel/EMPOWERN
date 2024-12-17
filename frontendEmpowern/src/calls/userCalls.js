// import { axiosInstance } from './axiosInstance';

// const getUserById = async (id) => {
//     try {
//         const response = await axiosInstance.get(`/users/get/${id}`);
//         return response.data;
//     } catch (error) {
//         return error.response.data;
//     }
// }

// const getUserByNumber = async (mobileNumber) => {
//     try {
//         const response = await axiosInstance.get(`/users/getbynumber/${mobileNumber}`);
//         return response.data;
//     } catch (error) {
//         return { message: error.response.data };
//     }
// }

// const getAllUsers = async () => {
//     try {
//         const response = await axiosInstance.get('/users/getall');
//         return response.data;
//     } catch (error) {
//         return error.response.data;
//     }
// }

// const updateUser = async (id, user) => {
//     try {
//         const response = await axiosInstance.put(`/users/update/${id}`, user);
//         return response.data;
//     } catch (error) {
//         return error.response.data;
//     }
// }

// const createUser = async (user) => {
//     try {
//         const response = await axiosInstance.post('/users/create', user);
//         return response.data;
//     } catch (error) {
//         return error.response.data;
//     }
// }

// const deleteUser = async (id) => {  
//     try {
//         const response = await axiosInstance.delete(`/users/delete/${id}`);
//         return response.data;
//     } catch (error) {
//         return error.response.data;
//     }
// }

// export { getUserById, getAllUsers, updateUser, createUser, deleteUser, getUserByNumber };
