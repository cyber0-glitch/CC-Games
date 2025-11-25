# Chop Chop Axe Throwing Games

Interactive web-based axe throwing games designed for Chop Chop Axe Throwing Bar in Skopje, Macedonia.

## Overview

This application provides 18 different axe throwing games that run on Android tablets connected to projectors. Players manually click on the tablet to mark where their axe hit the projected target.

## Features

- **18 Different Games**: Classic games, party modes, competitive challenges, and seasonal specials
- **Multi-Player Support**: 1-4 players per game (some games require specific player counts)
- **Touch-Optimized**: Designed specifically for tablet touchscreens
- **Projector-Friendly**: High-contrast visuals that project well
- **Score Tracking**: Automatic scoring and winner determination
- **Undo Functionality**: Undo last action if mistakes are made
- **Customizable Settings**: Adjust difficulty, rules, and gameplay options
- **In-Game Modals**: Smooth user experience with custom modal dialogs

## Installation

1. Clone this repository to your Android tablet or web server
2. Open `index.html` in a web browser (Chrome recommended)
3. Connect tablet to projector
4. Start playing!

## How to Use

1. **Select a Game** from the main menu (organized by player count and game type)
2. **Set Up Players** - Choose number of players (1-4) and enter names
3. **Play the Game** - Click on the screen where the axe hit
4. **Use Controls** - Undo mistakes, advance turns, or exit game
5. **View Results** - Winners are displayed at the end
6. **Customize Settings** - Access settings from main menu to adjust game rules

## Games Description

### 2-Player Games

#### Tic-Tac-Toe ❌
Classic tic-tac-toe with axes. Get three in a row to win!

#### Connect Four 🔴
Drop discs into columns. Get four in a row to win!

### 2-4 Player Games

#### Classic Bullseye 🎯
Hit the center for maximum points. 5 throws per player.
- Scoring: Bullseye (50), Red (25), White (15), Black (10), Orange (5), Outer (1)

#### Around the World 🌍
Hit all 12 zones in numerical order. First to complete wins!

#### Target Practice 🎪
Hit moving targets for points. 10 throws per player.
- Targets worth 10-100 points

#### Zombie Hunt 🧟
Timed survival mode. Click zombies to eliminate them.
- Customizable timer and spawn settings

#### 21 Game 🎲
Race to exactly 21 points. Going over resets to 0 (hard mode) or keeps previous score (easy mode).

#### Cricket 💥
Close all numbers (15-20, 25) with 3 hits each. Score points after closing!

### Party Games

#### Axe Crush 💎
Match-3 puzzle game. Clear groups of 3+ matching icons for points!
- Combo cascades for bonus points

#### Axe Memory 🎴
Find matching pairs. Each turn you get two throws.
- Extra turns on successful matches (optional)

#### Axe Word Wack 🔤
Reveal hidden words by hitting letters. Earn points for each occurrence!
- Multiple word categories available

#### Emoji Frenzy 😂
Hit the target emoji for big points! Multiple rounds of emoji-matching fun.

#### BAD AXE 🏀
Axe throwing HORSE game. Call your trick shot - miss it and earn a letter!
- Default: Ring only (customizable to include quadrants)

#### Infection Mode 🦠
Survivors vs Infected! Win duels to stay human or convert others.
- Team-based competitive gameplay

#### Landmines 💣
Climb the score ladder but avoid landmines! Hit a mine and fall back to last checkpoint.

#### Throw Royale 👑
Battle royale! Lowest score each round loses a life. Last player standing wins!
- Scores display for 2 seconds after all players throw

#### Date Night Mode 💕
Romantic couples mode with heart bonus zones and optional date dares!

#### Merry Axe-mas 🎄
Festive holiday mode! Hit presents and ornaments on the Christmas tree for points.

## Technical Details

- **Platform**: Web-based (HTML5, CSS3, JavaScript)
- **Compatibility**: Any modern web browser
- **Screen Size**: Optimized for tablets (tested on 10" screens)
- **No Server Required**: Runs entirely client-side
- **No Internet Required**: Works offline once loaded

## File Structure

```
CC-Games/
├── index.html      # Main HTML structure and game interface
├── styles.css      # All styling, animations, and responsive design
├── app.js          # Core app logic, player management, and settings
├── games.js        # All 18 game implementations
└── README.md       # This file
```

## Customization

### Via Settings Menu
Access the settings menu from the main menu to customize:
- **Target Movement**: Enable/disable moving targets and zombies
- **Timer Settings**: Adjust countdown times and durations
- **Difficulty Modes**: Toggle hard mode for 21 Game
- **Game-Specific Rules**: Customize grid sizes, point values, and gameplay mechanics for each game

### Via Code
You can also customize by editing the source files:
- **Colors & Themes**: Edit CSS variables in `styles.css`
- **Point Values**: Modify scoring constants in `games.js`
- **Default Settings**: Change default values in `app.js` (lines 8-75)
- **Game Rules**: Adjust game logic in respective game functions in `games.js`

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

## Recent Updates

- ✅ 18 total games (up from original 8)
- ✅ In-game modal dialogs for better UX
- ✅ Comprehensive settings menu
- ✅ Undo functionality with proper state restoration
- ✅ Multiple game categories (2-player, multiplayer, party games)
- ✅ Seasonal/themed games (Date Night, Merry Axe-mas)
- ✅ Improved visual feedback (score displays, animations)

## Potential Future Enhancements

- Sound effects and audio feedback
- Tournament mode with brackets
- Persistent statistics tracking
- All-time leaderboards
- Additional seasonal themes
- Multiplayer online mode

## Credits

Developed for Chop Chop Axe Throwing Bar, Skopje, Macedonia.

## License

Proprietary - For use by Chop Chop Axe Throwing Bar

## Support

For issues or questions, contact the venue management.