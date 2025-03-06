import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BingoGrid } from '../BingoGrid';
import { useGameStore } from '@/lib/store/game-store';
import { GameMode, Team, Win } from '@/lib/types';

// Mock the game store
jest.mock('@/lib/store/game-store');

// Mock the sounds
jest.mock('@/lib/sounds', () => ({
  useSounds: () => ({
    playBingo: jest.fn(),
    playSuccess: jest.fn(),
    playClick: jest.fn(),
  }),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useAnimation: () => ({
    start: jest.fn(),
  }),
}));

// Mock canvas-confetti
jest.mock('canvas-confetti', () => jest.fn());

describe('BingoGrid', () => {
  const mockGrid = [
    ['Option 1', 'Option 2', 'Option 3'],
    ['Option 4', 'Option 5', 'Option 6'],
    ['Option 7', 'Option 8', 'Option 9'],
  ];
  const mockMarkedSquares: [number, number][] = [];
  const mockTeams: Team[] = [{
    id: '1',
    name: 'Test Team',
    advisor: 'karen',
    markedSquares: [],
    wins: [],
    createdAt: new Date().toISOString(),
    userId: '1'
  }];

  beforeEach(() => {
    jest.clearAllMocks();
    // Create a mock function for useGameStore
    const mockGameStore = jest.fn();
    mockGameStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          grid: mockGrid,
          markedSquares: mockMarkedSquares,
          teams: mockTeams,
          isLocked: false,
          teamId: '1',
          gameMode: 'line' as GameMode,
          targetNumber: 5,
          previousWins: [] as Win[],
          toggleSquare: jest.fn(),
          addWin: jest.fn(),
        });
      }
      return jest.fn();
    });
    (useGameStore as unknown as jest.Mock).mockImplementation(mockGameStore);
  });

  it('renders a 3x3 grid of squares', () => {
    render(<BingoGrid />);
    const squares = screen.getAllByRole('button');
    expect(squares).toHaveLength(9);
  });

  it('displays the correct content in each square', () => {
    render(<BingoGrid />);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const content = mockGrid[i][j];
        expect(screen.getByText(content)).toBeInTheDocument();
      }
    }
  });

  it('allows clicking squares when not locked', async () => {
    const mockToggleSquare = jest.fn();
    const mockGameStore = jest.fn();
    mockGameStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          grid: mockGrid,
          markedSquares: mockMarkedSquares,
          teams: mockTeams,
          isLocked: false,
          teamId: '1',
          gameMode: 'line' as GameMode,
          targetNumber: 5,
          previousWins: [] as Win[],
          toggleSquare: mockToggleSquare,
          addWin: jest.fn(),
        });
      }
      return jest.fn();
    });
    (useGameStore as unknown as jest.Mock).mockImplementation(mockGameStore);

    render(<BingoGrid />);
    const squares = screen.getAllByRole('button');
    await userEvent.click(squares[0]);
    
    expect(mockToggleSquare).toHaveBeenCalled();
  });

  it('disables squares when game is locked', () => {
    const mockGameStore = jest.fn();
    mockGameStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          grid: mockGrid,
          markedSquares: mockMarkedSquares,
          teams: mockTeams,
          isLocked: true,
          teamId: '1',
          gameMode: 'line' as GameMode,
          targetNumber: 5,
          previousWins: [] as Win[],
          toggleSquare: jest.fn(),
          addWin: jest.fn(),
        });
      }
      return jest.fn();
    });
    (useGameStore as unknown as jest.Mock).mockImplementation(mockGameStore);

    render(<BingoGrid />);
    const squares = screen.getAllByRole('button');
    squares.forEach(square => {
      expect(square).toBeDisabled();
    });
  });

  it('displays marked squares correctly', () => {
    const markedSquares: [number, number][] = [[0, 0], [0, 1]];
    const mockGameStore = jest.fn();
    mockGameStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          grid: mockGrid,
          markedSquares: markedSquares,
          teams: mockTeams,
          isLocked: false,
          teamId: '1',
          gameMode: 'line' as GameMode,
          targetNumber: 5,
          previousWins: [] as Win[],
          toggleSquare: jest.fn(),
          addWin: jest.fn(),
        });
      }
      return jest.fn();
    });
    (useGameStore as unknown as jest.Mock).mockImplementation(mockGameStore);

    render(<BingoGrid />);
    const squares = screen.getAllByRole('button');
    
    // The first two squares should be marked (have the selected class)
    expect(squares[0]).toHaveClass('bg-gradient-to-br');
    expect(squares[1]).toHaveClass('bg-gradient-to-br');
    
    // The third square should not be marked
    expect(squares[2]).not.toHaveClass('bg-gradient-to-br');
  });
}); 