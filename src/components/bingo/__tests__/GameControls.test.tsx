import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameControls } from '../GameControls';
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
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('GameControls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          isLocked: false,
          setIsLocked: jest.fn(),
          resetGame: jest.fn(),
          prepareSoloMode: jest.fn(),
        });
      }
      return jest.fn();
    });
  });

  it('renders the lock/unlock button', () => {
    render(<GameControls />);
    expect(screen.getByText(/Lock Board/i)).toBeInTheDocument();
  });

  it('renders the reset button', () => {
    render(<GameControls />);
    expect(screen.getByText(/Reset/i)).toBeInTheDocument();
  });

  it('renders the new game button', () => {
    render(<GameControls />);
    expect(screen.getByText(/New Game/i)).toBeInTheDocument();
  });

  it('calls setIsLocked when lock button is clicked', async () => {
    const mockSetIsLocked = jest.fn();
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          isLocked: false,
          setIsLocked: mockSetIsLocked,
          resetGame: jest.fn(),
          prepareSoloMode: jest.fn(),
        });
      }
      return jest.fn();
    });

    render(<GameControls />);
    const lockButton = screen.getByText(/Lock Board/i);
    await userEvent.click(lockButton);
    expect(mockSetIsLocked).toHaveBeenCalledWith(true);
  });

  it('shows "Unlock Board" when board is locked', () => {
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          isLocked: true,
          setIsLocked: jest.fn(),
          resetGame: jest.fn(),
          prepareSoloMode: jest.fn(),
        });
      }
      return jest.fn();
    });

    render(<GameControls />);
    expect(screen.getByText(/Unlock Board/i)).toBeInTheDocument();
  });

  it('calls resetGame when reset button is clicked', async () => {
    const mockResetGame = jest.fn();
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          isLocked: false,
          setIsLocked: jest.fn(),
          resetGame: mockResetGame,
          prepareSoloMode: jest.fn(),
        });
      }
      return jest.fn();
    });

    render(<GameControls />);
    const resetButton = screen.getByText(/Reset/i);
    await userEvent.click(resetButton);
    expect(mockResetGame).toHaveBeenCalled();
  });

  it('calls prepareSoloMode when new game button is clicked', async () => {
    const mockPrepareSoloMode = jest.fn();
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          isLocked: false,
          setIsLocked: jest.fn(),
          resetGame: jest.fn(),
          prepareSoloMode: mockPrepareSoloMode,
        });
      }
      return jest.fn();
    });

    render(<GameControls />);
    const newGameButton = screen.getByText(/New Game/i);
    await userEvent.click(newGameButton);
    expect(mockPrepareSoloMode).toHaveBeenCalled();
  });
}); 