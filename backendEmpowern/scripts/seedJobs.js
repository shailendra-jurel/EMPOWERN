// scripts/seedJobs.js
const mongoose = require('mongoose');
const generateFakeJobs = require('./generateFakeJobs');
const Job = require('../models/Job');

const seedJobs = async () => {
    try {
        // Clear existing jobs
        await Job.deleteMany({});
        
        // Generate new fake jobs
        const fakeJobs = await generateFakeJobs(20);
        const insertedJobs = await Job.insertMany(fakeJobs);
        console.log(`Successfully seeded ${insertedJobs.length} jobs`);

        
        // Insert fake jobs
        await Job.insertMany(fakeJobs);
        
        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
};

module.exports = seedJobs;