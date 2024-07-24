import { Request, Response } from 'express';
import projectRepository from '../repositories/project.repository';

function getAll(req: Request, res: Response) {
	try {
		const result = projectRepository.getAll();
		res.json({ status: 'success', data: result });
	} catch (err) {
		errorResponse(res);
	}
}

function create(req: Request, res: Response) {
	try {
		projectRepository.create(req.body.name, req.body.description);
		res.json({ status: 'success', message: 'Insert successfully!' });
	} catch (err) {
		errorResponse(res);
	}
}

function findById(req: Request, res: Response) {
	try {
		const result = projectRepository.findById(req.params.id);
		if (result === null) {
			res.status(404).json({ status: 'not_fount' });
			return;
		}
		res.json({ status: 'success', data: result });
	} catch (err) {
		errorResponse(res);
	}
}

function remove(req: Request, res: Response) {
	try {
		projectRepository.remove(req.params.id);
		res.json({ status: 'success', message: 'Delete successfully!' });
	} catch (err) {
		errorResponse(res);
	}
}

function update(req: Request, res: Response) {
	try {
		projectRepository.update(
			req.body.name,
			req.body.description,
			req.params.id,
		);
		res.json({ status: 'success', message: 'Updated successfully!' });
	} catch (err) {
		errorResponse(res);
	}
}

function errorResponse(res: Response) {
	res.status(500).json({
		status: 'error',
		message: 'Something went wrong!',
	});
}

export default { getAll, create, findById, remove, update };
