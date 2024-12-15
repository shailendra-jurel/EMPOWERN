// import { axiosInstance } from "./axiosInstance";

// export const getJobAssignmentById = async (id) => {
//     try {
//         const response = await axiosInstance.get(`/jobAssignments/get/${id}`);
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching job assignment by id:", error);
//     }
// };

// export const getAllJobAssignments = async () => {
//     try {
//         const response = await axiosInstance.get("/jobAssignments/getAll");
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching all job assignments:", error);
//     }
// }

// export const createJobAssignment = async (jobAssignmentData) => {
//     try {
//         const response = await axiosInstance.post("/jobAssignments/create", jobAssignmentData);
//         return response.data;
//     } catch (error) {
//         console.error("Error creating job assignment:", error);
//     }
// }

// export const updateJobAssignment = async (id, jobAssignmentData) => {
//     try {
//         const response = await axiosInstance.put(`/jobAssignments/update/${id}`, jobAssignmentData);
//         return response.data;
//     } catch (error) {
//         console.error("Error updating job assignment:", error);
//     }
// }

// export const deleteJobAssignment = async (id) => {
//     try {
//         const response = await axiosInstance.delete(`/jobAssignments/delete/${id}`);
//         return response.data;
//     } catch (error) {
//         console.error("Error deleting job assignment:", error);
//     }
// }

// export const getJobAssignmentsByJobId = async (jobId) => {
//     console.log('Fetching job assignments for job ID:', jobId);
//     try {
//         const response = await axiosInstance.get(`/jobAssignments/getByJobId/${jobId}`);
//         console.log('Job assignments found:', response.data);
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching job assignments by job ID:", error);
//     }
// }

// export const getJobAssignmentsByWorkerId = async (workerId) => {
//     console.log('Fetching job assignments for worker ID:', workerId);
//     try {
//         const response = await axiosInstance.get(`/jobAssignments/getByWorkerId/${workerId}`);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching job assignments by worker ID:', error);
//         return [];
//     }
// };

import { axiosInstance } from "./axiosInstance";
import { handleApiError } from   "../utilities/api/errors";
import Logger from "../utilities/logger";

// Configuration for API endpoints
const ENDPOINTS = {
    GET_BY_ID: (id) => `/jobAssignments/get/${id}`,
    GET_ALL: "/jobAssignments/getAll",
    CREATE: "/jobAssignments/create",
    UPDATE: (id) => `/jobAssignments/update/${id}`,
    DELETE: (id) => `/jobAssignments/delete/${id}`,
    GET_BY_JOB_ID: (jobId) => `/jobAssignments/getByJobId/${jobId}`,
    GET_BY_WORKER_ID: (workerId) => `/jobAssignments/getByWorkerId/${workerId}`
};

/**
 * Base API call function with common error handling and logging
 * @param {Function} apiCall - The axios API call function
 * @param {string} errorMessage - Custom error message
 * @returns {Promise} - Resolved or rejected promise
 */
const performApiCall = async (apiCall, errorMessage) => {
    try {
        const response = await apiCall();
        Logger.info(`API Call Successful: ${errorMessage}`, response.data);
        return response.data;
    } catch (error) {
        Logger.error(`API Call Failed: ${errorMessage}`, error);
        return handleApiError(error, errorMessage);
    }
};

/**
 * Job Assignment API Service
 * Provides a comprehensive set of methods for job assignment operations
 */
export const JobAssignmentService = {
    /**
     * Fetch a single job assignment by ID
     * @param {string} id - Job assignment ID
     * @returns {Promise<Object>} - Job assignment details
     */
    getById: async (id) => {
        return performApiCall(
            () => axiosInstance.get(ENDPOINTS.GET_BY_ID(id)),
            `Fetching job assignment with ID: ${id}`
        );
    },

    /**
     * Fetch all job assignments
     * @param {Object} [params] - Optional query parameters
     * @returns {Promise<Array>} - List of job assignments
     */
    getAll: async (params = {}) => {
        return performApiCall(
            () => axiosInstance.get(ENDPOINTS.GET_ALL, { params }),
            "Fetching all job assignments"
        );
    },

    /**
     * Create a new job assignment
     * @param {Object} jobAssignmentData - Job assignment details
     * @returns {Promise<Object>} - Created job assignment
     */
    create: async (jobAssignmentData) => {
        return performApiCall(
            () => axiosInstance.post(ENDPOINTS.CREATE, jobAssignmentData),
            "Creating new job assignment"
        );
    },

    /**
     * Update an existing job assignment
     * @param {string} id - Job assignment ID
     * @param {Object} jobAssignmentData - Updated job assignment details
     * @returns {Promise<Object>} - Updated job assignment
     */
    update: async (id, jobAssignmentData) => {
        return performApiCall(
            () => axiosInstance.put(ENDPOINTS.UPDATE(id), jobAssignmentData),
            `Updating job assignment with ID: ${id}`
        );
    },

    /**
     * Delete a job assignment
     * @param {string} id - Job assignment ID
     * @returns {Promise<Object>} - Deletion result
     */
    delete: async (id) => {
        return performApiCall(
            () => axiosInstance.delete(ENDPOINTS.DELETE(id)),
            `Deleting job assignment with ID: ${id}`
        );
    },

    /**
     * Fetch job assignments by job ID
     * @param {string} jobId - Job ID
     * @param {Object} [options] - Additional query options
     * @returns {Promise<Array>} - List of job assignments
     */
    getByJobId: async (jobId, options = {}) => {
        return performApiCall(
            () => axiosInstance.get(ENDPOINTS.GET_BY_JOB_ID(jobId), { params: options }),
            `Fetching job assignments for job ID: ${jobId}`
        );
    },

    /**
     * Fetch job assignments by worker ID
     * @param {string} workerId - Worker ID
     * @param {Object} [filters] - Optional filters and pagination
     * @returns {Promise<Array>} - List of job assignments
     */
    getByWorkerId: async (workerId, filters = {}) => {
        return performApiCall(
            () => axiosInstance.get(ENDPOINTS.GET_BY_WORKER_ID(workerId), { params: filters }),
            `Fetching job assignments for worker ID: ${workerId}`
        );
    },

    /**
     * Withdraw a job application
     * @param {string} jobAssignmentId - Job assignment ID
     * @returns {Promise<Object>} - Withdrawal result
     */
    withdrawJobApplication: async (jobAssignmentId) => {
        return performApiCall(
            () => axiosInstance.patch(`/jobAssignments/withdraw/${jobAssignmentId}`),
            `Withdrawing job application for ID: ${jobAssignmentId}`
        );
    }
};

// Optionally export individual methods for backwards compatibility
export const {
    getJobAssignmentById,
    getAllJobAssignments,
    createJobAssignment,
    updateJobAssignment,
    deleteJobAssignment,
    getJobAssignmentsByJobId,
    getJobAssignmentsByWorkerId,
    withdrawJobApplication
} = JobAssignmentService;

export default JobAssignmentService;
