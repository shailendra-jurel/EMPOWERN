import express from 'express';
const router = express.Router();
import Job from '../models/Jobs.js';
import jobController from '../controllers/JobController.js';

// Get all jobs (including seeded)
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ postedDate: -1 });
        console.log('Sending jobs to client:', jobs.length);
        res.json(jobs); // Send the array directly
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
    }
});

// Get job by ID - Update route to match frontend exactly
router.get('/getById/:id', async (req, res) => {
    try {
        console.log('Fetching job with ID:', req.params.id); // Debug log
        const job = await Job.findById(req.params.id).populate('postedBy');
        
        if (!job) {
            return res.status(404).json({ 
                message: `Job with ID ${req.params.id} not found` 
            });
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

// Create new job
router.post('/create', jobController.createJob);

// Update job
router.put('/update/:id', jobController.updateJob);

// Delete job
router.delete('/delete/:id', jobController.deleteJob);

// Get jobs by contractor
router.get('/posted-by/:id', jobController.getJobByPostedById);

// Apply for job
router.post('/apply/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;
        const { workerId } = req.body;
        
        // Create job assignment
        const assignment = {
            job: jobId,
            worker: workerId,
            status: 'PENDING'
        };
        
        // Save assignment
        const newAssignment = await JobAssignment.create(assignment);
        res.json(newAssignment);
    } catch (error) {
        res.status(500).json({ message: 'Error applying for job', error: error.message });
    }
});

export default router;