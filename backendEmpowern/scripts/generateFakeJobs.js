import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';

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
            accomodation: faker.datatype.boolean(),
            transportation: faker.datatype.boolean(),
            workersRequired: faker.number.int({ min: 1, max: 10 }),
            skillsRequired: faker.lorem.words(3),
            postedBy: new mongoose.Types.ObjectId(),
            postedDate: faker.date.recent({ days: 30 })
        };
        jobs.push(job);
    }
    
    return jobs;
};

export default generateFakeJobs;