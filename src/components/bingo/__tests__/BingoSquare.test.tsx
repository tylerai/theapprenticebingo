import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BingoSquare } from '../BingoSquare';
import { useGameStore } from '@/lib/store/game-store';

// Mock the game store
jest.mock('@/lib/store/game-store', () => ({
  useGameStore: jest.fn(),
}));

describe('BingoSquare', () => {
  const defaultProps = {
    index: 0,
    content: 'Test Option',
    isSelected: false,
    isLocked: false,
  };

  const mockGameState = {
    markedSquares: new Set(),
    isLocked: false,
    teamId: '1',
    teams: [{
      id: '1',
      markedSquares: new Set(),
    }],
    toggleSquare: jest.fn(),
  };

  beforeEach(() => {
    (useGameStore as jest.Mock).mockImplementation(() => mockGameState);
  });

  it('renders with the correct content', () => {
    render(<BingoSquare {...defaultProps} />);
    expect(screen.getByText('Test Option')).toBeInTheDocument();
  });

  it('calls toggleSquare when clicked', async () => {
    const mockToggleSquare = jest.fn();
    (useGameStore as jest.Mock).mockImplementation(() => ({
      ...mockGameState,
      toggleSquare: mockToggleSquare,
    }));

    render(<BingoSquare {...defaultProps} />);
    await userEvent.click(screen.getByRole('button'));
    expect(mockToggleSquare).toHaveBeenCalledWith(0);
  });

  it('is disabled when game is locked', () => {
    render(<BingoSquare {...defaultProps} isLocked={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows selected state correctly', () => {
    render(<BingoSquare {...defaultProps} isSelected={true} />);
    expect(screen.getByRole('button')).toHaveClass('bg-primary');
  });

  it('handles double clicks correctly', async () => {
    const mockToggleSquare = jest.fn();
    (useGameStore as jest.Mock).mockImplementation(() => ({
      ...mockGameState,
      toggleSquare: mockToggleSquare,
    }));

    render(<BingoSquare {...defaultProps} />);
    const button = screen.getByRole('button');
    await userEvent.dblClick(button);
    
    // Should only call toggleSquare once despite double click
    expect(mockToggleSquare).toHaveBeenCalledTimes(1);
  });

  it('maintains accessibility attributes', () => {
    render(<BingoSquare {...defaultProps} />);
    const button = screen.getByRole('button');
    
    expect(button).toHaveAttribute('aria-label', expect.stringContaining('Test Option'));
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });
}); 