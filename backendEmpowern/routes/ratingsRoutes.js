import express from 'express';
const router = express.Router();
import ratingsController from '../controllers/ratingsController.js';

router.post('/', ratingsController.createRating);
router.get('/', ratingsController.getAllRatings);
router.get('/:id', ratingsController.getRatingById);
router.put('/:id', ratingsController.updateRating);
router.delete('/:id', ratingsController.deleteRating);

export default  router;
