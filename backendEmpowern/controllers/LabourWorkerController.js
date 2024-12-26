import LabourWorker from '../models/LabourWorker.js';
const createLabourWorker = async (req, res) => {
    try {
        const newLabourWorker = new LabourWorker(req.body);
        await newLabourWorker.save();
        res.status(201).json(newLabourWorker);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllLabourWorkers = async (req, res) => {
    try {
        const labourWorkers = await LabourWorker.find().populate('userId');
        res.json(labourWorkers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLabourWorkerById = async (req, res) => {
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

const updateLabourWorker = async (req, res) => {
    try {
        const updatedLabourWorker = await LabourWorker.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('userId');
        res.json(updatedLabourWorker);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteLabourWorker = async (req, res) => {
    try {
        await LabourWorker.findByIdAndDelete(req.params.id);
        res.json({ message: 'Labour worker deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLabourWorkerByUserId = async (req, res) => {
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

export default { createLabourWorker, getAllLabourWorkers, getLabourWorkerById, updateLabourWorker, deleteLabourWorker, getLabourWorkerByUserId };
