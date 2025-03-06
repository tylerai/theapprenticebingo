'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useSounds } from '@/lib/sounds';

interface FiredAnimationProps {
  isVisible: boolean;
  onClose: () => void;
}

export function FiredAnimation({ isVisible, onClose }: FiredAnimationProps) {
  const { playFired } = useSounds();
  const [imageError, setImageError] = React.useState(false);
  
  // Play the sound when the animation becomes visible
  React.useEffect(() => {
    if (isVisible) {
      playFired();
      // Automatically close after 4 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, playFired]);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Fired content */}
          <motion.div
            className="relative z-10 max-w-lg w-full mx-4"
            initial={{ scale: 0.5, y: 100 }}
            animate={{ 
              scale: 1, 
              y: 0,
              transition: { 
                type: "spring", 
                damping: 12, 
                stiffness: 200 
              }
            }}
            exit={{ 
              scale: 0.5, 
              y: 100, 
              opacity: 0,
              transition: { duration: 0.3 } 
            }}
          >
            <div className="relative overflow-hidden rounded-lg shadow-[0_0_30px_10px_rgba(220,38,38,0.5)]">
              <Image
                src={imageError ? "/images/alansugar.jpg" : "/images/youre-fired.jpg"}
                alt="You're Fired!"
                width={800}
                height={450}
                className="w-full"
                priority
                onError={() => setImageError(true)}
              />
              
              {/* Overlay text */}
              <motion.div 
                className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-red-900/90 to-transparent p-4 text-center"
                initial={{ y: 100 }}
                animate={{ 
                  y: 0,
                  transition: { 
                    delay: 0.3,
                    duration: 0.5 
                  }
                }}
              >
                <motion.h2 
                  className="text-3xl font-bold text-white mb-2"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    textShadow: [
                      "0 0 0px rgba(255,255,255,0)", 
                      "0 0 10px rgba(255,255,255,0.8)", 
                      "0 0 0px rgba(255,255,255,0)"
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  YOU'RE FIRED!
                </motion.h2>
                <p className="text-white/80">Better luck in the boardroom next time!</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 