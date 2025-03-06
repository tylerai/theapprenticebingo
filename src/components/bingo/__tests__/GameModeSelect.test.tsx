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
}));

describe('GameModeSelect', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          prepareSoloMode: jest.fn(),
          initSinglePlayerMode: jest.fn(),
          initQuickGameMode: jest.fn(),
        });
      }
      return jest.fn();
    });
  });

  it('renders the game modes section', () => {
    render(<GameModeSelect />);
    // Check for headings in the game mode cards using more specific selectors
    const headings = screen.getAllByRole('heading');
    const quickGameHeading = headings.find(h => h.textContent === 'Quick Game');
    const singlePlayerHeading = headings.find(h => h.textContent === 'Single Player');
    
    expect(quickGameHeading).toBeInTheDocument();
    expect(singlePlayerHeading).toBeInTheDocument();
    expect(screen.getByTestId('game-mode-select')).toBeInTheDocument();
  });

  it('renders the single player option', () => {
    render(<GameModeSelect />);
    // Check for the Play Solo button by looking for buttons specifically
    const buttons = screen.getAllByRole('button');
    const playSoloButton = buttons.find(btn => btn.textContent?.includes('Play Solo'));
    
    expect(playSoloButton).toBeInTheDocument();
  });

  it('calls prepareSoloMode when Play Solo is clicked', async () => {
    const mockPrepareSoloMode = jest.fn();
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          prepareSoloMode: mockPrepareSoloMode,
          initSinglePlayerMode: jest.fn(),
          initQuickGameMode: jest.fn(),
        });
      }
      return jest.fn();
    });

    render(<GameModeSelect />);
    const buttons = screen.getAllByRole('button');
    const playSoloButton = buttons.find(btn => btn.textContent?.includes('Play Solo'));
    
    if (playSoloButton) {
      await userEvent.click(playSoloButton);
      expect(mockPrepareSoloMode).toHaveBeenCalled();
    } else {
      throw new Error('Play Solo button not found');
    }
  });

  it('calls initQuickGameMode when Start button is clicked', async () => {
    const mockInitQuickGameMode = jest.fn();
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          prepareSoloMode: jest.fn(),
          initSinglePlayerMode: jest.fn(),
          initQuickGameMode: mockInitQuickGameMode,
        });
      }
      return jest.fn();
    });

    render(<GameModeSelect />);
    const buttons = screen.getAllByRole('button');
    const startButton = buttons.find(btn => btn.textContent?.includes('Start'));
    
    if (startButton) {
      await userEvent.click(startButton);
      expect(mockInitQuickGameMode).toHaveBeenCalled();
    } else {
      throw new Error('Start button not found');
    }
  });
}); 