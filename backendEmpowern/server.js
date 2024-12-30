//  backend  server.js

import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
const app = express();

import jwt from 'jsonwebtoken';
const SECRET_KEY = 'YOUR_SECRET_KEY';
// Function to generate JWT token after Google login success
const generateToken = (userId) => {
    return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
  };


  import twilio from 'twilio';
  import { twilioConfig , validateTwilioConfig } from './config/twilio.js';
  
 // Initialize Twilio client with validation
let twilioClient;
try {
  validateTwilioConfig();
  twilioClient = twilio(twilioConfig.accountSid, twilioConfig.authToken);
} catch (error) {
  console.error('Twilio Configuration Error:', error.message);
  // Don't exit the process, just disable Twilio features
  twilioClient = null;
}

  

// importing  Routes
import jobRoutes from './routes/jobRoutes.js';
//  this is a fake route  that I generate  to use  faker  in   other files  to create fake jobs on that route

import userRoutes from './routes/userRoutes.js';
import labourWorkerRoutes from './routes/labourWorkerRoutes.js';
import contractorRoutes from './routes/contractorRoutes.js';
import jobRoutes2 from './routes/jobRoutes2.js';
import skillsRoutes from './routes/skillsRoutes.js';
import workHistoryRoutes from './routes/workHistoryRoutes.js';
import ratingsRoutes from './routes/ratingsRoutes.js';
import jobAssignmentRoutes from './routes/jobAssignmentRoutes.js';


import {seedJobs} from './scripts/seedJobs.js';


// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());  // instead of bodyparser.json()   also we can use functionality like limit
app.use(express.urlencoded({ extended: true }));  // like html form 


// mongoose.connect('mongodb://localhost:27017/empowern', {
    const connectDB = async () => {
        try {
            if (!process.env.MONGODB_URI) {
                throw new Error('MONGODB_URI is not defined in environment variables');
            }
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('Connected to MongoDB');
            await seedJobs();
            console.log('Database seeded successfully');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            process.exit(1);
        }
    };
    connectDB();
    // Add this to your app.js for debugging
    mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to MongoDB');
    });
    
    mongoose.connection.on('error', (err) => {
        console.error('Mongoose connection error:', err);
    });


// AUTHENTICATION  TYPE OF THINGS    HAVE TO  LATER ON  SAPERRATE IT BY MYSELF
    app.post('/google-login', async (req, res) => {
        const { userId } = req.body;  // Extract the userId (or user data) from the frontend request
      
        const token = generateToken(userId);  // Create JWT for the user
        res.json({ token });  // Send the token back to the client
      });





// Updated OTP endpoints
app.post('/api/auth/send-otp', async (req, res) => {
    if (!twilioClient) {
      return res.status(503).json({
        success: false,
        message: 'SMS service is currently unavailable'
      });
    }
  
    try {
      const { phone } = req.body;
      if (!phone) {
        return res.status(400).json({
          success: false,
          message: 'Phone number is required'
        });
      }
  
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      const verification = await twilioClient.verify.v2
        .services(twilioConfig.verifyServiceSid)
        .verifications.create({
          to: formattedPhone,
          channel: 'sms'
        });
  
      res.json({
        success: true,
        message: 'OTP sent successfully'
      });
    } catch (error) {
      console.error('Send OTP Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to send OTP'
      });
    }
  });
  
  app.post('/api/auth/verify-otp', async (req, res) => {
    if (!twilioClient) {
      return res.status(503).json({
        success: false,
        message: 'SMS service is currently unavailable'
      });
    }
  
    try {
      const { phone, otp } = req.body;
      if (!phone || !otp) {
        return res.status(400).json({
          success: false,
          message: 'Phone number and OTP are required'
        });
      }
  
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      const verification = await twilioClient.verify.v2
        .services(twilioConfig.verifyServiceSid)
        .verificationChecks.create({
          to: formattedPhone,
          code: otp
        });
  
      if (verification.status === 'approved') {
        const token = generateToken(formattedPhone);
        res.json({
          success: true,
          message: 'OTP verified successfully',
          token
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Invalid OTP'
        });
      }
    } catch (error) {
      console.error('Verify OTP Error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to verify OTP'
      });
    }
  });
    
    
    app.use('/api/jobs', jobRoutes);
// app.use('/api/jobs', jobRoutes2);
app.use('/api/users', userRoutes);
app.use('/api/workers', labourWorkerRoutes);
app.use('/api/contractors', contractorRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/workHistory', workHistoryRoutes);
app.use('/api/rating', ratingsRoutes);
app.use('/api/jobAssignment', jobAssignmentRoutes);
app.get('/', (req, res) => {
    res.json({ 
        status: 'success',
        message: 'Welcome to Empowern API',
        version: '1.0.0'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});