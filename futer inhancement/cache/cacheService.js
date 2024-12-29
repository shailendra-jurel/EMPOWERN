// I don't know the file structure of the project, so I'm assuming the path

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
        favorite: '/favorite', // New endpoint for favoriting jobs
        report: '/report' // New endpoint for reporting jobs
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
     * Favorite a job
     * @param {string} jobId - Job ID
     * @returns {Promise<Object>} Result of the favorite action
     */
    async favoriteJob(jobId) {
        if (!jobId) throw new Error('Job ID is required');

        try {
            const response = await apiHelpers.withRetry(() =>
                this.axios.post(`${this.config.endpoints.favorite}/${jobId}`)
            );
            return response.data;
        } catch (error) {
            return apiHelpers.handleError(error, 'favorite job');
        }
    }

    /**
     * Report a job
     * @param {string} jobId - Job ID
     * @param {Object} reportData - Report details
     * @returns {Promise<Object>} Result of the report action
     */
    async reportJob(jobId, reportData) {
        if (!jobId) throw new Error('Job ID is required');

        try {
            const response = await apiHelpers.withRetry(() =>
                this.axios.post(`${this.config.endpoints.report}/${jobId}`, reportData)
            );
            return response.data;
        } catch (error) {
            return apiHelpers.handleError(error, 'report job');
        }
    }

    /**
     * Get job statistics (e.g., number of applications, views)
     * @param {string} jobId - Job ID
     * @returns {Promise<Object>} Job statistics
     */
    async getJobStatistics(jobId) {
        if (!jobId) throw new Error('Job ID is required');

        try {
            const response = await apiHelpers.withRetry(() =>
                this.axios.get(`${this.config.endpoints.base}/${jobId}/statistics`)
            );
            return response.data;
        } catch (error) {
            return apiHelpers.handleError(error, 'get job statistics');
        }
    }
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
    favoriteJob,
    reportJob,
    getJobStatistics
} = jobService;

// Export service for advanced usage
export default JobService;