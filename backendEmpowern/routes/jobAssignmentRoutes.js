import express from 'express';
const router = express.Router();
import jobAssignmentController from '../controllers/jobAssignmentController.js';

router.post('/create', jobAssignmentController.createJobAssignment);
router.get('/getAll', jobAssignmentController.getAllJobAssignments);
router.get('/get/:id', jobAssignmentController.getJobAssignmentById);
router.get('/getByJobId/:jobId', jobAssignmentController.getJobAssignmentsByJobId); 
router.get('/getByWorkerId/:workerId', jobAssignmentController.getJobAssignmentsByWorkerId); // New route
router.put('/update/:id', jobAssignmentController.updateJobAssignment);
router.delete('/delete/:id', jobAssignmentController.deleteJobAssignment);

export default  router;
