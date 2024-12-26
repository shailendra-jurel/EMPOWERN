import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const jobAssignmentSchema = new Schema({
    worker: {
        type: Schema.Types.ObjectId,
        ref: 'LabourWorker',
    },
    job: {
        type: Schema.Types.ObjectId,
        ref: 'Jobs',
    },
    demandedWage : {
        type: Number,
    },
    assignmentDate: {
        type: Date,
        default: Date.now
    },
    extracontact: {
        type: String,
    },
    additionalExpectations:{
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
    amountRecieved: {
        type: Number,
    },
});

export default mongoose.model('JobAssignment', jobAssignmentSchema);
