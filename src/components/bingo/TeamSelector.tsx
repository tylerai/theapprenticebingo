'use client';

import * as React from "react";
import { useGameStore } from "@/lib/store/game-store";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Team } from "@/lib/types";
import { TeamNameCloud } from "@/components/bingo/TeamNameCloud";

export function TeamSelector() {
  const [teamName, setTeamName] = React.useState("");
  const [advisor, setAdvisor] = React.useState<'karen' | 'tim' | 'claude' | 'nick' | 'margaret'>('karen');
  const gameId = useGameStore(state => state.gameId);
  const teams = useGameStore(state => state.teams);
  const isHost = useGameStore(state => state.isHost);
  const isSinglePlayer = useGameStore(state => state.isSinglePlayer);
  const soloSetupMode = useGameStore(state => state.soloSetupMode);
  const initSinglePlayerMode = useGameStore(state => state.initSinglePlayerMode);
  const initGame = useGameStore(state => state.initGame);

  // Handler for selecting name from word cloud
  const handleSelectTeamName = (name: string) => {
    setTeamName(name);
  };

  // Simplified team display without automatic team addition
  const handleCreateTeam = () => {
    if (teamName.trim()) {
      if (soloSetupMode) {
        // Start solo game with the selected name and advisor
        const teamId = `team-${Date.now()}`;
        
        // First initialize the game to generate the board
        initSinglePlayerMode();
        
        // Then update team info
        useGameStore.setState({
          teamName,
          teamAdvisor: advisor,
          soloSetupMode: false,
          teams: [{
            id: teamId,
            name: teamName,
            advisor,
            markedSquares: [],
            wins: [],
            createdAt: new Date().toISOString(),
            userId: 'single-player'
          }]
        });
      } else {
        // For multiplayer, continue with the game as before
        initGame(
          gameId || `game-${Date.now()}`, // Fallback in case gameId is null
          `team-${Date.now()}`,
          teamName,
          advisor
        );
      }
    }
  };

  const handleSinglePlayer = () => {
    initSinglePlayerMode();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card className="w-full overflow-hidden relative bg-gradient-to-br from-gray-900 to-gray-950 shadow-xl border-amber-800/30">
        <CardHeader className="relative z-10 border-b border-gray-800">
          <CardTitle className="text-2xl flex items-center">
            <span className="text-amber-500 mr-2">🏢</span> Create Your Team
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 relative z-10">
          {/* Team Name Cloud */}
          <TeamNameCloud onSelectName={handleSelectTeamName} selectedName={teamName} />
          
          <div className="space-y-2">
            <label htmlFor="teamName" className="text-sm font-medium">
              Team Name
            </label>
            <input
              id="teamName"
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-gray-700 border-gray-600"
              placeholder="Enter team name or select from above"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Choose Your Advisor</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Button
                variant={advisor === 'karen' ? 'default' : 'outline'}
                onClick={() => setAdvisor('karen')}
                className={advisor === 'karen' ? 'bg-amber-600 hover:bg-amber-700' : ''}
              >
                Karen Brady
              </Button>
              <Button
                variant={advisor === 'tim' ? 'default' : 'outline'}
                onClick={() => setAdvisor('tim')}
                className={advisor === 'tim' ? 'bg-amber-600 hover:bg-amber-700' : ''}
              >
                Tim Campbell
              </Button>
              <Button
                variant={advisor === 'claude' ? 'default' : 'outline'}
                onClick={() => setAdvisor('claude')}
                className={advisor === 'claude' ? 'bg-amber-600 hover:bg-amber-700' : ''}
              >
                Claude
              </Button>
              <Button
                variant={advisor === 'nick' ? 'default' : 'outline'}
                onClick={() => setAdvisor('nick')}
                className={advisor === 'nick' ? 'bg-amber-600 hover:bg-amber-700' : ''}
              >
                Nick
              </Button>
              <Button
                variant={advisor === 'margaret' ? 'default' : 'outline'}
                onClick={() => setAdvisor('margaret')}
                className={advisor === 'margaret' ? 'bg-amber-600 hover:bg-amber-700' : ''}
              >
                Margaret
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <Button 
              onClick={handleCreateTeam} 
              disabled={!teamName.trim()}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {soloSetupMode ? "Start Solo Game" : 
               isHost ? "Start Game" : "Join Game"}
            </Button>
            {!soloSetupMode && !isSinglePlayer && (
              <Button 
                onClick={handleSinglePlayer}
                variant="outline"
              >
                Play Solo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="w-full overflow-hidden relative bg-gradient-to-br from-gray-900 to-gray-950 shadow-xl border-amber-800/30">
        <CardHeader className="relative z-10 border-b border-gray-800">
          <CardTitle className="text-2xl flex items-center">
            <span className="text-amber-500 mr-2">⏳</span> Waiting Room
          </CardTitle>
          <p className="text-sm text-gray-400">
            Game Code: <span className="font-mono font-bold">{gameId}</span>
          </p>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-2">
            <h3 className="text-sm font-medium mb-2">Players in lobby ({teams.length})</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {teams.map((team) => (
                <div 
                  key={team.id} 
                  className="flex items-center justify-between p-2 bg-gray-800 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-medium">{team.name || "Unnamed Team"}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {team.advisor === 'karen' ? 'Karen Brady' : 
                     team.advisor === 'tim' ? 'Tim Campbell' : 
                     team.advisor === 'claude' ? 'Claude' : 
                     team.advisor === 'nick' ? 'Nick' : 'Margaret'}
                  </span>
                </div>
              ))}
            </div>
            {isHost && (
              <div className="mt-4 text-center">
                <p className="text-sm mb-2">You are the host. Start when all players have joined.</p>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  disabled={!teamName.trim()}
                  onClick={handleCreateTeam}
                >
                  Start Game ({teams.length} players)
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 