import sqlite from 'better-sqlite3';
import BetterSqlite3 from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import dbService from '../services/db.service';
import reportRepository from '../repositories/report.repository';

jest.mock('uuid', () => ({
	v4: jest.fn(),
}));

let db: BetterSqlite3.Database;

const TEST_PROJECT_ID = 'ProjectId-1';
const TEST_PROJECT_NAME = 'Test Project';
const TEST_PROJECT_DESC = 'Test Description';
const REPORT_ID_1 = 'ReportId-1';
const REPORT_ID_2 = 'ReportId-2';
const REPORT_TEXT_1 = 'Report Text 1';
const REPORT_TEXT_2 = 'Report Text 2';

beforeAll(() => {
	db = new sqlite(':memory:');
	db.exec(`
    CREATE TABLE reports (
      id TEXT PRIMARY KEY,
      text TEXT,
      projectid TEXT
    );
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

describe('Report Repository', () => {
	beforeEach(() => {
		db.exec('DELETE FROM reports');
		db.exec('DELETE FROM projects');
	});

	test('should create a report', () => {
		(uuidv4 as jest.Mock).mockReturnValue(REPORT_ID_1);

		reportRepository.create(REPORT_TEXT_1, TEST_PROJECT_ID);

		const reports = db.prepare('SELECT * FROM reports').all();
		expect(reports.length).toBe(1);
		expect(reports[0]).toEqual({
			id: REPORT_ID_1,
			text: REPORT_TEXT_1,
			projectid: TEST_PROJECT_ID,
		});
	});

	test('should get all reports', () => {
		db.prepare(
			'INSERT INTO projects (id, name, description) VALUES (?, ?, ?)',
		).run(TEST_PROJECT_ID, TEST_PROJECT_NAME, TEST_PROJECT_DESC);
		db.prepare(
			'INSERT INTO reports (id, text, projectid) VALUES (?, ?, ?)',
		).run(REPORT_ID_1, REPORT_TEXT_1, TEST_PROJECT_ID);
		db.prepare(
			'INSERT INTO reports (id, text, projectid) VALUES (?, ?, ?)',
		).run(REPORT_ID_2, REPORT_TEXT_2, TEST_PROJECT_ID);

		const reports = reportRepository.getAll();
		expect(reports.length).toBe(2);
		expect(reports).toContainEqual({
			id: REPORT_ID_1,
			text: REPORT_TEXT_1,
			projectid: TEST_PROJECT_ID,
			project_name: TEST_PROJECT_NAME,
		});
		expect(reports).toContainEqual({
			id: REPORT_ID_2,
			text: REPORT_TEXT_2,
			projectid: TEST_PROJECT_ID,
			project_name: TEST_PROJECT_NAME,
		});
	});

	test('should find a report by id', () => {
		db.prepare(
			'INSERT INTO reports (id, text, projectid) VALUES (?, ?, ?)',
		).run(REPORT_ID_1, REPORT_TEXT_1, TEST_PROJECT_ID);

		const report = reportRepository.findById(REPORT_ID_1);
		expect(report).toEqual({
			id: REPORT_ID_1,
			text: REPORT_TEXT_1,
			projectid: TEST_PROJECT_ID,
		});
	});

	test('should return null if could not find report by id', () => {
		const report = reportRepository.findById('NonExistentId');
		expect(report).toBeNull();
	});

	test('should remove a report by id', () => {
		db.prepare(
			'INSERT INTO reports (id, text, projectid) VALUES (?, ?, ?)',
		).run(REPORT_ID_1, REPORT_TEXT_1, TEST_PROJECT_ID);

		reportRepository.remove(REPORT_ID_1);
		const report = reportRepository.findById(REPORT_ID_1);
		expect(report).toBeNull();
	});

	test('should update a report', () => {
		db.prepare(
			'INSERT INTO reports (id, text, projectid) VALUES (?, ?, ?)',
		).run(REPORT_ID_1, REPORT_TEXT_1, TEST_PROJECT_ID);

		reportRepository.update(TEST_PROJECT_ID, 'Updated Text', REPORT_ID_1);

		const report = reportRepository.findById(REPORT_ID_1);
		expect(report).toEqual({
			id: REPORT_ID_1,
			text: 'Updated Text',
			projectid: TEST_PROJECT_ID,
		});
	});

	test('should not update a report if id does not exist', () => {
		const nonExistentId = 'NonExistentId';

		reportRepository.update(TEST_PROJECT_ID, 'Updated Text', nonExistentId);

		const report = reportRepository.findById(nonExistentId);
		expect(report).toBeNull();
	});
});
