import { axiosInstance } from './axiosInstance';
import { handleApiError } from '../utilities/api/errors';
import Logger from '../utilities/logger';

/**
 * Configuration for Job Assignment API endpoints and settings
 */
const ASSIGNMENT_API_CONFIG = {
    endpoints: {
        base: '/api/jobAssignment',
        getById: id => `/get/${id}`,
        getAll: '/getAll',
        create: '/create',
        update: id => `/update/${id}`,
        delete: id => `/delete/${id}`,
        getByJobId: jobId => `/getByJobId/${jobId}`,
        getByWorkerId: workerId => `/getByWorkerId/${workerId}`,
        withdraw: id => `/withdraw/${id}`,
        complete: id => `/complete/${id}`,
        rate: id => `/rate/${id}`,
        dispute: id => `/dispute/${id}`,
        progress: id => `/progress/${id}`,
        approve: id => `/approve/${id}`,
        reject: id => `/reject/${id}`,
        extend: id => `/extend/${id}`,
        pauseResume: id => `/pauseResume/${id}`,
        milestones: id => `/milestones/${id}`,
        feedback: id => `/feedback/${id}`,
        timesheet: id => `/timesheet/${id}`
    },
    status: {
        PENDING: 'PENDING',
        APPROVED: 'APPROVED',
        REJECTED: 'REJECTED',
        IN_PROGRESS: 'IN_PROGRESS',
        COMPLETED: 'COMPLETED',
        WITHDRAWN: 'WITHDRAWN',
        DISPUTED: 'DISPUTED',
        PAUSED: 'PAUSED',
        EXTENDED: 'EXTENDED',
        CANCELLED: 'CANCELLED'
    },
    validation: {
        minHourlyRate: 0,
        maxDurationDays: 365,
        maxMilestones: 10,
        minFeedbackLength: 10
    }
};

/**
 * Comprehensive Job Assignment Service
 * Handles all aspects of job assignments including creation, updates, status management,
 * milestones, timesheets, and related functionalities
 */
class JobAssignmentService {
    constructor() {
        this.axios = axiosInstance;
        this.config = ASSIGNMENT_API_CONFIG;
    }

    /**
     * Base API call handler with error management and logging
     * @private
     */
    async #performApiCall(apiCall, errorMessage, options = {}) {
        const { throwError = true, defaultValue = null } = options;
        try {
            const response = await apiCall();
            Logger.info(`API Call Successful: ${errorMessage}`, response.data);
            return response.data;
        } catch (error) {
            Logger.error(`API Call Failed: ${errorMessage}`, error);
            if (throwError) {
                throw handleApiError(error, errorMessage);
            }
            return defaultValue;
        }
    }

    /**
     * Validate assignment data
     * @private
     */
    #validateAssignmentData(data) {
        const requiredFields = ['jobId', 'workerId', 'hourlyRate', 'estimatedDuration'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        if (data.hourlyRate < this.config.validation.minHourlyRate) {
            throw new Error('Hourly rate cannot be negative');
        }

        if (data.estimatedDuration > this.config.validation.maxDurationDays) {
            throw new Error(`Duration cannot exceed ${this.config.validation.maxDurationDays} days`);
        }

        if (data.milestones?.length > this.config.validation.maxMilestones) {
            throw new Error(`Cannot exceed ${this.config.validation.maxMilestones} milestones`);
        }
    }

    /**
     * Get assignment by ID with detailed information
     * @param {string} id - Assignment ID
     * @param {Object} options - Additional options
     * @returns {Promise<Object>} Assignment details
     */
    async getById(id, options = {}) {
        const { includeJob = true, includeWorker = true, includeHistory = false } = options;
        return this.#performApiCall(
            () => this.axios.get(this.config.endpoints.getById(id), {
                params: { includeJob, includeWorker, includeHistory }
            }),
            `Fetching job assignment ${id}`
        );
    }

    /**
     * Get all assignments with advanced filtering and pagination
     * @param {Object} options - Filter and pagination options
     * @returns {Promise<Object>} Paginated list of assignments
     */
    async getAll(options = {}) {
        const {
            status,
            startDate,
            endDate,
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            search,
            includeDetails = false
        } = options;

        return this.#performApiCall(
            () => this.axios.get(this.config.endpoints.getAll, {
                params: {
                    status,
                    startDate,
                    endDate,
                    page,
                    limit,
                    sortBy,
                    sortOrder,
                    search,
                    includeDetails
                }
            }),
            'Fetching all job assignments'
        );
    }

    /**
     * Create new assignment with comprehensive validation
     * @param {Object} assignmentData - Assignment details
     * @returns {Promise<Object>} Created assignment
     */
    async create(assignmentData) {
        this.#validateAssignmentData(assignmentData);
        
        const enrichedData = {
            ...assignmentData,
            status: this.config.status.PENDING,
            createdAt: new Date().toISOString(),
            metadata: {
                platform: 'web',
                ipAddress: window.clientIP,
                userAgent: navigator.userAgent
            }
        };

        return this.#performApiCall(
            () => this.axios.post(this.config.endpoints.create, enrichedData),
            'Creating new job assignment'
        );
    }

    /**
     * Update assignment with status tracking
     * @param {string} id - Assignment ID
     * @param {Object} updateData - Updated details
     * @returns {Promise<Object>} Updated assignment
     */
    async update(id, updateData) {
        const currentAssignment = await this.getById(id);
        
        const enrichedUpdate = {
            ...updateData,
            updatedAt: new Date().toISOString(),
            statusHistory: [
                ...(currentAssignment.statusHistory || []),
                {
                    from: currentAssignment.status,
                    to: updateData.status || currentAssignment.status,
                    timestamp: new Date().toISOString(),
                    reason: updateData.statusChangeReason
                }
            ]
        };

        return this.#performApiCall(
            () => this.axios.put(this.config.endpoints.update(id), enrichedUpdate),
            `Updating job assignment ${id}`
        );
    }

    /**
     * Handle assignment workflow transitions
     * @param {string} id - Assignment ID
     * @param {string} action - Workflow action
     * @param {Object} data - Additional data
     * @returns {Promise<Object>} Updated assignment
     */
    async #handleWorkflowTransition(id, action, data = {}) {
        const endpoints = {
            approve: this.config.endpoints.approve,
            reject: this.config.endpoints.reject,
            complete: this.config.endpoints.complete,
            withdraw: this.config.endpoints.withdraw,
            dispute: this.config.endpoints.dispute,
            pauseResume: this.config.endpoints.pauseResume,
            extend: this.config.endpoints.extend
        };

        if (!endpoints[action]) {
            throw new Error(`Invalid workflow action: ${action}`);
        }

        return this.#performApiCall(
            () => this.axios.post(endpoints[action](id), {
                ...data,
                timestamp: new Date().toISOString()
            }),
            `Processing ${action} for assignment ${id}`
        );
    }

    /**
     * Approve assignment
     * @param {string} id - Assignment ID
     * @param {Object} approvalData - Approval details
     */
    async approve(id, approvalData = {}) {
        return this.#handleWorkflowTransition(id, 'approve', approvalData);
    }

    /**
     * Reject assignment
     * @param {string} id - Assignment ID
     * @param {Object} rejectionData - Rejection details
     */
    async reject(id, rejectionData = {}) {
        return this.#handleWorkflowTransition(id, 'reject', rejectionData);
    }

    /**
     * Complete assignment
     * @param {string} id - Assignment ID
     * @param {Object} completionData - Completion details
     */
    async complete(id, completionData = {}) {
        return this.#handleWorkflowTransition(id, 'complete', completionData);
    }

    /**
     * Manage assignment milestones
     * @param {string} id - Assignment ID
     * @param {Object} milestoneData - Milestone details
     */
    async manageMilestones(id, milestoneData) {
        return this.#performApiCall(
            () => this.axios.post(this.config.endpoints.milestones(id), milestoneData),
            `Managing milestones for assignment ${id}`
        );
    }

    /**
     * Submit timesheet entry
     * @param {string} id - Assignment ID
     * @param {Object} timesheetData - Timesheet details
     */
    async submitTimesheet(id, timesheetData) {
        return this.#performApiCall(
            () => this.axios.post(this.config.endpoints.timesheet(id), {
                ...timesheetData,
                submittedAt: new Date().toISOString()
            }),
            `Submitting timesheet for assignment ${id}`
        );
    }

    /**
     * Submit feedback
     * @param {string} id - Assignment ID
     * @param {Object} feedbackData - Feedback details
     */
    async submitFeedback(id, feedbackData) {
        if (feedbackData.comment && 
            feedbackData.comment.length < this.config.validation.minFeedbackLength) {
            throw new Error(`Feedback must be at least ${this.config.validation.minFeedbackLength} characters`);
        }

        return this.#performApiCall(
            () => this.axios.post(this.config.endpoints.feedback(id), {
                ...feedbackData,
                submittedAt: new Date().toISOString()
            }),
            `Submitting feedback for assignment ${id}`
        );
    }

    /**
     * Get assignments by job ID with filtering
     * @param {string} jobId - Job ID
     * @param {Object} options - Filter options
     */
    async getByJobId(jobId, options = {}) {
        return this.#performApiCall(
            () => this.axios.get(this.config.endpoints.getByJobId(jobId), { params: options }),
            `Fetching assignments for job ${jobId}`
        );
    }

    /**
     * Get assignments by worker ID with filtering
     * @param {string} workerId - Worker ID
     * @param {Object} options - Filter options
     */
    async getByWorkerId(workerId, options = {}) {
        return this.#performApiCall(
            () => this.axios.get(this.config.endpoints.getByWorkerId(workerId), { params: options }),
            `Fetching assignments for worker ${workerId}`
        );
    }

    /**
     * Generate assignment report
     * @param {string} id - Assignment ID
     * @param {Object} options - Report options
     */
    async generateReport(id, options = {}) {
        const assignment = await this.getById(id, { includeHistory: true });
        
        return {
            assignmentId: id,
            status: assignment.status,
            duration: {
                planned: assignment.estimatedDuration,
                actual: this.#calculateActualDuration(assignment)
            },
            financials: {
                hourlyRate: assignment.hourlyRate,
                totalHours: this.#calculateTotalHours(assignment),
                totalEarnings: this.#calculateTotalEarnings(assignment)
            },
            milestones: assignment.milestones,
            statusHistory: assignment.statusHistory,
            feedback: assignment.feedback,
            timesheets: assignment.timesheets,
            generatedAt: new Date().toISOString()
        };
    }

    /**
     * Calculate actual duration
     * @private
     */
    #calculateActualDuration(assignment) {
        const start = new Date(assignment.startDate);
        const end = assignment.completedAt ? new Date(assignment.completedAt) : new Date();
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }

    /**
     * Calculate total hours
     * @private
     */
    #calculateTotalHours(assignment) {
        return assignment.timesheets?.reduce((total, entry) => total + entry.hours, 0) || 0;
    }

    /**
     * Calculate total earnings
     * @private
     */
    #calculateTotalEarnings(assignment) {
        const totalHours = this.#calculateTotalHours(assignment);
        return totalHours * assignment.hourlyRate;
    }
}

// Export singleton instance
export const jobAssignmentService = new JobAssignmentService();

// Export service class for advanced usage
export default JobAssignmentService;





// to use jobAssignmentService in fronted, you can import it like this:

// import { jobAssignmentService } from './services/jobAssignmentService';

// // Example usage
// async function handleAssignment() {
//     try {
//         // Create new assignment
//         const assignment = await jobAssignmentService.create({
//             jobId: 'job123',
//             workerId: 'worker456',
//             hourlyRate: 25,
//             estimatedDuration: 30,
//             milestones: [
//                 { title: 'Phase 1', dueDate: '2024-01-15' },
//                 { title: 'Phase 2', dueDate: '2024-02-15' }
//             ]
//         });

//         // Approve assignment
//         await jobAssignmentService.approve(assignment.id, {
//             note: 'Assignment approved after review'
//         });

//         // Submit timesheet
//         await jobAssignmentService.submitTimesheet(assignment.id, {
//             date: '2024-01-10',
//             hours: