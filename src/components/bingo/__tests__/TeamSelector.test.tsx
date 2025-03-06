import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TeamSelector } from '../TeamSelector';
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

describe('TeamSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          teamName: '',
          teamAdvisor: null,
          isSinglePlayer: false,
          soloSetupMode: true,
          initSinglePlayerMode: jest.fn(),
          gameId: 'test-game-id',
          teams: [],
          isHost: false,
          initGame: jest.fn()
        });
      }
      return jest.fn();
    });
  });

  it('renders the team name selection component', () => {
    render(<TeamSelector />);
    expect(screen.getByText(/Select a team name/i)).toBeInTheDocument();
  });

  it('renders the advisor options', () => {
    render(<TeamSelector />);
    expect(screen.getByText(/Choose Your Advisor/i)).toBeInTheDocument();
    expect(screen.getByText(/Karen/i)).toBeInTheDocument();
    expect(screen.getByText(/Tim/i)).toBeInTheDocument();
    expect(screen.getByText(/Claude/i)).toBeInTheDocument();
  });

  it('renders the start game button', () => {
    render(<TeamSelector />);
    expect(screen.getByText(/Start Game/i)).toBeInTheDocument();
  });

  it('displays the search input for team names', () => {
    render(<TeamSelector />);
    expect(screen.getByPlaceholderText(/Search names/i)).toBeInTheDocument();
  });

  it('renders team name options', () => {
    render(<TeamSelector />);
    // Verify some of the default team names are present
    expect(screen.getByText(/First Forte/i)).toBeInTheDocument();
    expect(screen.getByText(/Venture/i)).toBeInTheDocument();
  });

  it('disables the start button by default', () => {
    render(<TeamSelector />);
    const startButton = screen.getByText(/Start Game/i);
    expect(startButton).toBeDisabled();
  });
}); 