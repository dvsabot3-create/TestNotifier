module.exports = {
  projects: [
    // Frontend tests (React components) - require jsdom
    {
      displayName: 'frontend',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/src'],
      testMatch: [
        '<rootDir>/src/**/__tests__/**/*.+(ts|tsx|js)',
        '<rootDir>/src/**/?(*.)+(spec|test).+(ts|tsx|js)'
      ],
      transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
      },
      setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/src/$1'
      }
    },
    // Backend tests (auth, API) - require node
    {
      displayName: 'backend',
      testEnvironment: 'node',
      roots: ['<rootDir>/tests'],
      testMatch: [
        '<rootDir>/tests/**/*.+(test|spec).+(ts|tsx|js)'
      ],
      transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
        '^.+\\.js$': 'babel-jest'
      },
      transformIgnorePatterns: [
        'node_modules/(?!(passport-google-oauth20|passport)/)'
      ]
    }
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};