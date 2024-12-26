// controllers/SkillsController.js

import Skills from '../models/Skills.js';
const createSkill = async (req, res) => {
    try {
        const newSkill = new Skills(req.body);
        await newSkill.save();
        res.status(201).json(newSkill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllSkills = async (req, res) => {
    try {
        const skills = await Skills.find().populate('workerId');
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSkillById = async (req, res) => {
    try {
        const skill = await Skills.findById(req.params.id).populate('workerId');
        if (skill) {
            res.json(skill);
        } else {
            res.status(404).json({ message: 'Skill not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSkill = async (req, res) => {
    try {
        const updatedSkill = await Skills.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedSkill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteSkill = async (req, res) => {
    try {
        await Skills.findByIdAndDelete(req.params.id);
        res.json({ message: 'Skill deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSkillsByEmployeeId = async (req, res) => {
    try {
        const skills = await Skills.find({ workerId: req.params.employeeId }).populate('workerId');
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default { createSkill, getAllSkills, getSkillById, updateSkill, deleteSkill, getSkillsByEmployeeId };
