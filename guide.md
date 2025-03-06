# THE APPRENTICE Bingo - Player Guide

Welcome to THE APPRENTICE Bingo! This guide will help you understand how to play the game, including both single-player and multiplayer modes.

## Table of Contents
- [Getting Started](#getting-started)
- [Single Player Mode](#single-player-mode)
- [Multiplayer Mode](#multiplayer-mode)
  - [Creating a Game](#creating-a-game)
  - [Joining a Game](#joining-a-game)
  - [Playing Together](#playing-together)
- [Game Features](#game-features)
  - [Bingo Card](#bingo-card)
  - [Marking Squares](#marking-squares)
  - [Winning Combinations](#winning-combinations)
  - [Leaderboard](#leaderboard)
  - [Advisors](#advisors)
- [Tips and Strategies](#tips-and-strategies)
- [Troubleshooting](#troubleshooting)
- [Deployment Information](#deployment-information)

## Getting Started

THE APPRENTICE Bingo is a game designed to be played while watching episodes of The Apprentice. Each square on the bingo card contains a common scenario or phrase that might occur during an episode. When you spot one of these scenarios happening in the show, mark that square on your card!

## Single Player Mode

1. Visit the homepage and click "Play Solo"
2. Enter your team name
3. Select your advisor (Karen Brady, Tim Campbell, or Lord Sugar)
4. Click "Start Game" to begin
5. Mark squares as you spot scenarios during the show
6. Get 3 squares in a row (horizontal, vertical, or diagonal) to win!

## Multiplayer Mode

Multiplayer mode allows you to play with friends while watching the show together, either in person or remotely.

### Creating a Game

1. From the homepage, click "Create Game"
2. Fill in the following details:
   - **Game Name**: A name for your game session
   - **Game Password**: A password that others will need to join
   - **Your Team Name**: What you want your team to be called
   - **Advisor**: Choose Karen Brady, Tim Campbell, or Lord Sugar as your advisor
3. Click "Create Game"
4. You'll be given a **Game ID** - share this and the password with friends who want to join

### Joining a Game

1. From the homepage, click "Join Game"
2. Enter the following details:
   - **Game ID**: The ID provided by the game creator
   - **Game Password**: The password set by the game creator
   - **Your Team Name**: Choose a unique team name (different from other players)
   - **Advisor**: Choose Karen Brady, Tim Campbell, or Lord Sugar as your advisor
3. Click "Join Game"

### Playing Together

In multiplayer mode:
- All players see the same bingo card
- Each team marks squares independently
- When a team gets a winning combination, all players are notified
- The leaderboard shows which teams have won
- You can continue playing after someone wins to see who gets the most winning combinations

## Game Features

### Bingo Card

- The bingo card consists of 9 squares (3×3 grid)
- Each square contains a common Apprentice scenario
- The center square is a "FREE" space in some game modes

### Marking Squares

- Click on a square to mark it when you see that scenario happen in the show
- Click again to unmark if you made a mistake
- You can also use the "Reset My Marks" button to clear all your marks

### Winning Combinations

A winning combination is 3 squares in a row:
- Horizontal (any row)
- Vertical (any column)
- Diagonal (top-left to bottom-right or top-right to bottom-left)

### Leaderboard

In multiplayer games, the leaderboard shows:
- All teams in the game
- Which teams have achieved winning combinations
- The time each team got their winning combination

### Advisors

Your chosen advisor (Karen Brady, Tim Campbell, or Lord Sugar) represents your team in the game. Each advisor has:
- A unique profile picture shown on the leaderboard
- A brief description visible in your game dashboard

## Tips and Strategies

1. **Watch Carefully**: Pay close attention to the show to spot scenarios quickly
2. **Be Strategic**: Focus on rows or columns that have the most likely scenarios
3. **Don't Rush**: Make sure the scenario actually happened before marking a square
4. **Have Fun**: The game is meant to enhance your viewing experience!

## Troubleshooting

**Can't Join a Game?**
- Double-check the Game ID and password
- Make sure you're using a unique team name
- Refresh the page and try again

**Game Not Loading?**
- Check your internet connection
- Clear your browser cache
- Try using a different browser

**Other Issues?**
- Contact support at [support@apprenticebingo.com](mailto:support@apprenticebingo.com)

## Deployment Information

### About Deployment

THE APPRENTICE Bingo is a Flask-based web application that requires a server to run. Here's what you need to know about deployment:

### Can I Use Vercel?

**No, Vercel is not recommended** for this application because:

1. This is a Flask application with server-side functionality, not a static site or serverless function
2. The multiplayer features require persistent connections and database access
3. Vercel is primarily designed for frontend applications and serverless functions

### Recommended Deployment Options

For proper functionality, especially for multiplayer features, we recommend:

1. **Traditional Web Hosting**:
   - Platforms like Heroku, DigitalOcean, or AWS Elastic Beanstalk
   - These support Flask applications with persistent server processes

2. **Virtual Private Server (VPS)**:
   - Services like DigitalOcean Droplets, Linode, or AWS EC2
   - Gives you full control over the server environment
   - Requires more technical knowledge to set up

3. **Platform as a Service (PaaS)**:
   - Heroku, PythonAnywhere, or Google App Engine
   - Easier to deploy but may have limitations on free tiers

### Deployment Requirements

For the application to work properly when deployed:

1. **Database**: The application needs a database to store game data
2. **Environment Variables**: Set up environment variables for configuration
3. **WSGI Server**: Use Gunicorn or uWSGI in production (not Flask's development server)
4. **Persistent Process**: The server needs to run continuously
5. **Domain Name**: Optionally, set up a custom domain name

### Quick Deployment Guide

1. Choose a hosting provider (e.g., Heroku)
2. Set up a database (PostgreSQL recommended)
3. Configure environment variables
4. Deploy the application code
5. Set up a production WSGI server
6. Configure your domain (optional)

Detailed deployment instructions for specific platforms can be found in the project's `deployment.md` file. 