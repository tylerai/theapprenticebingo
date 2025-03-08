'use client';

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/lib/store/game-store";
import { BingoGrid } from "@/components/bingo/BingoGrid";
import { GameControls } from "@/components/bingo/GameControls";
import { TeamSelector } from "@/components/bingo/TeamSelector";
import { GameModeSelector } from "@/components/bingo/GameModeSelector";
import { GameModeSelect } from "@/components/bingo/GameModeSelect";
import { Leaderboard } from "@/components/bingo/Leaderboard";
import { ApprenticeFacts } from "@/components/bingo/ApprenticeFacts";
import { useSounds } from "@/lib/sounds";
import { fadeIn, slideInFromBottom, slideInFromLeft, slideInFromRight, staggerChildren, boardroomBackground } from "@/lib/animations";
import { AdvisorAnimation } from "@/components/bingo/AdvisorAnimation";
import { WinsList } from "@/components/bingo/WinsList";

// Helper function to format advisor name for display
function formatAdvisor(advisor: 'karen' | 'tim' | 'claude' | 'nick' | 'margaret' | null): string {
  if (!advisor) return 'None';
  
  const nameMap: Record<string, string> = {
    'karen': 'Karen Brady',
    'tim': 'Tim Campbell',
    'claude': 'Claude Littner',
    'nick': 'Nick Hewer',
    'margaret': 'Margaret Mountford'
  };
  
  return nameMap[advisor] || advisor;
}

// Component for the parallax background effect
function ParallaxBackground({ children, src, opacity = 0.6, overlay = true }: { 
  children: React.ReactNode, 
  src: string, 
  opacity?: number,
  overlay?: boolean
}) {
  const [offset, setOffset] = React.useState(0);
  
  React.useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * 0.5);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="relative w-full overflow-hidden">
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ transform: `translateY(${offset}px)` }}
      >
        <Image 
          src={src} 
          alt="Background" 
          fill
          priority
          className="object-cover"
          style={{ opacity }}
        />
      </div>
      {overlay && <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  // Call all hooks at the top level
  const teamId = useGameStore(state => state.teamId);
  const isHost = useGameStore(state => state.isHost);
  const isSinglePlayer = useGameStore(state => state.isSinglePlayer);
  const teamName = useGameStore(state => state.teamName);
  const teamAdvisor = useGameStore(state => state.teamAdvisor);
  const teams = useGameStore(state => state.teams);
  // Get the current team from the teams array
  const currentTeam = teams.find(team => team.id === teamId);
  // Access soloSetupMode using type assertion to avoid TypeScript error
  const soloSetupMode = useGameStore(state => (state as any).soloSetupMode);
  const { playClick } = useSounds();

  // Determine which view to show based on the state
  const showTeamSelector = (!isSinglePlayer && teamId && !teamName) || (soloSetupMode);
  const showGameModeSelect = !teamId && !soloSetupMode;
  const showMainGame = teamId && (isSinglePlayer || teamName) && !soloSetupMode;

  // Initialize sounds on first render
  React.useEffect(() => {
    // This just ensures the sounds are preloaded
  }, []);

  if (showGameModeSelect) {
    return (
      <motion.main 
        className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-950 text-white"
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
      >
        <ParallaxBackground src="/images/theapprenticescreen.jpeg" opacity={0.4}>
          <div className="h-40 sm:h-60 md:h-80 flex items-center justify-center bg-black/40">
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center drop-shadow-lg px-4"
              variants={slideInFromBottom}
            >
              <motion.span 
                className="block text-amber-400"
                animate={{ 
                  textShadow: ['0 0 8px rgba(245, 158, 11, 0)', '0 0 20px rgba(245, 158, 11, 0.5)', '0 0 8px rgba(245, 158, 11, 0)'],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                The Apprentice <span className="text-sm">(UK)</span>
              </motion.span>
              <span className="text-white">Bingo</span>
            </motion.h1>
          </div>
        </ParallaxBackground>
        
        <div className="container mx-auto px-4 py-6 md:py-12 flex-1 relative">
          <div className="max-w-2xl mx-auto">
            <motion.div 
              className="bg-gradient-to-b from-gray-800 to-gray-900 p-4 sm:p-8 rounded-lg shadow-2xl border border-gray-700 relative overflow-hidden"
              variants={fadeIn}
            >
              {/* Subtle boardroom pattern */}
              <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5 pointer-events-none"></div>
              
              {/* Ensure GameModeSelect is in front and can receive events */}
              <div className="relative z-10">
                <GameModeSelect />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.main>
    );
  }

  if (showTeamSelector) {
    return (
      <motion.main 
        className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-950 text-white"
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
      >
        <ParallaxBackground src="/images/team.jpg" opacity={0.4}>
          <div className="h-40 sm:h-60 md:h-80 flex items-center justify-center bg-black/40">
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center drop-shadow-lg px-4"
              variants={slideInFromBottom}
            >
              <span className="block text-white">Choose Your</span>
              <motion.span 
                className="block text-amber-400"
                animate={{ 
                  textShadow: ['0 0 8px rgba(245, 158, 11, 0)', '0 0 20px rgba(245, 158, 11, 0.5)', '0 0 8px rgba(245, 158, 11, 0)'],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                Team
              </motion.span>
            </motion.h1>
          </div>
        </ParallaxBackground>
        
        <div className="container mx-auto px-4 py-6 md:py-12 flex-1">
          <div className="max-w-2xl mx-auto">
            <motion.div 
              className="bg-gradient-to-b from-gray-800 to-gray-900 p-4 sm:p-8 rounded-lg shadow-2xl border border-gray-700 overflow-hidden relative"
              variants={fadeIn}
            >
              {/* Subtle boardroom pattern */}
              <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5 pointer-events-none"></div>
              
              {/* Ensure TeamSelector is in front and can receive events */}
              <div className="relative z-10">
                <TeamSelector />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.main>
    );
  }

  return (
    <AnimatePresence>
      <motion.main 
        className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white"
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
        key="main-game"
      >
        <ParallaxBackground src="/images/alansugar.jpg" opacity={0.7} overlay={true}>
          <div className="h-40 sm:h-48 md:h-56 flex items-center justify-center">
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center drop-shadow-lg px-4"
              variants={slideInFromBottom}
            >
              <motion.span 
                className="block text-amber-400"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  textShadow: ['0 0 8px rgba(245, 158, 11, 0)', '0 0 20px rgba(245, 158, 11, 0.5)', '0 0 8px rgba(245, 158, 11, 0)'],
                }}
                transition={{ 
                  opacity: { duration: 1.5, ease: "easeInOut" },
                  textShadow: { 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                }}
              >
                The Apprentice <span className="text-sm">(UK)</span>
              </motion.span>
              <span className="text-white">Bingo</span>
            </motion.h1>
          </div>
        </ParallaxBackground>
        
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
            {/* Left sidebar - Game mode selection */}
            <motion.div 
              className="lg:col-span-3 order-2 lg:order-1"
              variants={slideInFromLeft}
              custom={1}
            >
              <motion.div 
                className="bg-gradient-to-b from-gray-800 to-gray-900 p-3 sm:p-5 rounded-lg shadow-xl border border-gray-700 relative overflow-hidden"
                whileHover={{ boxShadow: "0 0 25px rgba(245, 158, 11, 0.15)" }}
                transition={{ duration: 0.3 }}
              >
                {/* Subtle boardroom pattern */}
                <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5 pointer-events-none"></div>
                
                <motion.div className="relative z-10">
                  {isHost && <GameModeSelector />}
                  <motion.div 
                    className="mt-4 flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <AdvisorAnimation
                      type="lord-sugar"
                      size="large"
                      className="rounded-lg shadow-lg transition-transform duration-300 border border-amber-700/20"
                      forceVideo={true}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Main content - Bingo grid and controls */}
            <motion.div 
              className="lg:col-span-6 space-y-4 sm:space-y-6 order-1 lg:order-2"
              variants={fadeIn}
              custom={0}
            >
              <motion.div 
                className="bg-gradient-to-b from-gray-800 to-gray-900 p-3 sm:p-6 rounded-lg shadow-xl border border-gray-700 relative overflow-hidden"
                whileHover={{ y: -3, boxShadow: "0 20px 30px rgba(0, 0, 0, 0.3)" }}
                transition={{ duration: 0.3 }}
              >
                {/* Subtle boardroom pattern */}
                <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5 pointer-events-none"></div>
                <div className="relative z-10">
                  <BingoGrid />
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-b from-gray-800 to-gray-900 p-3 sm:p-6 rounded-lg shadow-xl border border-gray-700 relative overflow-hidden"
                whileHover={{ y: -3, boxShadow: "0 20px 30px rgba(0, 0, 0, 0.3)" }}
                transition={{ duration: 0.3 }}
              >
                {/* Subtle boardroom pattern */}
                <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5 pointer-events-none"></div>
                <div className="relative z-10">
                  <GameControls />
                </div>
              </motion.div>
            </motion.div>

            {/* Right sidebar - Leaderboard */}
            <motion.div 
              className="lg:col-span-3 order-3"
              variants={slideInFromRight}
              custom={1}
            >
              <motion.div 
                className="bg-gradient-to-b from-gray-800 to-gray-900 p-3 sm:p-5 rounded-lg shadow-xl border border-amber-800/30 h-full relative overflow-hidden"
                whileHover={{ boxShadow: "0 0 25px rgba(245, 158, 11, 0.15)" }}
                transition={{ duration: 0.3 }}
              >
                {/* Subtle boardroom pattern */}
                <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col">
                  <Leaderboard />
                  
                  {/* Add a dedicated section for user's latest clicks and wins */}
                  {showMainGame && currentTeam && (
                    <motion.div 
                      className="mt-6 bg-gray-900/50 p-4 rounded-lg border border-amber-800/30"
                      variants={fadeIn}
                    >
                      <h3 className="text-center text-white font-semibold mb-3">Your Progress</h3>
                      
                      {/* Show marked squares count */}
                      <div className="mb-3">
                        <h4 className="text-sm text-amber-200 mb-1">Squares Marked:</h4>
                        <div className="text-center text-2xl font-bold text-white">
                          {currentTeam.markedSquares.length}
                          <span className="text-xs text-gray-400 ml-2">/ 9</span>
                        </div>
                      </div>
                      
                      {/* Show wins */}
                      <div>
                        <h4 className="text-sm text-amber-200 mb-1">Your Wins:</h4>
                        {currentTeam.wins.length > 0 ? (
                          <WinsList wins={currentTeam.wins} />
                        ) : (
                          <div className="text-center text-sm text-gray-400 py-2">
                            No wins yet. Keep marking squares!
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                  
                  {showMainGame && teamAdvisor && (
                    <motion.div 
                      className="mt-6"
                      variants={staggerChildren}
                    >
                      <h3 className="text-center text-white text-sm mb-3">Your Advisor</h3>
                      <div className="flex justify-center">
                        <motion.div
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 0 15px rgba(245, 158, 11, 0.3)"
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                          className="w-24 h-24 sm:w-32 sm:h-32"
                        >
                          <AdvisorAnimation
                            type="advisor"
                            advisor={teamAdvisor}
                            size="large"
                            animate={true}
                          />
                        </motion.div>
                      </div>
                      <motion.p className="mt-2 text-center font-medium text-amber-400">
                        {formatAdvisor(teamAdvisor)}
                      </motion.p>
                      
                      {/* Player Wins Display with expandable list */}
                      {currentTeam && currentTeam.wins.length > 0 && (
                        <motion.div
                          className="mt-6"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <h3 className="text-amber-400 font-medium mb-3">Your Achievements</h3>
                          <WinsList wins={currentTeam.wins} />
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                  
                  {/* Apprentice Facts Component */}
                  <motion.div 
                    className="mt-6"
                    variants={slideInFromBottom}
                    custom={2}
                  >
                    <ApprenticeFacts />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.main>
    </AnimatePresence>
  );
} 