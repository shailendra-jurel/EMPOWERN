// src/calls/jobCalls.jsx
import React, { useEffect, useState } from 'react';
import { jobService } from './jobService'; // Import the job service

const JobCalls = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({}); // For search filters
    const [selectedJob, setSelectedJob] = useState(null); // For job details

    // Fetch all jobs on component mount
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const jobList = await jobService.getJobs();
                setJobs(jobList);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    // Handle job search
    const handleSearch = async () => {
        setLoading(true);
        try {
            const filteredJobs = await jobService.searchJobs(filters);
            setJobs(filteredJobs);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle job selection for details
    const handleJobSelect = async (id) => {
        setLoading(true);
        try {
            const jobDetails = await jobService.getJobById(id);
            setSelectedJob(jobDetails);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle job application
    const handleApply = async (jobId) => {
        const applicationData = { status: 'Applied' }; // Customize as needed
        try {
            const result = await jobService.applyForJob(jobId, applicationData);
            alert(`Applied successfully for job: ${result.title}`);
        } catch (err) {
            setError(err.message);
        }
    };

    // Render loading, error, and job list
    return (
        <div>
            <h1>Job Listings</h1>
            {loading && <p>Loading jobs...</p>}
            {error && <p>Error: {error}</p>}
            <div>
                <input
                    type="text"
                    placeholder="Search jobs..."
                    onChange={(e) => setFilters({ ...filters, title: e.target.value })}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <ul>
                {jobs.map((job) => (
                    <li key={job.id}>
                        <h2 onClick={() => handleJobSelect(job.id)}>{job.title}</h2>
                        <button onClick={() => handleApply(job.id)}>Apply</button>
                    </li>
                ))}
            </ul>
            {selectedJob && (
                <div>
                    <h2>Job Details</h2>
                    <p>{selectedJob.description}</p>
                    <p>Location: {selectedJob.location}</p>
                    {/* Add more job details as needed */}
                </div>
            )}
        </div>
    );
};

export default JobCalls;