import express from 'express';
const router = express.Router();
import skillsController from '../controllers/SkillsController.js';
router.post('/', skillsController.createSkill);
router.get('/', skillsController.getAllSkills);
router.get('/:id', skillsController.getSkillById);
router.put('/:id', skillsController.updateSkill);
router.delete('/:id', skillsController.deleteSkill);

export default  router;
