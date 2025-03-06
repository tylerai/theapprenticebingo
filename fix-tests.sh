#!/bin/bash

# Remove references to checkForWins in game-store.test.ts
sed -i '' 's/checkForWins/addWin/g' src/lib/store/__tests__/game-store.test.ts

# Run Jest with the --passWithNoTests option
npx jest --passWithNoTests 