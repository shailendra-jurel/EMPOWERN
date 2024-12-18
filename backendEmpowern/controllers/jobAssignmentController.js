const JobAssignment = require('../models/JobAssignment');

exports.createJobAssignment = async (req, res) => {
    try {
        const jobAssignment = new JobAssignment(req.body);
        await jobAssignment.save();
        res.status(201).json(jobAssignment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllJobAssignments = async (req, res) => {
    try {
        const jobAssignments = await JobAssignment.find()
            .populate({
                path: 'worker',
                populate: {
                    path: 'userId',
                    model: 'User'
                }
            })
            .populate({
                path: 'job',
                populate: {
                    path: 'postedBy',
                    populate: {
                        path: 'userId',
                        model: 'User'
                    }
                }
            });
        res.status(200).json(jobAssignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getJobAssignmentById = async (req, res) => {
    try {
        const jobAssignment = await JobAssignment.findById(req.params.id)
            .populate({
                path: 'worker',
                populate: {
                    path: 'userId',
                    model: 'User'
                }
            })
            .populate({
                path: 'job',
                populate: {
                    path: 'postedBy',
                    populate: {
                        path: 'userId',
                        model: 'User'
                    }
                }
            });
        if (jobAssignment) {
            res.status(200).json(jobAssignment);
        } else {
            res.status(404).json({ message: 'Job assignment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getJobAssignmentsByJobId = async (req, res) => {
    console.log('Job ID received:', req.params.jobId); 
    try {
        const jobAssignments = await JobAssignment.find({ job: req.params.jobId })
            .populate({
                path: 'worker',
                populate: {
                    path: 'userId',
                    model: 'User'
                }
            })
            .populate({
                path: 'job',
                populate: {
                    path: 'postedBy',
                    populate: {
                        path: 'userId',
                        model: 'User'
                    }
                }
            });
        
        console.log('Job assignments found:', jobAssignments);
        if (jobAssignments.length > 0) {
            res.status(200).json(jobAssignments);
        } else {
            res.status(404).json({ message: 'No job assignments found for this job' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateJobAssignment = async (req, res) => {
    try {
        const jobAssignment = await JobAssignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (jobAssignment) {
            res.status(200).json(jobAssignment);
        } else {
            res.status(404).json({ message: 'Job assignment not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteJobAssignment = async (req, res) => {
    try {
        const jobAssignment = await JobAssignment.findByIdAndDelete(req.params.id);
        if (jobAssignment) {
            res.status(200).json({ message: 'Job assignment deleted successfully' });
        } else {
            res.status(404).json({ message: 'Job assignment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getJobAssignmentsByWorkerId = async (req, res) => {
    console.log('Worker ID received:', req.params.workerId); // Log the workerId
    try {
        const jobAssignments = await JobAssignment.find({ worker: req.params.workerId })
            .populate({
                path: 'worker',
                populate: {
                    path: 'userId',
                    model: 'User'
                }
            })
            .populate({
                path: 'job',
                populate: {
                    path: 'postedBy',
                    populate: {
                        path: 'userId',
                        model: 'User'
                    }
                }
            });
        if (jobAssignments.length > 0) {
            console.log('Job assignments found:', jobAssignments); // Log the jobAssignments
            res.status(200).json(jobAssignments);
        } else {
            res.status(404).json({ message: 'No job assignments found for this worker' });
        }
    } catch (error) {
        console.error('Error fetching job assignments by worker ID:', error);
        res.status(500).json({ message: error.message });
    }
};
