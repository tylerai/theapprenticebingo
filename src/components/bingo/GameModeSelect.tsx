'use client';

import * as React from "react";
import { useGameStore } from "@/lib/store/game-store";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSounds } from "@/lib/sounds";
import { GiPartyPopper, GiDiceSixFacesFour } from "react-icons/gi";
import { FaUsers, FaUserFriends, FaClipboard, FaUserSecret, FaTrophy, FaTv } from "react-icons/fa";
import { FiCheck, FiCopy, FiArrowRight } from "react-icons/fi";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { HiOutlineLightningBolt, HiOutlineSparkles } from "react-icons/hi";
import Image from "next/image";

export function GameModeSelect() {
  const [gameCode, setGameCode] = React.useState("");
  const [createdGameCode, setCreatedGameCode] = React.useState("");
  const [showCopiedMessage, setShowCopiedMessage] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<'main' | 'join'>('main');
  const initSinglePlayerMode = useGameStore(state => state.initSinglePlayerMode);
  const initQuickGameMode = useGameStore(state => state.initQuickGameMode);
  const prepareSoloMode = useGameStore(state => state.prepareSoloMode);
  const initGame = useGameStore(state => state.initGame);
  const { playClick, playSuccess } = useSounds();

  const handleJoinGame = () => {
    if (gameCode.trim()) {
      playClick();
      initGame(
        gameCode,
        `team-${Date.now()}`,
        "",  // Team name will be set in TeamSelector
        'karen'  // Default advisor, will be set in TeamSelector
      );
    }
  };

  const handleCreateGame = () => {
    playClick();
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const gameCode = `bingo-${randomCode}`;
    setCreatedGameCode(gameCode);
    initGame(
      gameCode,
      `team-${Date.now()}`,
      "",
      'karen'
    );
  };

  const handleSinglePlayerMode = () => {
    playClick();
    prepareSoloMode();
  };

  const handleQuickGameMode = () => {
    playClick();
    initQuickGameMode();
  };

  const copyGameCode = () => {
    navigator.clipboard.writeText(createdGameCode);
    playSuccess();
    setShowCopiedMessage(true);
    setTimeout(() => setShowCopiedMessage(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && gameCode.trim()) {
      handleJoinGame();
    }
  };

  if (createdGameCode) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <motion.div 
          className="max-w-lg w-full p-8 bg-gradient-to-br from-amber-950 to-black rounded-3xl shadow-2xl border border-amber-700/20 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative overflow-hidden bg-black/40 rounded-xl p-6 mb-6 border border-amber-700/30">
            <motion.div 
              className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            
            <h2 className="text-2xl font-semibold text-white mb-2 flex items-center">
              <GiPartyPopper className="text-amber-400 mr-3 text-3xl" />
              Game Created!
            </h2>
            
            <p className="text-amber-200/80 mb-4">
              Share this code with your friends to let them join your game.
            </p>
            
            <div className="relative">
              <div className="p-4 bg-amber-900/30 rounded-lg border border-amber-700/30 font-mono text-xl text-center text-white relative">
                {createdGameCode}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent animate-pulse pointer-events-none" />
              </div>
              
              <motion.button
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-amber-800/50 hover:bg-amber-700/70 rounded-full text-white"
                onClick={copyGameCode}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {showCopiedMessage ? <FiCheck /> : <FiCopy />}
              </motion.button>
            </div>
            
            {showCopiedMessage && (
              <div className="mt-2 text-center text-amber-300 text-sm">
                Code copied to clipboard!
              </div>
            )}
          </div>
          
          <p className="text-white/80 text-center mb-6">
            Waiting for players to join...
          </p>
          
          <div className="flex justify-center">
            <Button 
              onClick={() => window.location.reload()}
              className="bg-amber-600 hover:bg-amber-700 px-6 py-2 rounded-full shadow-lg"
            >
              Cancel & Return Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[80vh] overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-3xl" />
        <div className="absolute right-0 bottom-1/4 w-[300px] h-[300px] bg-amber-400/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 container max-w-6xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {activeSection === 'main' ? (
            <motion.div 
              key="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              {/* Hero Section */}
              <motion.div 
                className="text-center mb-16"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 via-amber-400/20 to-amber-600/20 blur-xl rounded-full" />
                  <motion.div 
                    className="relative z-10 flex items-center justify-center w-24 h-24 mx-auto bg-gradient-to-br from-amber-500 to-amber-700 rounded-full shadow-lg mb-2"
                    animate={{ 
                      boxShadow: ['0 0 20px rgba(245, 158, 11, 0.3)', '0 0 30px rgba(245, 158, 11, 0.6)', '0 0 20px rgba(245, 158, 11, 0.3)']
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <FaTrophy className="text-4xl text-white" />
                  </motion.div>
                </div>
                
                <p className="text-xl text-white/70 max-w-2xl mx-auto mb-6">
                  Play along with your favorite business reality show! Mark events as they happen and win with style.
                </p>
                
                <div className="flex flex-wrap gap-2 justify-center">
                  <motion.div 
                    className="px-4 py-2 bg-amber-900/30 rounded-full text-amber-300 text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                  >
                    <FaTv className="inline mr-1" /> Watch and Play
                  </motion.div>
                  <motion.div 
                    className="px-4 py-2 bg-amber-900/30 rounded-full text-amber-300 text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                  >
                    <HiOutlineSparkles className="inline mr-1" /> Fun Facts
                  </motion.div>
                  <motion.div 
                    className="px-4 py-2 bg-amber-900/30 rounded-full text-amber-300 text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                  >
                    <FaUsers className="inline mr-1" /> Multiplayer
                  </motion.div>
                </div>
              </motion.div>

              {/* Game Mode Cards */}
              <div className="flex flex-col gap-4 max-w-xl w-full mb-16">
                {/* Quick Game Card */}
                <motion.div
                  className="w-full rounded-2xl overflow-hidden bg-gradient-to-br from-amber-700/20 to-amber-950/80 border border-amber-700/30 relative group"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(245, 158, 11, 0.4)" 
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <div className="absolute inset-0 opacity-40 bg-[url('/images/pattern.svg')]" />
                  <div className="p-6 relative z-10 flex items-center">
                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 w-14 h-14 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <BsFillLightningChargeFill className="text-2xl text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">Quick Game</h3>
                      <p className="text-white/70">
                        Jump straight into a game with auto-selected team and advisor. Ready in seconds!
                      </p>
                    </div>
                    
                    <motion.button 
                      className="ml-4 py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl text-white font-medium flex items-center justify-center group-hover:shadow-lg transition-all whitespace-nowrap"
                      onClick={handleQuickGameMode}
                      whileTap={{ scale: 0.97 }}
                    >
                      Start
                      <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>
                </motion.div>

                {/* Single Player Card */}
                <motion.div
                  className="w-full rounded-2xl overflow-hidden bg-gradient-to-br from-blue-700/20 to-blue-950/80 border border-blue-700/30 relative group"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(59, 130, 246, 0.4)" 
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <div className="absolute inset-0 opacity-40 bg-[url('/images/pattern.svg')]" />
                  <div className="p-6 relative z-10 flex items-center">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <FaUserSecret className="text-2xl text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">Single Player</h3>
                      <p className="text-white/70">
                        Create your team and choose your advisor. Customize your experience fully.
                      </p>
                    </div>
                    
                    <motion.button 
                      className="ml-4 py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl text-white font-medium flex items-center justify-center group-hover:shadow-lg transition-all whitespace-nowrap"
                      onClick={handleSinglePlayerMode}
                      whileTap={{ scale: 0.97 }}
                    >
                      Play Solo
                      <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>
                </motion.div>

                {/* Multiplayer Card */}
                <motion.div
                  className="w-full rounded-2xl overflow-hidden bg-gradient-to-br from-purple-700/20 to-purple-950/80 border border-purple-700/30 relative group"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(147, 51, 234, 0.4)" 
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <div className="absolute inset-0 opacity-40 bg-[url('/images/pattern.svg')]" />
                  <div className="p-6 relative z-10 flex items-center">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-14 h-14 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <FaUsers className="text-2xl text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">Multiplayer</h3>
                      <p className="text-white/70">
                        Play with friends! Create a game and invite others to join the competition.
                      </p>
                    </div>
                    
                    <div className="ml-4 flex gap-2">
                      <motion.button 
                        className="py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl text-white font-medium flex items-center justify-center group-hover:shadow-lg transition-all whitespace-nowrap"
                        onClick={handleCreateGame}
                        whileTap={{ scale: 0.97 }}
                      >
                        Create
                      </motion.button>
                      <motion.button 
                        className="py-3 px-4 bg-purple-700/30 hover:bg-purple-700/50 rounded-xl text-white font-medium flex items-center justify-center transition-all whitespace-nowrap"
                        onClick={() => {
                          playClick();
                          setActiveSection('join');
                        }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Join
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Footer */}
              <motion.div 
                className="text-center text-white/40 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Created for fans of The Apprentice • All content belongs to their respective owners
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="join"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 border border-purple-700/20 shadow-2xl">
                <button 
                  onClick={() => {
                    playClick();
                    setActiveSection('main');
                  }}
                  className="text-white/60 hover:text-white mb-6 flex items-center text-sm"
                >
                  ← Back to main menu
                </button>
                
                <h2 className="text-2xl font-bold text-white mb-6">Join a Game</h2>
                
                <div className="mb-6">
                  <label className="block text-white/70 mb-2 text-sm">
                    Enter Game Code
                  </label>
                  <Input
                    value={gameCode}
                    onChange={(e) => setGameCode(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. bingo-1234"
                    className="w-full bg-gray-800/70 border-gray-700 text-white"
                  />
                </div>
                
                <Button
                  onClick={handleJoinGame}
                  disabled={!gameCode.trim()}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl text-white font-medium"
                >
                  Join Game
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 