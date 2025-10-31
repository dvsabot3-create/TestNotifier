module.exports = {
  env: {
    browser: true,
    es2021: true,
    webextensions: true,
    node: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'indent': ['error', 2],
    'no-trailing-spaces': 'error',
    'eol-last': 'error',
    'comma-dangle': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'space-before-function-paren': ['error', 'never']
  },
  globals: {
    chrome: 'readonly',
    ModernPupilForm: 'readonly',
    DVSAAutomationEngine: 'readonly',
    StealthManager: 'readonly',
    DetectionEvasion: 'readonly',
    TimingRandomizer: 'readonly',
    MouseSimulator: 'readonly',
    BookingManager: 'readonly'
  }
};
