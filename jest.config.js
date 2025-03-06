/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
    '^.+\\.(js|jsx)$': ['babel-jest'],
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.test.(ts|tsx)',
    '<rootDir>/**/*.test.js'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/'
  ],
};

module.exports = config; 