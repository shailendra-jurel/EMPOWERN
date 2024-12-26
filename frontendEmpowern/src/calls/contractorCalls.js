import {axiosInstance} from './axiosInstance';
export const createContractor = async (contractorData) => {
    try {
        const response = await axiosInstance.post('/contractors/create', contractorData);
        return response.data;
    } catch (error) {
        console.error('Error creating contractor:', error);
        return null;
    }
}

export const getContractorById = async (contractorId) => {
    try {
        const response = await axiosInstance.get(`/contractors/get/${contractorId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching contractor by ID:', error);
        return null;
    }
}

export const updateContractor = async (contractorId, contractorData) => {
    try {
        const response = await axiosInstance.put(`/contractors/update/${contractorId}`, contractorData);
        return response.data;
    } catch (error) {
        console.error('Error updating contractor:', error);
        return null;
    }
}

export const deleteContractor = async (contractorId) => {
    try {
        const response = await axiosInstance.delete(`/contractors/delete/${contractorId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting contractor:', error);
        return null;
    }
}

export const getContractorByUserId = async (userId) => {
    try {
        const response = await axiosInstance.get(`/contractors/getByUserId`, {
            params: { userId }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching contractor by user ID:', error);
        return null;
    }
}
