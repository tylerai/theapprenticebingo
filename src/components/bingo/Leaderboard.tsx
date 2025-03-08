'use client';

import * as React from "react";
import { useGameStore } from "@/lib/store/game-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Team, Win } from "@/lib/types";
import { WinsList } from './WinsList';

function getTeamProgress(team: Team, gameMode: string, targetNumber: number): number {
  if (gameMode === 'line') {
    return (team.wins.length / 8) * 100; // 8 possible lines (3 rows, 3 cols, 2 diags)
  } else if (gameMode === 'full_house') {
    return (team.markedSquares.length / 9) * 100; // 9 total squares
  } else {
    return (team.markedSquares.length / targetNumber) * 100;
  }
}

function formatWinMessage(win: Win): string {
  switch (win.type) {
    case 'row_0':
      return 'Top Row Complete!';
    case 'row_1':
      return 'Middle Row Complete!';
    case 'row_2':
      return 'Bottom Row Complete!';
    case 'col_0':
      return 'Left Column Complete!';
    case 'col_1':
      return 'Middle Column Complete!';
    case 'col_2':
      return 'Right Column Complete!';
    case 'diag_1':
      return 'Diagonal (↘) Complete!';
    case 'diag_2':
      return 'Diagonal (↙) Complete!';
    case 'full_house':
      return 'FULL HOUSE!';
    default:
      if (win.type.startsWith('number_')) {
        const number = win.type.split('_')[1];
        return `${number} Squares Complete!`;
      }
      return win.message || 'Win!';
  }
}

export function Leaderboard() {
  const teams = useGameStore(state => state.teams);
  const gameMode = useGameStore(state => state.gameMode);
  const targetNumber = useGameStore(state => state.targetNumber);
  const teamId = useGameStore(state => state.teamId);

  // Sort teams based on game mode
  const sortedTeams = React.useMemo(() => {
    return [...teams].sort((a, b) => {
      if (gameMode === 'line') {
        return b.wins.length - a.wins.length;
      } else if (gameMode === 'full_house') {
        const aHasFullHouse = a.wins.some(w => w.type === 'full_house');
        const bHasFullHouse = b.wins.some(w => w.type === 'full_house');
        if (aHasFullHouse !== bHasFullHouse) {
          return bHasFullHouse ? 1 : -1;
        }
        return b.markedSquares.length - a.markedSquares.length;
      } else {
        return b.markedSquares.length - a.markedSquares.length;
      }
    });
  }, [teams, gameMode]);

  // Keep track of position changes
  const [previousPositions, setPreviousPositions] = React.useState<Record<string, number>>({});
  
  // Update positions when teams change
  React.useEffect(() => {
    const newPositions: Record<string, number> = {};
    sortedTeams.forEach((team, index) => {
      newPositions[team.id] = index;
    });
    setPreviousPositions(prev => {
      // Only update after initial load
      return Object.keys(prev).length === 0 ? newPositions : prev;
    });
  }, [sortedTeams]);

  // Check position changes
  const getPositionChange = (teamId: string, currentIndex: number): number => {
    if (!previousPositions[teamId]) return 0;
    return previousPositions[teamId] - currentIndex;
  };

  // Get the game mode display text
  const gameModeDisplayText = React.useMemo(() => {
    switch(gameMode) {
      case 'line': return 'By Lines Completed';
      case 'full_house': return 'By Squares Marked';
      case 'number': return `Target: ${targetNumber} Squares`;
      default: return '';
    }
  }, [gameMode, targetNumber]);

  return (
    <Card className="w-full bg-gradient-to-b from-gray-900 to-gray-800 border-gray-700 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(#60451a_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
      <CardHeader className="pb-1 pt-2 border-b border-gray-800 relative z-10">
        <div className="flex flex-col">
          <CardTitle className="text-xl font-bold text-amber-400 flex items-center">
            <span className="mr-1">🏆</span> 
            Leaderboard
          </CardTitle>
          <span className="text-xs font-medium px-2 py-0.5 bg-gray-800 rounded-full text-amber-100 mt-1 inline-block self-start">
            {gameModeDisplayText}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-2 relative z-10">
        <div className="space-y-2">
          {sortedTeams.length === 0 ? (
            <div className="text-center py-4 text-amber-200/70 text-sm">
              <div className="text-2xl mb-1">👥</div>
              No players yet. Share your game code to invite others!
            </div>
          ) : (
            sortedTeams.map((team, index) => {
              const positionChange = getPositionChange(team.id, index);
              const isCurrentTeam = team.id === teamId;
              const progress = getTeamProgress(team, gameMode, targetNumber);
              
              return (
                <div 
                  key={team.id} 
                  className={`space-y-2 p-2 rounded-lg transition-all duration-300 ${
                    isCurrentTeam ? 'bg-amber-900/30 border border-amber-700/50 shadow-lg shadow-amber-900/20' : 
                    index === 0 ? 'bg-gradient-to-r from-amber-950/40 to-gray-800/70 border border-amber-800/30' : 
                    'bg-gray-800/30 hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
                        index === 0 ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black' : 
                        index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800' :
                        index === 2 ? 'bg-gradient-to-r from-amber-700 to-yellow-700 text-gray-100' :
                        'bg-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <span className={`font-semibold text-sm ${
                          isCurrentTeam ? 'text-amber-400' : 
                          index === 0 ? 'text-yellow-200' : ''
                        }`}>
                          {team.name}
                          {isCurrentTeam && <span className="ml-1 text-xs font-normal bg-amber-800/50 text-amber-100 px-1 py-0.5 rounded-sm">You</span>}
                        </span>
                        {positionChange !== 0 && (
                          <span className={`ml-1 text-xs ${positionChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {positionChange > 0 ? `▲ ${positionChange}` : `▼ ${Math.abs(positionChange)}`}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs font-medium bg-gray-900 px-2 py-1 rounded-full shadow-inner">
                      {gameMode === 'line' && (
                        <span className="font-mono">
                          <span className="text-amber-400 text-sm">{team.wins.length}</span>
                          <span className="text-xs ml-1 text-neutral-500">/ 8</span>
                        </span>
                      )}
                      {gameMode === 'full_house' && (
                        <span className="font-mono">
                          <span className="text-amber-400 text-sm">{team.markedSquares.length}</span>
                          <span className="text-xs ml-1 text-neutral-500">/ 9</span>
                        </span>
                      )}
                      {gameMode === 'number' && (
                        <span className="font-mono">
                          <span className="text-amber-400 text-sm">{team.markedSquares.length}</span>
                          <span className="text-xs ml-1 text-neutral-500">/ {targetNumber}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-3 bg-gray-900 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isCurrentTeam ? 'bg-amber-500' : 
                        index === 0 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 
                        index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
                        index === 2 ? 'bg-gradient-to-r from-amber-700 to-yellow-700' :
                        'bg-blue-600'
                      }`}
                      style={{
                        width: `${progress}%`
                      }}
                    />
                  </div>

                  {/* Recent wins */}
                  {team.wins.length > 0 && (
                    <WinsList wins={team.wins} className="mt-2" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
} 