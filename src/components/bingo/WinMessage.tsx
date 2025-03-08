'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useSounds } from '@/lib/sounds';

interface WinMessageProps {
  show: boolean;
  onComplete?: () => void;
}

export function WinMessage({ show, onComplete }: WinMessageProps) {
  const { playSuccess } = useSounds();
  const [isVisible, setIsVisible] = React.useState(false);
  
  // Use a combination of props and local state for better reliability
  React.useEffect(() => {
    if (show) {
      setIsVisible(true);
      playSuccess();
      console.log("WIN MESSAGE SHOWING!");
    }
  }, [show, playSuccess]);
  
  const handleComplete = () => {
    setIsVisible(false);
    if (onComplete) {
      onComplete();
    }
  };
  
  return (
    <AnimatePresence onExitComplete={handleComplete}>
      {(show || isVisible) && (
        <motion.div 
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-black/80 absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleComplete}
          />
          
          <motion.div
            className="relative z-10 flex flex-col items-center bg-gray-900/80 p-8 rounded-xl shadow-2xl"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ 
              type: "spring", 
              damping: 15, 
              stiffness: 200 
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <Image 
                src="/images/bingo-win.jpg" 
                alt="BINGO!" 
                width={400} 
                height={300}
                className="rounded-lg shadow-xl border-4 border-amber-600"
                priority
              />
            </motion.div>
            
            <motion.h1
              className="text-5xl font-bold text-white mt-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <span className="text-amber-500">BINGO</span> WIN!
            </motion.h1>
            
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <button
                onClick={handleComplete}
                className="px-8 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors text-xl"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 