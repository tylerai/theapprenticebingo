'use client';

import * as React from "react";
import { useGameStore } from "@/lib/store/game-store";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSounds } from "@/lib/sounds";
import { fadeIn, staggerChildren } from "@/lib/animations";
import { GiPartyPopper, GiDiceSixFacesFour } from "react-icons/gi";
import { FaUsers, FaUserFriends, FaClipboard, FaUserSecret } from "react-icons/fa";
import { FiCheck, FiCopy } from "react-icons/fi";
import { HiOutlineLightningBolt } from "react-icons/hi";
import Image from "next/image";

export function GameModeSelect() {
  const [gameCode, setGameCode] = React.useState("");
  const [createdGameCode, setCreatedGameCode] = React.useState("");
  const [showCopiedMessage, setShowCopiedMessage] = React.useState(false);
  const initSinglePlayerMode = useGameStore(state => state.initSinglePlayerMode);
  const prepareSoloMode = useGameStore(state => state.prepareSoloMode);
  const initGame = useGameStore(state => state.initGame);
  const { playClick, playSuccess } = useSounds();
  const [rotateX, setRotateX] = React.useState(0);
  const [rotateY, setRotateY] = React.useState(0);

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
    // Create a more user-friendly code that's easier to remember
    playClick();
    const randomCode = Math.floor(1000 + Math.random() * 9000); // 4-digit number
    const gameCode = `bingo-${randomCode}`;
    setCreatedGameCode(gameCode);
    initGame(
      gameCode,
      `team-${Date.now()}`,
      "",  // Team name will be set in TeamSelector
      'karen'  // Default advisor, will be set in TeamSelector
    );
  };

  const handleSinglePlayerMode = () => {
    playClick();
    // Use prepareSoloMode instead of directly initializing the solo game
    // This will show the team name and advisor selection screen
    prepareSoloMode();
  };

  const copyGameCode = () => {
    navigator.clipboard.writeText(createdGameCode);
    playSuccess();
    setShowCopiedMessage(true);
    setTimeout(() => setShowCopiedMessage(false), 2000);
  };

  // Handle Enter key for joining a game
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && gameCode.trim()) {
      handleJoinGame();
    }
  };
  
  // 3D card effect for mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate rotation based on mouse position
    const rotationIntensity = 10; // max degrees of rotation
    const newRotateX = -((e.clientY - centerY) / (rect.height / 2)) * rotationIntensity;
    const newRotateY = ((e.clientX - centerX) / (rect.width / 2)) * rotationIntensity;
    
    setRotateX(newRotateX);
    setRotateY(newRotateY);
  };
  
  const handleMouseLeave = () => {
    // Reset rotation when mouse leaves
    setRotateX(0);
    setRotateY(0);
  };

  if (createdGameCode) {
    return (
      <motion.div 
        className="min-h-[60vh] flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="w-full max-w-md bg-gradient-to-br from-green-800 to-green-950 p-8 rounded-2xl shadow-[0_10px_40px_rgba(34,197,94,0.2)] border border-green-500/30"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="text-center">
            <motion.div 
              className="inline-block mb-4 text-5xl text-green-300"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, -5, 0, 5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <GiPartyPopper />
            </motion.div>
            <h2 className="text-2xl font-bold text-green-100 mb-2">Game Created!</h2>
            <p className="text-green-200 mb-4">Share this code with friends to join your game:</p>
            
            <div className="relative w-full max-w-xs mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 blur-lg opacity-30 rounded-lg" />
              <motion.div 
                className="relative bg-gradient-to-br from-green-900 to-green-950 p-4 rounded-lg border border-green-500/20 backdrop-blur-sm font-mono text-2xl text-green-300 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="tracking-wider">{createdGameCode}</span>
              </motion.div>
            </div>
            
            <motion.button
              className="bg-green-600 hover:bg-green-500 text-white rounded-full px-6 py-3 flex items-center justify-center space-x-2 mx-auto transition-all shadow-lg hover:shadow-green-500/25"
              whileTap={{ scale: 0.95 }}
              onClick={copyGameCode}
            >
              {showCopiedMessage ? (
                <>
                  <FiCheck className="text-lg" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <FiCopy className="text-lg" />
                  <span>Copy Code</span>
                </>
              )}
            </motion.button>
            
            <p className="text-green-300/70 text-sm mt-6">
              Players can enter this code to join your game.<br />
              Wait for them to connect before starting.
            </p>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-[75vh] py-8"
      variants={staggerChildren}
      initial="hidden"
      animate="visible"
    >
      {/* Banner */}
      <motion.div 
        className="w-full max-w-4xl mx-auto mb-12 relative rounded-2xl overflow-hidden"
        variants={fadeIn}
        custom={0}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/90 to-amber-700/90 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
        
        <div className="relative z-10 py-10 px-6 md:px-10 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            animate={{ 
              textShadow: [
                "0 0 0px rgba(255,255,255,0)", 
                "0 0 15px rgba(255,255,255,0.5)", 
                "0 0 0px rgba(255,255,255,0)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Welcome to Apprentice Bingo!
          </motion.h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Play along while watching the show and mark events as they happen!
          </p>
        </div>
      </motion.div>

      {/* Game Mode Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
        {/* Solo Mode Card */}
        <motion.div
          className="perspective-1000"
          variants={fadeIn}
          custom={1}
          whileHover={{ scale: 1.02, zIndex: 10 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div 
            className="relative h-full bg-gradient-to-br from-amber-800/90 to-amber-950 rounded-2xl overflow-hidden shadow-xl border border-amber-500/20"
            style={{ 
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              transition: "transform 0.1s ease",
            }}
          >
            <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
            
            <div className="p-6 md:p-8 h-full flex flex-col">
              <div className="flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <FaUserSecret className="text-3xl text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-amber-200 mb-3">Play Solo</h3>
                <p className="text-amber-200/70 mb-6">
                  Challenge yourself with a single-player game. Perfect for practicing or playing along with the show.
                </p>
                
                <div className="space-y-3 mb-8">
                  {["Create your team", "Select your advisor", "Track your wins"].map((feature, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center mr-3">
                        <FiCheck className="text-white text-xs" />
                      </div>
                      <span className="text-amber-100/90 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <motion.button
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white rounded-xl py-4 font-medium relative overflow-hidden group"
                onClick={handleSinglePlayerMode}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center justify-center">
                  <HiOutlineLightningBolt className="text-xl mr-2" />
                  Play Solo
                </span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-300/30 to-amber-400/0"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.8 }}
                />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Multiplayer Card */}
        <motion.div
          className="perspective-1000"
          variants={fadeIn}
          custom={2}
          whileHover={{ scale: 1.02, zIndex: 10 }}
        >
          <div className="relative h-full bg-gradient-to-br from-blue-800/90 to-blue-950 rounded-2xl overflow-hidden shadow-xl border border-blue-500/20">
            <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
            
            <div className="p-6 md:p-8 h-full flex flex-col">
              <div className="flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <FaUsers className="text-3xl text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-blue-200 mb-3">Multiplayer</h3>
                <p className="text-blue-200/70 mb-6">
                  Play with friends! Create a new game or join an existing one with a code.
                </p>
                
                <div className="grid grid-cols-1 gap-4 mb-8">
                  <motion.button
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl py-3 font-medium relative overflow-hidden group"
                    onClick={handleCreateGame}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      <GiDiceSixFacesFour className="text-xl mr-2" />
                      Create New Game
                    </span>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-300/30 to-blue-400/0"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.8 }}
                    />
                  </motion.button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-blue-700/50" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-2 text-xs uppercase text-blue-400 bg-blue-950">Or</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Input
                      placeholder="Enter game code"
                      value={gameCode}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGameCode(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="bg-blue-900/50 border-blue-700/30 focus:border-blue-400 rounded-xl text-blue-100 h-12 placeholder:text-blue-400/60"
                    />
                    
                    <motion.button
                      className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl py-3 font-medium relative overflow-hidden group disabled:opacity-50 disabled:pointer-events-none"
                      onClick={handleJoinGame}
                      disabled={!gameCode.trim()}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        <FaUserFriends className="text-xl mr-2" />
                        Join Existing Game
                      </span>
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-indigo-300/30 to-indigo-400/0"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.8 }}
                      />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Features Section */}
      <motion.div 
        className="max-w-4xl mx-auto mt-16 px-4"
        variants={fadeIn}
        custom={3}
      >
        <h2 className="text-2xl font-bold text-center text-white mb-10">Game Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "🎮",
              title: "Interactive Gameplay",
              description: "Mark events as they happen in the show with our intuitive interface"
            },
            {
              icon: "🏆",
              title: "Win Animations",
              description: "Experience exciting animations when you complete rows, columns, or a full house"
            },
            {
              icon: "📱",
              title: "Responsive Design",
              description: "Play on any device - desktop, tablet, or mobile"
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-6 border border-gray-700/30 backdrop-blur-sm"
              whileHover={{ 
                y: -5,
                boxShadow: "0 20px 30px rgba(0, 0, 0, 0.2)",
                borderColor: "rgba(255, 255, 255, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
} 