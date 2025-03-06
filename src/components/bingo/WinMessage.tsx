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
  
  React.useEffect(() => {
    if (show) {
      playSuccess();
    }
  }, [show, playSuccess]);
  
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center"
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
            onClick={onComplete}
          />
          
          <motion.div
            className="relative z-10 flex flex-col items-center"
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
                onClick={onComplete}
                className="px-8 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
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