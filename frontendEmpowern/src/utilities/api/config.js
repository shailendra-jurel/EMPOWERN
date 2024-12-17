// src/utils/api/config.js

/**
 * API Configuration Module
 * This module provides centralized configuration for different  environment settings, retry mechanisms, and API endpoints.
 */
export const API_CONFIG = {
    /**
     * Environment-specific API configurations
     * Allows seamless switching between different backend environments
     */
    ENVIRONMENTS: {
      // Development environment configuration
      DEVELOPMENT: {
        baseURL: 'http://localhost:5000/api', // Local development server
        timeout: 10000, // 10 seconds timeout for requests
      },
      // Production environment configuration
      PRODUCTION: {
        baseURL: 'https://labor-employement.onrender.com/api', // Deployed production API
        timeout: 15000, // Slightly longer timeout for production
      },
      // Test environment configuration
      TEST: {
        baseURL: 'http://test-api.example.com/api', // Separate test environment
        timeout: 5000, // Shorter timeout for test environments
      }
    },
    
    
      // Retry mechanism configuration  Helps handle temporary network issues or server hiccups
     
    RETRY: {
      ATTEMPTS: 3, // Number of retry attempts for failed requests
      DELAY: 1000, // Initial delay between retries in milliseconds
    }
  };