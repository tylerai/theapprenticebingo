// Simplified build script for Vercel

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

console.log('🔧 Starting simplified Vercel build...');

// Create src/lib and src/lib/store directories if they don't exist
const libDir = path.join(__dirname, 'src', 'lib');
const storeDir = path.join(libDir, 'store');

if (!fs.existsSync(path.join(__dirname, 'src'))) {
  fs.mkdirSync(path.join(__dirname, 'src'));
}

if (!fs.existsSync(libDir)) {
  fs.mkdirSync(libDir);
}

if (!fs.existsSync(storeDir)) {
  fs.mkdirSync(storeDir);
}

// Define real bingo options
const bingoOptions = [
  // Task Failures & Mistakes
  "Disastrous pitch",
  "Epic negotiation fail",
  "Stupid assumption",
  "Bad attempt at foreign language",
  "Team doesn't know what something obvious is",
  "Mispronunciation of everyday word",
  "Wasted journey",
  "Product development epic fail",
  "Abandons high value product",
  "No planning",
  "Team gets lost during task",
  "Epic pitch fail",
  "Nobody wins",
  "Misses deadline",
  "Complete breakdown in comms",
  "Team makes a loss",
  "Overspends budget massively",
  "Terrible Team Name",
  "Candidate pitches to the wrong person",
  
  // Candidate Behavior
  "Bragging in taxi",
  "Blaming others after getting fired",
  "PM is a pushover",
  "Candidate back-seat drives PM",
  "Candidate avoids responsibility",
  "Arguing in public place",
  "Candidate fights for <£1 discount",
  "Bitchy impersonation",
  "Candidate gets emotional",
  "Candidate answers phone in boxers/towels",
  "Candidate tries to outsmart but backfires"
];

// Function to get random options from the array
function getRandomOptions(count) {
  const shuffled = [...bingoOptions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Create a more functional implementation of game-store.ts
const gameStoreContent = `
import { create } from 'zustand';
import { GameMode, Team, Win, WinType } from '../types';
import { persist, createJSONStorage } from 'zustand/middleware';

// Initial state with actual bingo options
const initialState = {
  grid: [
    ['${getRandomOptions(9)[0]}', '${getRandomOptions(9)[1]}', '${getRandomOptions(9)[2]}'],
    ['${getRandomOptions(9)[3]}', '${getRandomOptions(9)[4]}', '${getRandomOptions(9)[5]}'],
    ['${getRandomOptions(9)[6]}', '${getRandomOptions(9)[7]}', '${getRandomOptions(9)[8]}']
  ],
  markedSquares: [],
  teams: [],
  teamId: '',
  gameId: '',
  teamName: '',
  teamAdvisor: null,
  isHost: true,
  isLocked: false,
  isLive: false,
  isSinglePlayer: false,
  gameMode: 'line' as GameMode,
  targetNumber: 5,
  wins: [],
  previousWins: [],
  soloSetupMode: false,
  countdownRemaining: 0
};

// Helper function to check for wins
function checkForWins(grid: string[][], markedSquares: [number, number][], gameMode: GameMode, targetNumber: number): Win[] {
  const allPossibleWins: Win[] = [];

  // Helper function to check if a square is marked
  const isMarked = (row: number, col: number) => {
    return markedSquares.some(([r, c]) => r === row && c === col);
  };

  // Check rows
  for (let i = 0; i < 3; i++) {
    if (isMarked(i, 0) && isMarked(i, 1) && isMarked(i, 2)) {
      allPossibleWins.push({
        type: \`row_\${i}\` as WinType,
        squares: [[i, 0], [i, 1], [i, 2]] as [number, number][],
        message: \`Row \${i + 1} complete!\`
      });
    }
  }

  // Check columns
  for (let j = 0; j < 3; j++) {
    if (isMarked(0, j) && isMarked(1, j) && isMarked(2, j)) {
      allPossibleWins.push({
        type: \`col_\${j}\` as WinType,
        squares: [[0, j], [1, j], [2, j]] as [number, number][],
        message: \`Column \${j + 1} complete!\`
      });
    }
  }

  // Check diagonals
  if (isMarked(0, 0) && isMarked(1, 1) && isMarked(2, 2)) {
    allPossibleWins.push({
      type: 'diag_1',
      squares: [[0, 0], [1, 1], [2, 2]] as [number, number][],
      message: 'Diagonal (top-left to bottom-right) complete!'
    });
  }

  if (isMarked(0, 2) && isMarked(1, 1) && isMarked(2, 0)) {
    allPossibleWins.push({
      type: 'diag_2',
      squares: [[0, 2], [1, 1], [2, 0]] as [number, number][],
      message: 'Diagonal (top-right to bottom-left) complete!'
    });
  }

  // Check full house
  if (markedSquares.length === 9) {
    const allSquares = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        allSquares.push([i, j]);
      }
    }
    allPossibleWins.push({
      type: 'full_house',
      squares: allSquares as [number, number][],
      message: 'FULL HOUSE! All squares complete!'
    });
  }

  // Filter wins based on game mode
  let filteredWins: Win[] = [];
  
  if (gameMode === 'line') {
    // In line mode, allow all line wins (rows, columns, diagonals)
    filteredWins = allPossibleWins.filter(win => 
      win.type.startsWith('row_') || win.type.startsWith('col_') || win.type.startsWith('diag_')
    );
  } else if (gameMode === 'full_house') {
    // In full house mode, only allow the full house win
    filteredWins = allPossibleWins.filter(win => win.type === 'full_house');
  } else if (gameMode === 'number') {
    // In number mode, only allow number wins when target is reached
    if (markedSquares.length >= targetNumber) {
      filteredWins = [{
        type: \`number_\${targetNumber}\`,
        squares: markedSquares.slice(0, targetNumber) as [number, number][],
        message: \`\${targetNumber} squares marked!\`
      }];
    }
  }

  return filteredWins;
}

// Define the interface for the game state
export interface GameState {
  grid: string[][];
  markedSquares: [number, number][];
  teams: Team[];
  teamId: string;
  gameId: string;
  teamName: string;
  teamAdvisor: 'karen' | 'tim' | 'claude' | 'nick' | 'margaret' | null;
  isHost: boolean;
  isLocked: boolean;
  isLive: boolean;
  isSinglePlayer: boolean;
  gameMode: GameMode;
  targetNumber: number;
  wins: Win[];
  previousWins: Win[];
  soloSetupMode: boolean;
  countdownRemaining: number;
}

// Define the interface for the game store
export interface GameStore extends GameState {
  initGame: (gameId: string, teamId: string, teamName: string, advisor: 'karen' | 'tim' | 'claude' | 'nick' | 'margaret') => void;
  setTeams: (teams: Team[]) => void;
  setGrid: (grid: string[][]) => void;
  toggleSquare: (row: number, col: number) => void;
  addWin: (win: Win) => void;
  setGameMode: (mode: GameMode) => void;
  setTargetNumber: (num: number) => void;
  resetMarks: () => void;
  regenerateCard: (seed?: string) => void;
  resetGame: () => void;
  initSinglePlayerMode: (teamName?: string, advisor?: 'karen' | 'tim' | 'claude' | 'nick' | 'margaret') => void;
  initQuickGameMode: () => void;
  prepareSoloMode: () => void;
  setIsLocked: (locked: boolean) => void;
  setIsLive: (live: boolean) => void;
  setCountdownRemaining: (seconds: number) => void;
}

// Create the actual store with persistence
export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Reset the entire game state
      resetGame: () => {
        set({ ...initialState });
      },

      // Initialize a new game
      initGame: (gameId, teamId, teamName, advisor) => {
        // First, reset the state completely to avoid any stale data
        set({ ...initialState });
        
        const isHost = !get().gameId; // First to join is host
        
        // Then set up the new game
        set({
          gameId,
          teamId,
          teamName,
          teamAdvisor: advisor,
          isHost,
          isSinglePlayer: false,
          markedSquares: [],
          wins: [],
          previousWins: [],
          teams: [
            {
              id: teamId,
              name: teamName || '',
              advisor,
              markedSquares: [],
              wins: [],
              createdAt: new Date().toISOString(),
              userId: teamId
            }
          ]
        });

        // Generate a grid with actual content
        const options = getRandomOptions(9);
        const grid: string[][] = [];
        for (let i = 0; i < 3; i++) {
          const row: string[] = [];
          for (let j = 0; j < 3; j++) {
            row.push(options[i * 3 + j]);
          }
          grid.push(row);
        }
        set({ grid });
      },

      toggleSquare: (row, col) => {
        const { markedSquares, gameMode, targetNumber, grid, previousWins } = get();
        const isAlreadyMarked = markedSquares.some(
          ([r, c]) => r === row && c === col
        );

        // Update marked squares
        let newMarkedSquares;
        if (isAlreadyMarked) {
          newMarkedSquares = markedSquares.filter(
            ([r, c]) => !(r === row && c === col)
          );
        } else {
          newMarkedSquares = [...markedSquares, [row, col] as [number, number]];
        }
        
        set({ markedSquares: newMarkedSquares });
        
        // Check for wins
        const wins = checkForWins(grid, newMarkedSquares, gameMode, targetNumber);
        wins.forEach(win => {
          const isNewWin = !previousWins.some(prev => prev.type === win.type);
          if (isNewWin) {
            get().addWin(win);
          }
        });
      },

      addWin: (win) => {
        const { wins, previousWins } = get();
        set({ 
          wins: [...wins, win],
          previousWins: [...previousWins, win]
        });
      },

      setTeams: (teams) => {
        set({ teams });
      },

      setGrid: (grid) => {
        set({ grid });
      },

      setGameMode: (mode) => {
        set({ gameMode: mode });
      },

      setTargetNumber: (num) => {
        set({ targetNumber: num });
      },

      setIsLocked: (locked) => {
        set({ isLocked: locked });
      },

      setIsLive: (live) => {
        set({ isLive: live });
      },

      setCountdownRemaining: (seconds) => {
        set({ countdownRemaining: seconds });
      },

      resetMarks: () => {
        set({ markedSquares: [] });
      },

      regenerateCard: (seed) => {
        // Generate new bingo options
        const options = getRandomOptions(9);
        const grid: string[][] = [];
        for (let i = 0; i < 3; i++) {
          const row: string[] = [];
          for (let j = 0; j < 3; j++) {
            row.push(options[i * 3 + j]);
          }
          grid.push(row);
        }
        set({ grid });
      },

      // Functions that start the game modes
      initSinglePlayerMode: (teamName = 'Solo Player', advisor = 'karen') => {
        // Implementation for Single Player mode
        set({ 
          teamId: 'solo-' + Date.now(),
          teamName: teamName,
          teamAdvisor: advisor,
          isSinglePlayer: true,
          isHost: true,
          soloSetupMode: false
        });
        
        // Generate a grid with actual content
        const options = getRandomOptions(9);
        const grid: string[][] = [];
        for (let i = 0; i < 3; i++) {
          const row: string[] = [];
          for (let j = 0; j < 3; j++) {
            row.push(options[i * 3 + j]);
          }
          grid.push(row);
        }
        set({ grid });
        
        // Use history API instead of reload
        if (typeof window !== 'undefined') {
          window.history.pushState({}, '', '/');
          window.dispatchEvent(new Event('popstate'));
        }
      },

      initQuickGameMode: () => {
        // Implementation for Quick Game mode
        const teamNames = [
          'First Forte', 'Impact', 'Velocity', 'Invicta', 'Stealth', 'Eclipse',
          'Alpha', 'Renaissance', 'Ignite', 'Empire', 'Apollo', 'Synergy'
        ];
        const advisors = ['karen', 'tim', 'claude', 'nick', 'margaret'];
        
        // Pick random team name and advisor
        const teamName = teamNames[Math.floor(Math.random() * teamNames.length)];
        const advisor = advisors[Math.floor(Math.random() * advisors.length)] as 'karen' | 'tim' | 'claude' | 'nick' | 'margaret';
        
        set({ 
          teamId: 'quick-' + Date.now(),
          teamName,
          teamAdvisor: advisor,
          isSinglePlayer: true,
          isHost: true,
          soloSetupMode: false
        });
        
        // Generate a grid with actual content
        const options = getRandomOptions(9);
        const grid: string[][] = [];
        for (let i = 0; i < 3; i++) {
          const row: string[] = [];
          for (let j = 0; j < 3; j++) {
            row.push(options[i * 3 + j]);
          }
          grid.push(row);
        }
        set({ grid });
        
        // Use history API instead of reload
        if (typeof window !== 'undefined') {
          window.history.pushState({}, '', '/');
          window.dispatchEvent(new Event('popstate'));
        }
      },

      prepareSoloMode: () => {
        // Implementation for preparing solo mode
        set({ 
          isSinglePlayer: true,
          soloSetupMode: true,
          teamId: 'solo-setup-' + Date.now()
        });
        
        // Use history API instead of reload
        if (typeof window !== 'undefined') {
          window.history.pushState({}, '', '/');
          window.dispatchEvent(new Event('popstate'));
        }
      }
    }),
    {
      name: 'apprentice-bingo-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Helper function to get random bingo options
function getRandomBingoOptions(count: number): string[] {
  const options = [
    "Disastrous pitch", "Epic negotiation fail", "Team gets lost", "Product epic fail",
    "Candidate back-seat drives", "Arguing in public", "Overspends budget", "Bad attempt at foreign language",
    "Bragging in taxi", "Blaming others", "PM is a pushover", "Candidate avoids responsibility",
    "Candidate fights for discount", "Candidate gets emotional", "Candidate tries to outsmart",
    "Lord Sugar makes a pun", "Team makes a loss", "Bitchy impersonation", "Stupid assumption",
    "Wasted journey", "Team doesn't research", "Everyone interrupts", "Candidate answers phone in towel",
    "Boardroom betrayal", "Karen gives death stare", "Claude gets angry", "Lord Sugar mentions East End",
    "Double firing!", "Triple firing!", "Project Manager changes"
  ];
  
  // Shuffle and pick options
  const shuffled = [...options].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
`;

// Create the data.ts file with the bingo options
const dataFileContent = `
const BINGO_OPTIONS = [
  // Task Failures & Mistakes
  "Disastrous pitch",
  "Epic negotiation fail",
  "Stupid assumption",
  "Bad attempt at foreign language",
  "Team doesn't know what something obvious is",
  "Mispronunciation of everyday word",
  "Wasted journey",
  "Product development epic fail",
  "Abandons high value product",
  "No planning",
  "Team gets lost during task",
  "Epic pitch fail",
  "Nobody wins",
  "Misses deadline",
  "Complete breakdown in comms",
  "Team makes a loss",
  "Overspends budget massively",
  "Terrible Team Name",
  "Candidate pitches to the wrong person",

  // Candidate Behavior
  "Bragging in taxi",
  "Blaming others after getting fired",
  "PM is a pushover",
  "Candidate back-seat drives PM",
  "Candidate avoids responsibility",
  "Arguing in public place",
  "Candidate fights for <£1 discount",
  "Bitchy impersonation",
  "Candidate gets emotional",
  "Candidate answers phone in boxers/towels",
  "Candidate tries to outsmart but backfires",
  "Candidate offends Lord Sugar",
  "Candidate says they're like Lord Sugar",
  "Candidate talks themselves into firing line",
  "Continues to defend bad product",
  "Candidate has stupid name/nickname",
  "Nobody wants to be PM",
  "Bitches about PM in taxi",
  "Candidate uses jargon incorrectly",
  "Candidate claims to be expert in everything",
  "Candidate forgets another's name",
  "Candidate throws another under the bus",
  "Candidate says '110%'"
];

// Seeded random number generator
function seededRandom(seed) {
  // Simple xorshift-based PRNG with string seed
  let hash = Array.from(seed).reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0) | 0;
  }, 0);
  
  // Ensure hash is positive
  hash = Math.abs(hash);
  
  return function() {
    // Simple xorshift algorithm
    hash ^= hash << 13;
    hash ^= hash >> 17;
    hash ^= hash << 5;
    return Math.abs(hash) / Math.pow(2, 31);
  };
}

export function getRandomOptions(count, seed) {
  // Create a copy of the options
  const options = [...BINGO_OPTIONS];
  
  // If no seed is provided, use standard Math.random
  if (!seed) {
    return options.sort(() => Math.random() - 0.5).slice(0, count);
  }
  
  // Use seeded random function
  const random = seededRandom(seed);
  
  // Shuffle the array using Fisher-Yates algorithm with seeded random
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return options.slice(0, count);
}
`;

// Create enhanced sounds.ts file
const soundsFileContent = `
'use client';

import { useCallback, useEffect, useState, useRef } from 'react';

export function useSounds() {
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const clickSoundRef = useRef(null);
  const successSoundRef = useRef(null);
  const notificationSoundRef = useRef(null);
  const bingoSoundRef = useRef(null);

  // Create mock audio element if we're not in the browser
  const createAudio = useCallback(() => {
    if (typeof window === 'undefined') {
      return {
        play: () => Promise.resolve(),
        pause: () => {},
        volume: 0.5,
        currentTime: 0
      };
    }
    return new Audio();
  }, []);

  // Setup sounds on initial render
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check for mute preference in localStorage
    const savedMute = localStorage.getItem('apprentice-bingo-muted');
    if (savedMute === 'true') {
      setIsMuted(true);
    }
    
    // Create audio elements
    clickSoundRef.current = createAudio();
    successSoundRef.current = createAudio();
    notificationSoundRef.current = createAudio();
    bingoSoundRef.current = createAudio();
    
    setIsLoaded(true);
  }, [createAudio]);

  // Toggle mute state
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newValue = !prev;
      localStorage.setItem('apprentice-bingo-muted', String(newValue));
      return newValue;
    });
  }, []);

  // Play audio with error handling
  const safePlay = useCallback((audioRef) => {
    if (!audioRef?.current || isMuted) return;
    
    // Reset to beginning if already playing
    audioRef.current.currentTime = 0;
    
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error('Error playing sound:', error);
      });
    }
  }, [isMuted]);

  // Sound functions
  const playClick = useCallback(() => safePlay(clickSoundRef), [safePlay]);
  const playSuccess = useCallback(() => safePlay(successSoundRef), [safePlay]);
  const playNotification = useCallback(() => safePlay(notificationSoundRef), [safePlay]);
  const playBingo = useCallback(() => safePlay(bingoSoundRef), [safePlay]);

  return {
    playClick,
    playSuccess,
    playNotification,
    playBingo,
    isMuted,
    toggleMute,
    isLoaded
  };
}
`;

// Create WinningAnimation component
const winningAnimationContent = `
'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSounds } from '@/lib/sounds';
import confetti from 'canvas-confetti';

interface WinningAnimationProps {
  isVisible: boolean;
  onClose: () => void;
}

export function WinningAnimation({ isVisible, onClose }: WinningAnimationProps) {
  const { playBingo } = useSounds();
  const [phrase, setPhrase] = React.useState('');
  
  const winningPhrases = [
    "BINGO CHAMPION!",
    "ABSOLUTELY BRILLIANT!",
    "TASK COMPLETED!",
    "WINNER WINNER!",
    "BOARDROOM MASTER!",
    "PROJECT MANAGER MATERIAL!",
    "CEO MATERIAL!",
    "BUSINESS SUPERSTAR!",
    "APPRENTICE STAR!",
    "DEAL MAKER!",
    "BUSINESS GENIUS!",
    "PERFECT STRATEGY!"
  ];
  
  // Play sound and trigger confetti when animation becomes visible
  React.useEffect(() => {
    if (isVisible) {
      // Play sound
      playBingo();
      
      // Set random phrase
      setPhrase(winningPhrases[Math.floor(Math.random() * winningPhrases.length)]);
      
      // Trigger confetti explosion
      try {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        const randomInRange = (min, max) => {
          return Math.random() * (max - min) + min;
        };

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          
          // Create confetti bursts from different angles
          if (typeof confetti === 'function') {
            try {
              confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
              });
              confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
              });
            } catch (err) {
              console.error('Confetti error:', err);
            }
          }
        }, 250);
        
        // Automatically close after 6 seconds
        const timer = setTimeout(() => {
          onClose();
        }, 6000);
        
        return () => {
          clearInterval(interval);
          clearTimeout(timer);
        };
      } catch (error) {
        console.error('Error in WinningAnimation effect:', error);
        // Ensure we still close the animation even if there's an error
        const timer = setTimeout(() => {
          onClose();
        }, 6000);
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, onClose, playBingo, winningPhrases]);
  
  // Fallback rendering if animation has an error
  if (!winningPhrases || !phrase) {
    return (
      <AnimatePresence>
        {isVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-amber-500 p-8 rounded-xl text-white text-center">
              <h2 className="text-3xl font-bold mb-4">YOU WIN!</h2>
              <p className="mb-4">Congratulations on your victory!</p>
              <button 
                onClick={onClose}
                className="bg-white text-amber-600 px-4 py-2 rounded font-medium"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    );
  }
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background with radial gradient */}
          <motion.div 
            className="absolute inset-0 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Main content */}
          <motion.div
            className="relative z-10 max-w-3xl w-full mx-4 flex flex-col items-center justify-center"
            initial={{ scale: 0.5, y: 100 }}
            animate={{ 
              scale: 1, 
              y: 0,
              transition: { type: "spring", damping: 12, stiffness: 200 }
            }}
            exit={{ scale: 0.5, y: 100, opacity: 0, transition: { duration: 0.3 } }}
          >
            {/* Trophy icon */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ 
                y: 0, 
                opacity: 1,
                transition: { delay: 0.3, duration: 0.5 }
              }}
              className="text-9xl mb-6"
            >
              🏆
            </motion.div>
            
            {/* Main text */}
            <motion.div
              className="bg-gradient-to-r from-amber-500 to-yellow-500 p-8 rounded-2xl text-center transform"
            >
              <motion.h2 
                className="text-4xl md:text-6xl font-bold text-white mb-4"
              >
                {phrase}
              </motion.h2>
              
              <motion.p 
                className="text-xl text-white/90 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.5 } }}
              >
                You've dominated the boardroom challenge!
              </motion.p>
              
              <button
                onClick={onClose}
                className="mt-6 bg-white text-amber-600 px-6 py-3 rounded-full font-bold text-lg hover:bg-amber-100 transition-colors"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
`;

// Add animations file
const animationsContent = `
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

export const slideInFromBottom = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

export const slideInFromLeft = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5 } }
};

export const slideInFromRight = {
  hidden: { x: 50, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5 } }
};

export const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const boardroomBackground = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1 } }
};
`;

// List of files to create
const files = [
  { path: path.join(libDir, 'animations.ts'), content: animationsContent },
  { path: path.join(libDir, 'data.ts'), content: dataFileContent },
  { path: path.join(libDir, 'facts.ts'), content: 'export const apprenticeFacts = ["Lord Sugar started with just £100", "The show has been running since 2005", "Winners receive a £250,000 investment", "Over 100,000 people apply each series", "Karen Brady joined as an advisor in 2009", "Tim Campbell was the first winner of The Apprentice", "In the US version, the show was hosted by Donald Trump", "Claude Littner was originally just for the interview episodes", "In total, Lord Sugar has invested over £2.5 million in winners"];' },
  { path: path.join(libDir, 'sounds.ts'), content: soundsFileContent },
  { path: path.join(libDir, 'types.ts'), content: 'export type GameMode = "line" | "full_house" | "number";\nexport type WinType = string;\nexport interface Team { id: string; name: string; advisor: string; markedSquares?: [number, number][]; wins: Win[]; createdAt?: string; userId?: string; }\nexport interface Win { type: string; squares: [number, number][]; message: string; };' },
  { path: path.join(libDir, 'utils.ts'), content: 'export const cn = (...args) => args.filter(Boolean).join(" ");' },
  { path: path.join(storeDir, 'game-store.ts'), content: gameStoreContent },
  { path: path.join(libDir, 'index.ts'), content: '// Export from lib directory\nexport * from "./animations";\nexport * from "./data";\nexport * from "./facts";\nexport * from "./sounds";\nexport * from "./types";\nexport * from "./utils";' },
  { path: path.join(storeDir, 'index.ts'), content: '// Export from store directory\nexport * from "./game-store";' },
  // Create WinningAnimation component
  { path: path.join(__dirname, 'src', 'components', 'bingo'), mkdir: true },
  { path: path.join(__dirname, 'src', 'components', 'bingo', 'WinningAnimation.tsx'), content: winningAnimationContent }
];

// Create all the files
files.forEach(file => {
  try {
    // Create directory if it doesn't exist
    if (file.mkdir) {
      if (!fs.existsSync(file.path)) {
        fs.mkdirSync(file.path, { recursive: true });
        console.log(`📁 Created directory: ${file.path}`);
      }
      return;
    }

    // Create parent directories if they don't exist
    const dir = path.dirname(file.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }

    // Always create/update the files to ensure latest implementation
    console.log(`📝 Creating/updating file: ${file.path}`);
    fs.writeFileSync(file.path, file.content);
  } catch (err) {
    console.error(`❌ Error creating file ${file.path}:`, err);
  }
});

// Run standard Next.js build
console.log('🔨 Running standard Next.js build...');

const result = spawnSync('npm', ['run', 'build'], {
  stdio: 'inherit',
  env: { ...process.env }
});

process.exit(result.status); 