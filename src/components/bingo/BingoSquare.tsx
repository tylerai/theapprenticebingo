'use client';

import * as React from "react";
import { useGameStore } from "@/lib/store/game-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useSounds } from "@/lib/sounds";

interface BingoSquareProps {
  index: number;
  content: string;
  isSelected: boolean;
  isLocked: boolean;
  isWinning?: boolean;
}

export function BingoSquare({ index, content, isSelected, isLocked, isWinning = false }: BingoSquareProps) {
  const toggleSquare = useGameStore(state => state.toggleSquare);
  const row = Math.floor(index / 3);
  const col = index % 3;
  const { playClick } = useSounds();

  const handleClick = React.useCallback(() => {
    if (!isLocked) {
      playClick();
      toggleSquare(row, col);
    }
  }, [isLocked, toggleSquare, row, col, playClick]);

  return (
    <motion.button
      onClick={handleClick}
      disabled={isLocked}
      whileTap={{ scale: isLocked ? 1 : 0.95 }}
      whileHover={!isLocked ? { scale: 1.03 } : {}}
      animate={{ 
        scale: isWinning ? [1, 1.1, 1] : 1,
        boxShadow: isWinning ? [
          "0 0 0 rgba(212, 175, 55, 0)",
          "0 0 20px rgba(212, 175, 55, 0.7)",
          "0 0 0 rgba(212, 175, 55, 0)"
        ] : "none"
      }}
      transition={{ 
        duration: isWinning ? 0.8 : 0.2,
        repeat: isWinning ? 3 : 0,
        repeatType: "loop"
      }}
      className={cn(
        "relative w-full aspect-square px-2 py-3 rounded-lg text-sm md:text-base font-medium transition-all duration-200",
        "flex items-center justify-center",
        "shadow-md bg-opacity-90 backdrop-blur-sm",
        isSelected 
          ? "bg-gradient-to-br from-amber-300 to-amber-500 text-black" 
          : "bg-gradient-to-br from-gray-700 to-gray-900 text-white hover:from-gray-600 hover:to-gray-800",
        isLocked && "cursor-not-allowed opacity-70",
        isWinning && "z-10"
      )}
    >
      {/* Content */}
      <div className="text-center px-1 flex-1 flex items-center justify-center min-h-[5rem] text-sm sm:text-base">
        {content}
      </div>
      
      {/* Checkmark overlay */}
      {isSelected && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-0.5 z-10"
        >
          <Check size={16} className="text-white" />
        </motion.div>
      )}
    </motion.button>
  );
} 