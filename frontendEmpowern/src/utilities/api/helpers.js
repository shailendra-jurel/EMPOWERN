// src/utils/api/helpers.js
import { API_CONFIG } from './config';
import { ApiError } from './errors';
/**
 * API Helper Utilities
 * Provides common utility functions for API interactions
 * including error handling and retry mechanisms
 */
export  const  apiHelpers = {
/**
 * Centralized error handling method
 * Logs detailed error information and throws a custom ApiError
 * @param {Error} error - The caught error
 * @param {string} operation - Description of the operation that failed
 * @throws {ApiError}
 */
handleError: (error, operation) => {
// Extract status code, defaulting to 500 if not available
const statusCode = error.response?.status || 500;

// Get error message, using a fallback if not available
const errorMessage = error.response?.data?.message || error.message;

// Log detailed error information for debugging
console.error(`API Error [${operation}]:`, {
    statusCode,
    message: errorMessage,
    details: error.response?.data || error,
    timestamp: new Date().toISOString()
});
// Throw a custom ApiError with detailed information
throw new ApiError(
    `Failed to ${operation}: ${errorMessage}`,
    statusCode,
    error
);
},
/**
 * Retry mechanism for API calls
 * Automatically retries failed API calls with exponential backoff
 * 
 * @param {Function} apiCall - The API call function to retry
 * @param {number} maxAttempts - Maximum number of retry attempts
 * @returns {Promise} - Resolves with the result of the successful API call
 */
withRetry: async (apiCall, maxAttempts = API_CONFIG.RETRY.ATTEMPTS) => {
for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
    // Attempt to execute the API call
    return await apiCall();
    } catch (error) {
    // If it's the last attempt, throw the error
    if (attempt === maxAttempts) throw error;
    
    // Wait before retrying with increasing delay
    await new Promise(resolve => 
        setTimeout(resolve, API_CONFIG.RETRY.DELAY * attempt)
    );
    
    // Log retry attempt
    console.warn(`Retrying API call, attempt ${attempt + 1}/${maxAttempts}`);
    }
}
}
};