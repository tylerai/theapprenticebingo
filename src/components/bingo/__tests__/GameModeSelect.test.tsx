import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameModeSelect } from '../GameModeSelect';
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

describe('GameModeSelect', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          prepareSoloMode: jest.fn(),
        });
      }
      return jest.fn();
    });
  });

  it('renders the title', () => {
    render(<GameModeSelect />);
    expect(screen.getByText(/Select Game Mode/i)).toBeInTheDocument();
  });

  it('renders the single player option', () => {
    render(<GameModeSelect />);
    expect(screen.getByText(/Single Player/i)).toBeInTheDocument();
  });

  it('renders the multiplayer option', () => {
    render(<GameModeSelect />);
    expect(screen.getByText(/Multiplayer/i)).toBeInTheDocument();
  });

  it('calls prepareSoloMode when single player is selected', async () => {
    const mockPrepareSoloMode = jest.fn();
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          prepareSoloMode: mockPrepareSoloMode,
        });
      }
      return jest.fn();
    });

    render(<GameModeSelect />);
    const singlePlayerButton = screen.getByText(/Single Player/i).closest('button');
    await userEvent.click(singlePlayerButton!);
    expect(mockPrepareSoloMode).toHaveBeenCalled();
  });

  it('shows multiplayer as coming soon', () => {
    render(<GameModeSelect />);
    const multiplayerButton = screen.getByText(/Multiplayer/i).closest('button');
    expect(multiplayerButton).toBeDisabled();
    expect(screen.getByText(/Coming Soon/i)).toBeInTheDocument();
  });
}); 