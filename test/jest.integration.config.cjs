const base = require('./jest.base.config.cjs');

module.exports = {
  ...base,
  testTimeout: 120000,
  testMatch: ['<rootDir>/test/**/*.integration.spec.ts'],
};
