// Global Game State
const GameState = {
    currentGame: null,
    players: [],
    currentPlayerIndex: 0,
    gameData: {},
    history: [],
    settings: {
        movingTargets: true
    }
};

// Screen Management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Game player requirements
const GAME_PLAYER_LIMITS = {
    'ticTacToe': { min: 2, max: 2, name: 'Tic-Tac-Toe' },
    'connectFour': { min: 2, max: 2, name: 'Connect Four' },
    'bullseye': { min: 1, max: 4, name: 'Classic Bullseye' },
    'aroundWorld': { min: 1, max: 4, name: 'Around the World' },
    'targetPractice': { min: 1, max: 4, name: 'Target Practice' },
    'zombieHunt': { min: 1, max: 4, name: 'Zombie Hunt' },
    '21': { min: 1, max: 4, name: '21 Game' },
    'knockout': { min: 2, max: 4, name: 'Cricket' }
};

// Main Menu Functions
function selectGame(gameType) {
    GameState.currentGame = gameType;
    showScreen('playerSetup');

    // Set player count based on game requirements
    const limits = GAME_PLAYER_LIMITS[gameType];
    if (limits) {
        const countElement = document.getElementById('playerCount');
        countElement.textContent = limits.min === limits.max ? limits.min : 2;

        // Hide/show player count buttons for fixed player count games
        const numberSelector = document.querySelector('.number-selector');
        const buttons = numberSelector.querySelectorAll('button');
        if (limits.min === limits.max) {
            // Hide +/- buttons for games with fixed player count
            buttons.forEach(btn => btn.style.display = 'none');
        } else {
            // Show +/- buttons for games with variable player count
            buttons.forEach(btn => btn.style.display = 'inline-block');
        }

        // Show notice for games that require specific player counts (but hide for 2-player games)
        const setupContainer = document.querySelector('.setup-container');
        let notice = document.getElementById('playerCountNotice');
        if (!notice) {
            notice = document.createElement('div');
            notice.id = 'playerCountNotice';
            notice.style.cssText = 'background: #ff6b6b; padding: 15px; border-radius: 10px; margin-bottom: 20px; text-align: center; font-size: 1.1rem;';
            setupContainer.insertBefore(notice, setupContainer.firstChild.nextSibling);
        }

        // Hide notice for 2-player only games (Tic-Tac-Toe and Connect Four)
        if (limits.min === limits.max && limits.min === 2) {
            notice.style.display = 'none';
        } else if (limits.min === limits.max) {
            notice.textContent = `${limits.name} requires exactly ${limits.min} players`;
            notice.style.display = 'block';
        } else if (limits.min > 1) {
            notice.textContent = `${limits.name} requires ${limits.min}-${limits.max} players`;
            notice.style.display = 'block';
        } else {
            notice.style.display = 'none';
        }
    }

    updatePlayerNameInputs();
}

function backToMenu() {
    showScreen('mainMenu');
    resetGameState();
}

// Player Setup Functions
function changePlayerCount(delta) {
    const limits = GAME_PLAYER_LIMITS[GameState.currentGame];
    if (!limits) return;

    // Don't allow changing if game requires exact player count
    if (limits.min === limits.max) {
        return;
    }

    const countElement = document.getElementById('playerCount');
    let count = parseInt(countElement.textContent);
    count = Math.max(limits.min, Math.min(limits.max, count + delta));
    countElement.textContent = count;
    updatePlayerNameInputs();
}

function updatePlayerNameInputs() {
    const count = parseInt(document.getElementById('playerCount').textContent);
    const container = document.getElementById('playerNames');
    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'player-name-input';
        div.innerHTML = `
            <label>Player ${i + 1} Name:</label>
            <input type="text" id="player${i}Name" placeholder="Player ${i + 1}" value="Player ${i + 1}">
        `;
        container.appendChild(div);
    }
}

function startGame() {
    const count = parseInt(document.getElementById('playerCount').textContent);
    const limits = GAME_PLAYER_LIMITS[GameState.currentGame];

    // Validate player count
    if (limits && (count < limits.min || count > limits.max)) {
        alert(`${limits.name} requires ${limits.min === limits.max ? 'exactly ' + limits.min : limits.min + '-' + limits.max} players!`);
        return;
    }

    GameState.players = [];

    for (let i = 0; i < count; i++) {
        const nameInput = document.getElementById(`player${i}Name`);
        GameState.players.push({
            name: nameInput.value || `Player ${i + 1}`,
            score: 0,
            data: {}
        });
    }

    GameState.currentPlayerIndex = 0;
    GameState.history = [];
    initializeGame(GameState.currentGame);
    showScreen('gameScreen');
    updateScoreboard();
    updateCurrentPlayerDisplay();
}

// Game Initialization
function initializeGame(gameType) {
    const gameTitle = document.getElementById('gameTitle');
    const gameInstructions = document.getElementById('gameInstructions');
    const gameCanvas = document.getElementById('gameCanvas');

    // Debug logging
    console.log('Initializing game:', gameType);
    console.log('Canvas element:', gameCanvas);
    console.log('Canvas dimensions:', gameCanvas.offsetWidth, 'x', gameCanvas.offsetHeight);

    // CRITICAL: Clear previous game state and event listeners
    gameCanvas.innerHTML = '';

    // Remove all event listeners by cloning and replacing the canvas
    const newCanvas = gameCanvas.cloneNode(false);
    gameCanvas.parentNode.replaceChild(newCanvas, gameCanvas);

    // Clear game data
    GameState.gameData = {};

    // Update reference
    const canvas = document.getElementById('gameCanvas');

    // Initialize specific game
    switch(gameType) {
        case 'bullseye':
            gameTitle.textContent = 'Classic Bullseye';
            gameInstructions.textContent = 'Click where the axe hit. 5 throws per player.';
            if (typeof initBullseye === 'function') {
                initBullseye();
                console.log('Bullseye initialized');
            } else {
                console.error('initBullseye function not found!');
            }
            break;
        case 'aroundWorld':
            gameTitle.textContent = 'Around the World';
            gameInstructions.textContent = 'Hit all zones in order. First to complete wins!';
            initAroundWorld();
            break;
        case 'ticTacToe':
            gameTitle.textContent = 'Tic-Tac-Toe';
            gameInstructions.textContent = 'Get three in a row to win!';
            initTicTacToe();
            break;
        case 'targetPractice':
            gameTitle.textContent = 'Target Practice';
            gameInstructions.textContent = 'Hit the targets for points. 10 throws per player.';
            initTargetPractice();
            break;
        case 'zombieHunt':
            gameTitle.textContent = 'Zombie Hunt';
            gameInstructions.textContent = 'Click on zombies to eliminate them. 60 seconds!';
            initZombieHunt();
            break;
        case 'connectFour':
            gameTitle.textContent = 'Connect Four';
            gameInstructions.textContent = 'Get four in a row to win!';
            initConnectFour();
            break;
        case '21':
            gameTitle.textContent = '21 Game';
            gameInstructions.textContent = 'First to exactly 21 points wins!';
            init21Game();
            break;
        case 'knockout':
            gameTitle.textContent = 'Cricket';
            gameInstructions.textContent = 'Hit each number 3 times to close it. Score points after closing!';
            initKnockout();
            break;
    }
}

// Scoreboard Update
function updateScoreboard() {
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = '';

    GameState.players.forEach((player, index) => {
        const scoreDiv = document.createElement('div');
        scoreDiv.className = 'player-score';
        if (index === GameState.currentPlayerIndex) {
            scoreDiv.classList.add('active');
        }

        let displayScore = player.score;
        let extraInfo = '';

        // Add game-specific information
        if (GameState.currentGame === 'bullseye' || GameState.currentGame === 'targetPractice') {
            const throws = player.data.throws || 0;
            const maxThrows = GameState.currentGame === 'bullseye' ? 5 : 10;
            extraInfo = `<div style="font-size: 0.9rem; color: #aaa;">Throws: ${throws}/${maxThrows}</div>`;
        } else if (GameState.currentGame === 'aroundWorld') {
            const zone = player.data.currentZone || 1;
            extraInfo = `<div style="font-size: 0.9rem; color: #aaa;">Zone: ${zone}/12</div>`;
        }

        scoreDiv.innerHTML = `
            <div class="player-name">${player.name}</div>
            <div class="score">${displayScore}</div>
            ${extraInfo}
        `;
        scoreboard.appendChild(scoreDiv);
    });
}

// Current Player Display
function updateCurrentPlayerDisplay() {
    const display = document.getElementById('currentPlayerDisplay');
    const currentPlayer = GameState.players[GameState.currentPlayerIndex];
    display.innerHTML = `Current Player: <span>${currentPlayer.name}</span>`;
}

// Next Player
function nextPlayer() {
    const currentPlayer = GameState.players[GameState.currentPlayerIndex];

    // Check if current player has finished their turn based on game type
    if (GameState.currentGame === 'bullseye') {
        const throws = currentPlayer.data.throws || 0;
        if (throws < 5) {
            alert(`${currentPlayer.name} still has ${5 - throws} throws remaining!`);
            return;
        }
    } else if (GameState.currentGame === 'targetPractice') {
        const throws = currentPlayer.data.throws || 0;
        if (throws < 10) {
            alert(`${currentPlayer.name} still has ${10 - throws} throws remaining!`);
            return;
        }
    }

    GameState.currentPlayerIndex = (GameState.currentPlayerIndex + 1) % GameState.players.length;

    // Check if all players have finished their turns
    if (GameState.currentGame === 'bullseye' || GameState.currentGame === 'targetPractice') {
        const maxThrows = GameState.currentGame === 'bullseye' ? 5 : 10;
        const allFinished = GameState.players.every(p => (p.data.throws || 0) >= maxThrows);
        if (allFinished) {
            endGame();
            return;
        }
    }

    updateScoreboard();
    updateCurrentPlayerDisplay();

    // Reset turn-specific data for new player
    if (GameState.currentGame === 'targetPractice') {
        generateTargets();
    }
}

// Undo Last Hit
function undoLastHit() {
    if (GameState.history.length === 0) {
        alert('Nothing to undo!');
        return;
    }

    const lastAction = GameState.history.pop();

    // Restore player state
    GameState.players[lastAction.playerIndex] = JSON.parse(JSON.stringify(lastAction.playerState));
    GameState.currentPlayerIndex = lastAction.playerIndex;

    // Restore game-specific state
    if (lastAction.gameState) {
        GameState.gameData = JSON.parse(JSON.stringify(lastAction.gameState));
    }

    // Re-render the game
    initializeGame(GameState.currentGame);
    updateScoreboard();
    updateCurrentPlayerDisplay();
}

// Save state for undo
function saveState() {
    GameState.history.push({
        playerIndex: GameState.currentPlayerIndex,
        playerState: JSON.parse(JSON.stringify(GameState.players[GameState.currentPlayerIndex])),
        gameState: JSON.parse(JSON.stringify(GameState.gameData))
    });

    // Limit history to last 10 actions
    if (GameState.history.length > 10) {
        GameState.history.shift();
    }
}

// Exit Game
function exitGame() {
    if (confirm('Are you sure you want to exit the game?')) {
        backToMenu();
    }
}

// End Game
function endGame() {
    showScreen('gameOver');

    // Sort players by score (descending)
    const sortedPlayers = [...GameState.players].sort((a, b) => b.score - a.score);

    const winnerDisplay = document.getElementById('winnerDisplay');
    const finalScores = document.getElementById('finalScores');

    // Check for tie
    if (sortedPlayers[0].score === sortedPlayers[1]?.score) {
        const winners = sortedPlayers.filter(p => p.score === sortedPlayers[0].score);
        winnerDisplay.innerHTML = `It's a Tie!<br>${winners.map(w => w.name).join(' & ')}`;
    } else {
        winnerDisplay.innerHTML = `Winner: ${sortedPlayers[0].name}!`;
    }

    finalScores.innerHTML = '';
    sortedPlayers.forEach((player, index) => {
        const scoreDiv = document.createElement('div');
        scoreDiv.className = 'final-score-item';
        if (index === 0) {
            scoreDiv.classList.add('winner');
        }
        scoreDiv.innerHTML = `${index + 1}. ${player.name}: ${player.score} points`;
        finalScores.appendChild(scoreDiv);
    });
}

// Play Again
function playAgain() {
    GameState.players.forEach(player => {
        player.score = 0;
        player.data = {};
    });
    GameState.currentPlayerIndex = 0;
    GameState.history = [];
    initializeGame(GameState.currentGame);
    showScreen('gameScreen');
    updateScoreboard();
    updateCurrentPlayerDisplay();
}

// Reset Game State
function resetGameState() {
    GameState.currentGame = null;
    GameState.players = [];
    GameState.currentPlayerIndex = 0;
    GameState.gameData = {};
    GameState.history = [];
}

// Click Indicator Effect
function showClickIndicator(x, y) {
    const indicator = document.getElementById('clickIndicator');
    indicator.style.left = x + 'px';
    indicator.style.top = y + 'px';
    indicator.classList.add('show');

    setTimeout(() => {
        indicator.classList.remove('show');
    }, 500);
}

// Utility: Get click position relative to element
function getRelativePosition(event, element) {
    const rect = element.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        centerX: rect.width / 2,
        centerY: rect.height / 2
    };
}

// Utility: Calculate distance from center
function getDistanceFromCenter(x, y, centerX, centerY) {
    return Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
}

// Settings Functions
function showSettings() {
    showScreen('settingsScreen');
    // Update toggle state from GameState
    document.getElementById('movingTargetsToggle').checked = GameState.settings.movingTargets;
}

function toggleMovingTargets() {
    GameState.settings.movingTargets = document.getElementById('movingTargetsToggle').checked;
    console.log('Moving targets:', GameState.settings.movingTargets);
}

// Help Functions
function showHelp() {
    showScreen('helpScreen');
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    showScreen('mainMenu');
    updatePlayerNameInputs();
});
