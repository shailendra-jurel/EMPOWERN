import express from 'express';
const router = express.Router();
import jobController from '../controllers/jobController.js';

router.post('/create', jobController.createJob);
router.get('/getAllJobs', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);
router.put('/update/:id', jobController.updateJob);
router.delete('/:id', jobController.deleteJob);
router.get('/posted-by/:id', jobController.getJobByPostedById);

export default  router;
