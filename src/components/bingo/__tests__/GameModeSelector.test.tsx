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

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
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
          isHost: true,
        });
      }
      return jest.fn();
    });
  });

  it('renders the game mode options', () => {
    render(<GameModeSelector />);
    expect(screen.getByText('Game Mode')).toBeInTheDocument();
    expect(screen.getByText('Line')).toBeInTheDocument();
    expect(screen.getByText('Full House')).toBeInTheDocument();
    expect(screen.getByText('Number')).toBeInTheDocument();
  });

  it('highlights the current game mode', () => {
    render(<GameModeSelector />);
    const lineButton = screen.getByText('Line').closest('button');
    expect(lineButton).toHaveClass('bg-black');
  });

  it('shows confirmation dialog when a mode is selected', async () => {
    const user = userEvent.setup();
    render(<GameModeSelector />);
    const fullHouseButton = screen.getByText('Full House').closest('button');
    await user.click(fullHouseButton!);
    
    expect(screen.getByText('This will reset your current bingo card. Do you want to continue?')).toBeInTheDocument();
    expect(screen.getByText('Yes, continue')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls setGameMode when a mode is confirmed', async () => {
    const mockSetGameMode = jest.fn();
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          gameMode: 'line' as GameMode,
          targetNumber: 5,
          setGameMode: mockSetGameMode,
          setTargetNumber: jest.fn(),
          isHost: true,
        });
      }
      return jest.fn();
    });

    const user = userEvent.setup();
    render(<GameModeSelector />);
    
    // Click on Full House button
    const fullHouseButton = screen.getByText('Full House').closest('button');
    await user.click(fullHouseButton!);
    
    // Confirm the change
    const confirmButton = screen.getByText('Yes, continue');
    await user.click(confirmButton);
    
    expect(mockSetGameMode).toHaveBeenCalledWith('full_house');
  });

  it('shows number selector when number mode is active', () => {
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          gameMode: 'number' as GameMode,
          targetNumber: 5,
          setGameMode: jest.fn(),
          setTargetNumber: jest.fn(),
          isHost: true,
        });
      }
      return jest.fn();
    });

    render(<GameModeSelector />);
    expect(screen.getByText('Target Number of Squares')).toBeInTheDocument();
    
    // Check that all number buttons are rendered
    [3, 4, 5, 6, 7, 8, 9].forEach(num => {
      expect(screen.getByText(num.toString())).toBeInTheDocument();
    });
    
    // Check that 5 is highlighted
    const button5 = screen.getByText('5').closest('button');
    expect(button5).toHaveClass('bg-black');
  });

  it('shows confirmation dialog when a target number is selected', async () => {
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          gameMode: 'number' as GameMode,
          targetNumber: 5,
          setGameMode: jest.fn(),
          setTargetNumber: jest.fn(),
          isHost: true,
        });
      }
      return jest.fn();
    });

    const user = userEvent.setup();
    render(<GameModeSelector />);
    
    // Click on number 7 button
    const button7 = screen.getByText('7').closest('button');
    await user.click(button7!);
    
    expect(screen.getByText('This will reset your current bingo card. Do you want to continue?')).toBeInTheDocument();
  });

  it('calls setTargetNumber when a number is confirmed', async () => {
    const mockSetTargetNumber = jest.fn();
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          gameMode: 'number' as GameMode,
          targetNumber: 5,
          setGameMode: jest.fn(),
          setTargetNumber: mockSetTargetNumber,
          isHost: true,
        });
      }
      return jest.fn();
    });

    const user = userEvent.setup();
    render(<GameModeSelector />);
    
    // Click on number 7 button
    const button7 = screen.getByText('7').closest('button');
    await user.click(button7!);
    
    // Confirm the change
    const confirmButton = screen.getByText('Yes, continue');
    await user.click(confirmButton);
    
    expect(mockSetTargetNumber).toHaveBeenCalledWith(7);
  });
  
  it('does not render when user is not host', () => {
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          gameMode: 'line' as GameMode,
          targetNumber: 5,
          setGameMode: jest.fn(),
          setTargetNumber: jest.fn(),
          isHost: false,
        });
      }
      return jest.fn();
    });

    const { container } = render(<GameModeSelector />);
    expect(container).toBeEmptyDOMElement();
  });
}); 