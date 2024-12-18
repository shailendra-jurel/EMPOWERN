const LabourWorker = require('../models/LabourWorker');

exports.createLabourWorker = async (req, res) => {
    try {
        const newLabourWorker = new LabourWorker(req.body);
        await newLabourWorker.save();
        res.status(201).json(newLabourWorker);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllLabourWorkers = async (req, res) => {
    try {
        const labourWorkers = await LabourWorker.find().populate('userId');
        res.json(labourWorkers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLabourWorkerById = async (req, res) => {
    try {
        const labourWorker = await LabourWorker.findById(req.params.id).populate('userId');
        if (labourWorker) {
            res.json(labourWorker);
        } else {
            res.status(404).json({ message: 'Labour worker not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateLabourWorker = async (req, res) => {
    try {
        const updatedLabourWorker = await LabourWorker.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('userId');
        res.json(updatedLabourWorker);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteLabourWorker = async (req, res) => {
    try {
        await LabourWorker.findByIdAndDelete(req.params.id);
        res.json({ message: 'Labour worker deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLabourWorkerByUserId = async (req, res) => {
    console.log('this is the user id', req.params.userId);
    try {
        const labourWorker = await LabourWorker.findOne({ userId: req.params.userId }).populate('userId');
        if (labourWorker) {
            res.json(labourWorker);
        } else {
            res.status(404).json({ message: 'Labour worker not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
