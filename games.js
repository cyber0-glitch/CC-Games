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
        ringDiv.dataset.points = ring.points;

        // Create label element positioned on the ring
        const label = document.createElement('div');
        label.className = 'ring-label';
        label.textContent = ring.label;
        label.style.position = 'absolute';
        label.style.top = '50%';
        label.style.left = '50%';
        label.style.transform = 'translate(-50%, -50%)';
        label.style.fontSize = '1.5rem';
        label.style.fontWeight = 'bold';
        label.style.color = ring.color === '#fff' || ring.color === '#FFD700' ? '#000' : '#fff';
        label.style.pointerEvents = 'none';
        label.style.zIndex = '10';
        ringDiv.style.position = 'relative';

        ringDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            handleBullseyeHit(ring.points);
        });

        ringDiv.appendChild(label);
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
        if (!player.data.completedZones) {
            player.data.completedZones = [];
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
        currentPlayer.data.completedZones.push(zoneNumber);
        currentPlayer.data.currentZone = currentZone + 1;
        currentPlayer.score += 10;

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
    const completedZones = currentPlayer.data.completedZones || [];

    zones.forEach(zone => {
        const zoneNum = parseInt(zone.dataset.zone);
        zone.classList.remove('active', 'completed');

        // Show completed zones for CURRENT player only with transparency
        if (completedZones.includes(zoneNum)) {
            zone.classList.add('completed');
        }

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

        // Animate target movement with delay
        if (GameState.settings.movingTargets) {
            setTimeout(() => {
                animateTarget(target);
            }, 1000); // 1 second delay before starting movement
        }
    }
}

function animateTarget(target) {
    // CRITICAL: Check if we're still in target practice game
    if (GameState.currentGame !== 'targetPractice') {
        return;
    }

    // Check if moving targets is enabled
    if (!GameState.settings.movingTargets) {
        return;
    }

    const duration = 3000 + Math.random() * 2000;
    const newX = Math.random() * 80 + 10;
    const newY = Math.random() * 80 + 10;

    target.style.transition = `all ${duration}ms linear`;
    target.style.left = newX + '%';
    target.style.top = newY + '%';

    setTimeout(() => {
        if (target.parentElement && GameState.currentGame === 'targetPractice' && GameState.settings.movingTargets) {
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

        // Generate a new target if player still has throws remaining
        if (currentPlayer.data.throws < 10) {
            generateSingleTarget();
        }
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

function generateSingleTarget() {
    const canvas = document.getElementById('gameCanvas');
    const targetValues = [10, 20, 30, 50, 100];

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

    // Animate target movement with delay
    if (GameState.settings.movingTargets) {
        setTimeout(() => {
            animateTarget(target);
        }, 1000); // 1 second delay before starting movement
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

    // Position based on settings
    if (GameState.settings.movingTargets) {
        // Random position for moving zombies
        zombie.style.left = Math.random() * 90 + 5 + '%';
        zombie.style.top = Math.random() * 90 + 5 + '%';
    } else {
        // Fixed grid positions when movement is disabled
        if (!GameState.gameData.zombieGridIndex) {
            GameState.gameData.zombieGridIndex = 0;
        }
        const gridPositions = [
            { left: '20%', top: '20%' },
            { left: '50%', top: '20%' },
            { left: '80%', top: '20%' },
            { left: '20%', top: '50%' },
            { left: '50%', top: '50%' },
            { left: '80%', top: '50%' },
            { left: '20%', top: '80%' },
            { left: '50%', top: '80%' },
            { left: '80%', top: '80%' }
        ];
        const pos = gridPositions[GameState.gameData.zombieGridIndex % gridPositions.length];
        zombie.style.left = pos.left;
        zombie.style.top = pos.top;
        GameState.gameData.zombieGridIndex++;
    }

    zombie.addEventListener('click', () => handleZombieClick(zombie));

    canvas.appendChild(zombie);

    // Animate zombie movement if enabled, otherwise disable transitions
    if (GameState.settings.movingTargets) {
        animateZombie(zombie);
    } else {
        zombie.style.transition = 'none';
    }

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

function animateZombie(zombie) {
    // Check if we're still in zombie hunt game
    if (GameState.currentGame !== 'zombieHunt') {
        return;
    }

    // Check if moving targets is enabled
    if (!GameState.settings.movingTargets) {
        return;
    }

    const duration = 2000 + Math.random() * 1000;
    const newX = Math.random() * 90 + 5;
    const newY = Math.random() * 90 + 5;

    zombie.style.transition = `all ${duration}ms linear`;
    zombie.style.left = newX + '%';
    zombie.style.top = newY + '%';

    setTimeout(() => {
        if (zombie.parentElement && GameState.currentGame === 'zombieHunt' && GameState.settings.movingTargets && !zombie.classList.contains('hit')) {
            animateZombie(zombie);
        }
    }, duration);
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
        ringDiv.dataset.points = ring.points;

        // Create label element positioned on the ring
        const label = document.createElement('div');
        label.className = 'ring-label';
        label.textContent = ring.label;
        label.style.position = 'absolute';
        label.style.top = '50%';
        label.style.left = '50%';
        label.style.transform = 'translate(-50%, -50%)';
        label.style.fontSize = '1.5rem';
        label.style.fontWeight = 'bold';
        label.style.color = ring.color === '#fff' || ring.color === '#FFD700' ? '#000' : '#fff';
        label.style.pointerEvents = 'none';
        label.style.zIndex = '10';
        ringDiv.style.position = 'relative';

        ringDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            handle21GameHit(ring.points);
        });

        ringDiv.appendChild(label);
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
// GAME 8: KNOCKOUT (Cricket-style)
// ============================================
function initKnockout() {
    const canvas = document.getElementById('gameCanvas');

    // Initialize player cricket data
    GameState.players.forEach((player, index) => {
        if (!player.data.cricket) {
            player.data.cricket = {
                15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 25: 0
            };
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
    boardDiv.style.width = '95%';
    boardDiv.style.maxWidth = '900px';
    boardDiv.style.overflowY = 'auto';
    boardDiv.style.maxHeight = '80vh';

    // Create header
    const header = document.createElement('div');
    header.style.display = 'grid';
    header.style.gridTemplateColumns = `150px repeat(${GameState.players.length}, 1fr)`;
    header.style.gap = '10px';
    header.style.marginBottom = '20px';
    header.style.alignItems = 'center';

    // Number column header
    const numHeader = document.createElement('div');
    numHeader.style.fontSize = '1.3rem';
    numHeader.style.fontWeight = 'bold';
    numHeader.style.color = '#f0a500';
    numHeader.style.textAlign = 'center';
    numHeader.textContent = 'Number';
    header.appendChild(numHeader);

    // Player headers
    GameState.players.forEach((player, pIndex) => {
        const playerHeader = document.createElement('div');
        playerHeader.style.fontSize = '1.1rem';
        playerHeader.style.fontWeight = 'bold';
        playerHeader.style.color = pIndex === GameState.currentPlayerIndex ? '#ff6b6b' : '#aaa';
        playerHeader.style.textAlign = 'center';
        playerHeader.style.padding = '10px';
        playerHeader.style.background = 'rgba(42, 42, 62, 0.6)';
        playerHeader.style.borderRadius = '10px';
        playerHeader.textContent = player.name;
        header.appendChild(playerHeader);
    });

    boardDiv.appendChild(header);

    // Create rows for each number
    const numbers = [20, 19, 18, 17, 16, 15, 25];
    numbers.forEach(num => {
        const row = document.createElement('div');
        row.style.display = 'grid';
        row.style.gridTemplateColumns = `150px repeat(${GameState.players.length}, 1fr)`;
        row.style.gap = '10px';
        row.style.marginBottom = '15px';
        row.style.alignItems = 'center';

        // Number label
        const numLabel = document.createElement('div');
        numLabel.style.fontSize = '2rem';
        numLabel.style.fontWeight = 'bold';
        numLabel.style.color = '#f0a500';
        numLabel.style.textAlign = 'center';
        numLabel.style.background = 'rgba(240, 165, 0, 0.2)';
        numLabel.style.padding = '15px';
        numLabel.style.borderRadius = '10px';
        numLabel.textContent = num;
        row.appendChild(numLabel);

        // Player cells
        GameState.players.forEach((player, pIndex) => {
            const cell = document.createElement('button');
            const hits = player.data.cricket[num] || 0;
            const marks = ['', '/', 'X', '⊗'][Math.min(hits, 3)];

            cell.textContent = marks;
            cell.style.fontSize = '2.5rem';
            cell.style.fontWeight = 'bold';
            cell.style.padding = '0';
            cell.style.background = hits >= 3 ? '#4ecdc4' : 'rgba(42, 42, 62, 0.8)';
            cell.style.color = hits >= 3 ? '#1a1a2e' : '#fff';
            cell.style.border = '2px solid #555';
            cell.style.borderRadius = '50%';
            cell.style.cursor = 'pointer';
            cell.style.width = '80px';
            cell.style.height = '80px';
            cell.style.display = 'flex';
            cell.style.alignItems = 'center';
            cell.style.justifyContent = 'center';

            cell.addEventListener('click', () => handleKnockoutHit(num));

            row.appendChild(cell);
        });

        boardDiv.appendChild(row);
    });

    canvas.appendChild(boardDiv);
}

function handleKnockoutHit(number) {
    const currentPlayer = GameState.players[GameState.currentPlayerIndex];

    saveState();

    // Increment hit count for this number
    currentPlayer.data.cricket[number] = (currentPlayer.data.cricket[number] || 0) + 1;

    // If this number is closed (3+ hits) and not all opponents have closed it, score points
    if (currentPlayer.data.cricket[number] > 3) {
        // Check if any opponent hasn't closed this number
        const canScore = GameState.players.some((p, i) =>
            i !== GameState.currentPlayerIndex && (p.data.cricket[number] || 0) < 3
        );

        if (canScore) {
            currentPlayer.score += number;
        }
    }

    renderKnockoutBoard();
    updateScoreboard();

    // Check for win condition
    const allClosed = Object.values(currentPlayer.data.cricket).every(hits => hits >= 3);
    if (allClosed) {
        // Check if current player has most points or tied
        const maxOpponentScore = Math.max(...GameState.players
            .filter((p, i) => i !== GameState.currentPlayerIndex)
            .map(p => p.score));

        if (currentPlayer.score >= maxOpponentScore) {
            setTimeout(() => {
                endGame();
            }, 500);
            return;
        }
    }
}
