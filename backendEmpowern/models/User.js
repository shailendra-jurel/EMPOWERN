import mongoose from 'mongoose';
import Skills from './Skills.js';

const Schema = mongoose.Schema;

// Enum for user types
const userTypes = {
  LABOR_WORKER: "labor_worker",
  CONTRACTOR: "contractor",
};

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'], 
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  phone: {
    type: String,
    unique: true,
    sparse: true, 
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  userType: {
    type: String,
    required: true,
    enum: {
      values: ['worker', 'contractor'],
      message: 'User type must be either worker or contractor'
    }
  },
  profileStatus: {
    type: String,
    enum: ['incomplete', 'complete'],
    default: 'incomplete'
  },
  googleId: String,
  profilePicture: String
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
