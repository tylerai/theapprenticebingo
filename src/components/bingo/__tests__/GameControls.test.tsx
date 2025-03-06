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
    // Create a mock with the functions available in the component
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          isHost: true,
          isSinglePlayer: true,
          resetMarks: jest.fn(),
          regenerateCard: jest.fn(),
          setGrid: jest.fn()
        });
      }
      return jest.fn();
    });
  });

  it('renders the Reset Marks button', () => {
    render(<GameControls />);
    expect(screen.getByText(/Reset Marks/i)).toBeInTheDocument();
  });

  it('renders the New Card button when user is host or single player', () => {
    render(<GameControls />);
    expect(screen.getByText(/New Card/i)).toBeInTheDocument();
  });

  it('renders the Exit Game button', () => {
    render(<GameControls />);
    expect(screen.getByText(/Exit Game/i)).toBeInTheDocument();
  });

  it('does not show New Card button when user is not host or single player', () => {
    // Mock a non-host, non-single-player user
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          isHost: false,
          isSinglePlayer: false,
          resetMarks: jest.fn(),
          regenerateCard: jest.fn(),
          setGrid: jest.fn()
        });
      }
      return jest.fn();
    });

    render(<GameControls />);
    expect(screen.queryByText(/New Card/i)).not.toBeInTheDocument();
  });

  it('calls resetMarks when Reset Marks button is clicked', async () => {
    const mockResetMarks = jest.fn();
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          isHost: true,
          isSinglePlayer: true,
          resetMarks: mockResetMarks,
          regenerateCard: jest.fn(),
          setGrid: jest.fn()
        });
      }
      return jest.fn();
    });

    render(<GameControls />);
    const resetButton = screen.getByText(/Reset Marks/i);
    await userEvent.click(resetButton);
    expect(mockResetMarks).toHaveBeenCalled();
  });

  it('calls regenerateCard when New Card button is clicked', async () => {
    const mockRegenerateCard = jest.fn();
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          isHost: true,
          isSinglePlayer: true,
          resetMarks: jest.fn(),
          regenerateCard: mockRegenerateCard,
          setGrid: jest.fn()
        });
      }
      return jest.fn();
    });

    render(<GameControls />);
    const newCardButton = screen.getByText(/New Card/i);
    await userEvent.click(newCardButton);
    expect(mockRegenerateCard).toHaveBeenCalled();
  });

  it('displays the card seed input field when user is host or single player', () => {
    render(<GameControls />);
    expect(screen.getByPlaceholderText(/.+/)).toBeInTheDocument(); // Seed input has dynamic placeholder
    expect(screen.getByText(/Card Seed/i)).toBeInTheDocument();
  });

  it('does not display the card seed input when user is not host or single player', () => {
    // Mock a non-host, non-single-player user
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          isHost: false,
          isSinglePlayer: false,
          resetMarks: jest.fn(),
          regenerateCard: jest.fn(),
          setGrid: jest.fn()
        });
      }
      return jest.fn();
    });

    render(<GameControls />);
    expect(screen.queryByText(/Card Seed/i)).not.toBeInTheDocument();
  });
}); 