import db from '../services/db.service';
import { v4 as uuidv4 } from 'uuid';
import ReportInterface from '../lib/report.lib';

const SPECIAL_REPORT_THRESHOLD = 3;

function getAll() {
	return db.query(
		'SELECT *, (SELECT name FROM projects WHERE id=reports.projectid) AS project_name FROM reports',
	) as ReportInterface[];
}

function create(text: string, projectId: string) {
	const id = uuidv4();
	db.run(
		'INSERT INTO reports (id, text, projectid) VALUES(@id, @text, @projectId)',
		{ id, text, projectId },
	);
}

function findById(id: string) {
	const result = db.query('SELECT * FROM reports WHERE id=@id', { id });
	if (result.length === 0) {
		return null;
	}

	return result[0] as ReportInterface;
}

function findByProjectId(projectId: string) {
	return db.query('SELECT * FROM reports WHERE projectid=@projectId', {
		projectId,
	}) as ReportInterface[];
}

function remove(id: string) {
	db.run('DELETE FROM reports WHERE id=@id', { id });
}

function update(projectId: string, text: string, id: string) {
	db.run('UPDATE REPORTS SET text=@text, projectid=@projectId WHERE id=@id', {
		projectId,
		text,
		id,
	});
}

function specialReport() {
	const data = db.query('SELECT text FROM reports') as ReportInterface[];
	return data.filter(hasFrequentWords);
}

function hasFrequentWords(item: ReportInterface) {
	type HashType = { [key: string]: number };
	const count: HashType = {};
	const words = item.text.split(' ');
	for (let i = 0; i < words.length; i++) {
		const word = words[i].toLowerCase();
		if (word in count) {
			count[word]++;
			if (count[word] === SPECIAL_REPORT_THRESHOLD) {
				return true;
			}
			continue;
		}
		count[word] = 1;
	}
	return false;
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
