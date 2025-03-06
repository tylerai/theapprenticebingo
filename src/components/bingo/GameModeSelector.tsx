'use client';

import * as React from "react";
import { useGameStore } from "@/lib/store/game-store";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import type { GameMode } from "@/lib/types";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function GameModeSelector() {
  const setGameMode = useGameStore(state => state.setGameMode);
  const setTargetNumber = useGameStore(state => state.setTargetNumber);
  const gameMode = useGameStore(state => state.gameMode);
  const targetNumber = useGameStore(state => state.targetNumber);
  const isHost = useGameStore(state => state.isHost);
  const [showConfirmation, setShowConfirmation] = React.useState<{mode: GameMode, target?: number} | null>(null);

  if (!isHost) return null;
  
  const handleGameModeChange = (mode: GameMode) => {
    setShowConfirmation({mode});
  };
  
  const handleTargetNumberChange = (num: number) => {
    setShowConfirmation({mode: 'number', target: num});
  };
  
  const confirmChange = () => {
    if (showConfirmation) {
      setGameMode(showConfirmation.mode);
      if (showConfirmation.mode === 'number' && showConfirmation.target) {
        setTargetNumber(showConfirmation.target);
      }
      setShowConfirmation(null);
    }
  };
  
  const cancelChange = () => {
    setShowConfirmation(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-black">Game Mode</CardTitle>
        <CardDescription className="text-gray-600">
          Select how players can win the game
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant={gameMode === 'line' ? 'default' : 'outline'}
            onClick={() => handleGameModeChange('line')}
            className={gameMode === 'line' ? 'bg-black text-white' : 'text-black border-gray-300'}
          >
            Line
            <span className={`ml-2 text-xs ${gameMode === 'line' ? 'text-gray-200' : 'text-gray-500'}`}>
              (row/col/diag)
            </span>
          </Button>
          
          <Button
            variant={gameMode === 'full_house' ? 'default' : 'outline'}
            onClick={() => handleGameModeChange('full_house')}
            className={gameMode === 'full_house' ? 'bg-black text-white' : 'text-black border-gray-300'}
          >
            Full House
            <span className={`ml-2 text-xs ${gameMode === 'full_house' ? 'text-gray-200' : 'text-gray-500'}`}>
              (all 9)
            </span>
          </Button>
          
          <Button
            variant={gameMode === 'number' ? 'default' : 'outline'}
            onClick={() => handleGameModeChange('number')}
            className={gameMode === 'number' ? 'bg-black text-white' : 'text-black border-gray-300'}
          >
            Number
            <span className={`ml-2 text-xs ${gameMode === 'number' ? 'text-gray-200' : 'text-gray-500'}`}>
              ({targetNumber} squares)
            </span>
          </Button>
        </div>
        
        {/* Mode explanation */}
        <div className="p-3 border rounded-md bg-gray-50 border-gray-200">
          <p className="text-sm text-gray-700 mb-2 font-medium">Mode description:</p>
          {gameMode === 'line' && (
            <p className="text-xs text-gray-600">
              Wins are recorded when you complete any row, column, or diagonal line.
            </p>
          )}
          {gameMode === 'full_house' && (
            <p className="text-xs text-gray-600">
              Win only when all 9 squares are marked. No partial wins are recorded.
            </p>
          )}
          {gameMode === 'number' && (
            <p className="text-xs text-gray-600">
              Win when you mark exactly {targetNumber} squares, regardless of position.
            </p>
          )}
        </div>

        {gameMode === 'number' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Target Number of Squares</label>
            <div className="flex gap-2">
              {[3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Button
                  key={num}
                  variant={targetNumber === num ? 'default' : 'outline'}
                  onClick={() => handleTargetNumberChange(num)}
                  size="sm"
                  className={targetNumber === num ? 'bg-black text-white' : 'text-black border-gray-300'}
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {/* Confirmation Dialog */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 p-3 bg-amber-50 border border-amber-300 rounded-md text-amber-800"
            >
              <p className="mb-2 font-medium">This will reset your current bingo card. Do you want to continue?</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={confirmChange} className="bg-amber-600 hover:bg-amber-700 text-white">
                  Yes, continue
                </Button>
                <Button size="sm" variant="outline" onClick={cancelChange} className="border-amber-300 text-amber-800">
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
} 