import sqlite from 'better-sqlite3';
import BetterSqlite3 from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import dbService from '../services/db.service';
import projectRepository from '../repositories/project.repository';

jest.mock('uuid', () => ({
	v4: jest.fn(),
}));

let db: BetterSqlite3.Database;

beforeAll(() => {
	db = new sqlite(':memory:');
	db.exec(`
	CREATE TABLE projects (
		id TEXT PRIMARY KEY,
		name TEXT,
		description TEXT
	);
  `);

	jest.spyOn(dbService, 'query').mockImplementation(
		(
			sql: string,
			params?: { [key: string]: string | number | undefined },
		) => {
			const stmt = db.prepare(sql);
			return params ? stmt.all(params) : stmt.all();
		},
	);

	jest.spyOn(dbService, 'run').mockImplementation(
		(
			sql: string,
			params?: { [key: string]: string | number | undefined },
		) => {
			const stmt = db.prepare(sql);
			return params ? stmt.run(params) : stmt.run();
		},
	);
});

afterAll(() => {
	db.close();
});

describe('Project Repository', () => {
	beforeEach(() => {
		db.exec('DELETE FROM projects');
	});

	test('should create a project', () => {
		const id = 'test-id';
		(uuidv4 as jest.Mock).mockReturnValue(id);

		projectRepository.create('Test Project', 'Test Description');

		const projects = projectRepository.getAll();
		expect(projects.length).toBe(1);
		expect(projects[0]).toEqual({
			id,
			name: 'Test Project',
			description: 'Test Description',
		});
	});

	test('should get all projects', () => {
		db.prepare(
			'INSERT INTO projects (id, name, description) VALUES (?, ?, ?)',
		).run('3', 'Project 3', 'Description 3');
		db.prepare(
			'INSERT INTO projects (id, name, description) VALUES (?, ?, ?)',
		).run('4', 'Project 4', 'Description 4');

		const projects = projectRepository.getAll();
		expect(projects.length).toBe(2);
		expect(projects[0]).toEqual({
			description: 'Description 3',
			id: '3',
			name: 'Project 3',
		});
		expect(projects[1]).toEqual({
			description: 'Description 4',
			id: '4',
			name: 'Project 4',
		});
	});

	test('should find a project by id', () => {
		const id = '5';
		db.prepare(
			'INSERT INTO projects (id, name, description) VALUES (?, ?, ?)',
		).run(id, 'Project 5', 'Description 5');

		const project = projectRepository.findById(id);
		expect(project).toEqual({
			id,
			name: 'Project 5',
			description: 'Description 5',
		});
	});

	test('should return null if could not find project by id', () => {
		const id = '6';
		db.prepare(
			'INSERT INTO projects (id, name, description) VALUES (?, ?, ?)',
		).run(id, 'Project 6', 'Description 6');

		const project = projectRepository.findById('7');
		expect(project).toBeNull();
	});

	test('should remove a project by id', () => {
		const id = '8';
		db.prepare(
			'INSERT INTO projects (id, name, description) VALUES (?, ?, ?)',
		).run(id, 'Project 8', 'Description 8');

		projectRepository.remove(id);
		const project = projectRepository.findById(id);
		expect(project).toBeNull();
	});

	test('should update a project', () => {
		const id = '9';
		db.prepare(
			'INSERT INTO projects (id, name, description) VALUES (?, ?, ?)',
		).run(id, 'Project 9', 'Description 9');

		projectRepository.update(
			'Updated Project 9',
			'Updated Description 9',
			id,
		);

		const project = projectRepository.findById(id);
		expect(project).toEqual({
			id,
			name: 'Updated Project 9',
			description: 'Updated Description 9',
		});
	});

	test('should return an empty array if no projects are found', () => {
		const projects = projectRepository.getAll();
		expect(projects).toEqual([]);
	});

	test('should handle creating multiple projects', () => {
		const id1 = 'id-1';
		const id2 = 'id-2';
		(uuidv4 as jest.Mock).mockReturnValueOnce(id1).mockReturnValueOnce(id2);

		projectRepository.create('First Project', 'First Description');
		projectRepository.create('Second Project', 'Second Description');

		const projects = projectRepository.getAll();
		expect(projects.length).toBe(2);
		expect(projects[0]).toEqual({
			id: id1,
			name: 'First Project',
			description: 'First Description',
		});
		expect(projects[1]).toEqual({
			id: id2,
			name: 'Second Project',
			description: 'Second Description',
		});
	});

	test('should not allow SQL injection in project creation', () => {
		const maliciousId = '1; DROP TABLE projects; --';
		(uuidv4 as jest.Mock).mockReturnValue(maliciousId);

		projectRepository.create('Malicious Project', 'Malicious Description');

		const projects = projectRepository.getAll();
		expect(projects.length).toBe(1);
		expect(projects[0]).toEqual({
			id: maliciousId,
			name: 'Malicious Project',
			description: 'Malicious Description',
		});
	});

	test('should handle invalid input types gracefully', () => {
		const id = 'invalid-id';
		(uuidv4 as jest.Mock).mockReturnValue(id);

		expect(() => {
			projectRepository.create(
				123 as unknown as string,
				{} as unknown as string,
			);
		}).toThrowError();

		const result = projectRepository.findById('non-existent-id');
		expect(result).toBeNull();
	});
});
