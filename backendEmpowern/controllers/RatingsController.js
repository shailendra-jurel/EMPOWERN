// import Ratings from '../models/Ratings';
import Ratings from '../models/Ratings.js';
const createRating = async (req, res) => {
    try {
        const newRating = new Ratings(req.body);
        await newRating.save();
        res.status(201).json(newRating);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllRatings = async (req, res) => {
    try {
        const ratings = await Ratings.find().populate('ratedBy').populate('targetId');
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRatingById = async (req, res) => {
    try {
        const rating = await Ratings.findById(req.params.id).populate('ratedBy').populate('targetId');
        if (rating) {
            res.json(rating);
        } else {
            res.status(404).json({ message: 'Rating not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateRating = async (req, res) => {
    try {
        const updatedRating = await Ratings.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedRating);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteRating = async (req, res) => {
    try {
        await Ratings.findByIdAndDelete(req.params.id);
        res.json({ message: 'Rating deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export default { createRating, getAllRatings, getRatingById, updateRating, deleteRating };