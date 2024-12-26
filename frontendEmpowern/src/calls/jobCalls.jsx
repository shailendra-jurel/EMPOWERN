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
getAll: '/',//previously it was '/getAllJobs'
getById: '/getById', 
create: '/',  //previously it was '/create'
update: '/:id',  //previously it was '/update'
apply: '/apply',
search: '/search',
postedBy: '/posted-by'
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

/**
 * Fetch all jobs with optional caching
 * @param {boolean} useCache - Whether to use cache
 * @returns {Promise<Array>} List of jobs
 */

async getJobs(useCache = this.config.cache.enabled) {
    try {
        console.log('Fetching all jobs...');
        const cacheKey = this.config.endpoints.getAll;
        const url = `${this.endpoint}${this.config.endpoints.getAll}`;

        if (useCache) {
            return await this.cache.get(
                cacheKey,
                async () => {
                    // Use axios to fetch from combined endpoint
                    const response = await this.axios.get(url);
                    return response.data;
                },
                this.config.cache.ttl
            );
        }

        // Use apiHelpers.withRetry to retry on failure
        const response = await apiHelpers.withRetry(() => this.axios.get(url));
        if (!response.data) {
            throw new Error('No data received from server (jobCalls)');
        }
        return response.data;
    } catch (error) {
        return apiHelpers.handleError(error, 'fetch all jobs');
    }
}

/**
 * Get job by ID with optional caching
 * @param {string} id - Job ID
 * @param {boolean} useCache - Whether to use cache
 * @returns {Promise<Object>} Job details
 */
async getJobById(id, useCache = this.config.cache.enabled) {
if (!id) throw new Error('Job ID is required');

try {
    const cacheKey = `${this.config.endpoints.getById}/${id}`;
    if (useCache) {
    return await this.cache.get(
        cacheKey,
        async () => {
            const response = await this.axios.get(`${this.endpoint}${this.config.endpoints.getById}/${id}`);
            return response.data;
        },
        this.config.cache.ttl
    );
    }

    const response = await apiHelpers.withRetry(() =>
    this.axios.get(`${this.config.endpoints.getById}/${id}`)
    );
    return response.data;
} catch (error) {
    return apiHelpers.handleError(error, 'get job by ID');
}
}

/**
 * Get jobs posted by a specific user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of jobs
 */
async getJobsByPostedById(userId) {
if (!userId) throw new Error('User ID is required');

try {
    const response = await apiHelpers.withRetry(() =>
    this.axios.get(`${this.config.endpoints.postedBy}/${userId}`)
    );
    return response.data;
} catch (error) {
    return apiHelpers.handleError(error, 'get jobs by posted ID');
}
}

/**
 * Create a new job
 * @param {Object} jobData - Job details
 * @returns {Promise<Object>} Created job
 */
async createJob(jobData) {
try {
    await this.validateJobData(jobData);
    const response = await apiHelpers.withRetry(() =>
    this.axios.post(this.config.endpoints.create, jobData)
    );
    await this.invalidateJobCache();
    return response.data;
} catch (error) {
    return apiHelpers.handleError(error, 'create job');
}
}

/**
 * Update an existing job
 * @param {string} id - Job ID
 * @param {Object} jobData - Updated job details
 * @returns {Promise<Object>} Updated job
 */
async updateJob(id, jobData) {
if (!id) throw new Error('Job ID is required');

try {
    await this.validateJobData(jobData);
    const response = await apiHelpers.withRetry(() =>
    this.axios.put(`${this.config.endpoints.update}/${id}`, jobData)
    );
    await this.invalidateJobCache(id);
    return response.data;
} catch (error) {
    return apiHelpers.handleError(error, 'update job');
}
}

/**
 * Apply for a job
 * @param {string} jobId - Job ID
 * @param {Object} applicationData - Application details
 * @returns {Promise<Object>} Application result
 */
async applyForJob(jobId, applicationData = { status: 'Applied' }) {
if (!jobId) throw new Error('Job ID is required');

try {
    const response = await apiHelpers.withRetry(() =>
    this.axios.post(`${this.config.endpoints.apply}/${jobId}`, applicationData)
    );
    await this.invalidateJobCache(jobId);
    return response.data;
} catch (error) {
    return apiHelpers.handleError(error, 'apply for job');
}
}

/**
 * Search jobs with filters
 * @param {Object} filters - Search filters
 * @returns {Promise<Array>} Filtered jobs
 */
async searchJobs(filters = {}) {
try {
    const response = await apiHelpers.withRetry(() =>
    this.axios.get(this.config.endpoints.search, { params: filters })
    );
    return response.data;
} catch (error) {
    return apiHelpers.handleError(error, 'search jobs');
}
}

/**
 * Validate job data
 * @private
 * @param {Object} jobData - Job data to validate
 */
async validateJobData(jobData) {
const requiredFields = ['title', 'description', 'location'];
const missingFields = requiredFields.filter(field => !jobData[field]);

if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
}
}

/**
 * Invalidate job cache
 * @private
 * @param {string} [jobId] - Specific job ID to invalidate
 */
async invalidateJobCache(jobId = null) {
if (jobId) {
    await this.cache.invalidate(`${this.config.endpoints.getById}/${jobId}`);
}
await this.cache.invalidate(this.config.endpoints.getAll);
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
searchJobs
} = jobService;

// Export service for advanced usage
export default JobService;