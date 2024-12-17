//  backend  server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jobRoutes = require('./routes/jobRoutes');

const app = express();

// Middleware


// app.use(cors());

// Updated CORS configuration
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/jobs', jobRoutes);

// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/empowern', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });


mongoose.connect('mongodb://127.0.0.1:27017/empowern', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
    // Seed initial data
    console.log('Seeding initial data...');
    const seedJobs = require('./scripts/seedJobs');
    return seedJobs();
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});


















// Add this to your app.js for debugging
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

// Optional: Seed the database on startup
const seedJobs = require('./scripts/seedJobs');
seedJobs();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});