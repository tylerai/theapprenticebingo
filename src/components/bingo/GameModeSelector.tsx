'use client';

import * as React from "react";
import { useGameStore } from "@/lib/store/game-store";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import type { GameMode } from "@/lib/types";

export function GameModeSelector() {
  const setGameMode = useGameStore(state => state.setGameMode);
  const setTargetNumber = useGameStore(state => state.setTargetNumber);
  const gameMode = useGameStore(state => state.gameMode);
  const targetNumber = useGameStore(state => state.targetNumber);
  const isHost = useGameStore(state => state.isHost);

  if (!isHost) return null;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Game Mode</CardTitle>
        <CardDescription>Select how players can win the game</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant={gameMode === 'line' ? 'default' : 'outline'}
            onClick={() => setGameMode('line')}
          >
            Line
            <span className="ml-2 text-xs opacity-70">(row/col/diag)</span>
          </Button>
          
          <Button
            variant={gameMode === 'full_house' ? 'default' : 'outline'}
            onClick={() => setGameMode('full_house')}
          >
            Full House
            <span className="ml-2 text-xs opacity-70">(all 9)</span>
          </Button>
          
          <Button
            variant={gameMode === 'number' ? 'default' : 'outline'}
            onClick={() => setGameMode('number')}
          >
            Number
            <span className="ml-2 text-xs opacity-70">({targetNumber} squares)</span>
          </Button>
        </div>

        {gameMode === 'number' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Number of Squares</label>
            <div className="flex gap-2">
              {[3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Button
                  key={num}
                  variant={targetNumber === num ? 'default' : 'outline'}
                  onClick={() => setTargetNumber(num)}
                  size="sm"
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 