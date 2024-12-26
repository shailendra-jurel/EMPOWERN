// src/utils/api/interceptors.js

// ensures robust request handling, detailed logging for debugging, and better user experience during errors

import { createBrowserHistory } from 'history';

/**
 * Create Axios interceptors for advanced request and response handling
 * @param {Object} axiosInstance - Axios instance to add interceptors to
 */
export const createInterceptors = (axiosInstance) => {
  // Create browser history for navigation
  const history = createBrowserHistory();

  // Request interceptor
  axiosInstance.interceptors.request.use(
    async (config) => {
      // Attach authentication token if available
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add metadata for tracking request duration and additional diagnostics
      config.metadata = { 
        startTime: new Date(),
        url: config.url,
        method: config.method
      };
      
      // Log outgoing request details for debugging
      console.debug('Outgoing Request:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data
      });
      
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      // Calculate and log request duration
      const requestDuration = new Date() - response.config.metadata.startTime;
      
      // Detailed request performance logging
      console.debug(`Request Performance:`, {
        url: response.config.metadata.url,
        method: response.config.metadata.method,
        duration: `${requestDuration}ms`,
        status: response.status
      });
      
      return response;
    },
    async (error) => {
      // Handle specific error scenarios
      if (error.response) {
        // Destructure error response for easier handling
        const { status, data, config } = error.response;
        
        // Comprehensive error logging
        console.error('API Error Response:', {
          status,
          url: config?.url,
          method: config?.method,
          errorData: data
        });
        
        // Detailed error handling based on status code
        switch (status) {
          case 400: // Bad Request
            console.warn('Bad Request: Invalid data sent to server');
            break;
          
          case 401: // Unauthorized
            console.warn('Authentication failed');
            // Remove invalid token
            localStorage.removeItem('authToken');
            
            // Redirect to login page
            history.push('/login');
            
            // Optional: Dispatch logout action if using Redux
            // store.dispatch(logoutAction());
            break;
          
          case 403: // Forbidden
            console.warn('Access forbidden: Insufficient permissions');
            // Optional: Redirect to unauthorized page
            history.push('/unauthorized');
            break;
          
          case 404: // Not Found
            console.warn('Requested resource not found');
            break;
          
          case 500: // Internal Server Error
            console.error('Server-side error occurred');
            // Optional: Show global error notification
            // toast.error('A server error occurred. Please try again later.');
            break;
          
          case 503: // Service Unavailable
            console.warn('Service temporarily unavailable');
            // Optional: Implement retry or show maintenance message
            break;
          
          default:
            console.warn('Unhandled API error', error.response);
        }
        
        // Rethrow error for catch block handling
        return Promise.reject(error.response);
      } else if (error.request) {
        // Request was made but no response received (network error)
        console.error('Network Error:', error.message);
        
        // Optional: Check if it's a network connectivity issue
        if (!navigator.onLine) {
          // Handle offline scenario
          console.warn('No internet connection');
          // Optional: Show offline notification
          // toast.error('No internet connection');
        }
        
        return Promise.reject({
          type: 'NetworkError',
          message: 'Unable to connect to the server'
        });
      } else {
        // Something happened in setting up the request
        console.error('Request Setup Error:', error.message);
        
        return Promise.reject({
          type: 'RequestError',
          message: 'An error occurred while preparing the request'
        });
      }
    }
  );
};

// Optional: Connection monitoring utility
export const networkMonitor = {
  /**
   * Check current network status
   * @returns {boolean} - Whether device is online
   */
  isOnline: () => navigator.onLine,
  
  /**
   * Add online/offline event listeners
   * @param {Function} onOnline - Callback when network comes online
   * @param {Function} onOffline - Callback when network goes offline
   */
  monitor: (onOnline, onOffline) => {
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }
};