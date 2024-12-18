// models/Contractor.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contractorSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User'},
  email: { type: String},
  companyName: { type: String}
});

const Contractor = mongoose.model('Contractor', contractorSchema);

module.exports = Contractor;
