import { Request, Response } from 'express';
import reportRepository from '../repositories/report.repository';

function getAll(req: Request, res: Response) {
	try {
		const result = reportRepository.getAll();
		res.json({ status: 'success', data: result });
	} catch (err) {
		errorResponse(res);
	}
}

function create(req: Request, res: Response) {
	try {
		reportRepository.create(req.body.text, req.body.project_id);
		res.json({ status: 'success', message: 'Insert successfully!' });
	} catch (err) {
		errorResponse(res);
	}
}

function findById(req: Request, res: Response) {
	try {
		const result = reportRepository.findById(req.params.id);
		if (result === null) {
			res.status(404).json({ status: 'not_fount' });
			return;
		}
		res.json({ status: 'success', data: result });
	} catch (err) {
		errorResponse(res);
	}
}

function findByProjectId(req: Request, res: Response) {
	try {
		const result = reportRepository.findByProjectId(req.params.projectId);
		res.json({ status: 'success', data: result });
	} catch (err) {
		errorResponse(res);
	}
}

function remove(req: Request, res: Response) {
	try {
		reportRepository.remove(req.params.id);
		res.json({ status: 'success', message: 'Delete successfully!' });
	} catch (err) {
		errorResponse(res);
	}
}

function update(req: Request, res: Response) {
	try {
		reportRepository.update(
			req.body.project_id,
			req.body.text,
			req.params.id,
		);
		res.json({ status: 'success', message: 'Updated successfully!' });
	} catch (err) {
		errorResponse(res);
	}
}

function specialReport(req: Request, res: Response) {
	try {
		const result = reportRepository.specialReport();
		res.json({ status: 'success', data: result });
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

export default {
	getAll,
	create,
	findById,
	findByProjectId,
	remove,
	update,
	specialReport,
};
