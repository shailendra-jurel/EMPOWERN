//  backend  server.js

import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
const app = express();


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
    
    
    app.use('/api/jobs', jobRoutes);
// Routes
app.use('/api/users', userRoutes)
app.use('/api/workers', labourWorkerRoutes)
app.use('/api/contractors', contractorRoutes)
// app.use('/api/jobs', jobRoutes2)
app.use('/api/skills', skillsRoutes)
app.use('/api/workHistory', workHistoryRoutes)
app.use('/api/rating', ratingsRoutes)
app.use('/api/jobAssignment', jobAssignmentRoutes)
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