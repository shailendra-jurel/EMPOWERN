import mongoose from 'mongoose';

const jobAssignmentSchema = new mongoose.Schema({
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LabourWorker',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  demandedWage: Number,
  extraContact: String,
  contractTerms: String,
  assignmentDate: Date
}, {
  timestamps: true
});

export default mongoose.model('JobAssignment', jobAssignmentSchema);