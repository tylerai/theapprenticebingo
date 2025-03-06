'use client';

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Win } from "@/lib/types";
import { Medal, Award, Trophy, ChevronUp, ChevronDown } from "lucide-react";
import { formatWinMessage } from './utils';

interface WinsListProps {
  wins: Win[];
  className?: string;
}

export function WinsList({ wins, className = "" }: WinsListProps) {
  const [showAll, setShowAll] = React.useState(false);
  
  // Display only first 2 wins if not showing all
  const displayedWins = showAll ? wins : wins.slice(0, 2);
  const hasMoreWins = wins.length > 2;

  // Toggle function for the "+X more" button
  const toggleShowAll = () => {
    setShowAll(prev => !prev);
  };

  // Get appropriate icon for win type
  const getWinIcon = (win: Win) => {
    if (win.type === 'full_house') {
      return <Trophy className="inline mr-2 text-yellow-200" size={16} />;
    } else if (win.type.startsWith('diag')) {
      return <Award className="inline mr-2 text-yellow-200" size={16} />;
    } else {
      return <Medal className="inline mr-2 text-yellow-200" size={16} />;
    }
  };

  if (wins.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <AnimatePresence initial={false}>
        {displayedWins.map((win, idx) => (
          <motion.div 
            key={win.type}
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center shadow-sm
              ${win.type === 'full_house' 
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30' 
                : 'bg-gray-800 text-gray-300 border border-gray-700'}`}
          >
            {getWinIcon(win)}
            {formatWinMessage(win)}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* "More" button */}
      {hasMoreWins && (
        <motion.button
          onClick={toggleShowAll}
          className="w-full px-3 py-2 mt-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium
                     flex items-center justify-center border border-gray-700 text-gray-300
                     transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {showAll ? (
            <>
              <ChevronUp size={14} className="mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown size={14} className="mr-1" />
              +{wins.length - 2} more
            </>
          )}
        </motion.button>
      )}
    </div>
  );
} 