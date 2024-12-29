import axios from 'axios';

// Set the base URL for API calls
const BASE_URL = 'https://api.example.com';

// Function to fetch all jobs
export const fetchAllJobs = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/jobs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    throw error;
  }
};

// Function to fetch a job by ID
export const fetchJobById = async (jobId) => {
  try {
    const response = await axios.get(`${BASE_URL}/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching job with ID ${jobId}:`, error);
    throw error;
  }
};

// Function to apply for a job
export const applyForJob = async (jobId, applicantData) => {
  try {
    const response = await axios.post(`${BASE_URL}/jobs/${jobId}/apply`, applicantData);
    return response.data;
  } catch (error) {
    console.error(`Error applying for job with ID ${jobId}:`, error);
    throw error;
  }
};

// Function to update job details
export const updateJob = async (jobId, updatedData) => {
  try {
    const response = await axios.put(`${BASE_URL}/jobs/${jobId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating job with ID ${jobId}:`, error);
    throw error;
  }
};

// Function to delete a job
export const deleteJob = async (jobId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting job with ID ${jobId}:`, error);
    throw error;
  }
};

// Function to fetch jobs by status
export const fetchJobsByStatus = async (status) => {
  try {
    const response = await axios.get(`${BASE_URL}/jobs?status=${status}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching jobs with status ${status}:`, error);
    throw error;
  }
};
