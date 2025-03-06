import { render, screen } from '@testing-library/react';
import Home from '../page';
import { useGameStore } from '@/lib/store/game-store';

// Mock the game store
jest.mock('@/lib/store/game-store');

// Mock the sounds
jest.mock('@/lib/sounds', () => ({
  useSounds: () => ({
    playClick: jest.fn(),
    playBingo: jest.fn(),
    playSuccess: jest.fn(),
  }),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    main: ({ children, ...props }: any) => <main {...props}>{children}</main>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  staggerChildren: {},
  slideInFromBottom: {},
  slideInFromLeft: {},
  slideInFromRight: {},
  fadeIn: {},
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock components
jest.mock('@/components/bingo/BingoGrid', () => ({
  BingoGrid: () => <div data-testid="bingo-grid">Bingo Grid</div>,
}));

jest.mock('@/components/bingo/GameControls', () => ({
  GameControls: () => <div data-testid="game-controls">Game Controls</div>,
}));

jest.mock('@/components/bingo/TeamSelector', () => ({
  TeamSelector: () => <div data-testid="team-selector">Team Selector</div>,
}));

jest.mock('@/components/bingo/GameModeSelector', () => ({
  GameModeSelector: () => <div data-testid="game-mode-selector">Game Mode Selector</div>,
}));

jest.mock('@/components/bingo/GameModeSelect', () => ({
  GameModeSelect: () => <div data-testid="game-mode-select">Game Mode Select</div>,
}));

jest.mock('@/components/bingo/Leaderboard', () => ({
  Leaderboard: () => <div data-testid="leaderboard">Leaderboard</div>,
}));

jest.mock('@/components/bingo/ApprenticeFacts', () => ({
  ApprenticeFacts: () => <div data-testid="apprentice-facts">Apprentice Facts</div>,
}));

jest.mock('@/components/bingo/AdvisorAnimation', () => ({
  AdvisorAnimation: () => <div data-testid="advisor-animation">Advisor Animation</div>,
}));

jest.mock('@/components/bingo/WinsList', () => ({
  WinsList: () => <div data-testid="wins-list">Wins List</div>
}));

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the game mode select screen when no team is selected', () => {
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          teamId: null,
          isHost: false,
          isSinglePlayer: false,
          teamName: '',
          teamAdvisor: null,
          teams: [],
          soloSetupMode: false
        });
      }
      return jest.fn();
    });

    render(<Home />);
    expect(screen.getByTestId('game-mode-select')).toBeInTheDocument();
  });

  it('renders the team selector when team ID exists but no team name', () => {
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          teamId: 'team-123',
          isHost: false,
          isSinglePlayer: false,
          teamName: '',
          teamAdvisor: null,
          teams: [{ id: 'team-123', name: '', advisor: null, wins: [] }],
          soloSetupMode: false
        });
      }
      return jest.fn();
    });

    render(<Home />);
    expect(screen.getByTestId('team-selector')).toBeInTheDocument();
  });

  it('renders the main game when team is selected', () => {
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          teamId: 'team-123',
          isHost: false,
          isSinglePlayer: true,
          teamName: 'Test Team',
          teamAdvisor: 'karen',
          teams: [{ id: 'team-123', name: 'Test Team', advisor: 'karen', wins: [] }],
          soloSetupMode: false
        });
      }
      return jest.fn();
    });

    render(<Home />);
    expect(screen.getByTestId('bingo-grid')).toBeInTheDocument();
    expect(screen.getByTestId('game-controls')).toBeInTheDocument();
  });
}); 