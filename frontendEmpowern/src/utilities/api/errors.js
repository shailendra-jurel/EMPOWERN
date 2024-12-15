// src/utils/api/errors.js

/**
 * Custom API Error Class
 * 
 * Extends the standard Error class to provide more detailed 
 * information about API-related errors.
 */
export class ApiError extends Error {
    /**
     * Constructor for creating a custom API error
     * 
     * @param {string} message - Human-readable error message
     * @param {number} statusCode - HTTP status code of the error
     * @param {Error} originalError - The original error object
     */
    constructor(message, statusCode, originalError) {
      super(message); // Call parent Error constructor
      this.name = 'ApiError'; // Custom error name
      this.statusCode = statusCode; // HTTP status code
      this.originalError = originalError; // Original error for debugging
    }
  }