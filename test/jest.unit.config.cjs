const base = require('./jest.base.config.cjs');

module.exports = {
  ...base,
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
};
