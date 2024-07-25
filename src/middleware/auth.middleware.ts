import { NextFunction, Request, Response } from 'express';

const DEFAULT_PASSWORD = 'Password123';
const AUTH_ERROR = 'Password required!';

function auth(req: Request, res: Response, next: NextFunction) {
	const reqPassword = req.headers.authorization;
	if (reqPassword === DEFAULT_PASSWORD) {
		next();
		return;
	}

	res.status(401).send(AUTH_ERROR);
}

export default auth;
