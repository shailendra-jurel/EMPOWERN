import express from 'express';
const router = express.Router();
import labourWorkerController from '../controllers/LabourWorkerController.js';


router.post('/create', labourWorkerController.createLabourWorker);
router.get('/getAll', labourWorkerController.getAllLabourWorkers);
router.get('/get/:id', labourWorkerController.getLabourWorkerById);
router.get('/getByUserId/:userId', labourWorkerController.getLabourWorkerByUserId); // Updated route
router.put('/update/:id', labourWorkerController.updateLabourWorker);
router.delete('/delete/:id', labourWorkerController.deleteLabourWorker);

export default  router;
