# Apprentice Bingo

A fun, interactive game based on The Apprentice TV show. Play along while watching the show and mark events as they happen!

## Features

- 3x3 bingo card with randomized events from The Apprentice
- Interactive animations with Lord Sugar and his advisors
- Fun facts about the show
- Win animations and sound effects
- Responsive design for both desktop and mobile

## Technology Stack

- Next.js
- React
- TypeScript
- Zustand for state management
- Tailwind CSS with Shadcn UI components
- Framer Motion for animations

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Testing

The application includes a comprehensive test suite using Jest and React Testing Library.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

Tests are organized in `__tests__` directories alongside the components or modules they test:

- Component tests: `src/components/bingo/__tests__/`
- Store tests: `src/lib/store/__tests__/`
- Page tests: `src/app/__tests__/`

For more detailed information about testing, see [TESTING.md](TESTING.md).

## Game Rules

1. Start a new game
2. Events will be randomly placed on your bingo card
3. Mark events as they happen during the show
4. Complete a row, column, or diagonal to win!

## Credits

- All Apprentice-related content belongs to their respective owners
- Created with ❤️ for fans of The Apprentice 