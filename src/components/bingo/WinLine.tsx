'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import type { Win } from '@/lib/types';

interface WinLineProps {
  win: Win | null;
}

export function WinLine({ win }: WinLineProps) {
  if (!win || !win.type || !win.squares || win.squares.length < 3) return null;

  let lineProps = {};
  
  // Set line position based on win type
  if (win.type.startsWith('row')) {
    const row = parseInt(win.type.split('_')[1]);
    lineProps = {
      className: "absolute bg-amber-400 h-1 w-0 left-0 rounded-full opacity-80 shadow-glow-sm",
      style: { top: `calc(${(row + 0.5) * 33.333}%)` },
      animate: { width: '100%' },
      transition: { duration: 0.8, ease: "easeOut" }
    };
  } else if (win.type.startsWith('col')) {
    const col = parseInt(win.type.split('_')[1]);
    lineProps = {
      className: "absolute bg-amber-400 w-1 h-0 top-0 rounded-full opacity-80 shadow-glow-sm",
      style: { left: `calc(${(col + 0.5) * 33.333}%)` },
      animate: { height: '100%' },
      transition: { duration: 0.8, ease: "easeOut" }
    };
  } else if (win.type === 'diag_1') {
    // Top-left to bottom-right
    lineProps = {
      className: "absolute bg-amber-400 h-1 w-0 opacity-80 shadow-glow-sm origin-top-left",
      style: { 
        top: '0', 
        left: '0',
        transformOrigin: 'top left',
        transform: 'rotate(45deg)',
        width: '0%',
      },
      animate: { width: '142%' }, // √2 * 100% to cover diagonal
      transition: { duration: 0.8, ease: "easeOut" }
    };
  } else if (win.type === 'diag_2') {
    // Top-right to bottom-left
    lineProps = {
      className: "absolute bg-amber-400 h-1 w-0 opacity-80 shadow-glow-sm origin-top-right",
      style: {
        top: '0',
        right: '0',
        transformOrigin: 'top right',
        transform: 'rotate(-45deg)',
        width: '0%',
      },
      animate: { width: '142%' }, // √2 * 100% to cover diagonal
      transition: { duration: 0.8, ease: "easeOut" }
    };
  } else {
    return null; // No line for full house or number wins
  }

  return <motion.div {...lineProps} />;
} 