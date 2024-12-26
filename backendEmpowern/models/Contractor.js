// models/Contractor.js

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const contractorSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User'},
  email: { type: String},
  companyName: { type: String}
});

const Contractor = mongoose.model('Contractor', contractorSchema);

export default  Contractor;
