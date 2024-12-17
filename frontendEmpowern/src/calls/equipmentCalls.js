// import { axiosInstance } from "./axiosInstance";

// const getEquipmentByUserId = async (userId) => {
//     try {
//         const response = await axiosInstance.get(`/equipment/user/${userId}`);
//         return response.data;
//     } catch (error) {
//         return error.response.data;
//     }
// }

// const getEquipmentByCategory = async (category) => {
//     try {
//         const response = await axiosInstance.get(`/equipment/category/${category}`);
//         return response.data;
//     } catch (error) {
//         return error.response.data;
//     }
// }


// const getEquipmentById = async (equipmentId) => {
//     try {
//         const response = await axiosInstance.get(`/equipment/get/${equipmentId}`);
//         return response.data;
//     } catch (error) {
//         return error.response.data;
//     }
// }

// const createEquipment = async (equipment) => {
//     console.log('equipment', equipment);
//     try {
//         const response = await axiosInstance.post('/equipment/create', equipment);
//         return response.data;
//     } catch (error) {
//         return error.response.data;
//     }
// }

// const deleteEquipment = async (equipmentId) => {
//     try {
//         const response = await axiosInstance.delete(`/equipment/delete/${equipmentId}`);
//         return response.data;
//     } catch (error) {
//         return error.response.data;
//     }
// }

// export { getEquipmentByUserId, getEquipmentById, createEquipment, deleteEquipment, getEquipmentByCategory };