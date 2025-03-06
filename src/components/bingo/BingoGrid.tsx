'use client';

import * as React from "react";
import { useGameStore } from "@/lib/store/game-store";
import { BingoSquare } from "./BingoSquare";
import type { Win, WinType } from "@/lib/types";
import confetti from 'canvas-confetti';
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Trophy, Award, Medal } from "lucide-react";
import { useSounds } from "@/lib/sounds";
import { FiredAnimation } from "./FiredAnimation";
import { WinLine } from './WinLine';
import { WinMessage } from './WinMessage';
import { cn } from '@/lib/utils';
import { WinningAnimation } from './WinningAnimation';

function checkForWins(grid: string[][], markedSquares: [number, number][]): Win[] {
  const wins: Win[] = [];

  // Helper function to check if a square is marked
  const isMarked = (row: number, col: number) => {
    return markedSquares.some(([r, c]) => r === row && c === col);
  };

  // Check rows
  for (let i = 0; i < 3; i++) {
    if (isMarked(i, 0) && isMarked(i, 1) && isMarked(i, 2)) {
      wins.push({
        type: `row_${i}` as WinType,
        squares: [[i, 0], [i, 1], [i, 2]],
        message: `Row ${i + 1} complete!`
      });
    }
  }

  // Check columns
  for (let j = 0; j < 3; j++) {
    if (isMarked(0, j) && isMarked(1, j) && isMarked(2, j)) {
      wins.push({
        type: `col_${j}` as WinType,
        squares: [[0, j], [1, j], [2, j]],
        message: `Column ${j + 1} complete!`
      });
    }
  }

  // Check diagonals
  if (isMarked(0, 0) && isMarked(1, 1) && isMarked(2, 2)) {
    wins.push({
      type: 'diag_1',
      squares: [[0, 0], [1, 1], [2, 2]],
      message: 'Diagonal (top-left to bottom-right) complete!'
    });
  }

  if (isMarked(0, 2) && isMarked(1, 1) && isMarked(2, 0)) {
    wins.push({
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
    wins.push({
      type: 'full_house',
      squares: allSquares as [number, number][],
      message: 'FULL HOUSE! All squares complete!'
    });
  }

  return wins;
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
      particleCount,
      origin
    });
  });

  if (isFullHouse) {
    // Massive gold confetti burst for full house
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 150,
        origin: { x: 0.5, y: 0.3 },
        colors: ['#d4af37', '#FFD700', '#FFDF00', '#DAA520']  // Gold colors
      });
    }, 750);

    // Side bursts
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 120,
        spread: 120,
        origin: { x: 0.1, y: 0.5 }
      });
      confetti({
        ...defaults,
        particleCount: 120,
        spread: 120,
        origin: { x: 0.9, y: 0.5 }
      });
    }, 1500);

    // Bottom burst
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 100,
        spread: 120,
        gravity: 0.2,
        origin: { x: 0.5, y: 0.8 }
      });
    }, 2500);

    // Final grand burst
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 200,
        spread: 180,
        startVelocity: 45,
        origin: { x: 0.5, y: 0.5 }
      });
    }, 3500);
  }
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

  // Check for wins when marked squares change
  React.useEffect(() => {
    if (!grid.length) return;

    const wins = checkForWins(grid, markedSquares);
    
    // Add new wins that haven't been recorded yet
    wins.forEach(win => {
      const isNewWin = !previousWins.some(prev => prev.type === win.type);
      if (isNewWin) {
        addWin(win);
        // Save the latest win for animation
        setLastWin(win);
        
        // Animate the grid
        gridAnimControls.start({
          scale: [1, 1.05, 1],
          transition: { duration: 0.7 }
        });
        
        // Show winning animation for any win (not just full house)
        setTimeout(() => {
          setShowWinningAnimation(true);
        }, 500);
        
        // Play appropriate sound
        if (win.type === 'full_house') {
          playBingo();
        } else {
          playSuccess();
        }
        
        // Fire confetti for the win
        fireConfetti(win.type === 'full_house');
      }
    });

    // Check for number mode win
    if (gameMode === 'number' && markedSquares.length >= targetNumber) {
      const numberWin: Win = {
        type: `number_${targetNumber}`,
        squares: markedSquares,
        message: `You've marked ${targetNumber} squares!`
      };
      const isNewWin = !previousWins.some(prev => prev.type === numberWin.type);
      if (isNewWin) {
        addWin(numberWin);
        setLastWin(numberWin);
        
        // Animate the grid for number win
        gridAnimControls.start({
          scale: [1, 1.03, 1],
          transition: { duration: 0.6 }
        });
        
        // Show winning animation for number win
        setTimeout(() => {
          setShowWinningAnimation(true);
        }, 500);
        
        // Play success sound
        playSuccess();
        
        fireConfetti(false);
      }
    }
  }, [markedSquares, grid, gameMode, targetNumber, addWin, previousWins, gridAnimControls, playBingo, playSuccess]);

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
          "grid grid-cols-3 gap-2 p-4 rounded-xl border border-amber-600/30 shadow-lg transition-all duration-500",
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
            <BingoSquare 
              key={index}
              index={index}
              content={content}
              isSelected={isSelected}
              isLocked={isLocked}
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