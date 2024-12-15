// src/calls/jobCalls.js
import { axiosInstance } from './axiosInstance';
import { BaseApiService } from './baseApiService';
import { apiHelpers } from '../utils/api/helpers';

/**
 * Job Service
 * 
 * Extends BaseApiService with job-specific methods
 * Provides specialized API interactions for job-related operations
 */
class JobService extends BaseApiService {
/**
 * Constructor
 * Initializes the JobService with the jobs endpoint
 */
constructor() {
// Call parent constructor with Axios instance and jobs endpoint
super(axiosInstance, '/jobs');
}

/**
 * Retrieve jobs posted by a specific user
 * 
 * @param {string} postedById - Unique identifier of the user who posted the jobs
 * @returns {Promise} Array of jobs posted by the user
 */
async getByPostedId(postedById) {
try {
    // Make API call to fetch jobs by posted ID
    const response = await this.axios.get(`${this.endpoint}/posted-by/${postedById}`);
    return response.data;
} catch (error) {
    // Use centralized error handling
    apiHelpers.handleError(error, 'get jobs by posted ID');
}
}

// You can add more job-specific methods here as needed
}

// Export a singleton instance of JobService
export const jobService = new JobService();

























// // src/calls/jobCalls.js
// import { axiosInstance } from "./axiosInstance";


// //   Custom error class for job-related API errors

// class JobApiError extends Error {
//   constructor(message, statusCode, originalError) {
//     super(message);
//     this.name = 'JobApiError';
//     this.statusCode = statusCode;
//     this.originalError = originalError;
//   }
// }

// /**
//  * Configuration for API calls
//  */
// const API_CONFIG = {
//   RETRY_ATTEMPTS: 3,
//   RETRY_DELAY: 1000, // milliseconds
//   ENDPOINTS: {
//     GET_ALL: '/jobs/getAllJobs',
//     GET_BY_POSTED_ID: '/jobs/posted-by',
//     CREATE: '/jobs/create',
//     UPDATE: '/jobs/update',
//     DELETE: '/jobs'
//   }
// };

// /**
//  * Helper function to handle API errors
//  * @param {Error} error - The caught error
//  * @param {string} operation - The operation being performed
//  * @throws {JobApiError}
//  */
// const handleApiError = (error, operation) => {
//   const statusCode = error.response?.status || 500;
//   const errorMessage = error.response?.data?.message || error.message;

//   console.error(`Job API Error [${operation}]:`, {
//     statusCode,
//     message: errorMessage,
//     details: error.response?.data || error,
//     timestamp: new Date().toISOString()
//   });

//   throw new JobApiError(
//     `Failed to ${operation}: ${errorMessage}`,
//     statusCode,
//     error
//   );
// };

// /**
//  * Retry mechanism for failed API calls
//  * @param {Function} apiCall - The API call to retry
//  * @param {number} maxAttempts - Maximum number of retry attempts
//  * @returns {Promise}
//  */
// const withRetry = async (apiCall, maxAttempts = API_CONFIG.RETRY_ATTEMPTS) => {
//   for (let attempt = 1; attempt <= maxAttempts; attempt++) {
//     try {
//       return await apiCall();
//     } catch (error) {
//       if (attempt === maxAttempts) throw error;
//       await new Promise(resolve => 
//         setTimeout(resolve, API_CONFIG.RETRY_DELAY * attempt)
//       );
//       console.warn(`Retrying API call, attempt ${attempt + 1}/${maxAttempts}`);
//     }
//   }
// };

// /**
//  * Validates job data before API calls
//  * @param {Object} jobData - The job data to validate
//  * @throws {Error}
//  */
// const validateJobData = (jobData) => {
//   const requiredFields = ['title', 'description', 'location'];
//   const missingFields = requiredFields.filter(field => !jobData[field]);

//   if (missingFields.length > 0) {
//     throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
//   }
// };

// /**
//  * Fetches all jobs
//  * @returns {Promise<Array>} Array of jobs
//  */
// export const getJobs = async () => {
//   try {
//     const response = await withRetry(() => 
//       axiosInstance.get(API_CONFIG.ENDPOINTS.GET_ALL)
//     );
//     return response.data;
//   } catch (error) {
//     handleApiError(error, 'fetch all jobs');
//   }
// };

// /**
//  * Fetches jobs by posted ID
//  * @param {string} postedById - ID of the user who posted the jobs
//  * @returns {Promise<Array>} Array of jobs
//  */
// export const getJobsByPostedById = async (postedById) => {
//   if (!postedById) throw new Error('Posted ID is required');

//   try {
//     const response = await withRetry(() => 
//       axiosInstance.get(`${API_CONFIG.ENDPOINTS.GET_BY_POSTED_ID}/${postedById}`)
//     );
//     return response.data;
//   } catch (error) {
//     handleApiError(error, 'fetch jobs by posted ID');
//   }
// };

// /**
//  * Creates a new job
//  * @param {Object} jobData - The job data
//  * @returns {Promise<Object>} Created job
//  */
// export const createJob = async (jobData) => {
//   try {
//     validateJobData(jobData);

//     const response = await withRetry(() => 
//       axiosInstance.post(API_CONFIG.ENDPOINTS.CREATE, jobData)
//     );

//     console.log('Job created successfully:', response.data);
//     return response.data;
//   } catch (error) {
//     handleApiError(error, 'create job');
//   }
// };

// /**
//  * Updates an existing job
//  * @param {string} jobId - ID of the job to update
//  * @param {Object} jobData - Updated job data
//  * @returns {Promise<Object>} Updated job
//  */
// export const updateJob = async (jobId, jobData) => {
//   if (!jobId) throw new Error('Job ID is required');

//   try {
//     validateJobData(jobData);

//     const response = await withRetry(() => 
//       axiosInstance.put(`${API_CONFIG.ENDPOINTS.UPDATE}/${jobId}`, jobData)
//     );

//     console.log('Job updated successfully:', response.data);
//     return response.data;
//   } catch (error) {
//     handleApiError(error, 'update job');
//   }
// };

// /**
//  * Deletes a job
//  * @param {string} jobId - ID of the job to delete
//  * @returns {Promise<Object>} Deletion confirmation
//  */
// export const deleteJob = async (jobId) => {
//   if (!jobId) throw new Error('Job ID is required');

//   try {
//     const response = await withRetry(() => 
//       axiosInstance.delete(`${API_CONFIG.ENDPOINTS.DELETE}/${jobId}`)
//     );

//     console.log('Job deleted successfully:', jobId);
//     return response.data;
//   } catch (error) {
//     handleApiError(error, 'delete job');
//   }
// };

// /**
//  * Batch operations for jobs
//  */
// export const jobBatchOperations = {
//   /**
//    * Creates multiple jobs
//    * @param {Array<Object>} jobs - Array of job data
//    * @returns {Promise<Array>} Created jobs
//    */
//   createMany: async (jobs) => {
//     try {
//       const createdJobs = await Promise.all(
//         jobs.map(job => createJob(job))
//       );
//       return createdJobs.filter(Boolean);
//     } catch (error) {
//       handleApiError(error, 'batch create jobs');
//     }
//   },

//   /**
//    * Updates multiple jobs
//    * @param {Array<{id: string, data: Object}>} updates - Array of job updates
//    * @returns {Promise<Array>} Updated jobs
//    */
//   updateMany: async (updates) => {
//     try {
//       const updatedJobs = await Promise.all(
//         updates.map(({ id, data }) => updateJob(id, data))
//       );
//       return updatedJobs.filter(Boolean);
//     } catch (error) {
//       handleApiError(error, 'batch update jobs');
//     }
//   }
// };

// // Cache mechanism for frequently accessed data
// const jobCache = {
//   data: new Map(),
//   timeouts: new Map(),

//   /**
//    * Gets cached data or fetches it
//    * @param {string} key - Cache key
//    * @param {Function} fetchFn - Function to fetch data
//    * @param {number} ttl - Time to live in milliseconds
//    */
//   async get(key, fetchFn, ttl = 5 * 60 * 1000) {
//     if (this.data.has(key)) {
//       return this.data.get(key);
//     }

//     const data = await fetchFn();
//     this.set(key, data, ttl);
//     return data;
//   },

//   /**
//    * Sets cached data with TTL
//    */
//   set(key, data, ttl) {
//     this.data.set(key, data);

//     if (this.timeouts.has(key)) {
//       clearTimeout(this.timeouts.get(key));
//     }

//     this.timeouts.set(key, setTimeout(() => {
//       this.data.delete(key);
//       this.timeouts.delete(key);
//     }, ttl));
//   }
// };

// // Export cache for external use if needed
// export { jobCache };


















































// // // src/calls/jobCalls.js
// // import { axiosInstance } from "./axiosInstance";

// // export const getJobs = async () => {
// //     try {
// //         const response = await axiosInstance.get('/jobs/getAllJobs');
// //         return response.data;
// //     } catch (error) {
// //         console.error('Error fetching jobs:', error);
// //         return [];
// //     }
// // }


// // //I have an confusion about my code  is  getJobById and getJobsByPostedById are same or not
// // export const getJobById = async (postedById) => {
// //     try {
// //         const response = await axiosInstance.get(`/jobs/posted-by/${postedById}`);
// //         return response.data;
// //     } catch (error) {
// //         console.error('Error fetching jobs by postedBy:', error);
// //         return [];
// //     }
// // }

// // export const createJob = async (job) => {
// //     try {
// //         const response = await axiosInstance.post('/jobs/create', job);
// //         return response.data;
// //     } catch (error) {
// //         console.error('Error creating job:', error);
// //         return null;
// //     }
// // }

// // export const updateJob = async (jobId, job) => {
// //     console.log('jobId:', jobId);
// //     console.log('job data:', job);
// //     try {
// //         const response = await axiosInstance.put(`/jobs/update/${jobId}`, job);
// //         return response.data;
// //     } catch (error) {
// //         console.error('Error updating job:', error.response ? error.response.data : error.message);
// //         return null;
// //     }
// // }

// // export const deleteJob = async (jobId) => {
// //     try {
// //         const response = await axiosInstance.delete(`/jobs/${jobId}`);
// //         return response.data;
// //     } catch (error) {
// //         console.error('Error deleting job:', error);
// //         return null;
// //     }
// // }
