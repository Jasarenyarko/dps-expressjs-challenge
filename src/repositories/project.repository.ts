import db from '../services/db.service';
import { v4 as uuidv4 } from 'uuid';
import ProjectInterface from '../lib/project.lib';

function getAll() {
	return db.query('SELECT * FROM projects') as ProjectInterface[];
}

function create(name: string, description: string) {
	const id = uuidv4();
	db.run(
		'INSERT INTO projects (id, name, description) VALUES (@id, @name, @description)',
		{ id, name, description },
	);
}

function findById(id: string) {
	const result = db.query('SELECT * FROM projects WHERE id=@id', { id });
	if (result.length === 0) {
		return null;
	}

	return result[0] as ProjectInterface;
}

function remove(id: string) {
	db.run('DELETE FROM projects WHERE id=@id', { id });
}

function update(name: string, description: string, id: string) {
	db.run(
		'UPDATE projects SET name=@name, description=@description WHERE id=@id',
		{ name, description, id },
	);
}

export default { getAll, create, findById, remove, update };
