// ============================================
// GAME 1: CLASSIC BULLSEYE
// ============================================
function initBullseye() {
    console.log('initBullseye called');
    const canvas = document.getElementById('gameCanvas');
    console.log('Bullseye canvas:', canvas);

    // Initialize player data
    GameState.players.forEach(player => {
        if (!player.data.throws) {
            player.data.throws = 0;
        }
    });

    // Create bullseye target
    const target = document.createElement('div');
    target.className = 'target-bullseye';
    console.log('Target created:', target);

    const rings = [
        { size: 100, color: '#FFD700', points: 50, label: '50' },
        { size: 200, color: '#ff6b6b', points: 25, label: '25' },
        { size: 300, color: '#fff', points: 15, label: '15' },
        { size: 400, color: '#000', points: 10, label: '10' },
        { size: 500, color: '#f0a500', points: 5, label: '5' },
        { size: 600, color: '#1a1a2e', points: 1, label: '1' }
    ];

    rings.reverse().forEach(ring => {
        const ringDiv = document.createElement('div');
        ringDiv.className = 'target-ring';
        ringDiv.style.width = ring.size + 'px';
        ringDiv.style.height = ring.size + 'px';
        ringDiv.style.background = ring.color;
        ringDiv.style.color = ring.color === '#fff' || ring.color === '#FFD700' ? '#000' : '#fff';
        ringDiv.textContent = ring.label;
        ringDiv.dataset.points = ring.points;

        ringDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            handleBullseyeHit(ring.points);
        });

        target.appendChild(ringDiv);
    });

    // Add click handler for misses (clicking outside rings)
    canvas.addEventListener('click', handleBullseyeMiss);

    canvas.appendChild(target);
    console.log('Target appended to canvas. Canvas now has', canvas.children.length, 'children');
}

function handleBullseyeMiss(e) {
    // Only handle clicks on the canvas itself, not on rings
    if (e.target.id === 'gameCanvas' || e.target.classList.contains('target-bullseye')) {
        const currentPlayer = GameState.players[GameState.currentPlayerIndex];

        if (currentPlayer.data.throws >= 5) {
            return;
        }

        saveState();

        // Count as a throw with 0 points
        currentPlayer.data.throws = (currentPlayer.data.throws || 0) + 1;

        updateScoreboard();

        // Auto-advance if player has finished
        if (currentPlayer.data.throws >= 5) {
            setTimeout(() => {
                const allFinished = GameState.players.every(p => p.data.throws >= 5);
                if (allFinished) {
                    endGame();
                } else {
                    if (confirm(`${currentPlayer.name} has finished! Next player?`)) {
                        nextPlayer();
                    }
                }
            }, 500);
        }
    }
}

function handleBullseyeHit(points) {
    const currentPlayer = GameState.players[GameState.currentPlayerIndex];

    if (currentPlayer.data.throws >= 5) {
        alert('You have used all your throws!');
        return;
    }

    saveState();

    currentPlayer.score += points;
    currentPlayer.data.throws = (currentPlayer.data.throws || 0) + 1;

    updateScoreboard();

    // Auto-advance if player has finished
    if (currentPlayer.data.throws >= 5) {
        setTimeout(() => {
            const allFinished = GameState.players.every(p => p.data.throws >= 5);
            if (allFinished) {
                endGame();
            } else {
                if (confirm(`${currentPlayer.name} has finished! Next player?`)) {
                    nextPlayer();
                }
            }
        }, 500);
    }
}

// ============================================
// GAME 2: AROUND THE WORLD
// ============================================
function initAroundWorld() {
    const canvas = document.getElementById('gameCanvas');

    // Initialize player data
    GameState.players.forEach(player => {
        if (!player.data.currentZone) {
            player.data.currentZone = 1;
        }
        if (!player.data.throws) {
            player.data.throws = 0;
        }
    });

    // Create target with 12 zones - SMALLER SIZE TO FIT SCREEN
    const target = document.createElement('div');
    target.className = 'atw-target';

    const zones = 12;
    const colors = ['#ff6b6b', '#f0a500', '#4ecdc4', '#95e1d3', '#ff9ff3', '#feca57', '#48dbfb', '#ff6348', '#1dd1a1', '#ee5a6f', '#c44569', '#f8b500'];

    for (let i = 0; i < zones; i++) {
        const angle = (360 / zones) * i - 90;
        const zone = document.createElement('div');
        zone.className = 'atw-zone';
        zone.dataset.zone = i + 1;
        zone.style.background = colors[i];

        // Position zones in a circle - REDUCED RADIUS
        const radius = 200; // Reduced from 300
        const angleRad = (angle + (360 / zones) / 2) * Math.PI / 180;
        const x = Math.cos(angleRad) * radius * 0.7;
        const y = Math.sin(angleRad) * radius * 0.7;

        zone.style.width = '90px'; // Reduced from 120px
        zone.style.height = '90px';
        zone.style.left = `calc(50% + ${x}px - 45px)`;
        zone.style.top = `calc(50% + ${y}px - 45px)`;
        zone.style.borderRadius = '50%';
        zone.style.fontSize = '1.8rem'; // Adjusted font size
        zone.textContent = i + 1;

        zone.addEventListener('click', (e) => {
            e.stopPropagation();
            handleAroundWorldHit(i + 1, zone);
        });

        target.appendChild(zone);
    }

    // Add click handler for misses (clicking outside zones)
    canvas.addEventListener('click', handleAroundWorldMiss);

    canvas.appendChild(target);
    updateAroundWorldDisplay();
}

function handleAroundWorldHit(zoneNumber, zoneElement) {
    const currentPlayer = GameState.players[GameState.currentPlayerIndex];
    const currentZone = currentPlayer.data.currentZone || 1;

    saveState();

    // Increment throw count
    currentPlayer.data.throws = (currentPlayer.data.throws || 0) + 1;

    if (zoneNumber === currentZone) {
        // Correct zone hit!
        currentPlayer.data.currentZone = currentZone + 1;
        currentPlayer.score += 10;
        zoneElement.classList.add('completed');

        updateScoreboard();
        updateAroundWorldDisplay();

        // Check if player completed all zones
        if (currentPlayer.data.currentZone > 12) {
            // Mark player as finished but continue game for other players
            currentPlayer.data.finished = true;

            // Check if all players are finished
            const allFinished = GameState.players.every(p => p.data.finished || p.data.currentZone > 12);
            if (allFinished) {
                setTimeout(() => {
                    endGame();
                }, 500);
                return;
            }
        }
    } else {
        // Wrong zone - visual feedback
        const originalBg = zoneElement.style.background;
        zoneElement.style.background = '#dc3545';
        setTimeout(() => {
            zoneElement.style.background = originalBg;
        }, 300);
    }

    // Move to next player after each throw
    setTimeout(() => {
        nextPlayer();
    }, 400);
}

// Handle clicking outside zones (miss)
function handleAroundWorldMiss(e) {
    // Only handle clicks on the canvas itself, not on zones
    if (e.target.id === 'gameCanvas' || e.target.classList.contains('atw-target')) {
        const currentPlayer = GameState.players[GameState.currentPlayerIndex];

        saveState();

        // Count as a throw
        currentPlayer.data.throws = (currentPlayer.data.throws || 0) + 1;

        updateScoreboard();

        // Move to next player
        setTimeout(() => {
            nextPlayer();
        }, 200);
    }
}

function updateAroundWorldDisplay() {
    const zones = document.querySelectorAll('.atw-zone');
    const currentPlayer = GameState.players[GameState.currentPlayerIndex];
    const currentZone = currentPlayer.data.currentZone || 1;

    zones.forEach(zone => {
        const zoneNum = parseInt(zone.dataset.zone);
        zone.classList.remove('active');
        // Don't remove completed class as it might be from previous player

        // Only highlight the CURRENT player's active zone
        if (zoneNum === currentZone && !currentPlayer.data.finished) {
            zone.classList.add('active');
        }
    });
}

// ============================================
// GAME 3: TIC-TAC-TOE
// ============================================
function initTicTacToe() {
    const canvas = document.getElementById('gameCanvas');

    // Initialize game data
    if (!GameState.gameData.board) {
        GameState.gameData.board = Array(9).fill(null);
        GameState.gameData.symbols = ['❌', '⭕'];
    }

    const grid = document.createElement('div');
    grid.className = 'ttt-grid';

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'ttt-cell';
        cell.dataset.index = i;

        if (GameState.gameData.board[i] !== null) {
            cell.textContent = GameState.gameData.board[i];
            cell.classList.add('filled');
        }

        cell.addEventListener('click', () => handleTicTacToeClick(i, cell));

        grid.appendChild(cell);
    }

    canvas.appendChild(grid);
}

function handleTicTacToeClick(index, cell) {
    if (GameState.gameData.board[index] !== null) {
        return;
    }

    saveState();

    const symbol = GameState.gameData.symbols[GameState.currentPlayerIndex % 2];
    GameState.gameData.board[index] = symbol;
    cell.textContent = symbol;
    cell.classList.add('filled');

    // Check for winner
    const winner = checkTicTacToeWinner();
    if (winner !== null) {
        setTimeout(() => {
            if (winner === 'draw') {
                alert("It's a draw!");
                endGame();
            } else {
                GameState.players[winner].score += 100;
                updateScoreboard();
                endGame();
            }
        }, 300);
    } else {
        nextPlayer();
    }
}

function checkTicTacToeWinner() {
    const board = GameState.gameData.board;
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let line of lines) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            // Find which player has this symbol
            const symbol = board[a];
            const playerIndex = GameState.players.findIndex((p, i) =>
                GameState.gameData.symbols[i % 2] === symbol
            );
            return playerIndex;
        }
    }

    // Check for draw
    if (board.every(cell => cell !== null)) {
        return 'draw';
    }

    return null;
}

// ============================================
// GAME 4: TARGET PRACTICE
// ============================================
function initTargetPractice() {
    const canvas = document.getElementById('gameCanvas');

    // Initialize player data
    GameState.players.forEach(player => {
        if (!player.data.throws) {
            player.data.throws = 0;
        }
    });

    generateTargets();
}

function generateTargets() {
    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = '';

    const numTargets = 5;
    const targetValues = [10, 20, 30, 50, 100];

    for (let i = 0; i < numTargets; i++) {
        const target = document.createElement('div');
        target.className = 'moving-target';

        // Random position
        const x = Math.random() * 80 + 10; // 10% to 90%
        const y = Math.random() * 80 + 10;

        target.style.left = x + '%';
        target.style.top = y + '%';

        const value = targetValues[Math.floor(Math.random() * targetValues.length)];
        target.innerHTML = `<div class="target-value">${value}</div>`;
        target.dataset.value = value;

        target.addEventListener('click', (e) => {
            e.stopPropagation();
            handleTargetPracticeHit(value, target);
        });

        canvas.appendChild(target);

        // Animate target movement
        animateTarget(target);
    }
}

function animateTarget(target) {
    // CRITICAL: Check if we're still in target practice game
    if (GameState.currentGame !== 'targetPractice') {
        return;
    }

    const duration = 3000 + Math.random() * 2000;
    const newX = Math.random() * 80 + 10;
    const newY = Math.random() * 80 + 10;

    target.style.transition = `all ${duration}ms linear`;
    target.style.left = newX + '%';
    target.style.top = newY + '%';

    setTimeout(() => {
        if (target.parentElement && GameState.currentGame === 'targetPractice') {
            animateTarget(target);
        }
    }, duration);
}

function handleTargetPracticeHit(points, target) {
    const currentPlayer = GameState.players[GameState.currentPlayerIndex];

    if (currentPlayer.data.throws >= 10) {
        alert('You have used all your throws!');
        return;
    }

    saveState();

    currentPlayer.score += points;
    currentPlayer.data.throws = (currentPlayer.data.throws || 0) + 1;

    // Visual feedback
    target.style.transform = 'scale(0)';
    setTimeout(() => {
        target.remove();
    }, 300);

    updateScoreboard();

    // Check if player has finished
    if (currentPlayer.data.throws >= 10) {
        setTimeout(() => {
            const allFinished = GameState.players.every(p => p.data.throws >= 10);
            if (allFinished) {
                endGame();
            } else {
                if (confirm(`${currentPlayer.name} has finished! Next player?`)) {
                    nextPlayer();
                }
            }
        }, 500);
    }
}

// ============================================
// GAME 5: ZOMBIE HUNT
// ============================================
function initZombieHunt() {
    const canvas = document.getElementById('gameCanvas');

    // Initialize game data
    if (!GameState.gameData.timeRemaining) {
        GameState.gameData.timeRemaining = 60;
        GameState.gameData.zombiesKilled = 0;
    }

    // Start spawning zombies
    spawnZombie();

    // Start timer
    startZombieTimer();
}

function spawnZombie() {
    // CRITICAL: Check if we're still in zombie hunt game
    if (GameState.currentGame !== 'zombieHunt') {
        return;
    }

    if (GameState.gameData.timeRemaining <= 0) {
        return;
    }

    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    const zombie = document.createElement('div');
    zombie.className = 'zombie';
    zombie.textContent = '🧟';

    // Random position
    zombie.style.left = Math.random() * 90 + 5 + '%';
    zombie.style.top = Math.random() * 90 + 5 + '%';

    zombie.addEventListener('click', () => handleZombieClick(zombie));

    canvas.appendChild(zombie);

    // Spawn next zombie
    const spawnDelay = Math.max(500, 2000 - GameState.gameData.zombiesKilled * 50);
    const timeoutId = setTimeout(() => spawnZombie(), spawnDelay);

    // Store timeout ID so we can clear it if needed
    if (!GameState.gameData.zombieTimeouts) {
        GameState.gameData.zombieTimeouts = [];
    }
    GameState.gameData.zombieTimeouts.push(timeoutId);

    // Remove zombie after some time if not clicked
    setTimeout(() => {
        if (zombie.parentElement && !zombie.classList.contains('hit')) {
            zombie.remove();
        }
    }, 5000);
}

function handleZombieClick(zombie) {
    if (zombie.classList.contains('hit')) {
        return;
    }

    saveState();

    zombie.classList.add('hit');
    const currentPlayer = GameState.players[GameState.currentPlayerIndex];
    currentPlayer.score += 10;
    GameState.gameData.zombiesKilled++;

    updateScoreboard();

    setTimeout(() => {
        zombie.remove();
    }, 500);
}

function startZombieTimer() {
    const updateTimer = () => {
        // CRITICAL: Check if we're still in zombie hunt game
        if (GameState.currentGame !== 'zombieHunt') {
            return;
        }

        GameState.gameData.timeRemaining--;

        // Update display
        const instructions = document.getElementById('gameInstructions');
        if (instructions) {
            instructions.textContent = `Time: ${GameState.gameData.timeRemaining}s | Zombies: ${GameState.gameData.zombiesKilled}`;
        }

        if (GameState.gameData.timeRemaining <= 0) {
            setTimeout(() => {
                if (GameState.currentGame === 'zombieHunt') {
                    endGame();
                }
            }, 500);
        } else {
            const timeoutId = setTimeout(updateTimer, 1000);
            // Store timeout ID
            if (!GameState.gameData.zombieTimeouts) {
                GameState.gameData.zombieTimeouts = [];
            }
            GameState.gameData.zombieTimeouts.push(timeoutId);
        }
    };

    updateTimer();
}

// ============================================
// GAME 6: CONNECT FOUR
// ============================================
function initConnectFour() {
    const canvas = document.getElementById('gameCanvas');

    // Initialize game data
    if (!GameState.gameData.board) {
        GameState.gameData.board = Array(6).fill(null).map(() => Array(7).fill(null));
        GameState.gameData.symbols = ['🔴', '🟡'];
    }

    const grid = document.createElement('div');
    grid.className = 'c4-grid';

    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
            const cell = document.createElement('div');
            cell.className = 'c4-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;

            if (GameState.gameData.board[row][col] !== null) {
                cell.textContent = GameState.gameData.board[row][col];
                cell.classList.add('filled');
            }

            cell.addEventListener('click', () => handleConnectFourClick(col));

            grid.appendChild(cell);
        }
    }

    canvas.appendChild(grid);
}

function handleConnectFourClick(col) {
    // Find the lowest empty row in this column
    let row = -1;
    for (let r = 5; r >= 0; r--) {
        if (GameState.gameData.board[r][col] === null) {
            row = r;
            break;
        }
    }

    if (row === -1) {
        alert('Column is full!');
        return;
    }

    saveState();

    const symbol = GameState.gameData.symbols[GameState.currentPlayerIndex % 2];
    GameState.gameData.board[row][col] = symbol;

    // Update display
    const cells = document.querySelectorAll('.c4-cell');
    cells.forEach(cell => {
        const r = parseInt(cell.dataset.row);
        const c = parseInt(cell.dataset.col);
        if (r === row && c === col) {
            cell.textContent = symbol;
            cell.classList.add('filled');
        }
    });

    // Check for winner
    const winner = checkConnectFourWinner(row, col);
    if (winner !== null) {
        setTimeout(() => {
            if (winner === 'draw') {
                alert("It's a draw!");
                endGame();
            } else {
                GameState.players[winner].score += 100;
                updateScoreboard();
                endGame();
            }
        }, 300);
    } else {
        nextPlayer();
    }
}

function checkConnectFourWinner(row, col) {
    const board = GameState.gameData.board;
    const symbol = board[row][col];

    // Check horizontal
    let count = 1;
    for (let c = col - 1; c >= 0 && board[row][c] === symbol; c--) count++;
    for (let c = col + 1; c < 7 && board[row][c] === symbol; c++) count++;
    if (count >= 4) return findPlayerBySymbol(symbol);

    // Check vertical
    count = 1;
    for (let r = row - 1; r >= 0 && board[r][col] === symbol; r--) count++;
    for (let r = row + 1; r < 6 && board[r][col] === symbol; r++) count++;
    if (count >= 4) return findPlayerBySymbol(symbol);

    // Check diagonal \
    count = 1;
    for (let i = 1; row - i >= 0 && col - i >= 0 && board[row - i][col - i] === symbol; i++) count++;
    for (let i = 1; row + i < 6 && col + i < 7 && board[row + i][col + i] === symbol; i++) count++;
    if (count >= 4) return findPlayerBySymbol(symbol);

    // Check diagonal /
    count = 1;
    for (let i = 1; row - i >= 0 && col + i < 7 && board[row - i][col + i] === symbol; i++) count++;
    for (let i = 1; row + i < 6 && col - i >= 0 && board[row + i][col - i] === symbol; i++) count++;
    if (count >= 4) return findPlayerBySymbol(symbol);

    // Check for draw
    if (board.every(row => row.every(cell => cell !== null))) {
        return 'draw';
    }

    return null;
}

function findPlayerBySymbol(symbol) {
    return GameState.players.findIndex((p, i) =>
        GameState.gameData.symbols[i % 2] === symbol
    );
}

// ============================================
// GAME 7: 21 GAME
// ============================================
function init21Game() {
    const canvas = document.getElementById('gameCanvas');

    // Create bullseye target (similar to classic but different scoring)
    const target = document.createElement('div');
    target.className = 'target-bullseye';

    const rings = [
        { size: 100, color: '#FFD700', points: 7, label: '7' },
        { size: 200, color: '#ff6b6b', points: 5, label: '5' },
        { size: 300, color: '#fff', points: 3, label: '3' },
        { size: 400, color: '#000', points: 2, label: '2' },
        { size: 500, color: '#f0a500', points: 1, label: '1' },
        { size: 600, color: '#1a1a2e', points: 0, label: '0' }
    ];

    rings.reverse().forEach(ring => {
        const ringDiv = document.createElement('div');
        ringDiv.className = 'target-ring';
        ringDiv.style.width = ring.size + 'px';
        ringDiv.style.height = ring.size + 'px';
        ringDiv.style.background = ring.color;
        ringDiv.style.color = ring.color === '#fff' || ring.color === '#FFD700' ? '#000' : '#fff';
        ringDiv.textContent = ring.label;
        ringDiv.dataset.points = ring.points;

        ringDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            handle21GameHit(ring.points);
        });

        target.appendChild(ringDiv);
    });

    // Add click handler for misses
    canvas.addEventListener('click', handle21GameMiss);

    canvas.appendChild(target);
}

function handle21GameMiss(e) {
    // Only handle clicks on the canvas itself, not on rings
    if (e.target.id === 'gameCanvas' || e.target.classList.contains('target-bullseye')) {
        // Miss = 0 points, just update display
        updateScoreboard();
    }
}

function handle21GameHit(points) {
    const currentPlayer = GameState.players[GameState.currentPlayerIndex];

    saveState();

    currentPlayer.score += points;

    // Check if player went over 21 or hit exactly 21
    if (currentPlayer.score > 21) {
        alert(`${currentPlayer.name} went over 21! Setting score to 0.`);
        currentPlayer.score = 0;
    } else if (currentPlayer.score === 21) {
        updateScoreboard();
        setTimeout(() => {
            endGame();
        }, 500);
        return;
    }

    updateScoreboard();
}

// ============================================
// GAME 8: KNOCKOUT
// ============================================
function initKnockout() {
    const canvas = document.getElementById('gameCanvas');

    // Initialize player numbers
    GameState.players.forEach((player, index) => {
        if (!player.data.numbers) {
            player.data.numbers = [15, 16, 17, 18, 19, 20, 25]; // Standard knockout numbers
            player.data.lives = 3;
        }
    });

    renderKnockoutBoard();
}

function renderKnockoutBoard() {
    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = '';

    const boardDiv = document.createElement('div');
    boardDiv.style.position = 'absolute';
    boardDiv.style.top = '50%';
    boardDiv.style.left = '50%';
    boardDiv.style.transform = 'translate(-50%, -50%)';
    boardDiv.style.width = '90%';
    boardDiv.style.maxWidth = '800px';

    GameState.players.forEach((player, pIndex) => {
        const playerSection = document.createElement('div');
        playerSection.style.marginBottom = '30px';
        playerSection.style.padding = '20px';
        playerSection.style.background = 'rgba(42, 42, 62, 0.8)';
        playerSection.style.borderRadius = '15px';
        playerSection.style.border = pIndex === GameState.currentPlayerIndex ? '3px solid #ff6b6b' : '2px solid #555';

        const playerTitle = document.createElement('div');
        playerTitle.style.fontSize = '1.5rem';
        playerTitle.style.color = '#f0a500';
        playerTitle.style.marginBottom = '15px';
        playerTitle.textContent = `${player.name} - Lives: ${'❤️'.repeat(player.data.lives)}`;

        const numbersDiv = document.createElement('div');
        numbersDiv.style.display = 'flex';
        numbersDiv.style.gap = '10px';
        numbersDiv.style.flexWrap = 'wrap';
        numbersDiv.style.justifyContent = 'center';

        player.data.numbers.forEach(num => {
            const numBtn = document.createElement('button');
            numBtn.textContent = num;
            numBtn.style.width = '70px';
            numBtn.style.height = '70px';
            numBtn.style.fontSize = '1.5rem';
            numBtn.style.fontWeight = 'bold';
            numBtn.style.background = '#f0a500';
            numBtn.style.border = 'none';
            numBtn.style.borderRadius = '10px';
            numBtn.style.cursor = 'pointer';
            numBtn.style.color = '#1a1a2e';

            numBtn.addEventListener('click', () => handleKnockoutHit(pIndex, num));

            numbersDiv.appendChild(numBtn);
        });

        playerSection.appendChild(playerTitle);
        playerSection.appendChild(numbersDiv);
        boardDiv.appendChild(playerSection);
    });

    canvas.appendChild(boardDiv);
}

function handleKnockoutHit(targetPlayerIndex, number) {
    // Can only hit other players' numbers, not your own
    if (targetPlayerIndex === GameState.currentPlayerIndex) {
        alert('You cannot eliminate your own numbers!');
        return;
    }

    saveState();

    const targetPlayer = GameState.players[targetPlayerIndex];
    const numIndex = targetPlayer.data.numbers.indexOf(number);

    if (numIndex > -1) {
        targetPlayer.data.numbers.splice(numIndex, 1);
        GameState.players[GameState.currentPlayerIndex].score += 10;

        // Check if player is eliminated
        if (targetPlayer.data.numbers.length === 0) {
            targetPlayer.data.lives--;

            if (targetPlayer.data.lives <= 0) {
                alert(`${targetPlayer.name} is eliminated!`);

                // Check if only one player remains
                const remainingPlayers = GameState.players.filter(p => p.data.lives > 0);
                if (remainingPlayers.length === 1) {
                    setTimeout(() => {
                        endGame();
                    }, 500);
                    return;
                }
            } else {
                // Reset numbers
                targetPlayer.data.numbers = [15, 16, 17, 18, 19, 20, 25];
            }
        }

        renderKnockoutBoard();
        updateScoreboard();
    }
}
