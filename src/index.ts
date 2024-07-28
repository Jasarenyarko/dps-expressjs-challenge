import express, { Express } from 'express';
import dotenv from 'dotenv';
import accessLog from './services/log.service';
import projectRoute from './routes/project.route';
import reportRoute from './routes/report.route';
import authMiddleware from './middleware/auth.middleware';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(accessLog);
app.use(express.json());
app.use(authMiddleware);
app.use('/projects', projectRoute);
app.use('/reports', reportRoute);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
