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
        });
      }
      return jest.fn();
    });
  });

  it('renders the team name input', () => {
    render(<TeamSelector />);
    expect(screen.getByPlaceholderText(/Enter your team name/i)).toBeInTheDocument();
  });

  it('renders the advisor options', () => {
    render(<TeamSelector />);
    expect(screen.getByText(/Choose Your Advisor/i)).toBeInTheDocument();
    expect(screen.getByText(/Karen/i)).toBeInTheDocument();
    expect(screen.getByText(/Tim/i)).toBeInTheDocument();
    expect(screen.getByText(/Claude/i)).toBeInTheDocument();
  });

  it('allows selecting an advisor', async () => {
    render(<TeamSelector />);
    const karenOption = screen.getByText(/Karen/i).closest('button');
    await userEvent.click(karenOption!);
    expect(karenOption).toHaveClass('border-amber-500');
  });

  it('calls initSinglePlayerMode when form is submitted', async () => {
    const mockInitSinglePlayerMode = jest.fn();
    ((useGameStore as unknown) as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({
          teamName: '',
          teamAdvisor: null,
          isSinglePlayer: false,
          soloSetupMode: true,
          initSinglePlayerMode: mockInitSinglePlayerMode,
        });
      }
      return jest.fn();
    });

    render(<TeamSelector />);
    
    // Enter team name
    const teamNameInput = screen.getByPlaceholderText(/Enter your team name/i);
    await userEvent.type(teamNameInput, 'Test Team');
    
    // Select advisor
    const karenOption = screen.getByText(/Karen/i).closest('button');
    await userEvent.click(karenOption!);
    
    // Submit form
    const startButton = screen.getByText(/Start Game/i);
    await userEvent.click(startButton);
    
    expect(mockInitSinglePlayerMode).toHaveBeenCalledWith('Test Team', 'karen');
  });

  it('disables the start button when no team name is entered', () => {
    render(<TeamSelector />);
    const startButton = screen.getByText(/Start Game/i);
    expect(startButton).toBeDisabled();
  });

  it('disables the start button when no advisor is selected', async () => {
    render(<TeamSelector />);
    
    // Enter team name but don't select advisor
    const teamNameInput = screen.getByPlaceholderText(/Enter your team name/i);
    await userEvent.type(teamNameInput, 'Test Team');
    
    const startButton = screen.getByText(/Start Game/i);
    expect(startButton).toBeDisabled();
  });
}); 