module.exports = {
  displayName: 'admin-permissions',
  preset: '../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
    },
  },
  coverageDirectory: '../../../coverage/libs/admin/permissions',
  transform: { '^.+\\.(ts|js|html)$': 'jest-preset-angular' },
};
