import mongoose from 'mongoose';
import Skills from './Skills.js';

const Schema = mongoose.Schema;

// Enum for user types
const userTypes = {
  LABOR_WORKER: "labor_worker",
  CONTRACTOR: "contractor",
};

const userSchema = new Schema({
  firstName: { type: String, },
  lastName: { type: String,  },
  mobileNumber : { type: String, required: true },
  userType: { type: String,  enum: Object.values(userTypes) },
  location: { type: String,  },
  token: { type: String },
});

const User = mongoose.model('User', userSchema);

export default   User;