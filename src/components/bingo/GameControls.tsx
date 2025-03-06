'use client';

import * as React from "react";
import { useGameStore } from "@/lib/store/game-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRandomOptions } from "@/lib/data";
import { useSounds } from "@/lib/sounds";
import { motion } from "framer-motion";
import { FiRefreshCw, FiGrid, FiPower } from "react-icons/fi";

export function GameControls() {
  const isHost = useGameStore(state => state.isHost);
  const isSinglePlayer = useGameStore(state => state.isSinglePlayer);
  const resetGame = useGameStore(state => state.resetGame);
  const resetMarks = useGameStore(state => state.resetMarks);
  const regenerateCard = useGameStore(state => state.regenerateCard);
  const setGrid = useGameStore(state => state.setGrid);
  const { playClick } = useSounds();
  
  const [currentSeed, setCurrentSeed] = React.useState<string>(() => {
    // Generate a random seed when the component mounts
    return Date.now().toString(36);
  });
  
  const [seedInput, setSeedInput] = React.useState<string>("");

  const exitGame = () => {
    playClick();
    window.location.reload();
  };

  const handleResetMarks = () => {
    playClick();
    // Only reset marks without regenerating card
    resetMarks();
  };

  const handleNewCard = () => {
    playClick();
    // Generate new random seed
    const newSeed = Date.now().toString(36);
    setCurrentSeed(newSeed);
    // Generate new card with the new seed
    regenerateCard(newSeed);
  };
  
  const handleLoadSeed = () => {
    if (seedInput.trim()) {
      playClick();
      const normalizedSeed = seedInput.trim();
      setCurrentSeed(normalizedSeed);
      regenerateCard(normalizedSeed);
    }
  };
  
  const handleSeedKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && seedInput.trim()) {
      handleLoadSeed();
    }
  };
  
  return (
    <Card className="bg-gradient-to-b from-gray-800 to-gray-900 border-gray-700 overflow-hidden relative">
      {/* Subtle boardroom pattern */}
      <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5 pointer-events-none"></div>
      
      <CardContent className="p-4 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Reset marks button - available to all */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              variant="outline" 
              onClick={handleResetMarks}
              className="w-full bg-amber-600/90 hover:bg-amber-700 text-white border-amber-700/50 flex items-center gap-2"
            >
              <FiRefreshCw className="text-amber-200" />
              Reset Marks
            </Button>
          </motion.div>

          {/* New Card button - only for host or single player */}
          {(isHost || isSinglePlayer) && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={handleNewCard}
                className="w-full bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <FiGrid className="text-green-200" />
                New Card
              </Button>
            </motion.div>
          )}
        </div>
        
        {/* Seed input and load button */}
        {(isHost || isSinglePlayer) && (
          <div className="mb-4 p-3 bg-gray-900/50 rounded-md border border-gray-700">
            <div className="text-xs text-gray-400 mb-2">Card Seed</div>
            <div className="flex gap-2">
              <input
                type="text"
                value={seedInput}
                onChange={(e) => setSeedInput(e.target.value)}
                onKeyDown={handleSeedKeyDown}
                placeholder={currentSeed}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200"
              />
              <Button
                onClick={handleLoadSeed}
                variant="secondary"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!seedInput.trim()}
              >
                Load
              </Button>
            </div>
            <div className="text-xs text-gray-500 mt-1">Current seed: {currentSeed}</div>
          </div>
        )}
        
        {/* Exit Game button - available to all */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            variant="destructive" 
            onClick={exitGame}
            className="w-full flex items-center gap-2"
          >
            <FiPower />
            Exit Game
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
} 