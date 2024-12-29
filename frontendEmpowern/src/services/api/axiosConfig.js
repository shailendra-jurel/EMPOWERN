// src/calls/jobService.js
import { axiosInstance } from './axiosInstance';
import { BaseApiService } from './baseApiService';
import { apiHelpers } from '../utilities/api/helpers';

/**
 * Configuration for Job API
 */
const JOB_API_CONFIG = {
    endpoints: {
        base: '/api/jobs',
        getAll: '/',
        getById: '/getById',
        create: '/create',
        update: '/update',
        apply: '/apply',
        search: '/search',
        postedBy: '/posted-by',
        filter: '/filter', // New endpoint for filtering jobs
        paginate: '/paginate' // New endpoint for pagination
    },
    cache: {
        ttl: 5 * 60 * 1000, // 5 minutes
        enabled: true
    }
};

/**
 * Enhanced Job Service class extending BaseApiService
 * Provides comprehensive job-related API operations with caching and error handling
 */
class JobService extends BaseApiService {
    constructor() {
        super(axiosInstance, JOB_API_CONFIG.endpoints.base);
        this.config = JOB_API_CONFIG;
    }

    // Existing methods...

    /**
     * Fetch jobs with pagination
     * @param {number} page - Page number
     * @param {number} limit - Number of jobs per page
     * @returns {Promise<Object>} Paginated jobs
     */
    async getPaginatedJobs(page = 1, limit = 10) {
        try {
            const response = await apiHelpers.withRetry(() =>
                this.axios.get(`${this.config.endpoints.paginate}`, { params: { page, limit } })
            );
            return response.data;
        } catch (error) {
            return apiHelpers.handleError(error, 'fetch paginated jobs');
        }
    }

    /**
     * Filter jobs based on criteria
     * @param {Object} criteria - Filter criteria
     * @returns {Promise<Array>} Filtered jobs
     */
    async filterJobs(criteria = {}) {
        try {
            const response = await apiHelpers.withRetry(() =>
                this.axios.post(this.config.endpoints.filter, criteria)
            );
            return response.data;
        } catch (error) {
            return apiHelpers.handleError(error, 'filter jobs');
        }
    }

    // Existing methods...
}

// Export singleton instance
export const jobService = new JobService();

// Export individual methods for convenience
export const {
    getJobs,
    getJobById,
    getJobsByPostedById,
    createJob,
    updateJob,
    applyForJob,
    searchJobs,
    getPaginatedJobs,
    filterJobs
} = jobService;

// Export service for advanced usage
export default JobService;