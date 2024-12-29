import { axiosInstance } from './axiosInstance';

export const getLabourWorkerById = async (workerId) => {
  try {
    const response = await axiosInstance.get(`/api/workers/get/${workerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching labour worker:', error);
    throw error;
  }
};

export const getLabourWorkerByUserId = async (userId) => {
  try {
    const response = await axiosInstance.get(`/api/workers/getbyuserid/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching labour worker by user ID:', error);
    throw error;
  }
};