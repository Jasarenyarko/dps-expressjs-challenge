import db from '../services/db.service';
import { v4 as uuidv4 } from 'uuid';
import ProjectInterface from '../lib/project.lib';

function getAll(): ProjectInterface[] {
	try {
		return db.query('SELECT * FROM projects') as ProjectInterface[];
	} catch (error) {
		handleDatabaseError(error);
		return [];
	}
}

function create(name: string, description: string): void {
	const id = uuidv4();
	try {
		db.run(
			'INSERT INTO projects (id, name, description) VALUES (@id, @name, @description)',
			{ id, name, description },
		);
	} catch (error) {
		handleDatabaseError(error, 'UNIQUE constraint failed: projects.id');
	}
}

function findById(id: string): ProjectInterface | null {
	try {
		const result = db.query('SELECT * FROM projects WHERE id=@id', { id });
		if (result.length === 0) {
			return null;
		}
		return result[0] as ProjectInterface;
	} catch (error) {
		handleDatabaseError(error);
		return null;
	}
}

function remove(id: string): void {
	try {
		db.run('DELETE FROM projects WHERE id=@id', { id });
	} catch (error) {
		handleDatabaseError(error);
	}
}

function update(name: string, description: string, id: string): void {
	try {
		db.run(
			'UPDATE projects SET name=@name, description=@description WHERE id=@id',
			{ name, description, id },
		);
	} catch (error) {
		handleDatabaseError(error);
	}
}

function handleDatabaseError(
	error: unknown,
	uniqueConstraintMessage?: string,
): void {
	if (error instanceof Error) {
		if (
			uniqueConstraintMessage &&
			error.message.includes(uniqueConstraintMessage)
		) {
			throw new Error(uniqueConstraintMessage);
		}
		throw new Error(`Database error: ${error.message}`);
	} else {
		throw new Error('Unknown database error');
	}
}

export default { getAll, create, findById, remove, update };
