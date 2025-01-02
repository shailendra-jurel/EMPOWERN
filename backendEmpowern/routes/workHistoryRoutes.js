import express from 'express';
const router = express.Router();
import workHistoryController from '../controllers/WorkHistoryController.js';

router.post('/', workHistoryController.createWorkHistory);
router.get('/', workHistoryController.getAllWorkHistories);
router.get('/:id', workHistoryController.getWorkHistoryById);
router.put('/:id', workHistoryController.updateWorkHistory);
router.delete('/:id', workHistoryController.deleteWorkHistory);
router.get('/employee/:employeeId', workHistoryController.getWorkHistoryByEmployeeId);

export default  router;
