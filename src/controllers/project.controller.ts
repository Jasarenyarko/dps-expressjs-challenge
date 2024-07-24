import { Request, Response } from 'express';
import projectRepository from '../repositories/project.repository';

function getAll(req: Request, res: Response) {
	try {
		const result = projectRepository.getAll();
		res.json({ status: 'Success', data: result });
	} catch (err) {
		errorResponse(res);
	}
}

function create(req: Request, res: Response) {
	try {
		projectRepository.create(req.body.name, req.body.description);
		res.json({ status: 'Success', message: 'Inserted Successfully!' });
	} catch (err) {
		errorResponse(res);
	}
}

function findById(req: Request, res: Response) {
	try {
		const result = projectRepository.findById(req.params.id);
		if (result === null) {
			res.status(404).json({ status: 'Not Found' });
			return;
		}
		res.json({ status: 'Success', data: result });
	} catch (err) {
		errorResponse(res);
	}
}

function remove(req: Request, res: Response) {
	try {
		projectRepository.remove(req.params.id);
		res.json({ status: 'Success', message: 'Deleted Successfully!' });
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
		res.json({ status: 'Success', message: 'Updated Successfully!' });
	} catch (err) {
		errorResponse(res);
	}
}

function errorResponse(res: Response) {
	res.status(500).json({
		status: 'error',
		message: 'Oops! Something went wrong',
	});
}

export default { getAll, create, findById, remove, update };
