import { axiosInstance } from './axiosInstance';
import { BaseApiService } from './baseApiService';
import { apiHelpers } from '../utilities/api/helpers';
import Logger from '../utilities/logger';

/**
 * Configuration for Job API endpoints and settings
 */
const JOB_API_CONFIG = {
    endpoints: {
        base: '/api/jobs',
        getAll: '/',
        getById: '/getById',
        create: '/create',
        update: '/update',
        delete: '/delete',
        apply: '/apply',
        search: '/search',
        postedBy: '/posted-by',
        report: '/report',
        favorite: '/favorite',
        assignments: '/assignments',
        statistics: '/statistics',
        recommendations: '/recommendations',
        urgent: '/urgent',
        featured: '/featured',
        analytics: '/analytics'
    },
    cache: {
        ttl: 5 * 60 * 1000, // 5 minutes
        enabled: true
    },
    pagination: {
        defaultLimit: 10,
        maxLimit: 100
    }
};

/**
 * Enhanced Job Service with comprehensive job management features
 */
class EnhancedJobService extends BaseApiService {
    constructor() {
        super(axiosInstance, JOB_API_CONFIG.endpoints.base);
        this.config = JOB_API_CONFIG;
    }

    /**
     * Fetch all jobs with advanced filtering and pagination
     * @param {Object} options - Filter and pagination options
     * @param {boolean} useCache - Whether to use cache
     * @returns {Promise<Object>} Paginated job list with metadata
     */
    async getJobs(options = {}, useCache = this.config.cache.enabled) {
        try {
            Logger.info('Fetching jobs...');
            const response = await this.axios.get(this.config.endpoints.base);
            
            // Add debug logs
            Logger.info('Raw API Response:', response);
            
            if (!response || !response.data) {
                throw new Error('Invalid API response');
            }
            
            // Filter open jobs if response.data is an array
            const jobs = response.data;
            Logger.info('Received jobs:', jobs.length);
            
            return jobs;
        } catch (error) {
            Logger.error('Error fetching jobs:', error);
            throw error;
        }
    }

    /**
     * Internal method to fetch jobs with retry mechanism
     * @private
     */
    async fetchJobs(params) {
        const response = await apiHelpers.withRetry(() =>
            this.axios.get(this.config.endpoints.getAll, { params })
        );
        return response.data;
    }

    /**
     * Get detailed job information by ID
     * @param {string} id - Job ID
     * @param {boolean} includeRelated - Include related data
     * @returns {Promise<Object>} Job details with related information
     */
    async getJobById(id, includeRelated = false) {
        if (!id) throw new Error('Job ID is required');

        try {
            const params = { includeRelated };
            // Fix URL construction with proper path joining
            const url = `${this.config.endpoints.base}${this.config.endpoints.getById}/${id}`;
            console.log('Requesting URL:', url); // Debug log
            
            const response = await apiHelpers.withRetry(() =>
                this.axios.get(url, { params })
            );
            return response.data;
        } catch (error) {
            Logger.error(`Error fetching job ${id}:`, error);
            throw apiHelpers.handleError(error, 'get job by ID');
        }
    }

    /**
     * Create a new job with validation and optional scheduling
     * @param {Object} jobData - Job details
     * @param {Object} options - Additional options
     * @returns {Promise<Object>} Created job
     */
    async createJob(jobData, options = {}) {
        try {
            await this.validateJobData(jobData);
            
            const payload = {
                ...jobData,
                ...options,
                status: options.scheduled ? 'SCHEDULED' : 'ACTIVE'
            };

            const response = await apiHelpers.withRetry(() =>
                this.axios.post(this.config.endpoints.create, payload)
            );

            await this.invalidateJobCache();
            Logger.info('Job created successfully:', response.data);
            return response.data;
        } catch (error) {
            Logger.error('Error creating job:', error);
            throw apiHelpers.handleError(error, 'create job');
        }
    }

    /**
     * Apply for a job with additional application details
     * @param {string} jobId - Job ID
     * @param {Object} applicationData - Application details
     * @returns {Promise<Object>} Application result
     */
    async applyForJob(jobId, applicationData) {
        if (!jobId) throw new Error('Job ID is required');

        try {
            const payload = {
                ...applicationData,
                appliedAt: new Date().toISOString(),
                status: 'PENDING'
            };

            const response = await apiHelpers.withRetry(() =>
                this.axios.post(`${this.config.endpoints.apply}/${jobId}`, payload)
            );

            Logger.info(`Application submitted for job ${jobId}:`, response.data);
            await this.invalidateJobCache(jobId);
            return response.data;
        } catch (error) {
            Logger.error(`Error applying for job ${jobId}:`, error);
            throw apiHelpers.handleError(error, 'apply for job');
        }
    }

    /**
     * Get job statistics and analytics
     * @param {string} jobId - Job ID
     * @returns {Promise<Object>} Job statistics
     */
    async getJobStatistics(jobId) {
        try {
            const response = await apiHelpers.withRetry(() =>
                this.axios.get(`${this.config.endpoints.statistics}/${jobId}`)
            );
            return response.data;
        } catch (error) {
            Logger.error(`Error fetching job statistics for ${jobId}:`, error);
            throw apiHelpers.handleError(error, 'get job statistics');
        }
    }

    /**
     * Get recommended jobs based on user profile and preferences
     * @param {string} userId - User ID
     * @param {Object} preferences - User preferences
     * @returns {Promise<Array>} Recommended jobs
     */
    async getRecommendedJobs(userId, preferences = {}) {
        try {
            const response = await apiHelpers.withRetry(() =>
                this.axios.get(`${this.config.endpoints.recommendations}/${userId}`, {
                    params: preferences
                })
            );
            return response.data;
        } catch (error) {
            Logger.error(`Error fetching recommended jobs for user ${userId}:`, error);
            throw apiHelpers.handleError(error, 'get recommended jobs');
        }
    }

    // this is the method  I have made mySelf  may have some errors
    async updateJob(jobId, jobData) {
        if (!jobId) throw new Error('Job ID is required');
    
        try {
          await this.validateJobData(jobData);
    
          const response = await apiHelpers.withRetry(() =>
            this.axios.put(`${this.config.endpoints.update}/${jobId}`, jobData)
          );
    
          await this.invalidateJobCache(jobId);
          Logger.info(`Job ${jobId} updated successfully:`, response.data);
          return response.data;
        } catch (error) {
          Logger.error(`Error updating job ${jobId}:`, error);
          throw apiHelpers.handleError(error, 'update job');
        }
      }

    /**
     * Get urgent or featured jobs
     * @param {string} type - 'urgent' or 'featured'
     * @returns {Promise<Array>} List of special jobs
     */
    async getSpecialJobs(type = 'urgent') {
        try {
            const endpoint = type === 'urgent' ? 
                this.config.endpoints.urgent : 
                this.config.endpoints.featured;

            const response = await apiHelpers.withRetry(() =>
                this.axios.get(endpoint)
            );
            return response.data;
        } catch (error) {
            Logger.error(`Error fetching ${type} jobs:`, error);
            throw apiHelpers.handleError(error, `get ${type} jobs`);
        }
    }

    /**
     * Validate job data with enhanced validation rules
     * @private
     */
    async validateJobData(jobData) {
        const requiredFields = [
            'title',
            'description',
            'location',
            'salary',
            'skillSet',
            'jobType'
        ];

        const missingFields = requiredFields.filter(field => !jobData[field]);
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Additional validation rules
        if (jobData.salary < 0) {
            throw new Error('Salary cannot be negative');
        }

        if (jobData.description.length < 50) {
            throw new Error('Job description must be at least 50 characters long');
        }

        if (!Array.isArray(jobData.skillSet) || jobData.skillSet.length === 0) {
            throw new Error('At least one skill must be specified');
        }
    }
}

// Export singleton instance
export const jobService = new EnhancedJobService();

// Export service class for advanced usage
export default EnhancedJobService;