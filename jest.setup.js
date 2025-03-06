// Import jest-dom matchers
import '@testing-library/jest-dom';

// Mock canvas-confetti
jest.mock('canvas-confetti', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock the window.matchMedia function
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
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// Extend Jest matchers
expect.extend({
  toBeInTheDocument(received) {
    const pass = received !== null && received !== undefined;
    return {
      message: () => `expected ${received} ${pass ? 'not ' : ''}to be in the document`,
      pass,
    };
  },
  toHaveClass(received, className) {
    const pass = received && received.classList && received.classList.contains(className);
    return {
      message: () => `expected ${received} ${pass ? 'not ' : ''}to have class ${className}`,
      pass,
    };
  },
  toBeDisabled(received) {
    const pass = received && received.disabled === true;
    return {
      message: () => `expected ${received} ${pass ? 'not ' : ''}to be disabled`,
      pass,
    };
  },
  toHaveAttribute(received, attr, value) {
    const hasAttr = received && received.hasAttribute && received.hasAttribute(attr);
    const attrValue = hasAttr ? received.getAttribute(attr) : undefined;
    const pass = hasAttr && (value === undefined || attrValue === value);
    return {
      message: () => `expected ${received} ${pass ? 'not ' : ''}to have attribute ${attr}${value !== undefined ? ` with value ${value}` : ''}`,
      pass,
    };
  },
});

// Mock the useGameStore
jest.mock('./src/lib/store/game-store', () => ({
  useGameStore: jest.fn(),
})); 