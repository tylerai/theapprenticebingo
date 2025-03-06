import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BingoGrid } from '../BingoGrid';
import { useGameStore } from '@/lib/store/game-store';

// Mock the game store
jest.mock('@/lib/store/game-store', () => ({
  useGameStore: jest.fn(),
}));

describe('BingoGrid', () => {
  const mockGrid = Array(9).fill('Test Option');
  const mockMarkedSquares = new Set();
  const mockTeams = [{
    id: '1',
    name: 'Test Team',
    advisor: 'Test Advisor',
    markedSquares: new Set(),
    wins: [],
    createdAt: new Date(),
    userId: '1'
  }];

  beforeEach(() => {
    (useGameStore as jest.Mock).mockImplementation(() => ({
      grid: mockGrid,
      markedSquares: mockMarkedSquares,
      teams: mockTeams,
      isLocked: false,
      teamId: '1',
      toggleSquare: jest.fn(),
      checkForWins: jest.fn(),
    }));
  });

  it('renders a 3x3 grid of squares', () => {
    render(<BingoGrid />);
    const squares = screen.getAllByRole('button');
    expect(squares).toHaveLength(9);
  });

  it('allows clicking squares when not locked', async () => {
    const mockToggleSquare = jest.fn();
    (useGameStore as jest.Mock).mockImplementation(() => ({
      grid: mockGrid,
      markedSquares: mockMarkedSquares,
      teams: mockTeams,
      isLocked: false,
      teamId: '1',
      toggleSquare: mockToggleSquare,
      checkForWins: jest.fn(),
    }));

    render(<BingoGrid />);
    const squares = screen.getAllByRole('button');
    await userEvent.click(squares[0]);
    
    expect(mockToggleSquare).toHaveBeenCalledWith(0);
  });

  it('disables squares when game is locked', () => {
    (useGameStore as jest.Mock).mockImplementation(() => ({
      grid: mockGrid,
      markedSquares: mockMarkedSquares,
      teams: mockTeams,
      isLocked: true,
      teamId: '1',
      toggleSquare: jest.fn(),
      checkForWins: jest.fn(),
    }));

    render(<BingoGrid />);
    const squares = screen.getAllByRole('button');
    squares.forEach(square => {
      expect(square).toBeDisabled();
    });
  });

  it('displays marked squares correctly', () => {
    const markedSquares = new Set([0, 1]);
    (useGameStore as jest.Mock).mockImplementation(() => ({
      grid: mockGrid,
      markedSquares: markedSquares,
      teams: mockTeams,
      isLocked: false,
      teamId: '1',
      toggleSquare: jest.fn(),
      checkForWins: jest.fn(),
    }));

    render(<BingoGrid />);
    const squares = screen.getAllByRole('button');
    expect(squares[0]).toHaveClass('bg-primary');
    expect(squares[1]).toHaveClass('bg-primary');
    expect(squares[2]).not.toHaveClass('bg-primary');
  });

  it('checks for wins after marking a square', async () => {
    const mockCheckForWins = jest.fn();
    (useGameStore as jest.Mock).mockImplementation(() => ({
      grid: mockGrid,
      markedSquares: mockMarkedSquares,
      teams: mockTeams,
      isLocked: false,
      teamId: '1',
      toggleSquare: jest.fn(),
      checkForWins: mockCheckForWins,
    }));

    render(<BingoGrid />);
    const squares = screen.getAllByRole('button');
    await userEvent.click(squares[0]);
    
    expect(mockCheckForWins).toHaveBeenCalled();
  });
}); 