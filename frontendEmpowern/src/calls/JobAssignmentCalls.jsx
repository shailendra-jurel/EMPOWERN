import { axiosInstance } from "./axiosInstance";

export const getJobAssignmentById = async (id) => {
    try {
        const response = await axiosInstance.get(`/jobAssignments/get/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching job assignment by id:", error);
    }
};

export const getAllJobAssignments = async () => {
    try {
        const response = await axiosInstance.get("/jobAssignments/getAll");
        return response.data;
    } catch (error) {
        console.error("Error fetching all job assignments:", error);
    }
}

export const createJobAssignment = async (jobAssignmentData) => {
    try {
        const response = await axiosInstance.post("/jobAssignments/create", jobAssignmentData);
        return response.data;
    } catch (error) {
        console.error("Error creating job assignment:", error);
    }
}

export const updateJobAssignment = async (id, jobAssignmentData) => {
    try {
        const response = await axiosInstance.put(`/jobAssignments/update/${id}`, jobAssignmentData);
        return response.data;
    } catch (error) {
        console.error("Error updating job assignment:", error);
    }
}

export const deleteJobAssignment = async (id) => {
    try {
        const response = await axiosInstance.delete(`/jobAssignments/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting job assignment:", error);
    }
}

export const getJobAssignmentsByJobId = async (jobId) => {
    console.log('Fetching job assignments for job ID:', jobId);
    try {
        const response = await axiosInstance.get(`/jobAssignments/getByJobId/${jobId}`);
        console.log('Job assignments found:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching job assignments by job ID:", error);
    }
}

export const getJobAssignmentsByWorkerId = async (workerId) => {
    console.log('Fetching job assignments for worker ID:', workerId);
    try {
        const response = await axiosInstance.get(`/jobAssignments/getByWorkerId/${workerId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching job assignments by worker ID:', error);
        return [];
    }
};