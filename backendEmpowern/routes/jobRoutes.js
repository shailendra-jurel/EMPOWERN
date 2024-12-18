// routes/jobRoutes.js
//  this is just  a fake    code snippet to show how the routes are created in the backend
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// Get all jobs
router.get('/getAllJobs', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ postedDate: -1 });
        console.log('Jobs fetched:', jobs.length); // Debug log
        res.json(jobs);
    } catch (error) {
        next(error); // Pass to error handler
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

module.exports = router;