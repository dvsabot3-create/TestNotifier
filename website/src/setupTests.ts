// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
};

// Mock ScrollTrigger
global.ScrollTrigger = {
  create: jest.fn(),
  getAll: jest.fn(() => []),
  kill: jest.fn(),
};

// Mock GSAP
global.gsap = {
  to: jest.fn(() => ({ kill: jest.fn() })),
  from: jest.fn(() => ({ kill: jest.fn() })),
  timeline: jest.fn(() => ({
    from: jest.fn(() => ({ kill: jest.fn() })),
    kill: jest.fn(),
  })),
  set: jest.fn(),
  utils: {
    toArray: jest.fn(() => []),
  },
  registerPlugin: jest.fn(),
};