'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/store/game-store';

interface AdvisorAnimationProps {
  type?: 'lord-sugar' | 'advisor';
  variant?: string; 
  size?: 'small' | 'medium' | 'large';
  className?: string;
  forceVideo?: boolean;
  advisor?: string;
  animate?: boolean;
}

// Function to get advisor name
function getAdvisorName(advisorId: string): string {
  switch (advisorId) {
    case 'karen':
      return 'Karen Brady';
    case 'tim':
      return 'Tim Campbell';
    case 'claude':
      return 'Claude Littner';
    case 'nick':
      return 'Nick Hewer';
    case 'margaret':
      return 'Margaret Mountford';
    default:
      return 'Karen Brady';
  }
}

// Function to get advisor image
function getAdvisorImage(advisorId: string): string {
  switch (advisorId) {
    case 'karen':
      return '/images/karenbrady.webp';
    case 'tim':
      return '/images/timcambell.webp';
    case 'claude':
      return '/images/claude.jpg';
    case 'nick':
      return '/images/nick.jpg';
    case 'margaret':
      return '/images/margaret.jpeg';
    default:
      return '/images/karenbrady.webp';
  }
}

export function AdvisorAnimation({ 
  type = 'advisor', 
  variant = '0', 
  className = '',
  size = 'medium',
  forceVideo = false,
  advisor,
  animate = false
}: AdvisorAnimationProps) {
  // Simple compatibility mode for vercel-build.js implementation
  // If only advisor prop is provided (no explicit type prop), use the simplified rendering
  if (advisor && (!type || type === 'advisor')) {
    return (
      <div className={`relative w-full aspect-square flex items-center justify-center overflow-hidden rounded-full border-4 border-amber-500 bg-gray-900 shadow-lg ${className}`}>
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="overflow-hidden rounded-full w-full h-full relative">
            <Image
              src={getAdvisorImage(advisor)}
              alt={`Advisor ${getAdvisorName(advisor)}`}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        </div>
      </div>
    );
  }

  const teamAdvisor = useGameStore(state => state.teamAdvisor as string | null);
  const wins = useGameStore(state => state.wins as any[]);
  const markedSquares = useGameStore(state => state.markedSquares as [number, number][]);
  const [currentGif, setCurrentGif] = React.useState<string>('');
  const [lastInteractionTime, setLastInteractionTime] = React.useState<number>(Date.now());
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  
  // Map advisors to their GIFs and static images
  const ADVISOR_GIFS = {
    'karen': ['/videos/karen-gif-1.webm', '/images/karenbrady.webp'],
    'tim': ['/videos/tim-gif-1.webm', '/images/timcambell.webp'],
    'claude': ['/videos/claude-gif-1.webm', '/images/claude.jpg'],
    'nick': ['/videos/nick-gif-1.webm', '/images/nick.jpg'],
    'margaret': ['/images/margaret.jpeg'],
  };
  
  // Lord Sugar GIFs for different game states
  const LORD_SUGAR_GIFS = [
    '/images/alansugar.jpg',
    '/videos/alan-sugar-gif-1.webm',
    '/videos/alan-sugar-gif-2.webm',
    '/videos/alan-sugar-gif-3.webm',
    '/videos/alan-sugar-gif-4.webm',
    '/videos/alan-sugar-gif-5.webm',
  ];
  
  // Lord Sugar Videos only (for forceVideo parameter)
  const LORD_SUGAR_VIDEOS = [
    '/videos/alan-sugar-gif-1.webm',
    '/videos/alan-sugar-gif-2.webm',
    '/videos/alan-sugar-gif-3.webm',
    '/videos/alan-sugar-gif-4.webm',
    '/videos/alan-sugar-gif-5.webm',
  ];
  
  // Lord Sugar Videos only (for forceVideo parameter)
  const LORD_SUGAR_SPECIAL_STATES = {
    'first_win': '/videos/alan-sugar-gif-3.webm',
    'multiple_wins': '/videos/alan-sugar-gif-5.webm',
    'game_over': '/videos/alan-sugar-gif-2.webm', // Changed from gif-6 since it was problematic
  };
  
  React.useEffect(() => {
    if (type === 'lord-sugar') {
      // Log for debugging
      console.log('AdvisorAnimation: markedSquares changed', markedSquares);
      
      // Always cycle through Lord Sugar GIFs based on marked squares count
      // This ensures a new GIF is shown every time a square is marked
      const gifIndex = markedSquares.length % LORD_SUGAR_GIFS.length;
      const newGif = LORD_SUGAR_GIFS[gifIndex];
      
      // Set the GIF immediately
      setImgSrc(newGif);
      setCurrentGif(newGif);
    }
  }, [type, markedSquares.length]);
  
  // Separate effect for win states
  React.useEffect(() => {
    if (type === 'lord-sugar' && wins.length > 0) {
      // For special win states, use the appropriate GIF
      let winGif = '';
      if (wins.length >= 3) {
        winGif = LORD_SUGAR_SPECIAL_STATES.game_over;
      } else if (wins.length > 1) {
        winGif = LORD_SUGAR_SPECIAL_STATES.multiple_wins;
      } else if (wins.length === 1) {
        winGif = LORD_SUGAR_SPECIAL_STATES.first_win;
      }
      
      if (winGif) {
        setImgSrc(winGif);
        setCurrentGif(winGif);
        
        // After showing the win animation, revert to cycling based on marked squares
        const timeout = setTimeout(() => {
          const gifIndex = markedSquares.length % LORD_SUGAR_GIFS.length;
          setImgSrc(LORD_SUGAR_GIFS[gifIndex]);
          setCurrentGif(LORD_SUGAR_GIFS[gifIndex]);
        }, 3000);
        
        return () => clearTimeout(timeout);
      }
    }
  }, [type, wins.length]);
  
  // Set up one-minute timer for cycling Lord Sugar GIFs when no interaction
  React.useEffect(() => {
    if (type === 'lord-sugar') {
      // Update the last interaction time when squares are marked
      setLastInteractionTime(Date.now());
      
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Set up a new timer to check for inactivity and cycle GIFs
      timerRef.current = setInterval(() => {
        const currentTime = Date.now();
        // If no interaction for a minute, cycle to next GIF
        if (currentTime - lastInteractionTime >= 60000) {
          const currentIndex = LORD_SUGAR_GIFS.indexOf(currentGif);
          const nextIndex = (currentIndex + 1) % LORD_SUGAR_GIFS.length;
          const newGif = LORD_SUGAR_GIFS[nextIndex];
          
          setImgSrc(newGif);
          setCurrentGif(newGif);
          setLastInteractionTime(currentTime); // Reset the timer
        }
      }, 60000);
      
      // Cleanup interval on unmount
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [type, markedSquares.length, currentGif, lastInteractionTime]);
  
  // Determine which GIF to show
  const getGifSource = (): string => {
    // If direct advisor prop is provided, use it first
    if (type === 'advisor' && advisor) {
      if (ADVISOR_GIFS[advisor as keyof typeof ADVISOR_GIFS]) {
        // Get the specific GIF for the advisor based on direct advisor prop
        const advisorGifs = ADVISOR_GIFS[advisor as keyof typeof ADVISOR_GIFS];
        // Use WebM if available, otherwise fallback to static image
        return advisorGifs[0] || advisorGifs[1] || '/images/alansugar.jpg';
      }
    }
    
    // Otherwise proceed with variant logic
    if (type === 'advisor') {
      if (variant && ADVISOR_GIFS[variant as keyof typeof ADVISOR_GIFS]) {
        // Get the specific GIF for the advisor based on variant
        const advisorGifs = ADVISOR_GIFS[variant as keyof typeof ADVISOR_GIFS];
        // Use WebM if available, otherwise fallback to static image
        return advisorGifs[0] || advisorGifs[1] || '/images/alansugar.jpg';
      } 
      // Default to a static image if no valid variant
      return '/images/alansugar.jpg';
    } else {
      // For Lord Sugar, use the current GIF state or cycle based on marked squares
      if (forceVideo) {
        // If forceVideo is true, only use videos
        const videoIndex = markedSquares.length % LORD_SUGAR_VIDEOS.length;
        return LORD_SUGAR_VIDEOS[videoIndex];
      }
      
      if (currentGif) {
        return currentGif;
      }
      
      // Default to first GIF or cycle based on marked squares
      const gifIndex = markedSquares.length % LORD_SUGAR_GIFS.length;
      return LORD_SUGAR_GIFS[gifIndex];
    }
  };
  
  // Determine dimensions based on size
  const getDimensions = () => {
    switch (size) {
      case 'small':
        return { width: 80, height: 80 };
      case 'large':
        return { width: 200, height: 200 };
      default:
        return { width: 120, height: 120 };
    }
  };
  
  const { width, height } = getDimensions();
  
  // Fallback handling for file not found
  const [imgSrc, setImgSrc] = React.useState<string>(getGifSource());
  const handleError = () => {
    // If image fails to load, try using a static fallback
    if (type === 'advisor') {
      const currentAdvisor = advisor || variant;
      const staticImage = ADVISOR_GIFS[currentAdvisor as keyof typeof ADVISOR_GIFS]?.[1] || '/images/alansugar.jpg';
      setImgSrc(staticImage);
    } else {
      setImgSrc('/images/alansugar.jpg');
    }
  };
  
  React.useEffect(() => {
    setImgSrc(getGifSource());
  }, [variant, type, currentGif, advisor]);
  
  // Original component rendering
  return (
    <div className={className}>
      {imgSrc.endsWith('.webm') ? (
        // Render WebM as video
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-lg overflow-hidden bg-black relative"
          style={{ width, height }}
        >
          <video
            src={imgSrc}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            onError={handleError}
          />
        </motion.div>
      ) : (
        // Render static image
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`rounded-lg overflow-hidden relative ${type === 'advisor' ? 'rounded-full' : ''}`}
          style={{ width, height }}
        >
          <div className="w-full h-full relative">
            <Image
              src={type === 'advisor' ? 
                (advisor ? getAdvisorImage(advisor) : ADVISOR_GIFS[variant as keyof typeof ADVISOR_GIFS]?.[1] || '/images/alansugar.jpg') : 
                '/images/alansugar.jpg'}
              alt={type === 'lord-sugar' ? "Lord Sugar" : `Advisor ${advisor || variant}`}
              fill
              className="object-cover object-center"
              onError={handleError}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        </motion.div>
      )}
    </div>
  );
} 