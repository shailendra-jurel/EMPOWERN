
import User from '../models/User.js';

const createUser = async (req, res) => {
    console.log('req.body', req.body);
    console.log('user called for creating')
    try {
        console.log('req.body', req.body);
        const newUser = new User(req.body);
        console.log('newUser', newUser);
        await newUser.save();
        console.log('user created')
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserByNumber = async(req, res) => {
    try {
        const user = await User.findOne({ mobileNumber: req.params.mobileNumber });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    console.log('req.body', req.body);
    console.log('user called for updating')
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export default {
    createUser,
    getAllUsers,
    getUserById,
    getUserByNumber,
    updateUser,
    deleteUser
};
