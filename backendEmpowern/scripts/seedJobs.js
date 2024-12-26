// scripts/seedJobs.js
import mongoose from 'mongoose';
import generateFakeJobs from './generateFakeJobs.js';
import Job from '../models/Jobs.js';

export const seedJobs = async () => {
    try {
        // Clear existing jobs  ->  deleteMany() is a Mongoose method that removes all documents matching the filter criteria
        // Here we pass an empty object {} as the filter to match and delete ALL existing jobs
        // This ensures we start with a clean slate before seeding new fake job data
        await Job.deleteMany({}); 
        
        // Generate new fake jobs
        await Job.deleteMany({});
        const fakeJobs = await generateFakeJobs(20);
        const insertedJobs = await Job.insertMany(fakeJobs);
        console.log(`Successfully seeded ${insertedJobs.length} jobs`);
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
};
