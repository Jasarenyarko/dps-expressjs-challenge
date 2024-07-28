module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testMatch: ['<rootDir>/src/__tests__/*.test.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
      '^@src/(.*)$': '<rootDir>/src/$1',
      '^@tests/(.*)$': '<rootDir>/tests/$1'
    },
    verbose: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
  };
  