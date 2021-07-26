import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  detectOpenHandles: true,
  preset: 'ts-jest',
  silent: false,
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/infrastructure/', '/dist/'],
  verbose: true,
};

export default config;