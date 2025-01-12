// models/Skills.js

import mongoose from 'mongoose';
const Schema = mongoose.Schema;


// this is correct  skill are for worker only  
const skillSchema = new Schema({
  workerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'LabourWorker', 
    required: true 
  },

  skill: {
     type: String,
     required: true }
});

const Skills = mongoose.model('Skills', skillSchema);
export default   Skills;
