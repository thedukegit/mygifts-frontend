export default {
  displayName: 'mg-frontend-fb-rules-test',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  transform: {
    '^.+\\.(ts|js)$': [
      'ts-jest',
      { tsconfig: '<rootDir>/tsconfig.spec.json' }
    ],
  },
  moduleFileExtensions: ['ts', 'js'],
};