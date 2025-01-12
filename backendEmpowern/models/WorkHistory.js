// models/WorkHistory.js

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const workHistorySchema = new Schema({
  // I think workHistory should be for both contractor and worker  as  worker has work experience and contractor has project experience and year of experience in the work
 // I think it is incomplete as it is only for worker
  workerId: { type: Schema.Types.ObjectId,
     ref: 'LabourWorker', 
     required: true 
    },
  workHistory: { type: String,  
  required: true }
});

const WorkHistory = mongoose.model('WorkHistory', workHistorySchema);

export default  WorkHistory;
