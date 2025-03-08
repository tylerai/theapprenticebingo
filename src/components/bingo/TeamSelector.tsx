'use client';

import * as React from "react";
import { useGameStore } from "@/lib/store/game-store";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Team } from "@/lib/types";
import { TeamNameCloud } from "@/components/bingo/TeamNameCloud";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Advisor data with consistent image paths and display names
const ADVISORS = [
  { id: 'karen', name: 'Karen Brady', path: '/images/karenbrady.webp' },
  { id: 'tim', name: 'Tim Campbell', path: '/images/timcambell.webp' },
  { id: 'claude', name: 'Claude Littner', path: '/images/claude.jpg' },
  { id: 'nick', name: 'Nick Hewer', path: '/images/nick.jpg' },
  { id: 'margaret', name: 'Margaret Mountford', path: '/images/margaret.jpeg' },
] as const;

type AdvisorId = typeof ADVISORS[number]['id'];

export function TeamSelector() {
  const [teamName, setTeamName] = React.useState("");
  const [advisor, setAdvisor] = React.useState<AdvisorId>('karen');
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
        initSinglePlayerMode(teamName, advisor);
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
            <span className="text-amber-500 mr-2">🏢</span> <span className="text-white">Create Your Team</span>
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
              {ADVISORS.map((advisorData) => (
                <motion.div
                  key={advisorData.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAdvisor(advisorData.id)}
                  className={cn(
                    "relative cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-200",
                    advisor === advisorData.id 
                      ? "border-amber-500 shadow-glow-amber" 
                      : "border-gray-700 hover:border-gray-500"
                  )}
                >
                  {/* Standardized image container with fixed aspect ratio */}
                  <div className="relative aspect-[3/4] w-full">
                    {/* Background image with blur for consistency */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center blur-sm opacity-40 scale-110"
                      style={{ backgroundImage: `url(${advisorData.path})` }}
                    />
                    
                    {/* Overlay gradient for consistency */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-gray-900/20 z-10" />
                    
                    {/* Main image */}
                    <div className="absolute inset-0 flex items-center justify-center z-0">
                      <div className="relative w-full h-full">
                        <Image
                          src={advisorData.path}
                          alt={advisorData.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-cover object-center"
                        />
                      </div>
                    </div>
                    
                    {/* Name overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-gray-900 to-transparent z-20">
                      <p className="text-center text-white font-medium text-sm">
                        {advisorData.name}
                      </p>
                    </div>
                    
                    {/* Selected indicator */}
                    {advisor === advisorData.id && (
                      <div className="absolute top-2 right-2 z-30 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="pt-4">
            <Button
              onClick={handleCreateTeam}
              disabled={!teamName.trim()}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            >
              {soloSetupMode ? 'Start Game' : 'Create Team'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Waiting Room - Remove for single player mode */}
      {!soloSetupMode && (
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
      )}
    </div>
  );
} 