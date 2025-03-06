'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSounds } from '@/lib/sounds';
import confetti from 'canvas-confetti';

interface WinningAnimationProps {
  isVisible: boolean;
  onClose: () => void;
}

export function WinningAnimation({ isVisible, onClose }: WinningAnimationProps) {
  const { playBingo } = useSounds();
  const [phrase, setPhrase] = React.useState('');
  
  const winningPhrases = [
    "BINGO CHAMPION!",
    "ABSOLUTELY BRILLIANT!",
    "TASK COMPLETED!",
    "WINNER WINNER!",
    "BOARDROOM MASTER!",
    "PROJECT MANAGER MATERIAL!",
    "CEO MATERIAL!",
    "BUSINESS SUPERSTAR!",
    "APPRENTICE STAR!",
    "DEAL MAKER!",
    "BUSINESS GENIUS!",
    "PERFECT STRATEGY!"
  ];
  
  // Play sound and trigger confetti when animation becomes visible
  React.useEffect(() => {
    if (isVisible) {
      // Play sound
      playBingo();
      
      // Set random phrase
      setPhrase(winningPhrases[Math.floor(Math.random() * winningPhrases.length)]);
      
      // Trigger confetti explosion
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Create confetti bursts from different angles
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);
      
      // Automatically close after 6 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 6000);
      
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [isVisible, onClose, playBingo]);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background with radial gradient */}
          <motion.div 
            className="absolute inset-0 bg-gradient-radial from-amber-500/60 to-amber-900/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Main content */}
          <motion.div
            className="relative z-10 max-w-3xl w-full mx-4 flex flex-col items-center justify-center"
            initial={{ scale: 0.5, y: 100 }}
            animate={{ 
              scale: 1, 
              y: 0,
              transition: { type: "spring", damping: 12, stiffness: 200 }
            }}
            exit={{ scale: 0.5, y: 100, opacity: 0, transition: { duration: 0.3 } }}
          >
            {/* Trophy icon */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ 
                y: 0, 
                opacity: 1,
                transition: { delay: 0.3, duration: 0.5 }
              }}
              className="text-9xl text-yellow-300 mb-6"
            >
              🏆
            </motion.div>
            
            {/* Main text */}
            <motion.div
              className="bg-gradient-to-r from-amber-500 to-yellow-500 p-8 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.8)] text-center transform"
              animate={{
                boxShadow: [
                  '0 0 40px rgba(245,158,11,0.8)',
                  '0 0 70px rgba(245,158,11,0.9)',
                  '0 0 40px rgba(245,158,11,0.8)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.h2 
                className="text-4xl md:text-6xl font-bold text-white mb-4"
                animate={{ 
                  scale: [1, 1.1, 1],
                  textShadow: [
                    '0 0 0px rgba(255,255,255,0)',
                    '0 0 15px rgba(255,255,255,0.8)',
                    '0 0 0px rgba(255,255,255,0)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                {phrase}
              </motion.h2>
              
              <motion.p 
                className="text-xl text-white/90 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.5 } }}
              >
                You've dominated the boardroom challenge!
              </motion.p>
            </motion.div>
            
            {/* Stars floating around */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-4xl text-yellow-300"
                initial={{ 
                  x: (Math.random() - 0.5) * 300, 
                  y: (Math.random() - 0.5) * 300,
                  opacity: 0
                }}
                animate={{ 
                  x: (Math.random() - 0.5) * 300, 
                  y: (Math.random() - 0.5) * 300,
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              >
                {['✨', '⭐', '🌟'][Math.floor(Math.random() * 3)]}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 