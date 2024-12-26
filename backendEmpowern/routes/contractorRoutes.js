import express from 'express';
const router = express.Router();
import contractorController from '../controllers/contractorController.js';

router.post('/create', contractorController.createContractor);
router.get('/getAll', contractorController.getAllContractors);
router.get('/get/:id', contractorController.getContractorById);
router.get('/getByUserId', contractorController.getContractorByUserId); // New route
router.put('/update/:id', contractorController.updateContractor);
router.delete('/delete/:id', contractorController.deleteContractor);

export default  router;
