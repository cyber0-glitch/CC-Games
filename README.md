# Chop Chop Axe Throwing Games

Interactive web-based axe throwing games designed for Chop Chop Axe Throwing Bar in Skopje, Macedonia.

## Overview

This application provides 8 different axe throwing games that run on Android tablets connected to projectors. Players manually click on the tablet to mark where their axe hit the projected target.

## Features

- **8 Different Games**: Classic Bullseye, Around the World, Tic-Tac-Toe, Target Practice, Zombie Hunt, Connect Four, 21 Game, and Knockout
- **Multi-Player Support**: 1-8 players per game
- **Touch-Optimized**: Designed specifically for tablet touchscreens
- **Projector-Friendly**: High-contrast visuals that project well
- **Score Tracking**: Automatic scoring and winner determination
- **Undo Functionality**: Undo last action if mistakes are made

## Installation

1. Clone this repository to your Android tablet or web server
2. Open `index.html` in a web browser (Chrome recommended)
3. Connect tablet to projector
4. Start playing!

## How to Use

1. **Select a Game** from the main menu
2. **Set Up Players** - Choose number of players (1-8) and enter names
3. **Play the Game** - Click on the screen where the axe hit
4. **View Results** - Winners are displayed at the end

## Games Description

### 1. Classic Bullseye 🎯
Hit the center for maximum points. Each player gets 5 throws.
- Bullseye (50 pts) - Gold center
- 25 pts - Red ring
- 15 pts - White ring
- 10 pts - Black ring
- 5 pts - Orange ring
- 1 pt - Outer ring

### 2. Around the World 🌍
Hit all 12 zones in numerical order. First player to complete all zones wins!

### 3. Tic-Tac-Toe ❌⭕
Classic tic-tac-toe with axes. Get three in a row to win 100 points.

### 4. Target Practice 🎪
Hit moving targets for points. Each player gets 10 throws.
- Targets worth 10, 20, 30, 50, or 100 points
- Targets move around the screen

### 5. Zombie Hunt 🧟
60-second survival mode. Click on zombies to eliminate them.
- 10 points per zombie
- Zombies spawn faster as you progress

### 6. Connect Four 🔴🟡
Classic connect four game. First to get 4 in a row wins 100 points.

### 7. 21 Game 🎲
First player to reach exactly 21 points wins.
- Going over 21 resets your score to 0
- Hit high-value zones strategically

### 8. Knockout 💥
Eliminate opponent's numbers to win.
- Each player has numbers: 15, 16, 17, 18, 19, 20, 25
- 3 lives per player
- Hit opponent's numbers to eliminate them

## Technical Details

- **Platform**: Web-based (HTML5, CSS3, JavaScript)
- **Compatibility**: Any modern web browser
- **Screen Size**: Optimized for tablets (tested on 10" screens)
- **No Server Required**: Runs entirely client-side
- **No Internet Required**: Works offline once loaded

## File Structure

```
CC-Games/
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
├── app.js          # Core app logic and player management
├── games.js        # All 8 game implementations
└── README.md       # This file
```

## Customization

You can easily customize:
- **Colors**: Edit CSS variables in `styles.css`
- **Point Values**: Modify scoring in `games.js`
- **Number of Throws**: Change max throws in game functions
- **Game Rules**: Adjust game logic in respective game functions

## Browser Support

- ✅ Chrome (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Android Chrome
- ✅ Android Firefox

## Tips for Best Results

1. **Projector Setup**: Ensure projector is properly aligned with the throwing area
2. **Lighting**: Dim room lighting for best projection visibility
3. **Calibration**: Test click accuracy before starting games
4. **Player Names**: Use short names for better display on scoreboard
5. **Browser**: Use fullscreen mode (F11) for immersive experience

## Future Enhancements

Potential features to add:
- Sound effects
- More game modes
- Tournament mode
- Statistics tracking
- Leaderboards
- Custom themes

## Credits

Developed for Chop Chop Axe Throwing Bar, Skopje, Macedonia.

## License

Proprietary - For use by Chop Chop Axe Throwing Bar

## Support

For issues or questions, contact the venue management.