// src/calls/jobCalls.jsx
import React, { useEffect, useState } from 'react';
import { jobService } from './jobService'; // Import the job service
import { apiHelpers } from '../utilities/api/helpers'; // Import API helpers

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
                setError(apiHelpers.handleError(err, 'fetch jobs'));
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    // Search jobs based on filters
    const handleSearch = async () => {
        setLoading(true);
        try {
            const filteredJobs = await jobService.searchJobs(filters);
            setJobs(filteredJobs);
        } catch (err) {
            setError(apiHelpers.handleError(err, 'search jobs'));
        } finally {
            setLoading(false);
        }
    };

    // Handle job selection for details
    const handleJobSelect = async (jobId) => {
        setLoading(true);
        try {
            const jobDetails = await jobService.getJobById(jobId);
            setSelectedJob(jobDetails);
        } catch (err) {
            setError(apiHelpers.handleError(err, 'get job details'));
        } finally {
            setLoading(false);
        }
    };

    // Render job list
    const renderJobs = () => {
        if (loading) return <p>Loading jobs...</p>;
        if (error) return <p>Error: {error.message}</p>;

        return jobs.map(job => (
            <div key={job.id} onClick={() => handleJobSelect(job.id)}>
                <h3>{job.title}</h3>
                <p>{job.description}</p>
                <p>{job.location}</p>
            </div>
        ));
    };

    return (
        <div>
            <h1>Job Listings</h1>
            <div>
                <input
                    type="text"
                    placeholder="Search by title or location"
                    onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <div>
                {renderJobs()}
            </div>
            {selectedJob && (
                <div>
                    <h2>Job Details</h2>
                    <h3>{selectedJob.title}</h3>
                    <p>{selectedJob.description}</p>
                    <p>{selectedJob.location}</p>
                    <button onClick={() => jobService.applyForJob(selectedJob.id)}>Apply</button>
                </div>
            )}
        </div>
    );
};

export default JobCalls;