// scripts/generateFakeJobs.js
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Job = require('../models/Job');

const generateFakeJobs = async (count = 20) => {
    const jobs = [];
    
    for (let i = 0; i < count; i++) {
        const job = {
            name: faker.company.catchPhrase(),
            jobType: faker.helpers.arrayElement([
                'Construction',
                'Maintenance',
                'Installation',
                'Repair',
                'Other'
            ]),
            location: faker.location.city(),
            payRate: faker.number.int({ min: 500, max: 2000 }),
            status: 'Open',
            description: faker.lorem.paragraph(),
            requirements: [
                faker.lorem.sentence(),
                faker.lorem.sentence(),
                faker.lorem.sentence()
            ],
            postedDate: faker.date.recent({ days: 30 })
        };
        jobs.push(job);
    }
    
    return jobs;
};

module.exports = generateFakeJobs;