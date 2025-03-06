// Import testing libraries
import '@testing-library/jest-dom';
import React from 'react';

// Make React available globally for JSX in tests
global.React = React;

// Mock canvas-confetti
jest.mock('canvas-confetti', () => {
  return jest.fn().mockImplementation(() => {
    return Promise.resolve();
  });
});

// Mock framer-motion with a simpler approach that doesn't use React directly in the mock factory
jest.mock('framer-motion', () => ({
  __esModule: true,
  motion: {
    div: 'div',
    button: 'button',
    span: 'span',
    p: 'p',
    a: 'a',
    ul: 'ul',
    li: 'li',
    header: 'header',
    footer: 'footer',
    main: 'main',
    nav: 'nav',
    section: 'section',
    article: 'article',
    aside: 'aside',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5'
  },
  AnimatePresence: ({ children }) => children,
  useAnimation: () => ({ start: jest.fn() }),
  useMotionValue: () => ({ get: jest.fn(), set: jest.fn() }),
  useTransform: () => jest.fn()
}));

// Mock sounds
jest.mock('@/lib/sounds', () => ({
  useSounds: () => ({
    playClick: jest.fn(),
    playWin: jest.fn(),
    playGameStart: jest.fn(),
    playBingo: jest.fn(),
    playSuccess: jest.fn(),
  }),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();

  simulateIntersection(entries) {
    this.callback(entries, this);
  }
}

global.IntersectionObserver = MockIntersectionObserver;

// Mock the game store
jest.mock('./src/lib/store/game-store', () => ({
  useGameStore: jest.fn()
}));

// Extend Jest matchers
expect.extend({
  toBeInTheDocument(received) {
    const pass = received !== null;
    return {
      pass,
      message: () => `expected ${received} to be in the document`,
    };
  },
  toHaveClass(received, className) {
    const pass = received.className && received.className.includes(className);
    return {
      pass,
      message: () => `expected ${received} to have class ${className}`,
    };
  },
  toBeDisabled(received) {
    const pass = received.disabled === true;
    return {
      pass,
      message: () => `expected ${received} to be disabled`,
    };
  },
  toHaveAttribute(received, attr, value) {
    const hasAttr = received.hasAttribute && received.hasAttribute(attr);
    const pass = value !== undefined ? hasAttr && received.getAttribute(attr) === value : hasAttr;
    return {
      pass,
      message: () => `expected ${received} to have attribute ${attr}${value !== undefined ? ` with value ${value}` : ''}`,
    };
  },
}); 