import express from 'express';
const router = express.Router();
import userController from '../controllers/userController.js';
router.post('/create', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/get/:id', userController.getUserById);
router.put('/update/:id', userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);
router.get('/getbynumber/:mobileNumber', userController.getUserByNumber);

export default  router;
    