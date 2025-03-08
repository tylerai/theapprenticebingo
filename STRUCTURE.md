# Project Structure

```
.
├── __tests__
│   ├── multiplayer.test.js
│   ├── simple.test.js
│   └── utils.test.js
├── instance
│   └── apprentice_bingo.db
├── logs
│   └── apprentice_bingo.log
├── prisma
│   └── schema.prisma
├── public
│   ├── images
│   │   ├── alansugar.jpg
│   │   ├── alansugar2.jpg
│   │   ├── bingo-win.jpg
│   │   ├── claude.jpg
│   │   ├── favicon.ico
│   │   ├── karenbrady.webp
│   │   ├── margaret.jpeg
│   │   ├── nick.jpg
│   │   ├── pattern.svg
│   │   ├── skylinebackground.jpg
│   │   ├── team.jpg
│   │   ├── theapprenticescreen.jpeg
│   │   ├── tim-2.webp
│   │   ├── timcambell.webp
│   │   ├── youre-fired-new.jpg
│   │   └── youre-fired.jpg
│   ├── sounds
│   │   ├── original
│   │   │   ├── click.wav
│   │   │   └── win.ogg
│   │   ├── README.md
│   │   ├── bingo-win.mp3
│   │   ├── click.mp3
│   │   ├── click.wav
│   │   ├── notification.mp3
│   │   ├── success.mp3
│   │   └── youre-fired.mp3
│   ├── videos
│   │   ├── alan-sugar-gif-1.webm
│   │   ├── alan-sugar-gif-2.webm
│   │   ├── alan-sugar-gif-3.webm
│   │   ├── alan-sugar-gif-4.webm
│   │   ├── alan-sugar-gif-5.webm
│   │   ├── alan-sugar-gif-6.webm
│   │   ├── claude-gif-1.webm
│   │   ├── claude-gif-2.webm
│   │   ├── karen-gif-1.webm
│   │   ├── karen-gif-2.webm
│   │   └── nick-gif-1.webm
│   ├── favicon.ico
│   └── favicon.svg
├── src
│   ├── app
│   │   ├── __tests__
│   │   │   └── page.test.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── bingo
│   │   │   ├── __tests__
│   │   │   │   ├── BingoGrid.test.tsx
│   │   │   │   ├── BingoSquare.test.tsx
│   │   │   │   ├── GameControls.test.tsx
│   │   │   │   ├── GameModeSelect.test.tsx
│   │   │   │   ├── GameModeSelector.test.tsx
│   │   │   │   └── TeamSelector.test.tsx
│   │   │   ├── AdvisorAnimation.tsx
│   │   │   ├── ApprenticeFacts.tsx
│   │   │   ├── BingoGrid.tsx
│   │   │   ├── BingoSquare.tsx
│   │   │   ├── FiredAnimation.tsx
│   │   │   ├── GameControls.tsx
│   │   │   ├── GameModeSelect.tsx
│   │   │   ├── GameModeSelector.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   ├── TeamNameCloud.tsx
│   │   │   ├── TeamSelector.tsx
│   │   │   ├── WinLine.tsx
│   │   │   ├── WinMessage.tsx
│   │   │   ├── WinningAnimation.tsx
│   │   │   ├── WinsList.tsx
│   │   │   └── utils.ts
│   │   └── ui
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── input.tsx
│   ├── lib
│   │   ├── __tests__
│   │   │   ├── simple.test.js
│   │   │   └── utils.test.ts
│   │   ├── store
│   │   │   ├── __tests__
│   │   │   │   └── game-store.test.ts
│   │   │   ├── game-store.ts
│   │   │   └── index.ts
│   │   ├── types
│   │   │   └── index.ts
│   │   ├── animations.ts
│   │   ├── data.ts
│   │   ├── facts.ts
│   │   ├── index.ts
│   │   ├── sounds.ts
│   │   ├── types.ts
│   │   ├── utils.test.js
│   │   ├── utils.test.ts
│   │   └── utils.ts
│   └── types
│       └── jest.d.ts
├── LICENSE
├── README.md
├── STRUCTURE.md
├── TESTING.md
├── app_output.log
├── babel.config.js
├── deploy.sh
├── deployment.md
├── fix-tests.sh
├── generate-qr.js
├── guide.md
├── jest.config.js
├── jest.setup.js
├── jsconfig.json
├── multiplayer.test.js
├── next-env.d.ts
├── next.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── simple.test.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.server.json
├── utils.test.js
├── vercel-build.js
├── vercel-build.js.bak
└── vercel.json

23 directories, 117 files
```
