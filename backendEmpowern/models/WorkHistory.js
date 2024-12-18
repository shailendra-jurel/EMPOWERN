// models/WorkHistory.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workHistorySchema = new Schema({
  workerId: { type: Schema.Types.ObjectId, ref: 'LabourWorker', required: true },
  workHistory: { type: String, required: true }
});

const WorkHistory = mongoose.model('WorkHistory', workHistorySchema);

module.exports = WorkHistory;
