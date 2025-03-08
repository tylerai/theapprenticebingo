'use client';

import * as React from "react";
import { useGameStore } from "@/lib/store/game-store";
import { BingoSquare } from "./BingoSquare";
import type { Win, WinType, GameMode } from "@/lib/types";
import confetti from 'canvas-confetti';
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Trophy, Award, Medal } from "lucide-react";
import { useSounds } from "@/lib/sounds";
import { FiredAnimation } from "./FiredAnimation";
import { WinLine } from './WinLine';
import { WinMessage } from './WinMessage';
import { cn } from '@/lib/utils';
import { WinningAnimation } from './WinningAnimation';

// Local version of checkForWins to use just for UI display
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
        type: `row_${i}` as WinType,
        squares: [[i, 0], [i, 1], [i, 2]],
        message: `Row ${i + 1} complete!`
      });
    }
  }

  // Check columns
  for (let j = 0; j < 3; j++) {
    if (isMarked(0, j) && isMarked(1, j) && isMarked(2, j)) {
      allPossibleWins.push({
        type: `col_${j}` as WinType,
        squares: [[0, j], [1, j], [2, j]],
        message: `Column ${j + 1} complete!`
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
      squares: allSquares as [number, number][],
      message: 'FULL HOUSE! All squares complete!'
    });
  }

  // Check number mode
  if (markedSquares.length >= targetNumber) {
    allPossibleWins.push({
      type: `number_${targetNumber}`,
      squares: markedSquares.slice(0, targetNumber),
      message: `${targetNumber} squares marked!`
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
    // In number mode, only allow the target number win
    filteredWins = allPossibleWins.filter(win => win.type === `number_${targetNumber}`);
  }

  return filteredWins;
}

// Enhanced confetti animation function
function fireConfetti(isFullHouse = false) {
  const duration = isFullHouse ? 6000 : 3000;
  const particleCount = isFullHouse ? 250 : 120;

  const defaults = {
    spread: isFullHouse ? 360 : 180,
    ticks: isFullHouse ? 150 : 100,
    gravity: 0.5,
    decay: 0.94,
    startVelocity: isFullHouse ? 40 : 30,
    colors: ['#FFC107', '#FF9800', '#FF5722', '#4CAF50', '#2196F3', '#3F51B5', '#d4af37', '#FFD700']
  };

  // Launch confetti from multiple positions
  const origins = isFullHouse 
    ? [{x: 0.2, y: 0.5}, {x: 0.5, y: 0.5}, {x: 0.8, y: 0.5}]
    : [{x: 0.3, y: 0.5}, {x: 0.7, y: 0.5}];

  origins.forEach(origin => {
    confetti({
      ...defaults,
      origin,
      particleCount: particleCount / origins.length,
      zIndex: 9999
    });
  });
}

export function BingoGrid() {
  const grid = useGameStore(state => state.grid);
  const isLocked = useGameStore(state => state.isLocked);
  const markedSquares = useGameStore(state => state.markedSquares);
  const gameMode = useGameStore(state => state.gameMode);
  const targetNumber = useGameStore(state => state.targetNumber);
  const addWin = useGameStore(state => state.addWin);
  const previousWins = useGameStore(state => state.previousWins);
  const [lastWin, setLastWin] = React.useState<Win | null>(null);
  const [showWinMessage, setShowWinMessage] = React.useState(false);
  const [rotateX, setRotateX] = React.useState(0);
  const [rotateY, setRotateY] = React.useState(0);
  const [showFiredAnimation, setShowFiredAnimation] = React.useState(false);
  const [showWinningAnimation, setShowWinningAnimation] = React.useState(false);
  const [isShimmering, setIsShimmering] = React.useState(false);
  const [showAnimation, setShowAnimation] = React.useState(false);
  const gridAnimControls = useAnimation();
  const { playBingo, playSuccess } = useSounds();
  const winMessageRef = React.useRef<HTMLDivElement>(null);

  // 3D effect for mouse movement
  const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!grid.length) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate rotation based on mouse position
    const rotationIntensity = 5; // max degrees of rotation
    const newRotateX = -((e.clientY - centerY) / (rect.height / 2)) * rotationIntensity;
    const newRotateY = ((e.clientX - centerX) / (rect.width / 2)) * rotationIntensity;
    
    setRotateX(newRotateX);
    setRotateY(newRotateY);
  }, [grid]);
  
  const handleMouseLeave = React.useCallback(() => {
    // Reset rotation when mouse leaves
    setRotateX(0);
    setRotateY(0);
  }, []);

  // Check for wins when marked squares change - completely rewritten for reliability
  React.useEffect(() => {
    if (!grid.length || markedSquares.length === 0) return;

    console.log("Checking for wins with marked squares:", markedSquares);
    
    // Get all possible wins regardless of previous state
    const wins = checkForWins(grid, markedSquares, gameMode, targetNumber);
    console.log("Detected wins:", wins);
    console.log("Previous wins:", previousWins);
    
    // Check if there are any wins that weren't previously recorded
    const newWins = wins.filter(win => 
      !previousWins.some(prevWin => prevWin.type === win.type)
    );
    
    if (newWins.length > 0) {
      console.log("New wins detected!", newWins);
      
      // Process each new win
      newWins.forEach(win => {
        console.log("Adding win:", win.type);
        addWin(win);
      });
      
      // Get the most significant win (prefer full house over others)
      const mostSignificantWin = newWins.find(win => win.type === 'full_house') || newWins[0];
      
      // Set the win for display
      setLastWin(mostSignificantWin);
      
      // Force the win message to show - this is critical
      setTimeout(() => {
        console.log("FORCING WIN MESSAGE TO SHOW");
        setShowWinMessage(true);
        
        // Play appropriate sound effect
        if (mostSignificantWin.type === 'full_house') {
          playBingo();
        } else {
          playSuccess();
        }
        
        // Show win animation after a slight delay
        setTimeout(() => {
          setShowWinningAnimation(true);
        }, 200);
        
        // Fire confetti effect
        fireConfetti(mostSignificantWin.type === 'full_house');
      }, 100);
    }
  }, [markedSquares, grid, gameMode, targetNumber, addWin, previousWins, playBingo, playSuccess]);

  // Reset any win-related state when the grid changes
  React.useEffect(() => {
    setLastWin(null);
    setShowWinMessage(false);
  }, [grid]);

  // Listen for game-reset events
  React.useEffect(() => {
    const handleGameReset = () => {
      setLastWin(null);
      setShowWinMessage(false);
    };

    window.addEventListener('game-reset', handleGameReset);
    return () => {
      window.removeEventListener('game-reset', handleGameReset);
    };
  }, []);

  if (!grid.length) return null;

  // Function to get the appropriate icon for the win message
  const getWinIcon = () => {
    if (!lastWin) return null;
    
    if (lastWin.type === 'full_house') {
      return <Trophy className="inline mr-2 text-yellow-200" size={24} />;
    } else if (lastWin.type.startsWith('diag')) {
      return <Award className="inline mr-2 text-yellow-200" size={22} />;
    } else {
      return <Medal className="inline mr-2 text-yellow-200" size={20} />;
    }
  };

  // Stagger animation for grid items
  const gridItemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className={cn(
      "flex flex-col items-center relative",
      "w-full max-w-screen-sm",
      isShimmering && "animate-shimmer"
    )}>
      {/* Grid Container */}
      <div 
        className={cn(
          "grid grid-cols-3 gap-1 sm:gap-2 p-2 sm:p-4 rounded-xl border border-amber-600/30 shadow-lg transition-all duration-500",
          "bg-black/30 backdrop-blur-sm",
          showAnimation && "shake-animation"
        )}
      >
        {/* Bingo Squares */}
        {grid.flat().map((content, index) => {
          const row = Math.floor(index / 3);
          const col = index % 3;
          const isSelected = markedSquares.some(([r, c]) => r === row && c === col);
          const isWinning = lastWin && lastWin.squares ? 
            lastWin.squares.some(([r, c]) => r === row && c === col) : 
            false;
          
          return (
            <motion.div
              key={`square-${row}-${col}`}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={gridItemVariants}
              className="w-full"
            >
              <BingoSquare 
                key={index}
                index={index}
                content={content}
                isSelected={isSelected}
                isLocked={isLocked}
                isWinning={isWinning}
              />
            </motion.div>
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

      {/* You're Fired Animation */}
      <FiredAnimation 
        isVisible={showFiredAnimation} 
        onClose={() => setShowFiredAnimation(false)} 
      />

      {/* New winning animation */}
      <WinningAnimation 
        isVisible={showWinningAnimation} 
        onClose={() => setShowWinningAnimation(false)} 
      />
    </div>
  );
} 