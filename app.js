// Global Game State
const GameState = {
    currentGame: null,
    players: [],
    currentPlayerIndex: 0,
    gameData: {},
    history: [],
    settings: {
        movingTargets: false,
        zombieTimer: false,
        hardMode: false,
        moveDuration: 3,
        staticDuration: 5,
        zombieCountdown: 60,
        zombieDespawnTime: 20,
        maxZombies: 5,
        maxTargets: 5,
        // Axe Crush settings
        crushGridCols: 7,
        crushGridRows: 8,
        crushIconTypes: 5,
        crushMinGroupSize: 3,
        crushThrowsPerPlayer: 12,
        crushEnableCascades: true,
        // Axe Memory settings
        memoryGridSize: 16,
        memoryExtraTurnOnMatch: true,
        memoryRevealDuration: 1.5,
        // Axe Word Wack settings
        wordCategory: 'Random',
        wordPointsPerLetter: 10,
        wordFullWordBonus: 50,
        wordWrongLetterPenalty: 0,
        wordAllowFullGuess: true,
        wordMaxRounds: 26,
        // Emoji Frenzy settings
        emojiRoundsPerGame: 8,
        emojiTargetPoints: 20,
        emojiNonTargetPoints: 5,
        emojiPenaltyMode: false,
        emojiRespawnHit: true,
        emojiEnableMoving: false,
        // BAD AXE settings
        badaxeShotZoneType: 'Ring only',
        badaxeAllowMicroZones: false,
        badaxeLettersToEliminate: 6,
        // Infection Mode settings
        infectionInitialInfected: 1,
        infectionThrowsPerDuel: 2,
        infectionGameTime: 20,
        infectionVictoryCondition: 'Timer Only',
        infectionPairingMode: 'Round-Robin',
        // Landmines settings
        landminesTargetScore: 100,
        landminesScores: '25,50,75',
        landminesCheckpointInterval: 10,
        landminesThrowsPerTurn: 1,
        landminesOverTargetRule: 'Allow Over Target',
        // Throw Royale settings
        royaleStartingLives: 3,
        royaleTieRule: 'All Lowest Lose 1 Life',
        royaleMinPlayers: 2,
        // Date Night settings
        dateHeartMultiplier: 2,
        dateHeartZones: 4,
        dateEnableDares: true,
        dateThrowsPerPlayer: 10,
        // Merry Axe-mas settings
        xmasEnabled: true,
        xmasGameMode: 'Bullseye Mode',
        xmasEnableMoving: false,
        xmasGiftValues: '10,20,30,50',
        xmasThrowsPerPlayer: 10,
        xmasSeasonalOnly: false
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
    'knockout': { min: 2, max: 4, name: 'Cricket' },
    'axeCrush': { min: 2, max: 4, name: 'Axe Crush' },
    'axeMemory': { min: 2, max: 4, name: 'Axe Memory' },
    'axeWordWack': { min: 2, max: 4, name: 'Axe Word Wack' },
    'emojiFrenzy': { min: 2, max: 4, name: 'Emoji Frenzy' },
    'badAxe': { min: 2, max: 4, name: 'BAD AXE' },
    'infectionMode': { min: 2, max: 4, name: 'Infection Mode' },
    'landmines': { min: 2, max: 4, name: 'Landmines' },
    'throwRoyale': { min: 2, max: 4, name: 'Throw Royale' },
    'dateNight': { min: 2, max: 4, name: 'Date Night Mode' },
    'merryAxemas': { min: 1, max: 4, name: 'Merry Axe-mas' }
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

        // Remove warning notices - user requested removal
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
function initializeGame(gameType, preserveState = false) {
    const gameTitle = document.getElementById('gameTitle');
    const gameInstructions = document.getElementById('gameInstructions');
    const gameCanvas = document.getElementById('gameCanvas');

    // Debug logging
    console.log('Initializing game:', gameType);
    console.log('Canvas element:', gameCanvas);
    console.log('Canvas dimensions:', gameCanvas.offsetWidth, 'x', gameCanvas.offsetHeight);

    // CRITICAL: Clear previous game state and event listeners
    gameCanvas.innerHTML = '';

    // Clear any running timers/intervals to prevent contamination
    if (GameState.gameData && GameState.gameData.gameTimerInterval) {
        clearInterval(GameState.gameData.gameTimerInterval);
    }
    if (GameState.gameData && GameState.gameData.spawnInterval) {
        clearInterval(GameState.gameData.spawnInterval);
    }
    if (GameState.gameData && GameState.gameData.countdownInterval) {
        clearInterval(GameState.gameData.countdownInterval);
    }

    // Remove all event listeners by cloning and replacing the canvas
    const newCanvas = gameCanvas.cloneNode(false);
    gameCanvas.parentNode.replaceChild(newCanvas, gameCanvas);

    // Reset scoreboard styles to prevent contamination from previous games
    const scoreboard = document.getElementById('scoreboard');
    if (scoreboard) {
        scoreboard.style.display = '';
        scoreboard.style.flexDirection = '';
        scoreboard.style.gap = '';
        scoreboard.innerHTML = '';
    }

    // Clear game data only if not preserving state (e.g., for undo)
    if (!preserveState) {
        GameState.gameData = {};
    }

    // Update reference
    const canvas = document.getElementById('gameCanvas');

    // Hide miss button by default (only shown for Target Practice)
    const missBtn = document.getElementById('missBtn');
    if (missBtn) {
        missBtn.style.display = 'none';
    }

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
        case 'axeCrush':
            gameTitle.textContent = 'Axe Crush';
            gameInstructions.textContent = 'Match 3 or more icons to clear them and score points!';
            initAxeCrush();
            break;
        case 'axeMemory':
            gameTitle.textContent = 'Axe Memory';
            gameInstructions.textContent = 'Find matching pairs by hitting tiles. Each turn you get two throws!';
            initAxeMemory();
            break;
        case 'axeWordWack':
            gameTitle.textContent = 'Axe Word Wack';
            gameInstructions.textContent = 'Hit letters to reveal the hidden word or phrase!';
            initAxeWordWack();
            break;
        case 'emojiFrenzy':
            gameTitle.textContent = 'Emoji Frenzy';
            gameInstructions.textContent = 'Hit the target emoji for big points!';
            initEmojiFrenzy();
            break;
        case 'badAxe':
            gameTitle.textContent = 'BAD AXE';
            gameInstructions.textContent = 'Set a trick shot challenge. Miss it and earn a letter!';
            initBadAxe();
            break;
        case 'infectionMode':
            gameTitle.textContent = 'Infection Mode';
            gameInstructions.textContent = 'Survivors vs Infected! Win duels to stay human!';
            initInfectionMode();
            break;
        case 'landmines':
            gameTitle.textContent = 'Landmines';
            gameInstructions.textContent = 'Race to the top score but avoid the landmines!';
            initLandmines();
            break;
        case 'throwRoyale':
            gameTitle.textContent = 'Throw Royale';
            gameInstructions.textContent = 'Battle royale! Lowest score each round loses a life!';
            initThrowRoyale();
            break;
        case 'dateNight':
            gameTitle.textContent = 'Date Night Mode';
            gameInstructions.textContent = 'Romantic mode with heart bonus zones!';
            initDateNight();
            break;
        case 'merryAxemas':
            gameTitle.textContent = 'Merry Axe-mas';
            gameInstructions.textContent = 'Festive holiday mode with presents and snowmen!';
            initMerryAxemas();
            break;
    }
}

// Scoreboard Update
function updateScoreboard() {
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = '';

    // Hide scoreboard for games with custom scoreboards
    const gamesWithCustomScoreboards = ['infectionMode', 'landmines', 'throwRoyale'];
    if (gamesWithCustomScoreboards.includes(GameState.currentGame)) {
        scoreboard.style.display = 'none';
        return;
    }
    scoreboard.style.display = 'flex';
    scoreboard.style.flexDirection = 'row';
    scoreboard.style.justifyContent = 'space-around';
    scoreboard.style.flexWrap = 'wrap';
    scoreboard.style.gap = '15px';

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
            const completedZones = (player.data.completedZones || []).length;
            extraInfo = `<div style="font-size: 0.9rem; color: #aaa;">Zones: ${completedZones}/12</div>`;
        } else if (GameState.currentGame === 'zombieHunt') {
            const zombies = player.data.zombiesKilled || 0;
            const time = player.data.timeRemaining || 0;
            if (GameState.settings.zombieTimer) {
                extraInfo = `<div style="font-size: 0.9rem; color: #aaa;">Time: ${time}s | Zombies: ${zombies}</div>`;
            } else {
                extraInfo = `<div style="font-size: 0.9rem; color: #aaa;">Zombies: ${zombies}</div>`;
            }
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
    } else if (GameState.currentGame === 'aroundWorld') {
        updateAroundWorldDisplay();
    }
}

// Undo Last Hit
function undoLastHit() {
    if (GameState.history.length === 0) {
        showInfoModal('Undo', 'Nothing to undo!');
        return;
    }

    const lastAction = GameState.history.pop();

    // Restore all players' states
    GameState.players = JSON.parse(JSON.stringify(lastAction.allPlayers));
    GameState.currentPlayerIndex = lastAction.playerIndex;

    // Restore game-specific state
    if (lastAction.gameState) {
        GameState.gameData = JSON.parse(JSON.stringify(lastAction.gameState));
    }

    // Update displays without reinitializing the game
    updateScoreboard();
    updateCurrentPlayerDisplay();

    // Game-specific undo rendering
    switch(GameState.currentGame) {
        case 'ticTacToe':
        case 'connectFour':
            // Re-render board-based games with preserved state
            initializeGame(GameState.currentGame, true);
            break;
        case 'knockout':
            // Re-render knockout board
            renderKnockoutBoard();
            break;
        case 'aroundWorld':
            // Update zone display
            updateAroundWorldDisplay();
            break;
        case 'axeCrush':
            renderAxeCrushGrid();
            break;
        case 'axeMemory':
            renderAxeMemoryGrid();
            break;
        case 'axeWordWack':
            renderWordWackBoard();
            break;
        case 'emojiFrenzy':
            renderEmojiFrenzy();
            break;
        case 'badAxe':
            if (GameState.gameData.phase === 'selectingShot') {
                showBadAxeShotSelection();
            } else {
                updateBadAxeUI();
            }
            break;
        case 'infectionMode':
            renderInfectionMode();
            break;
        case 'landmines':
            renderLandminesBoard();
            break;
        case 'throwRoyale':
            renderThrowRoyale();
            break;
        case 'dateNight':
            renderDateNight();
            break;
        case 'merryAxemas':
            renderMerryAxemas();
            break;
        case 'bullseye':
        case '21':
        case 'targetPractice':
        case 'zombieHunt':
            // These games don't need visual re-rendering for undo
            // Just update the scoreboard which is already done above
            break;
    }
}

// Save state for undo
function saveState() {
    GameState.history.push({
        playerIndex: GameState.currentPlayerIndex,
        allPlayers: JSON.parse(JSON.stringify(GameState.players)),
        gameState: JSON.parse(JSON.stringify(GameState.gameData))
    });

    // Limit history to last 10 actions
    if (GameState.history.length > 10) {
        GameState.history.shift();
    }
}

// Modal Functions
function showConfirmModal(title, message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const confirmBtn = document.getElementById('modalConfirm');
    const cancelBtn = document.getElementById('modalCancel');

    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.add('active');

    // Remove any existing event listeners by cloning and replacing
    const newConfirmBtn = confirmBtn.cloneNode(true);
    const newCancelBtn = cancelBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    // Add new event listeners
    newConfirmBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        if (onConfirm) onConfirm();
    });

    newCancelBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// Info Modal (for single-button alerts)
function showInfoModal(title, message) {
    const modal = document.getElementById('confirmModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const confirmBtn = document.getElementById('modalConfirm');
    const cancelBtn = document.getElementById('modalCancel');

    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.add('active');

    // Hide cancel button for info modals
    cancelBtn.style.display = 'none';

    // Remove any existing event listeners by cloning and replacing
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    // Add new event listener
    newConfirmBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        cancelBtn.style.display = ''; // Restore cancel button visibility
    });

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            cancelBtn.style.display = ''; // Restore cancel button visibility
        }
    });
}

// Exit Game
function exitGame() {
    showConfirmModal(
        'Exit Game',
        'Are you sure you want to exit the game?',
        () => backToMenu()
    );
}

// End Game
function endGame() {
    // Sort players by score (descending)
    const sortedPlayers = [...GameState.players].sort((a, b) => b.score - a.score);

    let winnerText = '';
    // Check for tie
    if (sortedPlayers[0].score === sortedPlayers[1]?.score) {
        const winners = sortedPlayers.filter(p => p.score === sortedPlayers[0].score);
        winnerText = `It's a Tie!<br>${winners.map(w => w.name).join(' & ')}`;
    } else {
        winnerText = `Winner: ${sortedPlayers[0].name}!`;
    }

    // Show the completed word for Axe Word Wack
    let wordRevealHtml = '';
    if (GameState.currentGame === 'axeWordWack' && GameState.gameData.solution) {
        wordRevealHtml = `<div style="margin-top: 20px; font-size: 1.5rem; color: #f0a500; font-weight: bold;">The word was: <span style="color: #4CAF50;">${GameState.gameData.solution}</span></div>`;
    }

    // Build final scores HTML
    let finalScoresHtml = '';
    // For Throw Royale, only show the winner, not scores
    if (GameState.currentGame !== 'throwRoyale') {
        finalScoresHtml = '<div style="margin-top: 20px;">';
        sortedPlayers.forEach((player, index) => {
            const color = index === 0 ? '#4CAF50' : '#fff';
            finalScoresHtml += `<div style="font-size: 1.2rem; margin: 8px 0; color: ${color};">${index + 1}. ${player.name}: ${player.score} points</div>`;
        });
        finalScoresHtml += '</div>';
    }

    // Show winning modal
    const modal = document.getElementById('confirmModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const confirmBtn = document.getElementById('modalConfirm');
    const cancelBtn = document.getElementById('modalCancel');

    modalTitle.textContent = 'Game Over!';
    modalMessage.innerHTML = `
        <div style="font-size: 1.8rem; font-weight: bold; margin-bottom: 15px;">${winnerText}</div>
        ${wordRevealHtml}
        ${finalScoresHtml}
    `;
    modal.classList.add('active');

    // Update button text
    confirmBtn.textContent = 'Play Again';
    cancelBtn.textContent = 'Main Menu';

    // Remove any existing event listeners by cloning and replacing
    const newConfirmBtn = confirmBtn.cloneNode(true);
    const newCancelBtn = cancelBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    // Add new event listeners
    newConfirmBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        playAgain();
    });

    newCancelBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        backToMenu();
    });

    // Close on overlay click
    const modalClickHandler = (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            backToMenu();
            modal.removeEventListener('click', modalClickHandler);
        }
    };
    modal.addEventListener('click', modalClickHandler);
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
    document.getElementById('zombieTimerToggle').checked = GameState.settings.zombieTimer;
    document.getElementById('hardModeToggle').checked = GameState.settings.hardMode;
    document.getElementById('moveDuration').value = GameState.settings.moveDuration;
    document.getElementById('staticDuration').value = GameState.settings.staticDuration;
    document.getElementById('zombieCountdown').value = GameState.settings.zombieCountdown;
    document.getElementById('zombieDespawnTime').value = GameState.settings.zombieDespawnTime;
    document.getElementById('maxZombies').value = GameState.settings.maxZombies;
    document.getElementById('maxTargets').value = GameState.settings.maxTargets;

    // Axe Crush settings
    document.getElementById('crushGridSize').value = `${GameState.settings.crushGridCols},${GameState.settings.crushGridRows}`;
    document.getElementById('crushIconTypes').value = GameState.settings.crushIconTypes;
    document.getElementById('crushMinGroupSize').value = GameState.settings.crushMinGroupSize;
    document.getElementById('crushThrowsPerPlayer').value = GameState.settings.crushThrowsPerPlayer;
    document.getElementById('crushEnableCascades').checked = GameState.settings.crushEnableCascades;

    // Axe Memory settings
    document.getElementById('memoryGridSize').value = GameState.settings.memoryGridSize;
    document.getElementById('memoryExtraTurnOnMatch').checked = GameState.settings.memoryExtraTurnOnMatch;
    document.getElementById('memoryRevealDuration').value = GameState.settings.memoryRevealDuration;

    // Axe Word Wack settings
    document.getElementById('wordCategory').value = GameState.settings.wordCategory;
    document.getElementById('wordPointsPerLetter').value = GameState.settings.wordPointsPerLetter;
    document.getElementById('wordFullWordBonus').value = GameState.settings.wordFullWordBonus;
    document.getElementById('wordWrongLetterPenalty').value = GameState.settings.wordWrongLetterPenalty;

    // Emoji Frenzy settings
    document.getElementById('emojiRoundsPerGame').value = GameState.settings.emojiRoundsPerGame;
    document.getElementById('emojiTargetPoints').value = GameState.settings.emojiTargetPoints;
    document.getElementById('emojiNonTargetPoints').value = GameState.settings.emojiNonTargetPoints;
    document.getElementById('emojiPenaltyMode').checked = GameState.settings.emojiPenaltyMode;
    document.getElementById('emojiRespawnHit').checked = GameState.settings.emojiRespawnHit;

    // BAD AXE settings
    document.getElementById('badaxeShotZoneType').value = GameState.settings.badaxeShotZoneType;
    document.getElementById('badaxeLettersToEliminate').value = GameState.settings.badaxeLettersToEliminate;

    // Infection Mode settings
    document.getElementById('infectionInitialInfected').value = GameState.settings.infectionInitialInfected;
    document.getElementById('infectionThrowsPerDuel').value = GameState.settings.infectionThrowsPerDuel;
    document.getElementById('infectionGameTime').value = GameState.settings.infectionGameTime;
    document.getElementById('infectionVictoryCondition').value = GameState.settings.infectionVictoryCondition;

    // Landmines settings
    document.getElementById('landminesTargetScore').value = GameState.settings.landminesTargetScore;
    document.getElementById('landminesScores').value = GameState.settings.landminesScores;
    document.getElementById('landminesCheckpointInterval').value = GameState.settings.landminesCheckpointInterval;
    document.getElementById('landminesThrowsPerTurn').value = GameState.settings.landminesThrowsPerTurn;

    // Throw Royale settings
    document.getElementById('royaleStartingLives').value = GameState.settings.royaleStartingLives;
    document.getElementById('royaleTieRule').value = GameState.settings.royaleTieRule;

    // Date Night settings
    document.getElementById('dateHeartMultiplier').value = GameState.settings.dateHeartMultiplier;
    document.getElementById('dateHeartZones').value = GameState.settings.dateHeartZones;
    document.getElementById('dateEnableDares').checked = GameState.settings.dateEnableDares;
    document.getElementById('dateThrowsPerPlayer').value = GameState.settings.dateThrowsPerPlayer;

    // Merry Axe-mas settings
    document.getElementById('xmasGameMode').value = GameState.settings.xmasGameMode;
    document.getElementById('xmasGiftValues').value = GameState.settings.xmasGiftValues;
    document.getElementById('xmasThrowsPerPlayer').value = GameState.settings.xmasThrowsPerPlayer;
}

function toggleMovingTargets() {
    GameState.settings.movingTargets = document.getElementById('movingTargetsToggle').checked;
    console.log('Moving targets:', GameState.settings.movingTargets);

    // If movement is disabled, stop all existing animations
    if (!GameState.settings.movingTargets) {
        // Stop zombie animations
        const zombies = document.querySelectorAll('.zombie');
        zombies.forEach(zombie => {
            zombie.style.transition = 'none';
            zombie.style.animation = 'none';
            zombie.classList.remove('floating');
            // Get current computed position
            const computedStyle = window.getComputedStyle(zombie);
            const currentLeft = computedStyle.left;
            const currentTop = computedStyle.top;
            // Set position to current position (stops animation)
            zombie.style.left = currentLeft;
            zombie.style.top = currentTop;
        });

        // Stop moving target animations
        const targets = document.querySelectorAll('.moving-target');
        targets.forEach(target => {
            target.style.transition = 'none';
            // Get current computed position
            const computedStyle = window.getComputedStyle(target);
            const currentLeft = computedStyle.left;
            const currentTop = computedStyle.top;
            // Set position to current position (stops animation)
            target.style.left = currentLeft;
            target.style.top = currentTop;
        });
    }
}

function toggleZombieTimer() {
    GameState.settings.zombieTimer = document.getElementById('zombieTimerToggle').checked;
    console.log('Zombie timer:', GameState.settings.zombieTimer);
}

function toggleHardMode() {
    GameState.settings.hardMode = document.getElementById('hardModeToggle').checked;
    console.log('21 Game Hard Mode:', GameState.settings.hardMode);
}

function updateMoveDuration() {
    const value = parseInt(document.getElementById('moveDuration').value);
    if (value >= 1 && value <= 10) {
        GameState.settings.moveDuration = value;
        console.log('Move duration:', GameState.settings.moveDuration);
    }
}

function updateStaticDuration() {
    const value = parseInt(document.getElementById('staticDuration').value);
    if (value >= 1 && value <= 20) {
        GameState.settings.staticDuration = value;
        console.log('Static duration:', GameState.settings.staticDuration);
    }
}

function updateZombieCountdown() {
    const value = parseInt(document.getElementById('zombieCountdown').value);
    if (value >= 10 && value <= 300) {
        GameState.settings.zombieCountdown = value;
        console.log('Zombie countdown:', GameState.settings.zombieCountdown);
    }
}

function updateZombieDespawnTime() {
    const value = parseInt(document.getElementById('zombieDespawnTime').value);
    if (value >= 3 && value <= 30) {
        GameState.settings.zombieDespawnTime = value;
        console.log('Zombie despawn time:', GameState.settings.zombieDespawnTime);
    }
}

function updateMaxZombies() {
    const value = parseInt(document.getElementById('maxZombies').value);
    if (value >= 1 && value <= 20) {
        GameState.settings.maxZombies = value;
        console.log('Max zombies:', GameState.settings.maxZombies);
    }
}

function updateMaxTargets() {
    const value = parseInt(document.getElementById('maxTargets').value);
    if (value >= 1 && value <= 20) {
        GameState.settings.maxTargets = value;
        console.log('Max targets:', GameState.settings.maxTargets);
    }
}

// Axe Crush Settings
function updateCrushGridSize() {
    const value = document.getElementById('crushGridSize').value.split(',');
    GameState.settings.crushGridCols = parseInt(value[0]);
    GameState.settings.crushGridRows = parseInt(value[1]);
}

function updateCrushIconTypes() {
    GameState.settings.crushIconTypes = parseInt(document.getElementById('crushIconTypes').value);
}

function updateCrushMinGroupSize() {
    GameState.settings.crushMinGroupSize = parseInt(document.getElementById('crushMinGroupSize').value);
}

function updateCrushThrowsPerPlayer() {
    GameState.settings.crushThrowsPerPlayer = parseInt(document.getElementById('crushThrowsPerPlayer').value);
}

function updateCrushEnableCascades() {
    GameState.settings.crushEnableCascades = document.getElementById('crushEnableCascades').checked;
}

// Axe Memory Settings
function updateMemoryGridSize() {
    GameState.settings.memoryGridSize = parseInt(document.getElementById('memoryGridSize').value);
}

function updateMemoryExtraTurnOnMatch() {
    GameState.settings.memoryExtraTurnOnMatch = document.getElementById('memoryExtraTurnOnMatch').checked;
}

function updateMemoryRevealDuration() {
    GameState.settings.memoryRevealDuration = parseFloat(document.getElementById('memoryRevealDuration').value);
}

// Axe Word Wack Settings
function updateWordCategory() {
    GameState.settings.wordCategory = document.getElementById('wordCategory').value;
}

function updateWordPointsPerLetter() {
    GameState.settings.wordPointsPerLetter = parseInt(document.getElementById('wordPointsPerLetter').value);
}

function updateWordFullWordBonus() {
    GameState.settings.wordFullWordBonus = parseInt(document.getElementById('wordFullWordBonus').value);
}

function updateWordWrongLetterPenalty() {
    GameState.settings.wordWrongLetterPenalty = parseInt(document.getElementById('wordWrongLetterPenalty').value);
}

// Emoji Frenzy Settings
function updateEmojiRoundsPerGame() {
    GameState.settings.emojiRoundsPerGame = parseInt(document.getElementById('emojiRoundsPerGame').value);
}

function updateEmojiTargetPoints() {
    GameState.settings.emojiTargetPoints = parseInt(document.getElementById('emojiTargetPoints').value);
}

function updateEmojiNonTargetPoints() {
    GameState.settings.emojiNonTargetPoints = parseInt(document.getElementById('emojiNonTargetPoints').value);
}

function updateEmojiPenaltyMode() {
    GameState.settings.emojiPenaltyMode = document.getElementById('emojiPenaltyMode').checked;
}

function updateEmojiRespawnHit() {
    GameState.settings.emojiRespawnHit = document.getElementById('emojiRespawnHit').checked;
}

// BAD AXE Settings
function updateBadaxeShotZoneType() {
    GameState.settings.badaxeShotZoneType = document.getElementById('badaxeShotZoneType').value;
}

function updateBadaxeLettersToEliminate() {
    GameState.settings.badaxeLettersToEliminate = parseInt(document.getElementById('badaxeLettersToEliminate').value);
}

// Infection Mode Settings
function updateInfectionInitialInfected() {
    GameState.settings.infectionInitialInfected = parseInt(document.getElementById('infectionInitialInfected').value);
}

function updateInfectionThrowsPerDuel() {
    GameState.settings.infectionThrowsPerDuel = parseInt(document.getElementById('infectionThrowsPerDuel').value);
}

function updateInfectionGameTime() {
    GameState.settings.infectionGameTime = parseInt(document.getElementById('infectionGameTime').value);
}

function updateInfectionVictoryCondition() {
    GameState.settings.infectionVictoryCondition = document.getElementById('infectionVictoryCondition').value;
}

// Landmines Settings
function updateLandminesTargetScore() {
    GameState.settings.landminesTargetScore = parseInt(document.getElementById('landminesTargetScore').value);
}

function updateLandminesScores() {
    GameState.settings.landminesScores = document.getElementById('landminesScores').value;
}

function updateLandminesCheckpointInterval() {
    GameState.settings.landminesCheckpointInterval = parseInt(document.getElementById('landminesCheckpointInterval').value);
}

function updateLandminesThrowsPerTurn() {
    GameState.settings.landminesThrowsPerTurn = parseInt(document.getElementById('landminesThrowsPerTurn').value);
}

// Throw Royale Settings
function updateRoyaleStartingLives() {
    GameState.settings.royaleStartingLives = parseInt(document.getElementById('royaleStartingLives').value);
}

function updateRoyaleTieRule() {
    GameState.settings.royaleTieRule = document.getElementById('royaleTieRule').value;
}

// Date Night Settings
function updateDateHeartMultiplier() {
    GameState.settings.dateHeartMultiplier = parseInt(document.getElementById('dateHeartMultiplier').value);
}

function updateDateHeartZones() {
    GameState.settings.dateHeartZones = parseInt(document.getElementById('dateHeartZones').value);
}

function updateDateEnableDares() {
    GameState.settings.dateEnableDares = document.getElementById('dateEnableDares').checked;
}

function updateDateThrowsPerPlayer() {
    GameState.settings.dateThrowsPerPlayer = parseInt(document.getElementById('dateThrowsPerPlayer').value);
}

// Merry Axe-mas Settings
function updateXmasEnabled() {
    GameState.settings.xmasEnabled = document.getElementById('xmasEnabled').checked;
    // Update menu visibility
    const xmasCard = document.querySelector('button.game-card[onclick="selectGame(\'merryAxemas\')"]');
    if (xmasCard) {
        xmasCard.style.display = GameState.settings.xmasEnabled ? 'block' : 'none';
    }
}

function updateXmasGameMode() {
    GameState.settings.xmasGameMode = document.getElementById('xmasGameMode').value;
}

function updateXmasGiftValues() {
    GameState.settings.xmasGiftValues = document.getElementById('xmasGiftValues').value;
}

function updateXmasThrowsPerPlayer() {
    GameState.settings.xmasThrowsPerPlayer = parseInt(document.getElementById('xmasThrowsPerPlayer').value);
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
