'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSounds } from '@/lib/sounds';
import { slideInFromBottom, staggerChildren } from '@/lib/animations';

interface TeamNameCloudProps {
  onSelectName: (name: string) => void;
  selectedName: string;
}

// Team names from The Apprentice UK and US
const teamNames = [
  // UK Team Names
  { name: 'First Forte', color: 'text-amber-400' },
  { name: 'Impact', color: 'text-blue-400' },
  { name: 'Velocity', color: 'text-green-400' },
  { name: 'Invicta', color: 'text-purple-400' },
  { name: 'Stealth', color: 'text-red-400' },
  { name: 'Eclipse', color: 'text-cyan-400' },
  { name: 'Alpha', color: 'text-pink-400' },
  { name: 'Renaissance', color: 'text-indigo-400' },
  { name: 'Ignite', color: 'text-orange-400' },
  { name: 'Empire', color: 'text-emerald-400' },
  { name: 'Apollo', color: 'text-yellow-400' },
  { name: 'Synergy', color: 'text-violet-400' },
  { name: 'Venture', color: 'text-rose-400' },
  { name: 'Logic', color: 'text-lime-400' },
  { name: 'Sterling', color: 'text-teal-400' },
  { name: 'Phoenix', color: 'text-fuchsia-400' },
  { name: 'Evolve', color: 'text-amber-300' },
  { name: 'Endeavour', color: 'text-blue-300' },
  { name: 'Revolution', color: 'text-green-300' },
  { name: 'Instinct', color: 'text-purple-300' },
  { name: 'Kinetic', color: 'text-red-300' },
  { name: 'Atomic', color: 'text-cyan-300' },
  { name: 'Platinum', color: 'text-indigo-300' },
  { name: 'Odyssey', color: 'text-orange-300' },
  
  // Other names mentioned
  { name: 'Versacorp', color: 'text-emerald-300' },
  { name: 'Protégé', color: 'text-yellow-300' },
  { name: 'Mosaic', color: 'text-violet-300' },
  { name: 'Apex', color: 'text-rose-300' },
  { name: 'Capital Edge', color: 'text-lime-300' },
  { name: 'Excel', color: 'text-teal-300' },
  { name: 'Hydra', color: 'text-fuchsia-300' },
  { name: 'Athena', color: 'text-amber-200' },
  { name: 'Kotu', color: 'text-blue-200' },
  { name: 'Arrow', color: 'text-green-200' },
  { name: 'Tenacity', color: 'text-purple-200' },
  { name: 'Fortitude', color: 'text-red-200' },
];

export function TeamNameCloud({ onSelectName, selectedName }: TeamNameCloudProps) {
  const { playClick } = useSounds();
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Group team names into columns
  const groupedTeamNames = React.useMemo(() => {
    const filtered = searchTerm.trim() 
      ? teamNames.filter(team => 
          team.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : teamNames;
      
    // Create three balanced columns
    const columns: typeof teamNames[] = [[], [], []];
    filtered.forEach((team, index) => {
      columns[index % 3].push(team);
    });
    
    return columns;
  }, [searchTerm]);

  // Handle name selection
  const handleSelectName = (name: string) => {
    playClick();
    onSelectName(name);
  };

  return (
    <motion.div 
      className="w-full max-h-[450px] relative bg-gray-950 rounded-xl p-4 border border-gray-800 overflow-hidden mb-6 shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring", damping: 15 }}
    >
      <motion.div 
        className="text-sm text-gray-400 mb-4 px-2 flex items-center justify-between"
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={slideInFromBottom} className="flex items-center">
          <span className="text-amber-500 mr-2">⭐</span>
          <span>Select a team name:</span>
        </motion.div>
        
        <motion.div variants={slideInFromBottom} className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search names..."
            className="text-sm px-3 py-1 rounded bg-gray-800 border border-gray-700 focus:border-amber-500 focus:outline-none"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              ×
            </button>
          )}
        </motion.div>
      </motion.div>
      
      <div className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900 pointer-events-none z-10" />
        
        {/* Team name grid */}
        <div className="grid grid-cols-3 gap-4 overflow-y-auto max-h-[350px] pb-4 px-1">
          {groupedTeamNames.map((column, colIndex) => (
            <div key={`col-${colIndex}`} className="space-y-2">
              {column.map((team) => (
                <motion.button
                  key={team.name}
                  onClick={() => handleSelectName(team.name)}
                  className={`block w-full px-3 py-2 text-left rounded-md transition-all ${
                    selectedName === team.name 
                      ? 'bg-gray-800 shadow-md border border-amber-500/50' 
                      : 'bg-gray-900 border border-gray-800 hover:bg-gray-800'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className={`font-medium text-white ${
                    selectedName === team.name ? 'text-amber-300' : team.color
                  }`}>
                    {team.name}
                  </span>
                </motion.button>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Selection indicator with animation */}
      <AnimatePresence>
        {selectedName && (
          <motion.div 
            className="absolute bottom-4 left-0 right-0 text-center z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <motion.div 
              className="inline-block bg-gradient-to-r from-gray-800 to-gray-700 text-white px-4 py-2 rounded-full shadow-lg border border-gray-700"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
            >
              Selected: <span className="font-bold text-amber-300">{selectedName}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 