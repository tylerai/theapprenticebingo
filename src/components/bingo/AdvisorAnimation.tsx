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
  forceVideo?: boolean;
  advisor?: string;
  animate?: boolean;
}

export function AdvisorAnimation({ 
  type, 
  variant = '0', 
  className = '',
  size = 'medium',
  forceVideo = false,
  advisor,
  animate = true
}: AdvisorAnimationProps) {
  const { teamAdvisor, wins, markedSquares } = useGameStore();
  const [currentGif, setCurrentGif] = React.useState<string>('');
  
  // Map advisors to their GIFs and static images
  const ADVISOR_GIFS = {
    'karen': ['/videos/karen-gif-1.webm', '/images/advisors/karen.png'],
    'tim': ['/videos/tim-gif-1.webm', '/images/advisors/tim.png'],
    'claude': ['/videos/claude-gif-1.webm', '/images/advisors/claude.png'],
    'nick': ['/videos/nick-gif-1.webm', '/images/advisors/nick.png'],
    'margaret': ['/images/advisors/margaret.png'],
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
  
  // Function to get advisor name (for legacy compatibility)
  const getAdvisorName = () => {
    const currentAdvisor = advisor || variant;
    switch (currentAdvisor) {
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
  };
  
  // Function to get advisor image (for legacy compatibility)
  const getAdvisorImage = () => {
    const currentAdvisor = advisor || variant;
    switch (currentAdvisor) {
      case 'karen':
        return '/images/advisors/karen.png';
      case 'tim':
        return '/images/advisors/tim.png';
      case 'claude':
        return '/images/advisors/claude.png';
      case 'nick':
        return '/images/advisors/nick.png';
      case 'margaret':
        return '/images/advisors/margaret.png';
      default:
        return '/images/advisors/karen.png';
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
  
  // Simple advisor rendering for compatibility with vercel-build.js implementation
  if (advisor && type === 'advisor') {
    return (
      <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden rounded-full border-4 border-amber-500 bg-gray-900 shadow-lg">
        <motion.div
          initial={animate ? { scale: 0.9, y: 10 } : { scale: 1 }}
          animate={animate ? { 
            scale: [0.9, 1, 0.9],
            y: [10, 0, 10]
          } : { scale: 1 }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="relative w-full h-full flex items-center justify-center"
        >
          <div className="overflow-hidden rounded-full w-full h-full relative">
            <Image
              src={getAdvisorImage()}
              alt={`Advisor ${getAdvisorName()}`}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        </motion.div>
      </div>
    );
  }
  
  // Original component rendering
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background blur for consistency */}
      <div 
        className="absolute inset-0 bg-cover bg-center blur-sm opacity-40 scale-110 z-0"
        style={{ backgroundImage: `url(${imgSrc})` }}
      />
      
      {/* Overlay gradient for consistency */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-gray-900/20 z-10" />
      
      {/* Main content */}
      <div className="relative z-0">
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
              borderRadius: type === 'advisor' ? '50%' : '8px',
              width,
              height,
              position: 'relative',
              zIndex: 5
            }}
            onError={handleError}
          >
            <source src={imgSrc} type="video/webm" />
            <Image
              src={type === 'advisor' ? 
                (advisor ? getAdvisorImage() : ADVISOR_GIFS[variant as keyof typeof ADVISOR_GIFS]?.[1] || '/images/alansugar.jpg') : 
                '/images/alansugar.jpg'}
              alt={type === 'lord-sugar' ? "Lord Sugar" : `Advisor ${variant}`}
              width={width}
              height={height}
              style={{ objectFit: "cover", borderRadius: type === 'advisor' ? '50%' : '8px' }}
            />
          </video>
        ) : (
          <Image
            src={imgSrc}
            alt={type === 'lord-sugar' ? "Lord Sugar" : `Advisor ${advisor || variant}`}
            width={width}
            height={height}
            style={{ 
              objectFit: "cover", 
              borderRadius: type === 'advisor' ? '50%' : '8px',
              position: 'relative',
              zIndex: 5
            }}
            onError={handleError}
          />
        )}
      </div>
      
      {/* Subtle shine effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent z-20 pointer-events-none"
      />
    </motion.div>
  );
} 