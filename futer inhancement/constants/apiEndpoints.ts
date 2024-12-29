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
        favorite: '/favorite', // New endpoint for favorites
        notifications: '/notifications' // New endpoint for notifications
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

    async getJobs(useCache = this.config.cache.enabled, page = 1, limit = 10, sort = 'createdAt', order = 'desc') {
        try {
            console.log('Fetching all jobs...');
            const cacheKey = this.config.endpoints.getAll;
            const url = `${this.endpoint}${this.config.endpoints.getAll}?page=${page}&limit=${limit}&sort=${sort}&order=${order}`;

            if (useCache) {
                return await this.cache.get(
                    cacheKey,
                    async () => {
                        const response = await this.axios.get(url);
                        return response.data;
                    },
                    this.config.cache.ttl
                );
            }

            const response = await apiHelpers.withRetry(() => this.axios.get(url));
            if (!response.data) {
                throw new Error('No data received from server (jobCalls)');
            }
            return response.data;
        } catch (error) {
            return apiHelpers.handleError(error, 'fetch all jobs');
        }
    }

    async searchJobs(filters = {}, page = 1, limit = 10) {
        try {
            const response = await apiHelpers.withRetry(() =>
                this.axios.get(this.config.endpoints.search, { params: { ...filters, page, limit } })
            );
            return response.data;
        } catch (error) {
            return apiHelpers.handleError(error, 'search jobs');
        }
    }

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

    async getNotifications(userId) {
        if (!userId) throw new Error('User ID is required');

        try {
            const response = await apiHelpers.withRetry(() =>
                this.axios.get(`${this.config.endpoints.notifications}/${userId}`)
            );
            return response.data;
        } catch (error) {
            return apiHelpers.handleError(error, 'get notifications');
        }
    }

    // Other methods remain unchanged...
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
    getNotifications
} = jobService;

// Export service for advanced usage
export default JobService;