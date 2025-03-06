import type { Win } from "@/lib/types";

export function formatWinMessage(win: Win): string {
  switch (win.type) {
    case 'row_0':
      return 'Top Row Complete!';
    case 'row_1':
      return 'Middle Row Complete!';
    case 'row_2':
      return 'Bottom Row Complete!';
    case 'col_0':
      return 'Left Column Complete!';
    case 'col_1':
      return 'Middle Column Complete!';
    case 'col_2':
      return 'Right Column Complete!';
    case 'diag_1':
      return 'Diagonal (↘) Complete!';
    case 'diag_2':
      return 'Diagonal (↙) Complete!';
    case 'full_house':
      return 'FULL HOUSE!';
    default:
      if (win.type.startsWith('number_')) {
        const number = win.type.split('_')[1];
        return `${number} Squares Complete!`;
      }
      return win.message || 'Win!';
  }
} 