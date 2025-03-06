import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BingoSquare } from '../BingoSquare';
import { useGameStore } from '@/lib/store/game-store';

// Mock the game store
jest.mock('@/lib/store/game-store');

// Mock the sounds
jest.mock('@/lib/sounds', () => ({
  useSounds: () => ({
    playClick: jest.fn(),
  }),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('BingoSquare', () => {
  const defaultProps = {
    index: 0,
    content: 'Test Option',
    isSelected: false,
    isLocked: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const mockGameStore = jest.fn();
    mockGameStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          toggleSquare: jest.fn(),
        });
      }
      return jest.fn();
    });
    (useGameStore as unknown as jest.Mock).mockImplementation(mockGameStore);
  });

  it('renders with the correct content', () => {
    render(<BingoSquare {...defaultProps} />);
    expect(screen.getByText('Test Option')).toBeInTheDocument();
  });

  it('calls toggleSquare when clicked', async () => {
    const mockToggleSquare = jest.fn();
    const mockGameStore = jest.fn();
    mockGameStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          toggleSquare: mockToggleSquare,
        });
      }
      return mockToggleSquare;
    });
    (useGameStore as unknown as jest.Mock).mockImplementation(mockGameStore);

    render(<BingoSquare {...defaultProps} />);
    await userEvent.click(screen.getByRole('button'));
    expect(mockToggleSquare).toHaveBeenCalled();
  });

  it('is disabled when game is locked', () => {
    render(<BingoSquare {...defaultProps} isLocked={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows selected state correctly', () => {
    render(<BingoSquare {...defaultProps} isSelected={true} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('from-amber-300');
    expect(button).toHaveClass('to-amber-500');
  });

  it('shows checkmark when selected', () => {
    render(<BingoSquare {...defaultProps} isSelected={true} />);
    const checkmark = screen.getByRole('button').querySelector('.absolute.top-2.right-2');
    expect(checkmark).toBeInTheDocument();
  });

  it('shows winning animation when isWinning is true', () => {
    render(<BingoSquare {...defaultProps} isWinning={true} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('z-10');
  });
}); 