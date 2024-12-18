// controllers/WorkHistoryController.js
const WorkHistory = require('../models/WorkHistory');

exports.createWorkHistory = async (req, res) => {
    try {
        const newHistory = new WorkHistory(req.body);
        await newHistory.save();
        res.status(201).json(newHistory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllWorkHistories = async (req, res) => {
    try {
        const histories = await WorkHistory.find().populate('workerId');
        res.json(histories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getWorkHistoryById = async (req, res) => {
    try {
        const history = await WorkHistory.findById(req.params.id).populate('workerId');
        if (history) {
            res.json(history);
        } else {
            res.status(404).json({ message: 'Work history not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateWorkHistory = async (req, res) => {
    try {
        const updatedHistory = await WorkHistory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedHistory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteWorkHistory = async (req, res) => {
    try {
        await WorkHistory.findByIdAndDelete(req.params.id);
        res.json({ message: 'Work history deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getWorkHistoryByEmployeeId = async (req, res) => {
    try {
        const histories = await WorkHistory.find({ workerId: req.params.employeeId }).populate('workerId');
        res.json(histories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
