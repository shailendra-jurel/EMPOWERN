// src/utils/api/config.js

  // API Configuration Module provides centralized configuration for different  environment settings, retry mechanisms, and API endpoints.
export const API_CONFIG = {
    /**
     * Environment-specific API configurations Allows seamless switching between different backend environments
     */
    ENVIRONMENTS: {
      // Development environment configuration
      DEVELOPMENT: {
        baseURL: 'http://localhost:5000/api', 
        timeout: 10000, 
      },
      // Production environment configuration
      PRODUCTION: {
        baseURL: 'https://labor-employement.onrender.com/api', // Deployed production API
        timeout: 15000, // Slightly longer timeout for production
      },
      // Test environment configuration
      TEST: {
        baseURL: 'http://test-api.example.com/api', // Separate test environment
        timeout: 5000, 
      }
    },
      // Retry mechanism configuration  Helps handle temporary network issues or server hiccups
    RETRY: {
      ATTEMPTS: 3, // Number of retry attempts for failed requests
      DELAY: 1000, // Initial delay between retries in milliseconds
    }
  };