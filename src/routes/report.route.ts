import express from 'express';
import reportController from '../controllers/report.controller';

const reportRouter = express.Router();

reportRouter.get('/special', reportController.specialReport);
reportRouter.get('/project/:projectId', reportController.findByProjectId);

reportRouter
	.route('/')
	.get(reportController.getAll)
	.post(reportController.create);

reportRouter
	.route('/:id')
	.get(reportController.findById)
	.delete(reportController.remove)
	.put(reportController.update);

export default reportRouter;
