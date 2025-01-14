import axios from 'axios';
import { handleApiError } from '../utilities/api/errors';
import Logger from '../utilities/logger';

/**
 * Configuration for Job Assignment API endpoints and settings
 */
const ASSIGNMENT_API_CONFIG = {
    endpoints: {
        base: '/api/job-assignments',
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
        timesheet: id => `/timesheet/${id}`,
        report: id => `/report/${id}`,
        workers: jobId => `/${jobId}/workers`
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
        this.axios = axios.create({
            baseURL: ASSIGNMENT_API_CONFIG.endpoints.base,
        });
        this.config = ASSIGNMENT_API_CONFIG;
    }

    /**
     * Base API call handler with error management and logging
     * @private
     * @param {Function} apiCall - The API call to execute
     * @param {string} errorMessage - Error message for logging
     * @param {Object} options - Additional options for error handling
     * @returns {Promise<any>} API response data
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
     * @param {Object} data - Assignment data to validate
     * @throws {Error} If validation fails
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
     * @param {Object} options - Additional options for including related data
     * @returns {Promise<Object>} Assignment details
     */
    async getById(id, options = {}) {
        if (!id) throw new Error('Job assignment ID is required');
        const { includeJob = true, includeWorker = true, includeHistory = false } = options;
        
        return this.#performApiCall(
            () => this.axios.get(this.config.endpoints.getById(id), {
                params: { includeJob, includeWorker, includeHistory }
            }),
            `Error fetching job assignment with ID ${id}`
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
            'Error fetching all job assignments'
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
            'Error creating new job assignment'
        );
    }

    /**
     * Update assignment with status tracking
     * @param {string} id - Assignment ID
     * @param {Object} updateData - Updated details
     * @returns {Promise<Object>} Updated assignment
     */
    async update(id, updateData) {
        if (!id) throw new Error('Job assignment ID is required for update');
        if (!updateData || typeof updateData !== 'object') throw new Error('Invalid data for job assignment update');

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
            `Error updating job assignment ${id}`
        );
    }

    /**
     * Delete a job assignment by ID
     * @param {string} id - Assignment ID
     * @returns {Promise<Object>} Deletion confirmation
     */
    async delete(id) {
        if (!id) throw new Error('Job assignment ID is required for deletion');
        return this.#performApiCall(
            () => this.axios.delete(this.config.endpoints.delete(id)),
            `Error deleting job assignment ${id}`
        );
    }
    /**
     * Handle assignment workflow transitions
     * @private
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

    /**
     * Assign a worker to a job
     * @param {string} jobId - Job ID
     * @param {string} workerId - Worker ID
     */
    async assignWorker(jobId, workerId) {
        if (!jobId || !workerId) throw new Error('Job ID and Worker ID are required for assignment');
        return this.#performApiCall(
            () => this.axios.post(`/${jobId}/assign`, { workerId }),
            `Error assigning worker ${workerId} to job ${jobId}`
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
     * Get all workers assigned to a specific job
     * @param {string} jobId - Job ID
     * @returns {Promise<Array>} List of assigned workers
     */
async getAssignedWorkers(jobId) {
    if (!jobId) throw new Error('Job ID is required to fetch assigned workers');
    return this.#performApiCall(
        () => this.axios.get(this.config.endpoints.workers(jobId)),
        `Error fetching workers assigned to job ${jobId}`
    );
}

/**
 * Withdraw from assignment
 * @param {string} id - Assignment ID
 * @param {Object} withdrawalData - Withdrawal details including reason
 * @returns {Promise<Object>} Updated assignment
 */
async withdraw(id, withdrawalData = {}) {
    return this.#handleWorkflowTransition(id, 'withdraw', withdrawalData);
}
/**
 * Extend assignment duration
 * @param {string} id - Assignment ID
 * @param {Object} extensionData - Extension details including new duration and reason
 * @returns {Promise<Object>} Updated assignment
 */
async extend(id, extensionData) {
    if (!extensionData.newDuration) {
        throw new Error('New duration is required for extension');
    }
    return this.#handleWorkflowTransition(id, 'extend', extensionData);
}

/**
 * Toggle pause/resume status of assignment
 * @param {string} id - Assignment ID
 * @param {Object} pauseData - Pause/resume details including reason
 * @returns {Promise<Object>} Updated assignment
 */
async togglePauseResume(id, pauseData = {}) {
    return this.#handleWorkflowTransition(id, 'pauseResume', pauseData);
}

/**
 * Raise a dispute for an assignment
 * @param {string} id - Assignment ID
 * @param {Object} disputeData - Dispute details including reason and evidence
 * @returns {Promise<Object>} Updated assignment with dispute information
 */
async raiseDispute(id, disputeData) {
    if (!disputeData.reason) {
        throw new Error('Dispute reason is required');
    }
    return this.#handleWorkflowTransition(id, 'dispute', disputeData);
}

/**
 * Update assignment progress
 * @param {string} id - Assignment ID
 * @param {Object} progressData - Progress details including percentage and notes
 * @returns {Promise<Object>} Updated assignment
 */
async updateProgress(id, progressData) {
    if (!progressData.percentage || progressData.percentage < 0 || progressData.percentage > 100) {
        throw new Error('Valid progress percentage (0-100) is required');
    }
    return this.#performApiCall(
        () => this.axios.post(this.config.endpoints.progress(id), {
            ...progressData,
            updatedAt: new Date().toISOString()
        }),
        `Updating progress for assignment ${id}`
    );
}
/**
 * Rate assignment experience
 * @param {string} id - Assignment ID
 * @param {Object} ratingData - Rating details including score and review
 * @returns {Promise<Object>} Updated assignment with rating
 */
async submitRating(id, ratingData) {
    if (!ratingData.score || ratingData.score < 1 || ratingData.score > 5) {
        throw new Error('Valid rating score (1-5) is required');
    }
    return this.#performApiCall(
        () => this.axios.post(this.config.endpoints.rate(id), {
            ...ratingData,
            submittedAt: new Date().toISOString()
        }),
        `Submitting rating for assignment ${id}`
    );
}

/**
 * Export assignment data in specified format
 * @param {string} id - Assignment ID
 * @param {string} format - Export format (pdf, csv, json)
 * @returns {Promise<Blob>} Exported data in requested format
 */
async exportAssignment(id, format = 'pdf') {
    const supportedFormats = ['pdf', 'csv', 'json'];
    if (!supportedFormats.includes(format)) {
        throw new Error(`Unsupported export format. Supported formats: ${supportedFormats.join(', ')}`);
    }

    const assignment = await this.getById(id, { includeHistory: true });
    const report = await this.generateReport(id);

    return this.#performApiCall(
        () => this.axios.post(`/export/${id}`, {
            format,
            data: { assignment, report },
            timestamp: new Date().toISOString()
        }, {
            responseType: 'blob'
        }),
        `Exporting assignment ${id} as ${format}`
    );
}
}
// Export singleton instance
export const jobAssignmentService = new JobAssignmentService();
// Export service class for advanced usage
export default JobAssignmentService;
