// models/LabourWorker.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const labourWorkerSchema = new Schema({
  userId: { 
  type: Schema.Types.ObjectId,
  ref: 'User' 
  },
  workerImage: { type: String},
  expectedWage: { type: Number },
  skills: { type: String },
});
const LabourWorker = mongoose.model('LabourWorker', labourWorkerSchema);
export default  LabourWorker;





















