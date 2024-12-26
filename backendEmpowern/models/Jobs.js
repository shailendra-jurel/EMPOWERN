import mongoose from 'mongoose';

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
    accomodation: {
        type: Boolean
    },
    transportation: {
        type: Boolean
    },
    workersRequired: {
        type: Number
    },
    skillsRequired: {
        type: String
    },
    description: String,
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contractor'
    },
    postedDate: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Job', jobSchema);