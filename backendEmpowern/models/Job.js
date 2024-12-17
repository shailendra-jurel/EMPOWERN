// models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true,
        enum: ['Construction', 'Maintenance', 'Installation', 'Repair', 'Other']
    },
    location: {
        type: String,
        required: true
    },
    payRate: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'Open',
        enum: ['Open', 'Assigned', 'Completed', 'Cancelled']
    },
    description: String,
    requirements: [String],
    postedDate: {
        type: Date,
        default: Date.now
    }
});



module.exports = mongoose.model('Job', jobSchema);