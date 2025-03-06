'use client';

import * as React from "react";
import { useGameStore } from "@/lib/store/game-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRandomOptions } from "@/lib/data";
import { useSounds } from "@/lib/sounds";
import { motion } from "framer-motion";

export function GameControls() {
  const isHost = useGameStore(state => state.isHost);
  const isSinglePlayer = useGameStore(state => state.isSinglePlayer);
  const resetGame = useGameStore(state => state.resetGame);
  const setGrid = useGameStore(state => state.setGrid);
  const { playClick } = useSounds();

  const exitGame = () => {
    playClick();
    window.location.reload();
  };

  const handleReset = () => {
    playClick();
    resetGame();
    // Force a clean reset of win-related local state in BingoGrid
    // by triggering a small delay so the useEffect in BingoGrid can catch the grid change
    setTimeout(() => {
      const event = new CustomEvent('game-reset');
      window.dispatchEvent(event);
    }, 10);
  };

  const handleNewCard = () => {
    playClick();
    // Generate new grid
    const options = getRandomOptions(9);
    const grid: string[][] = [];
    for (let i = 0; i < 3; i++) {
      const row: string[] = [];
      for (let j = 0; j < 3; j++) {
        row.push(options[i * 3 + j]);
      }
      grid.push(row);
    }
    
    // First reset the game
    resetGame();
    // Then set the new grid
    setGrid(grid);
    
    // Force a clean reset of win-related local state in BingoGrid
    setTimeout(() => {
      const event = new CustomEvent('game-reset');
      window.dispatchEvent(event);
    }, 10);
  };

  return (
    <Card className="bg-gradient-to-b from-gray-800 to-gray-900 border-gray-700 overflow-hidden relative">
      {/* Subtle boardroom pattern */}
      <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5 pointer-events-none"></div>
      
      <CardContent className="flex flex-wrap gap-4 p-4 relative z-10">
        {/* Reset marks button - available to all */}
        <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="w-full bg-amber-600/90 hover:bg-amber-700 text-white border-amber-700/50"
          >
            Reset Marks
          </Button>
        </motion.div>

        {/* New game button - only for host or single player */}
        {(isHost || isSinglePlayer) && (
          <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={handleNewCard}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              New Game
            </Button>
          </motion.div>
        )}
        
        {/* Exit Game button - available to all */}
        <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            variant="destructive" 
            onClick={exitGame}
            className="w-full"
          >
            Exit Game
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
} 