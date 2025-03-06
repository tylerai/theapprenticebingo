'use client';

import * as React from "react";
import { useGameStore } from "@/lib/store/game-store";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSounds } from "@/lib/sounds";
import { GiDiceSixFacesFour } from "react-icons/gi";
import { FaUserSecret, FaTrophy, FaTv } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { BsFillLightningChargeFill } from "react-icons/bs";
import { HiOutlineSparkles } from "react-icons/hi";
import Image from "next/image";

export function GameModeSelect() {
  const initSinglePlayerMode = useGameStore(state => state.initSinglePlayerMode);
  const initQuickGameMode = useGameStore(state => state.initQuickGameMode);
  const prepareSoloMode = useGameStore(state => state.prepareSoloMode);
  const { playClick } = useSounds();

  const handleSinglePlayerMode = () => {
    playClick();
    prepareSoloMode();
  };

  const handleQuickGameMode = () => {
    playClick();
    initQuickGameMode();
  };

  return (
    <div className="relative min-h-[80vh] overflow-hidden" data-testid="game-mode-select">
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
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
          </div>
          
          {/* Footer */}
          <motion.div 
            className="text-center text-white/40 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            The Apprentice Bingo is a fan-made game, not affiliated with The Apprentice Game Show. 2023-2025
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 