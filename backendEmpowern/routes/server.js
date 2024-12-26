const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

// Database connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// Importing routes
const userRoutes = require('./routes/userRoutes');
const labourWorkerRoutes = require('./routes/labourWorkerRoutes');
const contractorRoutes = require('./routes/contractorRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const jobRoutes = require('./routes/jobRoutes');
const rentalTransactionRoutes = require('./routes/rentalTransactionRoutes');
const purchaseTransactionRoutes = require('./routes/purchaseTransactionRoutes');
const skillsRoutes = require('./routes/skillsRoutes');
const workHistoryRoutes = require('./routes/workHistoryRoutes');
const ratingsRoutes = require('./routes/ratingsRoutes');
const authRoutes = require('./routes/authRoutes'); // Assuming you have this route
const jobAssignmentRoutes = require('./routes/jobAssignmentRoutes'); // Assuming you have this route

// Using routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workers', labourWorkerRoutes);
app.use('/api/contractors', contractorRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/rentaltransactions', rentalTransactionRoutes);
app.use('/api/purchasetransactions', purchaseTransactionRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/workhistories', workHistoryRoutes);
app.use('/api/ratings', ratingsRoutes);
app.use('/api/jobAssignments', jobAssignmentRoutes); // Using jobAssignmentRoutes

// Server setup
const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
