// controllers/JobController.js
const Job = require('../models/Jobs');

exports.createJob = async (req, res) => {
    try {
        const newJob = new Job(req.body);
        await newJob.save();
        res.status(201).json(newJob);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('postedBy');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate({
            path: 'postedBy',
            populate: {
                path: 'userId',
                model: 'User'
            }
        });
        if (job) {
            res.json(job);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateJob = async (req, res) => {
    console.log('reached server for updating the job')
    console.log('req.params:', req.params);
    console.log('req.body:', req.body);
    try {
        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate({
            path: 'postedBy',
            populate: {
                path: 'userId',
                model: 'User'
            }
        });
        res.json(updatedJob);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.deleteJob = async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getJobByPostedById = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.params.id }).populate('postedBy');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


