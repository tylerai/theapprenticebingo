# Testing Guide for Apprentice Bingo

This document provides an overview of the testing setup and instructions for running tests in the Apprentice Bingo application.

## Testing Stack

The application uses the following testing tools:

- **Jest**: The main testing framework
- **React Testing Library**: For testing React components
- **Jest DOM**: For DOM-specific assertions
- **User Event**: For simulating user interactions

## Test Structure

Tests are organized in `__tests__` directories alongside the components or modules they test. The main test categories are:

1. **Component Tests**: Located in `src/components/bingo/__tests__/`
   - Test individual UI components
   - Focus on user interactions and rendering

2. **Store Tests**: Located in `src/lib/store/__tests__/`
   - Test the Zustand store functionality
   - Focus on state management

3. **Page Tests**: Located in `src/app/__tests__/`
   - Test page-level components
   - Focus on integration of components

## Running Tests

To run the tests, use the following npm scripts:

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Writing New Tests

When writing new tests, follow these guidelines:

1. **Component Tests**:
   - Test user interactions (clicking, typing, etc.)
   - Test conditional rendering
   - Mock dependencies (store, sounds, animations)

2. **Store Tests**:
   - Use `act()` to update store state
   - Test state transitions
   - Test side effects

3. **Mocking**:
   - Mock external dependencies (sounds, animations)
   - Mock store for component tests
   - Use `jest.mock()` for module mocking

## Test Examples

### Component Test Example

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from '../ComponentName';
import { useGameStore } from '@/lib/store/game-store';

// Mock dependencies
jest.mock('@/lib/store/game-store');

describe('ComponentName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const mockUseGameStore = useGameStore as jest.MockedFunction<typeof useGameStore>;
    mockUseGameStore.mockImplementation((selector) => {
      const state = {
        // Mock state here
      };
      return typeof selector === 'function' ? selector(state) : state[selector as keyof typeof state];
    });
  });

  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText(/expected text/i)).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    render(<ComponentName />);
    await userEvent.click(screen.getByRole('button'));
    // Assert expected behavior
  });
});
```

### Store Test Example

```tsx
import { useGameStore } from '../game-store';
import { act } from '@testing-library/react';

describe('Game Store', () => {
  beforeEach(() => {
    act(() => {
      useGameStore.getState().resetGame();
    });
  });

  it('updates state correctly', () => {
    act(() => {
      useGameStore.getState().someAction();
    });
    
    const state = useGameStore.getState();
    expect(state.someValue).toBe(expectedValue);
  });
});
```

## Troubleshooting

If you encounter issues with tests:

1. **TypeScript Errors**: Make sure you're properly mocking the store with the correct types
2. **Missing DOM Assertions**: Ensure you've imported `@testing-library/jest-dom`
3. **Async Issues**: Use `await` with user interactions and wrap store updates in `act()`
4. **Component Rendering Issues**: Check that all required props are provided and dependencies are mocked

## Coverage Goals

Aim for the following coverage targets:

- **Components**: 80% coverage
- **Store**: 90% coverage
- **Utilities**: 70% coverage

Run `npm run test:coverage` to generate a coverage report and identify areas that need more testing. 