'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apprenticeFacts } from '@/lib/facts';
import { motion, AnimatePresence } from 'framer-motion';
import { useSounds } from '@/lib/sounds';
import { Button } from '@/components/ui/button';
import { fadeIn, slideInFromBottom } from '@/lib/animations';

export function ApprenticeFacts() {
  const [factIndex, setFactIndex] = React.useState<number>(0);
  const [factHistory, setFactHistory] = React.useState<number[]>([]);
  const [isManualChange, setIsManualChange] = React.useState(false);
  const { playClick, playNotification } = useSounds();
  
  // Generate a random fact that hasn't been shown recently
  const getRandomFact = React.useCallback(() => {
    const recentFacts = factHistory.slice(-5); // Keep track of the last 5 facts
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * apprenticeFacts.length);
    } while (recentFacts.includes(randomIndex));
    
    setFactIndex(randomIndex);
    setFactHistory(prev => [...prev, randomIndex]);
    playNotification();
    setIsManualChange(true);
  }, [factHistory, playNotification]);

  // Timer progress state
  const [progress, setProgress] = React.useState(100);
  
  // Set up the timer for fact rotation
  React.useEffect(() => {
    // Set initial fact if we don't have one yet
    if (factHistory.length === 0) {
      getRandomFact();
    }

    // Reset progress when fact changes
    setProgress(100);
    
    // Set up a timer that updates every second
    const timerInterval = setInterval(() => {
      setProgress(prev => {
        // If manually changed, reset to 100
        if (isManualChange) {
          setIsManualChange(false);
          return 100;
        }
        
        // Decrease by 1.67 to complete in 60 seconds
        const newProgress = prev - 1.67;
        if (newProgress <= 0) {
          getRandomFact();
          return 100;
        }
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [getRandomFact, isManualChange]);

  return (
    <Card 
      className="overflow-hidden relative bg-gradient-to-br from-gray-900 to-gray-950 shadow-xl border-amber-800/30"
    >
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_500px_at_50%_40%,#3b3b3b,transparent)]"
        style={{ backgroundSize: '30px 30px', maskImage: 'radial-gradient(circle, white, black)' }}
      />
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-amber-500/5 to-transparent" />
      
      <CardHeader className="relative z-10 border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center gap-2">
            <span className="text-amber-500">🎬</span> 
            <span className="text-white">Apprentice Facts</span>
          </CardTitle>
        </div>
        
        {/* Progress bar */}
        <div className="h-1 w-full bg-gray-800 mt-2 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-amber-500"
            style={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={factIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-3"
          >
            <div className="text-3xl text-amber-500 opacity-70">"</div>
            <p className="text-gray-200 italic leading-relaxed min-h-[4rem]">
              {apprenticeFacts[factIndex]}
            </p>
            <div className="text-3xl text-amber-500 opacity-70 self-end">"</div>
          </motion.div>
        </AnimatePresence>
        
        {/* Static Fact controls */}
        <div className="flex justify-center mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-gray-800/70 hover:bg-gray-700/70 border-amber-800/30 text-amber-300 hover:text-amber-200"
            onClick={() => {
              playClick();
              getRandomFact();
            }}
          >
            New Fact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 