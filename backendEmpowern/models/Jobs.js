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
        enum: ['Open', 'In Progress', 'Completed', 'Cancelled']
    },
    accomodation: {
        type: Boolean,
        default: false
    },
    transportation: {
        type: Boolean,
        default: false
    },
    workersRequired: {
        type: Number,
        required: true
    },
    skillsRequired: {
        type: String
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contractor',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    ownerDetails: {
        name: String,
        mobile: String,
        company: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Job', jobSchema);