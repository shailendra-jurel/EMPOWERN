// routes/jobRoutes.js
//  this is just  a fake    code snippet to show how the routes are created in the backend
import express from 'express';
const router = express.Router();
import Job from '../models/Jobs.js';

// Get all jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ postedDate: -1 });
         // postedDate is a field in the Job model that stores the date when a job was posted  We sort by postedDate in descending order (-1) to show newest jobs first
    // This helps users see the most recent job postings at the top of the list
        console.log('Fetching jobs from database...')
        console.log('Jobs fetched:', jobs.length); // Debug log
        res.json(jobs); 
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ 
            message: 'Failed to fetch jobs',
            error: error.message 
        });
    }
});
// Get job by ID
router.get('/getById/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ 
            message: 'Error fetching job details',
            error: error.message 
        });
    }
});

export default  router;