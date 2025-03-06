import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameModeSelector } from '../GameModeSelector';
import { useGameStore } from '@/lib/store/game-store';
import { GameMode } from '@/lib/types';

// Mock the game store
jest.mock('@/lib/store/game-store');

// Mock the sounds
jest.mock('@/lib/sounds', () => ({
  useSounds: () => ({
    playClick: jest.fn(),
  }),
}));

describe('GameModeSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          gameMode: 'line' as GameMode,
          targetNumber: 5,
          setGameMode: jest.fn(),
          setTargetNumber: jest.fn(),
        });
      }
      return jest.fn();
    });
  });

  it('renders the game mode options', () => {
    render(<GameModeSelector />);
    expect(screen.getByText(/Game Mode/i)).toBeInTheDocument();
    expect(screen.getByText(/Line/i)).toBeInTheDocument();
    expect(screen.getByText(/Full House/i)).toBeInTheDocument();
    expect(screen.getByText(/Number/i)).toBeInTheDocument();
  });

  it('highlights the current game mode', () => {
    render(<GameModeSelector />);
    const lineButton = screen.getByText(/Line/i).closest('button');
    expect(lineButton).toHaveClass('bg-amber-500');
  });

  it('calls setGameMode when a mode is selected', async () => {
    const mockSetGameMode = jest.fn();
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          gameMode: 'line' as GameMode,
          targetNumber: 5,
          setGameMode: mockSetGameMode,
          setTargetNumber: jest.fn(),
        });
      }
      return jest.fn();
    });

    render(<GameModeSelector />);
    const fullHouseButton = screen.getByText(/Full House/i).closest('button');
    await userEvent.click(fullHouseButton!);
    expect(mockSetGameMode).toHaveBeenCalledWith('full_house');
  });

  it('shows number selector when number mode is selected', async () => {
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          gameMode: 'number' as GameMode,
          targetNumber: 5,
          setGameMode: jest.fn(),
          setTargetNumber: jest.fn(),
        });
      }
      return jest.fn();
    });

    render(<GameModeSelector />);
    expect(screen.getByText(/Target Number/i)).toBeInTheDocument();
    expect(screen.getByText(/5/i)).toBeInTheDocument();
  });

  it('calls setTargetNumber when a number is selected', async () => {
    const mockSetTargetNumber = jest.fn();
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          gameMode: 'number' as GameMode,
          targetNumber: 5,
          setGameMode: jest.fn(),
          setTargetNumber: mockSetTargetNumber,
        });
      }
      return jest.fn();
    });

    render(<GameModeSelector />);
    // Find the increase button by its aria-label or another reliable selector
    const increaseButton = screen.getByRole('button', { name: /increase/i });
    await userEvent.click(increaseButton);
    expect(mockSetTargetNumber).toHaveBeenCalledWith(6);
  });
}); 