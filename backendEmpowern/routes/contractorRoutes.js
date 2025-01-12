import express from 'express';
const router = express.Router();  //  how express.Router() works -->  https://expressjs.com/en/4x/api.html#router
import contractorController from '../controllers/contractorController.js';

router.post('/create', contractorController.createContractor);
router.get('/getAll', contractorController.getAllContractors);
router.get('/get/:id', contractorController.getContractorById);  //  getContractorById  vs  getContractorByUserId     what is difference
router.put('/update/:id', contractorController.updateContractor);
router.delete('/delete/:id', contractorController.deleteContractor);

router.get('/getByUserId', contractorController.getContractorByUserId); 
export default  router;
