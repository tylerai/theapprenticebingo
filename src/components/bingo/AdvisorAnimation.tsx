'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/store/game-store';

interface AdvisorAnimationProps {
  type: 'lord-sugar' | 'advisor';
  variant?: string; 
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function AdvisorAnimation({ 
  type, 
  variant = '0', 
  className = '',
  size = 'medium'
}: AdvisorAnimationProps) {
  const { teamAdvisor, wins, markedSquares } = useGameStore();
  const [currentGif, setCurrentGif] = React.useState<string>('');
  
  // Map advisors to their GIFs
  const ADVISOR_GIFS = {
    'karen': ['/videos/karen-gif-1.webm', '/images/karenbrady.webp'],
    'tim': ['/images/tim-2.webp', '/images/timcambell.webp'],
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
  
  // Special states
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
  
  // Determine which GIF to show
  const getGifSource = (): string => {
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
      const staticImage = ADVISOR_GIFS[variant as keyof typeof ADVISOR_GIFS]?.[1] || '/images/alansugar.jpg';
      setImgSrc(staticImage);
    } else {
      setImgSrc('/images/alansugar.jpg');
    }
  };
  
  React.useEffect(() => {
    setImgSrc(getGifSource());
  }, [variant, type, currentGif]);
  
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {imgSrc.endsWith('.webm') ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          width={width}
          height={height}
          style={{ 
            objectFit: "cover", 
            borderRadius: size === 'small' ? '50%' : '8px',
            width,
            height 
          }}
          onError={handleError}
        >
          <source src={imgSrc} type="video/webm" />
          <Image
            src={type === 'advisor' ? ADVISOR_GIFS[variant as keyof typeof ADVISOR_GIFS]?.[1] || '/images/alansugar.jpg' : '/images/alansugar.jpg'}
            alt={type === 'lord-sugar' ? "Lord Sugar" : `Advisor ${variant}`}
            width={width}
            height={height}
            style={{ objectFit: "cover", borderRadius: size === 'small' ? '50%' : '8px' }}
          />
        </video>
      ) : (
        <Image
          src={imgSrc}
          alt={type === 'lord-sugar' ? "Lord Sugar" : `Advisor ${variant}`}
          width={width}
          height={height}
          style={{ objectFit: "cover", borderRadius: size === 'small' ? '50%' : '8px' }}
          onError={handleError}
        />
      )}
    </motion.div>
  );
} 