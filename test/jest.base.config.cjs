const swcTransform = [
  '@swc/jest',
  {
    jsc: {
      parser: {
        decorators: true,
        syntax: 'typescript',
      },
      transform: {
        decoratorMetadata: true,
        legacyDecorator: true,
      },
    },
    module: {
      type: 'commonjs',
    },
  },
];

module.exports = {
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: '<rootDir>/coverage',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  rootDir: '..',
  setupFiles: ['<rootDir>/test/jest.setup.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': swcTransform,
  },
};
