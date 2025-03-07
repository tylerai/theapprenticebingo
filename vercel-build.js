// Simplified build script for Vercel

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

console.log('🔧 Starting simplified Vercel build...');

// Create src/lib and src/lib/store directories if they don't exist
const libDir = path.join(__dirname, 'src', 'lib');
const storeDir = path.join(libDir, 'store');
const componentsDir = path.join(__dirname, 'src', 'components');
const bingoComponentsDir = path.join(componentsDir, 'bingo');

if (!fs.existsSync(path.join(__dirname, 'src'))) {
  fs.mkdirSync(path.join(__dirname, 'src'));
}

if (!fs.existsSync(libDir)) {
  fs.mkdirSync(libDir);
}

if (!fs.existsSync(storeDir)) {
  fs.mkdirSync(storeDir);
}

if (!fs.existsSync(componentsDir)) {
  fs.mkdirSync(componentsDir);
}

if (!fs.existsSync(bingoComponentsDir)) {
  fs.mkdirSync(bingoComponentsDir);
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
function getRandomOptions(count, seed) {
  // If seed is provided, use seeded random
  if (seed) {
    // Simple seeded random function
    const seededRandom = (str) => {
      let hash = Array.from(str).reduce((acc, char) => {
        return ((acc << 5) - acc) + char.charCodeAt(0) | 0;
      }, 0);
      
      hash = Math.abs(hash);
      
      return function() {
        hash ^= hash << 13;
        hash ^= hash >> 17;
        hash ^= hash << 5;
        return Math.abs(hash) / Math.pow(2, 31);
      };
    };
    
    const random = seededRandom(seed);
    
    // Shuffle using Fisher-Yates with seeded random
    const shuffled = [...bingoOptions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, count);
  }
  
  const shuffled = [...bingoOptions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Function to get random bingo options from a static list
function getRandomBingoOptions(count, seed) {
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
  
  // If seed is provided, use seeded random
  if (seed) {
    // Simple seeded random function
    const seededRandom = (str) => {
      let hash = Array.from(str).reduce((acc, char) => {
        return ((acc << 5) - acc) + char.charCodeAt(0) | 0;
      }, 0);
      
      hash = Math.abs(hash);
      
      return function() {
        hash ^= hash << 13;
        hash ^= hash >> 17;
        hash ^= hash << 5;
        return Math.abs(hash) / Math.pow(2, 31);
      };
    };
    
    const random = seededRandom(seed);
    
    // Shuffle using Fisher-Yates with seeded random
    const shuffled = [...options];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, count);
  }
  
  // Otherwise use regular shuffle
  const shuffled = [...options].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Create a more functional implementation of game-store.ts
const gameStoreContent = `
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Generate random options for the initial grid
function getInitialGridOptions() {
  const options = [
    "Disastrous pitch", "Epic negotiation fail", "Team gets lost", "Product epic fail",
    "Candidate back-seat drives PM", "Arguing in public", "Overspends budget", "Bad attempt at foreign language",
    "Bragging in taxi", "Blaming others", "PM is a pushover", "Candidate avoids responsibility",
    "Candidate fights for discount", "Candidate gets emotional", "Candidate tries to outsmart",
    "Lord Sugar makes a pun", "Team makes a loss", "Stupid assumption", 
    "Wasted journey", "Everyone interrupts", "Candidate answers phone in towel", 
    "Boardroom betrayal", "Karen gives death stare", "Claude gets angry"
  ];
  
  const shuffled = [...options].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 9); // Get 9 random options
}

// Get options for the initial grid
const initialGridOptions = getInitialGridOptions();

// Initial state with actual bingo options
const initialState = {
  grid: [
    [initialGridOptions[0], initialGridOptions[1], initialGridOptions[2]],
    [initialGridOptions[3], initialGridOptions[4], initialGridOptions[5]],
    [initialGridOptions[6], initialGridOptions[7], initialGridOptions[8]]
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
  gameMode: 'line',
  targetNumber: 5,
  wins: [],
  previousWins: [],
  soloSetupMode: false,
  countdownRemaining: 0
};

// Helper function to check for wins
function checkForWins(grid, markedSquares, gameMode, targetNumber) {
  const allPossibleWins = [];

  // Helper function to check if a square is marked
  const isMarked = (row, col) => {
    return markedSquares.some(([r, c]) => r === row && c === col);
  };

  // Check rows
  for (let i = 0; i < 3; i++) {
    if (isMarked(i, 0) && isMarked(i, 1) && isMarked(i, 2)) {
      allPossibleWins.push({
        type: \`row_\${i}\`,
        squares: [[i, 0], [i, 1], [i, 2]],
        message: \`Row \${i + 1} complete!\`
      });
    }
  }

  // Check columns
  for (let j = 0; j < 3; j++) {
    if (isMarked(0, j) && isMarked(1, j) && isMarked(2, j)) {
      allPossibleWins.push({
        type: \`col_\${j}\`,
        squares: [[0, j], [1, j], [2, j]],
        message: \`Column \${j + 1} complete!\`
      });
    }
  }

  // Check diagonals
  if (isMarked(0, 0) && isMarked(1, 1) && isMarked(2, 2)) {
    allPossibleWins.push({
      type: 'diag_1',
      squares: [[0, 0], [1, 1], [2, 2]],
      message: 'Diagonal (top-left to bottom-right) complete!'
    });
  }

  if (isMarked(0, 2) && isMarked(1, 1) && isMarked(2, 0)) {
    allPossibleWins.push({
      type: 'diag_2',
      squares: [[0, 2], [1, 1], [2, 0]],
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
      squares: allSquares,
      message: 'FULL HOUSE! All squares complete!'
    });
  }

  // Filter wins based on game mode
  let filteredWins = [];
  
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
        squares: markedSquares.slice(0, targetNumber),
        message: \`\${targetNumber} squares marked!\`
      }];
    }
  }

  return filteredWins;
}

// Create the actual store with persistence
export const useGameStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Reset the entire game state
      resetGame: () => {
        try {
          console.log("Resetting game state completely");
          // Clear localStorage first for a more thorough reset
          if (typeof window !== 'undefined' && window.localStorage) {
            // Don't delete everything, just the game state
            window.localStorage.removeItem('apprentice-bingo-storage');
          }
          
          set({ ...initialState });
          
          // Generate a fresh grid
          const options = getRandomBingoOptions(9);
          const grid = [];
          for (let i = 0; i < 3; i++) {
            const row = [];
            for (let j = 0; j < 3; j++) {
              row.push(options[i * 3 + j]);
            }
            grid.push(row);
          }
          set({ grid });
          
          // Force a refresh to clear the UI state
          if (typeof window !== 'undefined') {
            console.log("Navigating to home page");
            window.location.href = '/';
          }
        } catch (error) {
          console.error("Error during game reset:", error);
          // Fallback - at least try to clear the state
          set({ ...initialState });
        }
      },
      
      // Hard reset that clears localStorage
      hardReset: () => {
        try {
          console.log("Performing HARD reset");
          // Clear localStorage first
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.removeItem('apprentice-bingo-storage');
          }
          
          // Reset state
          set({ ...initialState });
          
          // Force a refresh
          if (typeof window !== 'undefined') {
            console.log("Force refreshing page");
            window.location.href = '/?reset=' + Date.now();
          }
        } catch (error) {
          console.error("Error during hard reset:", error);
          // Fallback reload
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }
      },

      // Initialize a new game
      initGame: (gameId, teamId, teamName, advisor) => {
        console.log("Initializing game:", { gameId, teamId, teamName, advisor });
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
        const options = getRandomBingoOptions(9);
        const grid = [];
        for (let i = 0; i < 3; i++) {
          const row = [];
          for (let j = 0; j < 3; j++) {
            row.push(options[i * 3 + j]);
          }
          grid.push(row);
        }
        set({ grid });
        
        console.log("Game initialized with grid:", grid);
      },

      toggleSquare: (row, col) => {
        console.log("Toggling square:", row, col);
        const { markedSquares, gameMode, targetNumber, grid, previousWins, isLocked } = get();
        
        // Don't allow toggling if the game is locked
        if (isLocked) {
          console.log("Game is locked, cannot toggle square");
          return;
        }
        
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
          newMarkedSquares = [...markedSquares, [row, col]];
        }
        
        set({ markedSquares: newMarkedSquares });
        
        // Check for wins
        const wins = checkForWins(grid, newMarkedSquares, gameMode, targetNumber);
        wins.forEach(win => {
          const isNewWin = !previousWins.some(prev => prev.type === win.type);
          if (isNewWin) {
            console.log("New win detected:", win.type);
            get().addWin(win);
            
            // Check if the win should lock the game (full house or target number)
            if ((gameMode === 'full_house' && win.type === 'full_house') || 
                (gameMode === 'number' && win.type.startsWith('number_'))) {
              console.log("Win condition met - locking game");
              set({ isLocked: true });
            }
          }
        });
      },

      addWin: (win) => {
        const { wins, previousWins } = get();
        console.log("Adding win:", win.type);
        set({ 
          wins: [...wins, win],
          previousWins: [...previousWins, win]
        });
        
        // Play winning sound effect if in browser
        if (typeof window !== 'undefined') {
          try {
            // Dispatch a custom event that can be listened for to play sounds
            const winEvent = new CustomEvent('bingo-win', { detail: win });
            window.dispatchEvent(winEvent);
          } catch (error) {
            console.error("Error dispatching win event:", error);
          }
        }
      },

      setTeams: (teams) => {
        console.log("Setting teams:", teams.length);
        set({ teams });
      },

      setGrid: (grid) => {
        console.log("Setting new grid with " + grid.length + " rows");
        set({ grid });
      },

      setGameMode: (mode) => {
        console.log("Setting game mode to:", mode);
        set({ gameMode: mode });
        
        // Reset marked squares and wins when changing mode
        set({
          markedSquares: [],
          wins: [],
          previousWins: []
        });
      },

      setTargetNumber: (num) => {
        console.log("Setting target number to:", num);
        if (num >= 1 && num <= 9) {
          set({ targetNumber: num });
        } else {
          console.error("Invalid target number:", num);
        }
      },

      setIsLocked: (locked) => {
        console.log("Setting locked state to:", locked);
        set({ isLocked: locked });
      },

      setIsLive: (live) => {
        console.log("Setting live state to:", live);
        set({ isLive: live });
      },

      setCountdownRemaining: (seconds) => {
        set({ countdownRemaining: seconds });
      },

      resetMarks: () => {
        console.log("Resetting all marked squares");
        set({ 
          markedSquares: [],
          wins: [],
          previousWins: []
        });
      },

      regenerateCard: (seed) => {
        // Get options with seed if provided
        const options = getRandomBingoOptions(9, seed);
        
        // Create the grid data structure directly
        const newGrid = [
          [options[0], options[1], options[2]],
          [options[3], options[4], options[5]], 
          [options[6], options[7], options[8]]
        ];
        
        // Reset marks and set the new grid
        set({ 
          grid: newGrid,
          markedSquares: [],
          wins: [],
          previousWins: []
        });
        
        // Update the team if in single player mode
        const { teams, isSinglePlayer } = get();
        
        if (isSinglePlayer && teams.length > 0) {
          const updatedTeams = teams.map(team => ({
            ...team,
            markedSquares: [],
            wins: []
          }));
          
          set({ teams: updatedTeams });
        }
        
        // Trigger UI reset
        setTimeout(() => {
          const event = new CustomEvent('game-reset');
          window.dispatchEvent(event);
        }, 10);
        
        return seed; // Return the seed for display
      },

      // Functions that start the game modes
      initSinglePlayerMode: (teamName = 'Solo Player', advisor = 'karen') => {
        console.log("Initializing single player mode:", { teamName, advisor });
        // Implementation for Single Player mode
        set({ 
          teamId: 'solo-' + Date.now(),
          teamName: teamName || 'Solo Player',
          teamAdvisor: advisor,
          isSinglePlayer: true,
          isHost: true,
          soloSetupMode: false,
          markedSquares: [], // Ensure marked squares are reset
          wins: [],          // Ensure wins are reset
          previousWins: [],  // Ensure previous wins are reset
          isLocked: false    // Ensure game is unlocked
        });
        
        // Generate a grid with actual content
        const options = getRandomBingoOptions(9);
        const grid = [];
        for (let i = 0; i < 3; i++) {
          const row = [];
          for (let j = 0; j < 3; j++) {
            row.push(options[i * 3 + j]);
          }
          grid.push(row);
        }
        set({ grid });
        
        console.log("Single player mode initialized with grid");
        
        // Use history API instead of reload
        if (typeof window !== 'undefined') {
          try {
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new Event('popstate'));
            // Dispatch a custom event
            const gameStartEvent = new CustomEvent('game-started', { 
              detail: { mode: 'single-player' } 
            });
            window.dispatchEvent(gameStartEvent);
          } catch (error) {
            console.error("Error during single player initialization:", error);
            // Fallback to reload
            window.location.href = '/';
          }
        }
      },

      initQuickGameMode: () => {
        console.log("Initializing quick game mode");
        // Implementation for Quick Game mode
        const teamNames = [
          'First Forte', 'Impact', 'Velocity', 'Invicta', 'Stealth', 'Eclipse',
          'Alpha', 'Renaissance', 'Ignite', 'Empire', 'Apollo', 'Synergy'
        ];
        const advisors = ['karen', 'tim', 'claude', 'nick', 'margaret'];
        
        // Pick random team name and advisor
        const teamName = teamNames[Math.floor(Math.random() * teamNames.length)];
        const advisor = advisors[Math.floor(Math.random() * advisors.length)];
        
        set({ 
          teamId: 'quick-' + Date.now(),
          teamName,
          teamAdvisor: advisor,
          isSinglePlayer: true,
          isHost: true,
          soloSetupMode: false,
          markedSquares: [], // Ensure marked squares are reset
          wins: [],          // Ensure wins are reset
          previousWins: [],  // Ensure previous wins are reset
          isLocked: false    // Ensure game is unlocked
        });
        
        // Generate a grid with actual content
        const options = getRandomBingoOptions(9);
        const grid = [];
        for (let i = 0; i < 3; i++) {
          const row = [];
          for (let j = 0; j < 3; j++) {
            row.push(options[i * 3 + j]);
          }
          grid.push(row);
        }
        set({ grid });
        
        console.log("Quick game mode initialized with random team and advisor");
        
        // Use history API instead of reload
        if (typeof window !== 'undefined') {
          try {
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new Event('popstate'));
            // Dispatch a custom event
            const gameStartEvent = new CustomEvent('game-started', { 
              detail: { mode: 'quick-game' } 
            });
            window.dispatchEvent(gameStartEvent);
          } catch (error) {
            console.error("Error during quick game initialization:", error);
            // Fallback to reload
            window.location.href = '/';
          }
        }
      },

      prepareSoloMode: () => {
        console.log("Preparing solo setup mode");
        // Implementation for preparing solo mode
        set({ 
          isSinglePlayer: true,
          soloSetupMode: true,
          teamId: 'solo-setup-' + Date.now(),
          // Reset other game state
          markedSquares: [],
          wins: [],
          previousWins: [],
          isLocked: false
        });
        
        // Use history API instead of reload
        if (typeof window !== 'undefined') {
          try {
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new Event('popstate'));
            // Dispatch a custom event
            const setupEvent = new CustomEvent('solo-setup-started');
            window.dispatchEvent(setupEvent);
          } catch (error) {
            console.error("Error during solo setup:", error);
            // Fallback to reload
            window.location.href = '/';
          }
        }
      }
    }),
    {
      name: 'apprentice-bingo-storage',
      storage: createJSONStorage(() => localStorage),
      
      // Add a partial serialization to handle browser refresh/reset
      partialize: (state) => ({
        ...state,
        markedSquares: state.markedSquares,
        grid: state.grid,
        teamId: state.teamId,
        teamName: state.teamName,
        teamAdvisor: state.teamAdvisor,
        isSinglePlayer: state.isSinglePlayer,
        gameMode: state.gameMode,
        wins: state.wins,
        previousWins: state.previousWins
      }),
    }
  )
);
`;

// Create the AdvisorAnimation component
const advisorAnimationContent = `
'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function AdvisorAnimation({ advisor, animate = false }) {
  if (!advisor) return null;
  
  const getAdvisorImage = () => {
    switch (advisor) {
      case 'karen':
        return '/images/karenbrady.webp';
      case 'tim':
        return '/images/timcambell.webp';
      case 'claude':
        return '/images/claude.jpg';
      case 'nick':
        return '/images/nick.jpg';
      case 'margaret':
        return '/images/margaret.jpeg';
      default:
        return '/images/karenbrady.webp';
    }
  };
  
  const getAdvisorName = () => {
    switch (advisor) {
      case 'karen':
        return 'Karen Brady';
      case 'tim':
        return 'Tim Campbell';
      case 'claude':
        return 'Claude Littner';
      case 'nick':
        return 'Nick Hewer';
      case 'margaret':
        return 'Margaret Mountford';
      default:
        return 'Karen Brady';
    }
  };
  
  return (
    <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden rounded-full border-4 border-amber-500 bg-gray-900 shadow-lg">
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="overflow-hidden rounded-full w-full h-full relative">
          <Image
            src={getAdvisorImage()}
            alt={\`Advisor \${getAdvisorName()}\`}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
      </div>
    </div>
  );
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

// Create animations file
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

// Create the WinLine component
const winLineContent = `
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

export function WinLine({ win }) {
  if (!win || !win.type || !win.squares || win.squares.length < 3) return null;

  let lineProps = {};
  
  // Set line position based on win type
  if (win.type.startsWith('row')) {
    const row = parseInt(win.type.split('_')[1]);
    lineProps = {
      className: "absolute bg-amber-400 h-1 w-0 left-0 rounded-full opacity-80 shadow-glow-sm",
      style: { top: \`calc(\${(row + 0.5) * 33.333}%)\` },
      animate: { width: '100%' },
      transition: { duration: 0.8, ease: "easeOut" }
    };
  } else if (win.type.startsWith('col')) {
    const col = parseInt(win.type.split('_')[1]);
    lineProps = {
      className: "absolute bg-amber-400 w-1 h-0 top-0 rounded-full opacity-80 shadow-glow-sm",
      style: { left: \`calc(\${(col + 0.5) * 33.333}%)\` },
      animate: { height: '100%' },
      transition: { duration: 0.8, ease: "easeOut" }
    };
  } else if (win.type === 'diag_1') {
    // Top-left to bottom-right
    lineProps = {
      className: "absolute bg-amber-400 h-1 w-0 opacity-80 shadow-glow-sm origin-top-left",
      style: { 
        top: '0', 
        left: '0',
        transformOrigin: 'top left',
        transform: 'rotate(45deg)',
        width: '0%',
      },
      animate: { width: '142%' }, // √2 * 100% to cover diagonal
      transition: { duration: 0.8, ease: "easeOut" }
    };
  } else if (win.type === 'diag_2') {
    // Top-right to bottom-left
    lineProps = {
      className: "absolute bg-amber-400 h-1 w-0 opacity-80 shadow-glow-sm origin-top-right",
      style: {
        top: '0',
        right: '0',
        transformOrigin: 'top right',
        transform: 'rotate(-45deg)',
        width: '0%',
      },
      animate: { width: '142%' }, // √2 * 100% to cover diagonal
      transition: { duration: 0.8, ease: "easeOut" }
    };
  } else {
    return null; // No line for full house or number wins
  }

  return <motion.div {...lineProps} />;
}
`;

// Create the WinMessage component
const winMessageContent = `
'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';

export function WinMessage({ show, onComplete }) {
  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.4 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     bg-gradient-to-br from-amber-600 to-amber-800 
                     px-6 py-4 rounded-lg text-white text-center
                     shadow-xl border-2 border-amber-400 z-50"
        >
          <Trophy className="w-12 h-12 text-amber-300 mx-auto mb-2" />
          <h3 className="text-2xl font-bold mb-1">BINGO!</h3>
          <p className="text-amber-200">You've completed a line!</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
`;

// Create the BingoGrid component with win detection
const bingoGridContent = `
'use client';

import * as React from 'react';
import { useGameStore } from '@/lib/store/game-store';
import { BingoSquare } from './BingoSquare';
import { WinLine } from './WinLine';
import { WinMessage } from './WinMessage';
import { motion } from 'framer-motion';

// Helper function to check for wins
function checkForWins(grid, markedSquares, gameMode, targetNumber) {
  const allPossibleWins = [];

  // Helper function to check if a square is marked
  const isMarked = (row, col) => {
    return markedSquares.some(([r, c]) => r === row && c === col);
  };

  // Check rows
  for (let i = 0; i < 3; i++) {
    if (isMarked(i, 0) && isMarked(i, 1) && isMarked(i, 2)) {
      allPossibleWins.push({
        type: \`row_\${i}\`,
        squares: [[i, 0], [i, 1], [i, 2]],
        message: \`Row \${i + 1} complete!\`
      });
    }
  }

  // Check columns
  for (let j = 0; j < 3; j++) {
    if (isMarked(0, j) && isMarked(1, j) && isMarked(2, j)) {
      allPossibleWins.push({
        type: \`col_\${j}\`,
        squares: [[0, j], [1, j], [2, j]],
        message: \`Column \${j + 1} complete!\`
      });
    }
  }

  // Check diagonals
  if (isMarked(0, 0) && isMarked(1, 1) && isMarked(2, 2)) {
    allPossibleWins.push({
      type: 'diag_1',
      squares: [[0, 0], [1, 1], [2, 2]],
      message: 'Diagonal (top-left to bottom-right) complete!'
    });
  }

  if (isMarked(0, 2) && isMarked(1, 1) && isMarked(2, 0)) {
    allPossibleWins.push({
      type: 'diag_2',
      squares: [[0, 2], [1, 1], [2, 0]],
      message: 'Diagonal (top-right to bottom-left) complete!'
    });
  }

  // Filter wins based on game mode
  let filteredWins = [];
  
  if (gameMode === 'line') {
    // In line mode, allow all line wins (rows, columns, diagonals)
    filteredWins = allPossibleWins.filter(win => 
      win.type.startsWith('row_') || win.type.startsWith('col_') || win.type.startsWith('diag_')
    );
  } else if (gameMode === 'full_house') {
    // In full house mode, only allow the full house win
    filteredWins = allPossibleWins.filter(win => win.type === 'full_house');
  } else if (gameMode === 'number') {
    // In number mode, only allow number wins
    if (markedSquares.length >= targetNumber) {
      filteredWins = [{
        type: \`number_\${targetNumber}\`,
        squares: markedSquares.slice(0, targetNumber),
        message: \`\${targetNumber} squares marked!\`
      }];
    }
  }

  return filteredWins;
}

export function BingoGrid() {
  const grid = useGameStore(state => state.grid);
  const markedSquares = useGameStore(state => state.markedSquares);
  const gameMode = useGameStore(state => state.gameMode);
  const targetNumber = useGameStore(state => state.targetNumber);
  const addWin = useGameStore(state => state.addWin);
  const previousWins = useGameStore(state => state.previousWins);
  const [lastWin, setLastWin] = React.useState(null);
  const [showWinMessage, setShowWinMessage] = React.useState(false);

  // Check for wins when marked squares change
  React.useEffect(() => {
    if (!grid || !grid.length) return;
    
    const wins = checkForWins(grid, markedSquares, gameMode, targetNumber);
    
    // Add new wins that haven't been recorded yet
    wins.forEach(win => {
      const isNewWin = !previousWins.some(prev => prev.type === win.type);
      if (isNewWin) {
        console.log("New win detected:", win.type);
        addWin(win);
        setLastWin(win);
        setShowWinMessage(true);
      }
    });
  }, [markedSquares, grid, gameMode, targetNumber, addWin, previousWins]);
  
  if (!grid || !grid.length) return null;

  return (
    <div className="relative w-full">
      <div className="grid grid-cols-3 gap-1 sm:gap-2 p-2 sm:p-4 rounded-xl border border-amber-600/30 shadow-lg bg-black/30 relative">
        {grid.flat().map((content, index) => {
          const row = Math.floor(index / 3);
          const col = index % 3;
          const isSelected = markedSquares.some(([r, c]) => r === row && c === col);
          const isWinning = lastWin && lastWin.squares ? 
            lastWin.squares.some(([r, c]) => r === row && c === col) : 
            false;
          
          return (
            <BingoSquare 
              key={index}
              index={index}
              content={content}
              isSelected={isSelected}
              isWinning={isWinning}
            />
          );
        })}
        
        {/* Win Line Overlay */}
        {lastWin && (
          <WinLine win={lastWin} />
        )}
      </div>
      
      {/* Win Message */}
      <WinMessage 
        show={showWinMessage}
        onComplete={() => setShowWinMessage(false)}
      />
    </div>
  );
}
`;

// Create BingoSquare component
const bingoSquareContent = `
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/store/game-store';
import { cn } from '@/lib/utils';

interface BingoSquareProps {
  index: number;
  content: string;
  isSelected: boolean;
  isWinning?: boolean;
  isLocked?: boolean;
}

export function BingoSquare({ 
  index, 
  content, 
  isSelected, 
  isWinning = false,
  isLocked = false
}: BingoSquareProps) {
  const row = Math.floor(index / 3);
  const col = index % 3;
  const toggleSquare = useGameStore(state => state.toggleSquare);

  const handleClick = () => {
    if (!isLocked) {
      toggleSquare(row, col);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: isLocked ? 1 : 1.02 }}
      whileTap={{ scale: isLocked ? 1 : 0.98 }}
      className={cn(
        "aspect-square p-2 sm:p-3 rounded-lg cursor-pointer transition-colors text-center flex flex-col justify-center",
        "text-xs sm:text-sm border border-gray-700 shadow-sm",
        isSelected ? (
          isWinning ? 
            "bg-amber-500 border-amber-400 text-amber-950" : 
            "bg-amber-700/90 border-amber-600/50 text-amber-50"
        ) : (
          "bg-gray-800/90 border-gray-700 text-gray-300 hover:bg-gray-700/90 hover:text-white"
        ),
        isLocked && "opacity-80 cursor-default"
      )}
      onClick={handleClick}
    >
      <div 
        className={cn(
          "flex-1 flex items-center justify-center font-medium",
          (isSelected && !isWinning) && "text-shadow-sm"
        )}
      >
        <div className="text-center leading-tight sm:leading-snug">
          {content}
        </div>
      </div>
    </motion.div>
  );
}
`;

// Create utils.ts for cn function
const utilsContent = `
// Utility function to conditionally join classNames
export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
`;

// List of files to create
const files = [
  { path: path.join(libDir, 'animations.ts'), content: animationsContent },
  { path: path.join(libDir, 'data.ts'), content: dataFileContent },
  { path: path.join(libDir, 'facts.ts'), content: 'export const apprenticeFacts = ["Lord Sugar started with just £100", "The show has been running since 2005", "Winners receive a £250,000 investment", "Over 100,000 people apply each series", "Karen Brady joined as an advisor in 2009", "Tim Campbell was the first winner of The Apprentice", "In the US version, the show was hosted by Donald Trump", "Claude Littner was originally just for the interview episodes", "In total, Lord Sugar has invested over £2.5 million in winners"];' },
  { path: path.join(libDir, 'sounds.ts'), content: soundsFileContent },
  { path: path.join(libDir, 'types.ts'), content: 'export type GameMode = "line" | "full_house" | "number";\nexport type WinType = string;\nexport interface Team { id: string; name: string; advisor: string; markedSquares?: [number, number][]; wins: Win[]; createdAt?: string; userId?: string; }\nexport interface Win { type: string; squares: [number, number][]; message: string; };' },
  { path: path.join(libDir, 'utils.ts'), content: utilsContent },
  { path: path.join(storeDir, 'game-store.ts'), content: gameStoreContent },
  { path: path.join(libDir, 'index.ts'), content: '// Export from lib directory\nexport * from "./animations";\nexport * from "./data";\nexport * from "./facts";\nexport * from "./sounds";\nexport * from "./types";\nexport * from "./utils";' },
  { path: path.join(storeDir, 'index.ts'), content: '// Export from store directory\nexport * from "./game-store";' },
  // Create AdvisorAnimation component
  { path: path.join(bingoComponentsDir, 'AdvisorAnimation.tsx'), content: advisorAnimationContent },
  { path: path.join(bingoComponentsDir, 'WinLine.tsx'), content: winLineContent },
  { path: path.join(bingoComponentsDir, 'WinMessage.tsx'), content: winMessageContent },
  { path: path.join(bingoComponentsDir, 'BingoGrid.tsx'), content: bingoGridContent },
  { path: path.join(bingoComponentsDir, 'BingoSquare.tsx'), content: bingoSquareContent }
];

// Create all the files
files.forEach(file => {
  try {
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