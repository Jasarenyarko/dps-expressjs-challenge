import express from 'express';
import projectController from '../controllers/project.controller';

const projectRouter = express.Router();

projectRouter
	.route('/')
	.get(projectController.getAll)
	.post(projectController.create);

projectRouter
	.route('/:id')
	.get(projectController.findById)
	.delete(projectController.remove)
	.put(projectController.update);

export default projectRouter;
