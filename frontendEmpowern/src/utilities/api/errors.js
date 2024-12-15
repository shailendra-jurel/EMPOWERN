// // src/utils/api/errors.js

// /**
//  * Custom API Error Class
//  * 
//  * Extends the standard Error class to provide more detailed 
//  * information about API-related errors.
//  */
// export class ApiError extends Error {
//     /**
//      * Constructor for creating a custom API error
//      * 
//      * @param {string} message - Human-readable error message
//      * @param {number} statusCode - HTTP status code of the error
//      * @param {Error} originalError - The original error object
//      */
//     constructor(message, statusCode, originalError) {
//       super(message); // Call parent Error constructor
//       this.name = 'ApiError'; // Custom error name
//       this.statusCode = statusCode; // HTTP status code
//       this.originalError = originalError; // Original error for debugging
//     }
//   }


// utilities/api/error.js
import { Logger } from '../logger';

// Custom API error class
export class ApiError extends Error {
  constructor(message, statusCode = 500, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handling utility
export const handleApiError = (error, req = null) => {
  // Determine error details
  const statusCode = error.response?.status || error.statusCode || 500;
  const errorMessage = error.response?.data?.message 
    || error.message 
    || 'An unexpected error occurred';
  
  // Log the error
  Logger.error('API Error', {
    statusCode,
    message: errorMessage,
    url: req?.url,
    method: req?.method,
    ...(error.response?.data && { responseData: error.response.data })
  });
  
  // Create a standardized error response
  const errorResponse = {
    success: false,
    status: statusCode,
    message: errorMessage,
    timestamp: new Date().toISOString(),
    ...(import.meta.env.NODE_ENV === 'development' && { 
      stack: error.stack,
      originalError: error
    })
  };
  
  return errorResponse;
};

// Error handling middleware for Express (if using Express)
export const errorMiddleware = (err, req, res, next) => {
  const error = handleApiError(err, req);
  
  res.status(error.status).json({
    success: error.success,
    message: error.message,
    timestamp: error.timestamp,
    ...(import.meta.env.NODE_ENV === 'development' && { 
      stack: error.stack 
    })
  });
};

// Modify your existing API functions to use error handling
export const safeApiCall = async (apiCall) => {
  try {
    return await apiCall();
  } catch (error) {
    throw new ApiError(
      error.message || 'API call failed', 
      error.response?.status || 500
    );
  }
};