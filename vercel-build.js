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
          
          // Reset state with explicit resets for crucial UI state
          set({ 
            ...initialState,
            // Important: Reset these values explicitly to ensure proper UI rendering
            teamId: '',
            teamName: '',
            isSinglePlayer: false,
            soloSetupMode: false,
            isHost: true
          });
          
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
          
          // Use history API instead of direct location change
          if (typeof window !== 'undefined') {
            console.log("Navigating to home page");
            try {
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new Event('popstate'));
              // Dispatch a refresh event
              window.dispatchEvent(new CustomEvent('game-reset-complete'));
            } catch (error) {
              console.error("Error using history API:", error);
              // Fallback to direct navigation
              window.location.href = '/';
            }
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
        
        // Reset team data in the teams array for leaderboard
        const { teams } = get();
        if (teams.length > 0) {
          const updatedTeams = teams.map(team => ({
            ...team,
            markedSquares: [],
            wins: []
          }));
          
          set({ teams: updatedTeams });
        }
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
        
        // Create a single player team ID
        const singlePlayerId = 'solo-' + Date.now();
        
        // Create a team object for the single player
        const singlePlayerTeam = {
          id: singlePlayerId,
          name: teamName || 'Solo Player',
          advisor,
          markedSquares: [],
          wins: [],
          createdAt: new Date().toISOString(),
          userId: singlePlayerId
        };
        
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
        
        // Ensure the state is completely reset
        set({ 
          ...initialState,
          teamId: singlePlayerId,
          teamName: teamName || 'Solo Player',
          teamAdvisor: advisor,
          isSinglePlayer: true,
          isHost: true,
          soloSetupMode: false,
          grid,
          teams: [singlePlayerTeam] // Ensure the team is in the teams array for leaderboard/win tracking
        });
        
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

      initQuickGame: () => {
        console.log('Initializing quick game mode');
        
        const now = Date.now();
        const quickTeamId = \`quick-${now}\`;
        
        // Create a quick game team
        const quickTeam = {
          id: quickTeamId,
          name: 'Quick Player',
          advisor: 'karen',
          markedSquares: [],
          wins: [],
          createdAt: new Date().toISOString(),
          userId: quickTeamId
        };
        
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
        
        // Reset the store to a fresh state
        set({
          ...initialState,
          teamId: quickTeamId,
          teamName: 'Quick Player',
          teamAdvisor: 'karen',
          isHost: true,
          isSinglePlayer: true,
          gameMode: 'line',
          grid,
          teams: [quickTeam], // Add the quick team to the teams array
          isLocked: false,
          soloSetupMode: false
        });
        
        console.log('Quick game mode initialized with random team and advisor');
        
        // Navigate to game page
        if (typeof window !== 'undefined') {
          try {
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new Event('popstate'));
            
            // Dispatch a game-started event
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
          ...initialState,
          isSinglePlayer: true,
          soloSetupMode: true,
          teamId: 'solo-setup-' + Date.now(),
          isHost: true
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

export function WinMessage({ show, onComplete, message = "You've completed a line!" }) {
  React.useEffect(() => {
    if (show) {
      console.log('Showing win message with auto-dismiss');
      const timer = setTimeout(() => {
        if (onComplete) {
          console.log('Auto-dismissing win message');
          onComplete();
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);
  
  // For debugging
  React.useEffect(() => {
    console.log('WinMessage rendered with show =', show);
  }, [show]);
  
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-br from-amber-600 to-amber-800 
                   px-8 py-6 rounded-lg text-white text-center
                   shadow-xl border-2 border-amber-400"
      >
        <Trophy className="w-16 h-16 text-amber-300 mx-auto mb-3" />
        <h3 className="text-3xl font-bold mb-2">BINGO!</h3>
        <p className="text-amber-200 text-lg">{message}</p>
        <button 
          onClick={onComplete}
          className="mt-4 px-4 py-2 bg-amber-800 hover:bg-amber-700 rounded-lg font-medium text-sm"
        >
          Continue
        </button>
      </motion.div>
    </div>
  );
}
`;

// Create updated BingoGrid with enhanced win detection
const enhancedBingoGridContent = `
'use client';

import * as React from 'react';
import { useGameStore } from '@/lib/store/game-store';
import { BingoSquare } from './BingoSquare';
import { WinLine } from './WinLine';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

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

  // Debug flag for win detection
  const [debug, setDebug] = React.useState({
    winChecks: 0,
    checkedAt: null,
    lastWinFound: null
  });

  // Check for wins when marked squares change
  React.useEffect(() => {
    if (!grid || !grid.length) return;
    
    // Log for debugging
    console.log('Checking for wins with', markedSquares.length, 'marked squares');
    
    // Update debug info
    setDebug(prev => ({
      winChecks: prev.winChecks + 1,
      checkedAt: new Date().toISOString(),
      lastWinFound: null
    }));
    
    const wins = checkForWins(grid, markedSquares, gameMode, targetNumber);
    console.log('Found wins:', wins);
    
    // Add new wins that haven't been recorded yet
    wins.forEach(win => {
      const isNewWin = !previousWins.some(prev => prev.type === win.type);
      if (isNewWin) {
        console.log("New win detected:", win.type);
        addWin(win);
        setLastWin(win);
        
        // Update debug info
        setDebug(prev => ({
          ...prev,
          lastWinFound: win.type
        }));
        
        // Always show win message for new wins
        setShowWinMessage(true);
        
        // To ensure the animation re-triggers for subsequent wins, 
        // we need to reset it briefly
        setTimeout(() => {
          setShowWinMessage(false);
          setTimeout(() => {
            setShowWinMessage(true);
          }, 50);
        }, 10);
      }
    });
  }, [markedSquares, grid, gameMode, targetNumber, addWin, previousWins]);
  
  if (!grid || !grid.length) return null;

  // Display debug info in development if needed
  const debugInfo = false ? (
    <div className="absolute top-0 right-0 bg-black/70 text-white text-xs p-1 rounded">
      Checks: {debug.winChecks} | Last: {debug.lastWinFound || 'none'}
    </div>
  ) : null;

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
        
        {debugInfo}
      </div>
      
      {/* Win Message - Made more visible and larger */}
      {showWinMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-br from-amber-600 to-amber-800 
                     px-8 py-6 rounded-lg text-white text-center
                     shadow-xl border-2 border-amber-400"
          >
            <Trophy className="w-16 h-16 text-amber-300 mx-auto mb-3" />
            <h3 className="text-3xl font-bold mb-2">BINGO!</h3>
            <p className="text-amber-200 text-lg">{lastWin ? lastWin.message : "You've completed a line!"}</p>
            <button 
              onClick={() => setShowWinMessage(false)}
              className="mt-4 px-4 py-2 bg-amber-800 hover:bg-amber-700 rounded-lg font-medium text-sm"
            >
              Continue
            </button>
          </motion.div>
        </div>
      )}
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

// Create a GameProgress component to replace the Leaderboard
const gameProgressContent = `
'use client';

import * as React from 'react';
import { useGameStore } from '@/lib/store/game-store';
import { motion } from 'framer-motion';
import { Award, Check, Trophy } from 'lucide-react';

export function GameProgress() {
  const grid = useGameStore(state => state.grid);
  const markedSquares = useGameStore(state => state.markedSquares);
  const wins = useGameStore(state => state.wins);
  const gameMode = useGameStore(state => state.gameMode);
  const targetNumber = useGameStore(state => state.targetNumber);
  
  const totalSquares = grid.length ? grid.flat().length : 9;
  const markedCount = markedSquares.length;
  const progressPercentage = Math.round((markedCount / totalSquares) * 100);
  
  // Get the appropriate game objective based on game mode
  const getGameObjective = () => {
    switch (gameMode) {
      case 'line':
        return 'Complete a row, column, or diagonal';
      case 'full_house':
        return 'Mark all squares (Full House)';
      case 'number':
        return \`Mark \${targetNumber} squares\`;
      default:
        return 'Complete a line';
    }
  };
  
  // Display wins based on type
  const renderWins = () => {
    if (!wins.length) return null;
    
    return (
      <div className="mt-4 space-y-2">
        <h3 className="text-sm font-medium text-amber-400 mb-2">Achievements</h3>
        <div className="space-y-2">
          {wins.map((win, index) => (
            <div 
              key={index} 
              className="flex items-center bg-gray-800 rounded-lg p-2 border border-gray-700"
            >
              {win.type.startsWith('row') && (
                <Award className="mr-2 text-amber-400" size={16} />
              )}
              {win.type.startsWith('col') && (
                <Award className="mr-2 text-amber-400" size={16} />
              )}
              {win.type.startsWith('diag') && (
                <Trophy className="mr-2 text-amber-400" size={16} />
              )}
              {win.type === 'full_house' && (
                <Trophy className="mr-2 text-amber-400" size={16} />
              )}
              <span className="text-xs text-gray-300">
                {win.type === 'full_house' ? 'FULL HOUSE!' : 
                 win.type.startsWith('row_') ? \`Row \${parseInt(win.type.split('_')[1]) + 1} Complete\` :
                 win.type.startsWith('col_') ? \`Column \${parseInt(win.type.split('_')[1]) + 1} Complete\` :
                 win.type === 'diag_1' ? 'Diagonal (↘) Complete' :
                 win.type === 'diag_2' ? 'Diagonal (↙) Complete' : 
                 win.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold text-white">Game Progress</h2>
      
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-2">Objective</h3>
        <div className="p-2 bg-gray-800 rounded-lg text-sm text-white">
          {getGameObjective()}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-2">Progress</h3>
        <div className="flex items-center text-sm text-white mb-2">
          <span>{markedCount} of {totalSquares} squares marked</span>
          <span className="ml-auto">{progressPercentage}%</span>
        </div>
        <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-amber-500"
            initial={{ width: '0%' }}
            animate={{ width: \`\${progressPercentage}%\` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      
      {renderWins()}
    </div>
  );
}
`;

// Create simple app page content with GameProgress instead of Leaderboard
const simpleAppPageContent = `
'use client';

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useGameStore } from "@/lib/store/game-store";
import { BingoGrid } from "@/components/bingo/BingoGrid";
import { GameControls } from "@/components/bingo/GameControls";
import { GameProgress } from "@/components/bingo/GameProgress";
import { ApprenticeFacts } from "@/components/bingo/ApprenticeFacts";
import { AdvisorAnimation } from "@/components/bingo/AdvisorAnimation";

export default function Home() {
  const teamAdvisor = useGameStore(state => state.teamAdvisor);
  
  // Helper function to format advisor name for display
  function formatAdvisor(advisor) {
    if (!advisor) return 'None';
    
    const nameMap = {
      'karen': 'Karen Brady',
      'tim': 'Tim Campbell',
      'claude': 'Claude Littner',
      'nick': 'Nick Hewer',
      'margaret': 'Margaret Mountford'
    };
    
    return nameMap[advisor] || advisor;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
          <span className="text-amber-400">The Apprentice</span>
          <span className="text-white"> Bingo</span>
        </h1>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
          {/* Left sidebar - Facts and Game Mode */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            {/* ApprenticeFacts Component */}
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-3 sm:p-5 rounded-lg shadow-xl border border-gray-700 relative overflow-hidden mb-4">
              <div className="relative z-10">
                <ApprenticeFacts />
              </div>
            </div>
            
            {/* Alan Sugar Animation */}
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-3 sm:p-5 rounded-lg shadow-xl border border-gray-700 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-center mb-4 text-amber-400">Lord Sugar</h3>
                <motion.div className="flex items-center justify-center">
                  <AdvisorAnimation
                    type="lord-sugar"
                    size="large"
                    className="rounded-lg shadow-lg transition-transform duration-300 border border-amber-700/20"
                    forceVideo={true}
                  />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Main content - Bingo grid and controls */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 order-1 lg:order-2">
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-3 sm:p-6 rounded-lg shadow-xl border border-gray-700 relative overflow-hidden">
              <div className="relative z-10">
                <BingoGrid />
              </div>
            </div>
            
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-3 sm:p-6 rounded-lg shadow-xl border border-gray-700 relative overflow-hidden">
              <div className="relative z-10">
                <GameControls />
              </div>
            </div>
          </div>

          {/* Right sidebar - Game Progress */}
          <div className="lg:col-span-3 order-3">
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 p-3 sm:p-5 rounded-lg shadow-xl border border-amber-800/30 h-full relative overflow-hidden">
              <div className="relative z-10 flex flex-col">
                <GameProgress />
                
                {teamAdvisor && (
                  <div className="mt-6">
                    <h3 className="text-center text-white text-sm mb-3">Your Advisor</h3>
                    <div className="flex justify-center">
                      <motion.div className="w-24 h-24 sm:w-32 sm:h-32">
                        <AdvisorAnimation
                          type="advisor"
                          advisor={teamAdvisor}
                          size="large"
                          animate={false}
                        />
                      </motion.div>
                    </div>
                    <p className="mt-2 text-center font-medium text-amber-400">
                      {formatAdvisor(teamAdvisor)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
`;

// Add factsFileContent definition
const factsFileContent = `
/**
 * Apprentice Facts
 * A collection of interesting facts about The Apprentice TV show.
 */

export const apprenticeFacts = [
  "Fact 1: The Apprentice debuted in 2005.",
  "Fact 2: Known for its iconic boardroom sessions.",
  "Fact 3: It has served as a launchpad for many business careers.",
  "Fact 4: The show is famous for its dramatic confrontations.",
  "Fact 5: It continues to inspire entrepreneurial spirit."
];
`;

// Create list of files to write
const filesToWrite = [
  { path: path.join(libDir, 'animations.ts'), content: animationsContent },
  { path: path.join(libDir, 'data.ts'), content: dataFileContent },
  { path: path.join(libDir, 'facts.ts'), content: factsFileContent },
  { path: path.join(libDir, 'sounds.ts'), content: soundsFileContent },
  { path: path.join(libDir, 'types.ts'), content: 'export type GameMode = "line" | "full_house" | "number";\nexport type WinType = string;\nexport interface Team { id: string; name: string; advisor: string; markedSquares?: [number, number][]; wins: Win[]; createdAt?: string; userId?: string; }\nexport interface Win { type: string; squares: [number, number][]; message: string; };' },
  { path: path.join(libDir, 'utils.ts'), content: utilsContent },
  { path: path.join(storeDir, 'game-store.ts'), content: gameStoreContent },
  { path: path.join(libDir, 'index.ts'), content: '// Export from lib directory\nexport * from "./animations";\nexport * from "./data";\nexport * from "./sounds";\nexport * from "./types";\nexport * from "./utils";' },
  { path: path.join(storeDir, 'index.ts'), content: '// Export from store directory\nexport * from "./game-store";' },
  // Create components
  { path: path.join(bingoComponentsDir, 'AdvisorAnimation.tsx'), content: advisorAnimationContent },
  { path: path.join(bingoComponentsDir, 'WinLine.tsx'), content: winLineContent },
  { path: path.join(bingoComponentsDir, 'WinMessage.tsx'), content: winMessageContent },
  { path: path.join(bingoComponentsDir, 'BingoGrid.tsx'), content: enhancedBingoGridContent },
  { path: path.join(bingoComponentsDir, 'BingoSquare.tsx'), content: bingoSquareContent },
  { path: path.join(bingoComponentsDir, 'GameProgress.tsx'), content: gameProgressContent },
  { path: path.join(bingoComponentsDir, 'ApprenticeFacts.tsx'), content: `
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useSounds } from '@/lib/sounds';

// Import the facts directly as we're in the vercel-build context
const apprenticeFacts = [
  "The UK version of The Apprentice started in 2005, two years after the US version.",
  "The iconic boardroom used for filming is not Lord Sugar's real office – it's a set built specifically for the show.",
  "The famous 'You're Fired' catchphrase was originally 'You're Dismissed' in early planning.",
  "During filming, candidates typically work 18-hour days, 6 days a week.",
  "Lord Sugar's receptionist Frances has been with the show since it started.",
  "The dramatic 'walk of shame' with luggage was added in series 2 - candidates need to keep a packed suitcase ready at all times.",
  "Nick Hewer worked with Lord Sugar for nearly 30 years before joining as his advisor on the show.",
  "Margaret Mountford left her role as an advisor to complete her PhD in Papyrology.",
  "Karen Brady is actually a Conservative Party life peer in the House of Lords.",
  "Lord Sugar doesn't keep the £250,000 investment money in a briefcase as shown in the opening credits.",
  "Tim Campbell, who won the first series, later received an MBE for services to enterprise culture.",
  "Candidates don't immediately go home after being fired - they're kept in a separate house to maintain secrecy.",
  "The famous black cab that takes fired candidates away often drives around the block and drops them back at the hotel.",
  "The early morning wake-up calls shown on camera are real, with production calling candidates as early as 4 AM.",
  "In the first series, the prize was a £100,000 job working for Lord Sugar. This changed to a business investment in later series."
];

export function ApprenticeFacts() {
  const [factIndex, setFactIndex] = React.useState(0);
  const [progress, setProgress] = React.useState(100);
  const { playClick, playNotification } = useSounds();
  
  // Generate a random fact that hasn't been shown recently
  const getRandomFact = React.useCallback(() => {
    const randomIndex = Math.floor(Math.random() * apprenticeFacts.length);
    setFactIndex(randomIndex);
    playNotification?.();
  }, [playNotification]);

  // Set up the timer for fact rotation
  React.useEffect(() => {
    // Set initial fact
    getRandomFact();

    // Reset progress when fact changes
    setProgress(100);
    
    // Set up a timer that updates every second
    const timerInterval = setInterval(() => {
      setProgress(prev => {
        // Decrease by 1.67 to complete in 60 seconds
        const newProgress = prev - 1.67;
        if (newProgress <= 0) {
          getRandomFact();
          return 100;
        }
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [getRandomFact]);

  return (
    <Card className="overflow-hidden relative bg-gradient-to-br from-gray-900 to-gray-950 shadow-xl border-amber-800/30">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_500px_at_50%_40%,#3b3b3b,transparent)]"></div>
      
      <CardHeader className="relative z-10 border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="text-amber-500">🎬</span> 
            <span className="text-white">Apprentice Facts</span>
          </CardTitle>
        </div>
        
        {/* Progress bar */}
        <div className="h-1 w-full bg-gray-800 mt-2 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-amber-500"
            style={{ width: \`\${progress}%\` }}
            transition={{ ease: "linear" }}
          />
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={factIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-2"
          >
            <div className="text-2xl text-amber-500 opacity-70">"</div>
            <p className="text-gray-200 italic leading-relaxed min-h-[3rem] text-sm">
              {apprenticeFacts[factIndex]}
            </p>
            <div className="text-2xl text-amber-500 opacity-70 self-end">"</div>
          </motion.div>
        </AnimatePresence>
        
        {/* Static Fact controls */}
        <div className="flex justify-center mt-3">
          <button 
            className="bg-gray-800/70 hover:bg-gray-700/70 border border-amber-800/30 text-amber-300 hover:text-amber-200 px-3 py-1 rounded text-sm"
            onClick={() => {
              playClick?.();
              getRandomFact();
            }}
          >
            New Fact
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
` },
  { path: path.join(__dirname, 'src', 'app', 'page.tsx'), content: simpleAppPageContent }
];

// Create all the files
filesToWrite.forEach(file => {
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
