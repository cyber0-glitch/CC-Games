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

    // Use percentages for responsive scaling
    const rings = [
        { size: '15%', color: '#FFD700', points: 50, label: '50' },
        { size: '30%', color: '#ff6b6b', points: 25, label: '25' },
        { size: '45%', color: '#fff', points: 15, label: '15' },
        { size: '60%', color: '#000', points: 10, label: '10' },
        { size: '75%', color: '#f0a500', points: 5, label: '5' },
        { size: '90%', color: '#1a1a2e', points: 1, label: '1' }
    ];

    rings.reverse().forEach((ring, index) => {
        const ringDiv = document.createElement('div');
        ringDiv.className = 'target-ring';
        ringDiv.style.width = ring.size;
        ringDiv.style.height = ring.size;
        ringDiv.style.background = ring.color;
        ringDiv.dataset.points = ring.points;
        // Set z-index so smaller rings are on top (index 0 is largest, index 5 is smallest)
        ringDiv.style.zIndex = String(index + 1);

        // Create label element positioned on the ring edge
        const label = document.createElement('div');
        label.className = 'ring-label';
        label.textContent = ring.label;
        label.style.position = 'absolute';
        // Center the label for the smallest ring (50 points), move others up
        if (ring.points === 50) {
            label.style.top = '50%';
            label.style.transform = 'translate(-50%, -50%)';
        } else {
            label.style.top = '5px';
            label.style.transform = 'translateX(-50%)';
        }
        label.style.left = '50%';
        label.style.fontSize = 'min(1.2rem, 1.8vw, 1.8vh)';
        label.style.fontWeight = 'bold';
        label.style.color = ring.color === '#fff' || ring.color === '#FFD700' ? '#000' : '#fff';
        label.style.pointerEvents = 'none';
        label.style.zIndex = '10';
        label.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';

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

        // Position zones in a circle - optimized for larger container
        const radius = 320; // Increased for better spacing with larger container
        const angleRad = (angle + (360 / zones) / 2) * Math.PI / 180;
        const x = Math.cos(angleRad) * radius * 0.65;
        const y = Math.sin(angleRad) * radius * 0.65;

        zone.style.width = '80px'; // Increased for better visibility
        zone.style.height = '80px';
        zone.style.left = `calc(50% + ${x}px - 40px)`;
        zone.style.top = `calc(50% + ${y}px - 40px)`;
        zone.style.borderRadius = '50%';
        zone.style.fontSize = '1.6rem'; // Increased font size
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

    const numTargets = GameState.settings.maxTargets;
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

    // Movement phase: target moves for moveDuration seconds
    const moveDurationMs = GameState.settings.moveDuration * 1000;
    const newX = Math.random() * 80 + 10;
    const newY = Math.random() * 80 + 10;

    target.style.transition = `all ${moveDurationMs}ms linear`;
    target.style.left = newX + '%';
    target.style.top = newY + '%';

    // After movement, enter static phase
    setTimeout(() => {
        if (!target.parentElement || GameState.currentGame !== 'targetPractice' || !GameState.settings.movingTargets) {
            return;
        }

        // Static phase: target stays still for staticDuration seconds
        const staticDurationMs = GameState.settings.staticDuration * 1000;
        target.style.transition = 'none'; // Disable transition during static phase

        // After static phase, start moving again
        setTimeout(() => {
            if (target.parentElement && GameState.currentGame === 'targetPractice' && GameState.settings.movingTargets) {
                animateTarget(target); // Repeat the cycle
            }
        }, staticDurationMs);
    }, moveDurationMs);
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

    // Initialize player data with individual timers
    GameState.players.forEach(player => {
        if (!player.data.timeRemaining) {
            player.data.timeRemaining = GameState.settings.zombieCountdown;
            player.data.zombiesKilled = 0;
            player.data.finished = false;
        }
    });

    // Initialize game data
    if (!GameState.gameData.initialized) {
        GameState.gameData.initialized = true;
    }

    // Start spawning zombies
    spawnZombie();

    // Start timer for current player
    startZombieTimer();
}

function spawnZombie() {
    // CRITICAL: Check if we're still in zombie hunt game
    if (GameState.currentGame !== 'zombieHunt') {
        return;
    }

    const currentPlayer = GameState.players[GameState.currentPlayerIndex];
    if (!currentPlayer || currentPlayer.data.finished) {
        return;
    }

    // Check timer setting - if timer is disabled, skip time check
    if (GameState.settings.zombieTimer && currentPlayer.data.timeRemaining <= 0) {
        return;
    }

    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    // Limit maximum zombies on screen
    const currentZombies = canvas.querySelectorAll('.zombie:not(.hit)').length;
    const maxZombies = GameState.settings.maxZombies; // Maximum zombies allowed on screen at once
    if (currentZombies >= maxZombies) {
        // Try again later
        const retryDelay = 500;
        const timeoutId = setTimeout(() => spawnZombie(), retryDelay);
        if (!GameState.gameData.zombieTimeouts) {
            GameState.gameData.zombieTimeouts = [];
        }
        GameState.gameData.zombieTimeouts.push(timeoutId);
        return;
    }

    const zombie = document.createElement('div');
    zombie.className = 'zombie';
    zombie.textContent = '🧟';

    // Position based on settings
    if (GameState.settings.movingTargets) {
        // Random position for moving zombies
        zombie.style.left = Math.random() * 90 + 5 + '%';
        zombie.style.top = Math.random() * 90 + 5 + '%';
    } else {
        // Random non-overlapping positions when movement is disabled
        const existingZombies = Array.from(canvas.querySelectorAll('.zombie:not(.hit)'));
        let position = findNonOverlappingPosition(existingZombies);
        zombie.style.left = position.left;
        zombie.style.top = position.top;
    }

    zombie.addEventListener('click', () => handleZombieClick(zombie));

    canvas.appendChild(zombie);

    // Animate zombie movement if enabled, otherwise disable transitions AND animations
    if (GameState.settings.movingTargets) {
        zombie.classList.add('floating');
        animateZombie(zombie);
    } else {
        zombie.style.transition = 'none';
        zombie.style.animation = 'none';
        zombie.classList.remove('floating');
    }

    // Spawn next zombie with adaptive delay
    const spawnDelay = Math.max(800, 2000 - (currentPlayer.data.zombiesKilled || 0) * 30);
    const timeoutId = setTimeout(() => spawnZombie(), spawnDelay);

    // Store timeout ID so we can clear it if needed
    if (!GameState.gameData.zombieTimeouts) {
        GameState.gameData.zombieTimeouts = [];
    }
    GameState.gameData.zombieTimeouts.push(timeoutId);

    // Remove zombie after some time if not clicked
    // Use configurable despawn time from settings
    const despawnTime = GameState.settings.zombieDespawnTime * 1000; // Convert seconds to milliseconds
    setTimeout(() => {
        if (zombie.parentElement && !zombie.classList.contains('hit')) {
            zombie.remove();
        }
    }, despawnTime);
}

// Helper function to find non-overlapping position
function findNonOverlappingPosition(existingZombies) {
    const minDistance = 100; // Minimum distance in pixels between zombies
    let attempts = 0;
    const maxAttempts = 50;

    while (attempts < maxAttempts) {
        // Generate random position (5% to 90% range)
        const left = Math.random() * 85 + 5;
        const top = Math.random() * 85 + 5;

        // Check if this position overlaps with existing zombies
        let overlaps = false;
        for (let existingZombie of existingZombies) {
            const existingLeft = parseFloat(existingZombie.style.left);
            const existingTop = parseFloat(existingZombie.style.top);

            // Calculate distance (in percentage units)
            const distance = Math.sqrt(
                Math.pow(left - existingLeft, 2) +
                Math.pow(top - existingTop, 2)
            );

            if (distance < 12) { // 12% distance minimum
                overlaps = true;
                break;
            }
        }

        if (!overlaps) {
            return { left: left + '%', top: top + '%' };
        }

        attempts++;
    }

    // If we couldn't find a non-overlapping position, return a random one
    return {
        left: Math.random() * 85 + 5 + '%',
        top: Math.random() * 85 + 5 + '%'
    };
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

    // Movement phase: zombie moves for moveDuration seconds
    const moveDurationMs = GameState.settings.moveDuration * 1000;
    const newX = Math.random() * 90 + 5;
    const newY = Math.random() * 90 + 5;

    zombie.style.transition = `all ${moveDurationMs}ms linear`;
    zombie.style.left = newX + '%';
    zombie.style.top = newY + '%';

    // After movement, enter static phase
    setTimeout(() => {
        if (!zombie.parentElement || GameState.currentGame !== 'zombieHunt' || !GameState.settings.movingTargets || zombie.classList.contains('hit')) {
            return;
        }

        // Static phase: zombie stays still for staticDuration seconds
        const staticDurationMs = GameState.settings.staticDuration * 1000;
        zombie.style.transition = 'none'; // Disable transition during static phase

        // After static phase, start moving again
        setTimeout(() => {
            if (zombie.parentElement && GameState.currentGame === 'zombieHunt' && GameState.settings.movingTargets && !zombie.classList.contains('hit')) {
                animateZombie(zombie); // Repeat the cycle
            }
        }, staticDurationMs);
    }, moveDurationMs);
}

function handleZombieClick(zombie) {
    if (zombie.classList.contains('hit')) {
        return;
    }

    saveState();

    zombie.classList.add('hit');
    const currentPlayer = GameState.players[GameState.currentPlayerIndex];
    currentPlayer.score += 10;
    currentPlayer.data.zombiesKilled = (currentPlayer.data.zombiesKilled || 0) + 1;

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

        const currentPlayer = GameState.players[GameState.currentPlayerIndex];
        if (!currentPlayer || currentPlayer.data.finished) {
            return;
        }

        // Only decrement timer if timer setting is enabled
        if (GameState.settings.zombieTimer) {
            currentPlayer.data.timeRemaining--;
        }

        // Update display
        const instructions = document.getElementById('gameInstructions');
        if (instructions) {
            if (GameState.settings.zombieTimer) {
                instructions.textContent = `${currentPlayer.name} - Time: ${currentPlayer.data.timeRemaining}s | Zombies: ${currentPlayer.data.zombiesKilled || 0}`;
            } else {
                instructions.textContent = `${currentPlayer.name} - Zombies: ${currentPlayer.data.zombiesKilled || 0}`;
            }
        }

        // Only check for time-based game end if timer is enabled
        if (GameState.settings.zombieTimer && currentPlayer.data.timeRemaining <= 0) {
            currentPlayer.data.finished = true;

            // Check if all players finished
            const allFinished = GameState.players.every(p => p.data.finished);

            if (allFinished) {
                setTimeout(() => {
                    if (GameState.currentGame === 'zombieHunt') {
                        endGame();
                    }
                }, 500);
            } else {
                // Move to next player
                setTimeout(() => {
                    // Clear zombies from canvas
                    const canvas = document.getElementById('gameCanvas');
                    if (canvas) {
                        canvas.innerHTML = '';
                    }

                    // Move to next unfinished player
                    let nextIndex = (GameState.currentPlayerIndex + 1) % GameState.players.length;
                    while (GameState.players[nextIndex].data.finished && !allFinished) {
                        nextIndex = (nextIndex + 1) % GameState.players.length;
                    }
                    GameState.currentPlayerIndex = nextIndex;

                    updateScoreboard();
                    updateCurrentPlayerDisplay();

                    // Start new player's turn
                    spawnZombie();
                    startZombieTimer();
                }, 1000);
            }
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
        { size: 60, color: '#FFD700', points: 7, label: '7' },
        { size: 120, color: '#ff6b6b', points: 5, label: '5' },
        { size: 180, color: '#fff', points: 3, label: '3' },
        { size: 240, color: '#000', points: 2, label: '2' },
        { size: 300, color: '#f0a500', points: 1, label: '1' },
        { size: 360, color: '#1a1a2e', points: 0, label: '0' }
    ];

    rings.reverse().forEach((ring, index) => {
        const ringDiv = document.createElement('div');
        ringDiv.className = 'target-ring';
        ringDiv.style.width = ring.size + 'px';
        ringDiv.style.height = ring.size + 'px';
        ringDiv.style.background = ring.color;
        ringDiv.dataset.points = ring.points;
        // Set z-index so smaller rings are on top (index 0 is largest, index 5 is smallest)
        ringDiv.style.zIndex = String(index + 1);

        // Create label element positioned on the ring edge
        const label = document.createElement('div');
        label.className = 'ring-label';
        label.textContent = ring.label;
        label.style.position = 'absolute';
        // Center the label for the smallest ring (7 points), move others up
        if (ring.size === 60) {
            label.style.top = '50%';
            label.style.transform = 'translate(-50%, -50%)';
        } else {
            label.style.top = '5px';
            label.style.transform = 'translateX(-50%)';
        }
        label.style.left = '50%';
        label.style.fontSize = '1.2rem';
        label.style.fontWeight = 'bold';
        label.style.color = ring.color === '#fff' || ring.color === '#FFD700' ? '#000' : '#fff';
        label.style.pointerEvents = 'none';
        label.style.zIndex = '10';
        label.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';

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

    const previousScore = currentPlayer.score;
    currentPlayer.score += points;

    // Check if player went over 21 or hit exactly 21
    if (currentPlayer.score > 21) {
        if (GameState.settings.hardMode) {
            // Hard mode: reset to 0
            alert(`${currentPlayer.name} went over 21! Setting score to 0.`);
            currentPlayer.score = 0;
        } else {
            // Easy mode: keep previous score
            alert(`${currentPlayer.name} went over 21! Score remains at ${previousScore}.`);
            currentPlayer.score = previousScore;
        }
        // Move to next player
        updateScoreboard();
        setTimeout(() => {
            nextPlayer();
        }, 500);
        return;
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
    // Responsive sizing: fit within viewport
    boardDiv.style.maxWidth = 'min(85vw, 900px)';
    boardDiv.style.overflowY = 'auto';
    boardDiv.style.maxHeight = '80vh';

    // Create header
    const header = document.createElement('div');
    header.style.display = 'grid';
    header.style.gridTemplateColumns = `150px repeat(${GameState.players.length}, 1fr)`;
    header.style.gap = '10px';
    header.style.marginBottom = '20px';
    header.style.alignItems = 'center';
    header.style.justifyItems = 'center';

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
        row.style.justifyItems = 'center';

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

// ============================================
// GAME 9: AXE CRUSH (Match-3 Grid Puzzle)
// ============================================
function initAxeCrush() {
    const canvas = document.getElementById('gameCanvas');
    
    // Initialize player data
    GameState.players.forEach(player => {
        player.data.throws = 0;
    });
    
    // Initialize game data
    const cols = GameState.settings.crushGridCols;
    const rows = GameState.settings.crushGridRows;
    const iconTypes = GameState.settings.crushIconTypes;
    
    // Icon symbols (bottles, gems, monsters)
    const icons = ['🍾', '💎', '👹', '⚔️', '🛡️', '🏺', '💰', '🔮'];
    
    // Create grid
    GameState.gameData.grid = [];
    for (let r = 0; r < rows; r++) {
        GameState.gameData.grid[r] = [];
        for (let c = 0; c < cols; c++) {
            GameState.gameData.grid[r][c] = Math.floor(Math.random() * iconTypes);
        }
    }
    
    GameState.gameData.cols = cols;
    GameState.gameData.rows = rows;
    GameState.gameData.icons = icons.slice(0, iconTypes);
    
    renderAxeCrushGrid();
}

function renderAxeCrushGrid() {
    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = '';

    // Add turn indicator
    const currentPlayer = GameState.players[GameState.currentPlayerIndex];
    const maxThrows = GameState.settings.crushThrowsPerPlayer;
    const throwsRemaining = maxThrows - (currentPlayer.data.throws || 0);

    const turnIndicator = document.createElement('div');
    turnIndicator.style.textAlign = 'center';
    turnIndicator.style.marginBottom = '15px';
    turnIndicator.style.padding = '15px';
    turnIndicator.style.background = '#2a2a3e';
    turnIndicator.style.borderRadius = '10px';
    turnIndicator.style.border = '2px solid #f0a500';
    turnIndicator.innerHTML = `
        <div style="font-size: 1.2rem; color: #f0a500; margin-bottom: 5px;">
            <strong>${currentPlayer.name}'s Turn</strong>
        </div>
        <div style="font-size: 1rem; color: #fff;">
            Throws Remaining: <span style="color: #4CAF50; font-weight: bold;">${throwsRemaining}</span> / ${maxThrows}
        </div>
    `;
    canvas.appendChild(turnIndicator);

    const gridContainer = document.createElement('div');
    gridContainer.className = 'crush-grid';
    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = `repeat(${GameState.gameData.cols}, 1fr)`;
    gridContainer.style.gap = '5px';
    // Responsive sizing: increased for better visibility
    gridContainer.style.maxWidth = 'min(60vh, 85vw, 650px)';
    gridContainer.style.margin = '0 auto';
    
    for (let r = 0; r < GameState.gameData.rows; r++) {
        for (let c = 0; c < GameState.gameData.cols; c++) {
            const cell = document.createElement('div');
            cell.className = 'crush-cell';
            cell.style.aspectRatio = '1';
            cell.style.background = '#2a2a3e';
            cell.style.border = '2px solid #555';
            cell.style.borderRadius = '10px';
            cell.style.display = 'flex';
            cell.style.alignItems = 'center';
            cell.style.justifyContent = 'center';
            cell.style.fontSize = '2rem';
            cell.style.cursor = 'pointer';
            cell.style.transition = 'transform 0.2s';
            
            const iconIndex = GameState.gameData.grid[r][c];
            if (iconIndex !== null) {
                cell.textContent = GameState.gameData.icons[iconIndex];
            }
            
            cell.dataset.row = r;
            cell.dataset.col = c;
            
            cell.addEventListener('click', () => handleAxeCrushClick(r, c));
            cell.addEventListener('mouseenter', () => {
                cell.style.transform = 'scale(1.1)';
            });
            cell.addEventListener('mouseleave', () => {
                cell.style.transform = 'scale(1)';
            });
            
            gridContainer.appendChild(cell);
        }
    }
    
    canvas.appendChild(gridContainer);
}

function handleAxeCrushClick(row, col) {
    const currentPlayer = GameState.players[GameState.currentPlayerIndex];
    const maxThrows = GameState.settings.crushThrowsPerPlayer;

    if (currentPlayer.data.throws >= maxThrows) {
        return;
    }

    saveState();

    currentPlayer.data.throws++;

    // NEW MECHANIC: Axe Impact Zone
    // The axe destroys the hit cell and matching icons in a cross pattern (up, down, left, right)
    const iconType = GameState.gameData.grid[row][col];
    if (iconType === null) return;

    const impactZone = [[row, col]]; // Start with the hit cell
    const rows = GameState.gameData.rows;
    const cols = GameState.gameData.cols;

    // Check in all 4 directions for matching icons
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // up, down, left, right

    for (const [dr, dc] of directions) {
        let r = row + dr;
        let c = col + dc;

        // Continue in this direction while we find matching icons
        while (r >= 0 && r < rows && c >= 0 && c < cols && GameState.gameData.grid[r][c] === iconType) {
            impactZone.push([r, c]);
            r += dr;
            c += dc;
        }
    }

    const minGroupSize = GameState.settings.crushMinGroupSize;

    if (impactZone.length >= minGroupSize) {
        // Clear the impact zone and award points
        const points = impactZone.length * 10;
        currentPlayer.score += points;

        // Mark cells as empty
        impactZone.forEach(([r, c]) => {
            GameState.gameData.grid[r][c] = null;
        });

        // Apply gravity
        applyGravity();

        // Fill empty cells
        fillEmptyCells();

        // Check for cascades if enabled
        if (GameState.settings.crushEnableCascades) {
            setTimeout(() => {
                checkCascades(currentPlayer);
            }, 300);
        }
    } else {
        // Still destroy the hit cell, but only award 1 point
        currentPlayer.score += 1;
        GameState.gameData.grid[row][col] = null;
        applyGravity();
        fillEmptyCells();
    }

    renderAxeCrushGrid();
    updateScoreboard();

    // Check if turn is over and automatically advance
    if (currentPlayer.data.throws >= maxThrows) {
        const allFinished = GameState.players.every(p => p.data.throws >= maxThrows);
        if (allFinished) {
            setTimeout(() => endGame(), 500);
        } else {
            // Auto-advance to next player
            setTimeout(() => {
                nextPlayer();
            }, 500);
        }
    }
}

function findConnectedGroup(startRow, startCol, iconType) {
    const visited = new Set();
    const group = [];
    const queue = [[startRow, startCol]];
    const rows = GameState.gameData.rows;
    const cols = GameState.gameData.cols;
    
    while (queue.length > 0) {
        const [r, c] = queue.shift();
        const key = `${r},${c}`;
        
        if (visited.has(key)) continue;
        if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
        if (GameState.gameData.grid[r][c] !== iconType) continue;
        
        visited.add(key);
        group.push([r, c]);
        
        // Check 4 directions
        queue.push([r-1, c], [r+1, c], [r, c-1], [r, c+1]);
    }
    
    return group;
}

function applyGravity() {
    const cols = GameState.gameData.cols;
    const rows = GameState.gameData.rows;
    
    // For each column, move icons down
    for (let c = 0; c < cols; c++) {
        const column = [];
        for (let r = 0; r < rows; r++) {
            if (GameState.gameData.grid[r][c] !== null) {
                column.push(GameState.gameData.grid[r][c]);
            }
        }
        
        // Fill from bottom
        for (let r = 0; r < rows; r++) {
            if (r < rows - column.length) {
                GameState.gameData.grid[r][c] = null;
            } else {
                GameState.gameData.grid[r][c] = column[r - (rows - column.length)];
            }
        }
    }
}

function fillEmptyCells() {
    const cols = GameState.gameData.cols;
    const rows = GameState.gameData.rows;
    const iconTypes = GameState.gameData.icons.length;
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (GameState.gameData.grid[r][c] === null) {
                GameState.gameData.grid[r][c] = Math.floor(Math.random() * iconTypes);
            }
        }
    }
}

function checkCascades(player, comboCount = 0) {
    // Auto-clear any new matches after gravity using cross-pattern logic
    let foundMatch = false;
    const minGroupSize = GameState.settings.crushMinGroupSize;
    const rows = GameState.gameData.rows;
    const cols = GameState.gameData.cols;
    const checked = new Set();

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const key = `${row},${col}`;
            if (checked.has(key)) continue;

            const iconType = GameState.gameData.grid[row][col];
            if (iconType === null) continue;

            // Check cross pattern for this cell
            const impactZone = [[row, col]];
            const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

            for (const [dr, dc] of directions) {
                let r = row + dr;
                let c = col + dc;
                while (r >= 0 && r < rows && c >= 0 && c < cols && GameState.gameData.grid[r][c] === iconType) {
                    impactZone.push([r, c]);
                    r += dr;
                    c += dc;
                }
            }

            if (impactZone.length >= minGroupSize) {
                foundMatch = true;
                const points = Math.floor(impactZone.length * 5); // Smaller bonus for cascades
                player.score += points;

                impactZone.forEach(([r, c]) => {
                    GameState.gameData.grid[r][c] = null;
                    checked.add(`${r},${c}`);
                });
            }
        }
    }

    if (foundMatch) {
        applyGravity();
        fillEmptyCells();
        renderAxeCrushGrid();
        updateScoreboard();

        // Increment combo count
        comboCount++;

        // Check for more cascades
        setTimeout(() => checkCascades(player, comboCount), 300);
    } else if (comboCount > 0) {
        // No more cascades, show final combo notification
        const canvas = document.getElementById('gameCanvas');
        const comboNotif = document.createElement('div');
        comboNotif.style.position = 'fixed';
        comboNotif.style.top = '50%';
        comboNotif.style.left = '50%';
        comboNotif.style.transform = 'translate(-50%, -50%)';
        comboNotif.style.background = 'rgba(244, 67, 54, 0.95)';
        comboNotif.style.color = '#fff';
        comboNotif.style.padding = '30px 50px';
        comboNotif.style.borderRadius = '20px';
        comboNotif.style.fontSize = '2.5rem';
        comboNotif.style.fontWeight = 'bold';
        comboNotif.style.zIndex = '1000';
        comboNotif.style.boxShadow = '0 0 30px rgba(244, 67, 54, 0.8)';
        comboNotif.style.opacity = '0';
        comboNotif.innerHTML = `🔥 COMBO! x ${comboCount} 🔥`;
        canvas.appendChild(comboNotif);

        // Ensure element is fully positioned before showing it
        requestAnimationFrame(() => {
            comboNotif.style.transition = 'opacity 0.3s ease-in-out';
            comboNotif.style.opacity = '1';
        });

        setTimeout(() => comboNotif.remove(), 1200);
    }
}

// ============================================
// GAME 10: AXE MEMORY (Concentration / Pairs)
// ============================================
function initAxeMemory() {
    const canvas = document.getElementById('gameCanvas');
    
    // Initialize player data
    GameState.players.forEach(player => {
        player.data.pairs = 0;
        player.score = 0;
    });
    
    // Create grid
    const gridSize = GameState.settings.memoryGridSize;
    const totalPairs = gridSize / 2;
    const icons = ['🍾', '💎', '👹', '⚔️', '🛡️', '🏺', '💰', '🔮', '🎯', '🎪', '🧟', '🎲', '💥', '🌍', '🔴', '❌', '🎄', '💕'];
    
    // Create pairs
    const pairIds = [];
    for (let i = 0; i < totalPairs; i++) {
        pairIds.push(i, i);
    }
    
    // Shuffle
    for (let i = pairIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pairIds[i], pairIds[j]] = [pairIds[j], pairIds[i]];
    }
    
    // Create grid - determine cols and rows based on gridSize
    let cols, rows;
    if (gridSize === 16) {
        cols = 4;
        rows = 4;
    } else if (gridSize === 24) {
        cols = 4;
        rows = 6;
    } else if (gridSize === 36) {
        cols = 6;
        rows = 6;
    } else {
        // Default fallback
        cols = 6;
        rows = gridSize / cols;
    }
    GameState.gameData.grid = [];
    let index = 0;
    for (let r = 0; r < rows; r++) {
        GameState.gameData.grid[r] = [];
        for (let c = 0; c < cols; c++) {
            GameState.gameData.grid[r][c] = {
                pairId: pairIds[index],
                icon: icons[pairIds[index] % icons.length],
                state: 'faceDown' // faceDown, faceUp, collected
            };
            index++;
        }
    }
    
    GameState.gameData.cols = cols;
    GameState.gameData.rows = rows;
    GameState.gameData.firstTile = null;
    GameState.gameData.secondTile = null;
    GameState.gameData.turnThrows = 0;
    
    renderAxeMemoryGrid();
}

function renderAxeMemoryGrid() {
    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = '';
    
    const gridContainer = document.createElement('div');
    gridContainer.className = 'memory-grid';
    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = `repeat(${GameState.gameData.cols}, 1fr)`;
    gridContainer.style.gap = '10px';
    // Responsive sizing: significantly increased for better visibility and centered properly
    gridContainer.style.maxWidth = 'min(90vh, 90vw, 1100px)';
    gridContainer.style.margin = '0 auto';
    gridContainer.style.position = 'absolute';
    gridContainer.style.top = '50%';
    gridContainer.style.left = '50%';
    gridContainer.style.transform = 'translate(-50%, -50%)';
    
    for (let r = 0; r < GameState.gameData.rows; r++) {
        for (let c = 0; c < GameState.gameData.cols; c++) {
            const tile = GameState.gameData.grid[r][c];
            const cell = document.createElement('div');
            cell.className = 'memory-tile';
            cell.style.aspectRatio = '1';
            cell.style.background = tile.state === 'collected' ? '#1a1a2e' : '#f0a500';
            cell.style.border = '3px solid #555';
            cell.style.borderRadius = '10px';
            cell.style.display = 'flex';
            cell.style.alignItems = 'center';
            cell.style.justifyContent = 'center';
            cell.style.fontSize = '2.5rem';
            cell.style.cursor = tile.state === 'collected' ? 'default' : 'pointer';
            cell.style.transition = 'all 0.3s';
            
            if (tile.state === 'faceUp' || tile.state === 'collected') {
                cell.textContent = tile.icon;
            } else {
                cell.textContent = '❓';
            }
            
            cell.dataset.row = r;
            cell.dataset.col = c;
            
            if (tile.state !== 'collected') {
                cell.addEventListener('click', () => handleMemoryTileClick(r, c));
            }
            
            gridContainer.appendChild(cell);
        }
    }
    
    canvas.appendChild(gridContainer);
}

function handleMemoryTileClick(row, col) {
    const tile = GameState.gameData.grid[row][col];
    const currentPlayer = GameState.players[GameState.currentPlayerIndex];
    
    if (tile.state !== 'faceDown') return;
    if (GameState.gameData.turnThrows >= 2) return;
    
    saveState();
    
    // Flip tile
    tile.state = 'faceUp';
    GameState.gameData.turnThrows++;
    
    if (GameState.gameData.turnThrows === 1) {
        // First tile
        GameState.gameData.firstTile = { row, col };
        renderAxeMemoryGrid();
    } else {
        // Second tile
        GameState.gameData.secondTile = { row, col };
        renderAxeMemoryGrid();
        
        // Check match
        const firstTile = GameState.gameData.grid[GameState.gameData.firstTile.row][GameState.gameData.firstTile.col];
        const secondTile = GameState.gameData.grid[GameState.gameData.secondTile.row][GameState.gameData.secondTile.col];
        
        if (firstTile.pairId === secondTile.pairId) {
            // Match!
            setTimeout(() => {
                firstTile.state = 'collected';
                secondTile.state = 'collected';
                currentPlayer.data.pairs++;
                currentPlayer.score++;
                
                GameState.gameData.turnThrows = 0;
                GameState.gameData.firstTile = null;
                GameState.gameData.secondTile = null;
                
                renderAxeMemoryGrid();
                updateScoreboard();
                
                // Check if game over
                const allCollected = GameState.gameData.grid.every(row => 
                    row.every(tile => tile.state === 'collected')
                );
                
                if (allCollected) {
                    setTimeout(() => endGame(), 500);
                } else if (!GameState.settings.memoryExtraTurnOnMatch) {
                    // Move to next player if no extra turn on match
                    setTimeout(() => {
                        GameState.currentPlayerIndex = (GameState.currentPlayerIndex + 1) % GameState.players.length;
                        updateCurrentPlayerDisplay();
                        updateScoreboard();
                    }, 500);
                }
            }, 500);
        } else {
            // No match
            setTimeout(() => {
                firstTile.state = 'faceDown';
                secondTile.state = 'faceDown';

                GameState.gameData.turnThrows = 0;
                GameState.gameData.firstTile = null;
                GameState.gameData.secondTile = null;

                renderAxeMemoryGrid();

                // Move to next player
                GameState.currentPlayerIndex = (GameState.currentPlayerIndex + 1) % GameState.players.length;
                updateCurrentPlayerDisplay();
                updateScoreboard();
            }, GameState.settings.memoryRevealDuration * 1000);
        }
    }
}

// ============================================
// GAME 11: AXE WORD WACK (Word Guess)
// ============================================
function initAxeWordWack() {
    const canvas = document.getElementById('gameCanvas');
    
    // Initialize player data
    GameState.players.forEach(player => {
        player.score = 0;
    });
    
    // Expanded word categories with many more words
    const words = {
        'Random': [
            'SKOPJE NIGHT', 'AXE THROWING', 'BULLSEYE TARGET', 'CHAMPION THROWER',
            'WOODEN BOARD', 'SHARP BLADE', 'PERFECT SHOT', 'DOUBLE STRIKE',
            'TARGET PRACTICE', 'VICTORY LAP', 'POINT LEADER', 'SKILLED PLAYER',
            'THROWING ZONE', 'COMPETITION TIME', 'WINNING STREAK', 'GAME MASTER',
            'CHALLENGE MODE', 'TROPHY HUNT', 'ULTIMATE BATTLE', 'PRECISION THROW',
            'STEEL HATCHET', 'ROTATION SPIN', 'DIRECT HIT', 'SCORING ZONE',
            'POWER STRIKE', 'GOLDEN MOMENT', 'FINAL ROUND', 'AMAZING SCORE'
        ],
        'Movies': [
            'THE GODFATHER', 'PULP FICTION', 'FORREST GUMP', 'FIGHT CLUB',
            'STAR WARS', 'TITANIC', 'GLADIATOR', 'INCEPTION',
            'THE MATRIX', 'JURASSIC PARK', 'AVATAR', 'THE AVENGERS',
            'DARK KNIGHT', 'LION KING', 'TOY STORY', 'FROZEN',
            'SPIDER MAN', 'IRON MAN', 'HARRY POTTER', 'LORD RINGS',
            'FINDING NEMO', 'SHREK', 'PIRATES CARIBBEAN', 'FAST FURIOUS',
            'MISSION IMPOSSIBLE', 'JAMES BOND', 'INDIANA JONES', 'ROCKY',
            'TERMINATOR', 'ALIEN', 'JAWS', 'BACK FUTURE'
        ],
        'Countries': [
            'MACEDONIA', 'AUSTRALIA', 'ARGENTINA', 'SWITZERLAND',
            'UNITED STATES', 'CANADA', 'BRAZIL', 'MEXICO',
            'GERMANY', 'FRANCE', 'ITALY', 'SPAIN',
            'UNITED KINGDOM', 'PORTUGAL', 'GREECE', 'TURKEY',
            'RUSSIA', 'CHINA', 'JAPAN', 'INDIA',
            'SOUTH KOREA', 'THAILAND', 'VIETNAM', 'INDONESIA',
            'EGYPT', 'SOUTH AFRICA', 'MOROCCO', 'NIGERIA',
            'NEW ZEALAND', 'ICELAND', 'NORWAY', 'SWEDEN',
            'POLAND', 'CZECH REPUBLIC', 'AUSTRIA', 'BELGIUM'
        ],
        'Skopje': [
            'STONE BRIDGE', 'ALEXANDER STATUE', 'OLD BAZAAR', 'MATKA CANYON',
            'KALE FORTRESS', 'MILLENNIUM CROSS', 'CITY PARK', 'SKOPJE SQUARE',
            'VARDAR RIVER', 'MOTHER TERESA', 'MOUNT VODNO', 'CITY MALL',
            'MUSEUM MACEDONIA', 'TURKISH BATH', 'DAUT PASHA', 'MEMORIAL HOUSE',
            'ARCHAEOLOGICAL MUSEUM', 'HOLOCAUST MUSEUM', 'OPERA BALLET', 'PHILIP ARENA',
            'SHOPPING CENTER', 'CITY PLAZA', 'CABLE CAR', 'TVRDINA WALL'
        ]
    };
    
    const category = GameState.settings.wordCategory;
    const wordList = words[category] || words['Random'];
    const solution = wordList[Math.floor(Math.random() * wordList.length)];
    
    GameState.gameData.solution = solution;
    GameState.gameData.revealedLetters = [' ']; // Always reveal spaces (use array for proper undo)
    GameState.gameData.usedLetters = []; // Use array for proper undo
    GameState.gameData.category = category;

    renderWordWackBoard();
}

function renderWordWackBoard() {
    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = '';
    
    const container = document.createElement('div');
    container.style.textAlign = 'center';
    
    // Category
    const categoryDiv = document.createElement('div');
    categoryDiv.textContent = `Category: ${GameState.gameData.category}`;
    categoryDiv.style.fontSize = '1.5rem';
    categoryDiv.style.marginBottom = '20px';
    categoryDiv.style.color = '#f0a500';
    container.appendChild(categoryDiv);
    
    // Solution display
    const solutionDiv = document.createElement('div');
    solutionDiv.style.fontSize = '2.5rem';
    solutionDiv.style.marginBottom = '30px';
    solutionDiv.style.letterSpacing = '5px';
    solutionDiv.style.fontWeight = 'bold';
    
    let displayText = '';
    for (const char of GameState.gameData.solution) {
        if (GameState.gameData.revealedLetters.includes(char)) {
            displayText += char;
        } else {
            displayText += '_';
        }
        displayText += ' ';
    }
    solutionDiv.textContent = displayText;
    container.appendChild(solutionDiv);
    
    // Letter grid (A-Z)
    const letterGrid = document.createElement('div');
    letterGrid.style.display = 'grid';
    letterGrid.style.gridTemplateColumns = 'repeat(7, 1fr)';
    letterGrid.style.gap = '10px';
    // Responsive sizing: fit within viewport while maintaining aspect ratio
    letterGrid.style.maxWidth = 'min(70vh, 85vw, 600px)';
    letterGrid.style.margin = '0 auto';
    
    for (let i = 0; i < 26; i++) {
        const letter = String.fromCharCode(65 + i);
        const letterBtn = document.createElement('div');
        letterBtn.textContent = letter;
        letterBtn.className = 'word-letter';
        letterBtn.style.aspectRatio = '1';
        letterBtn.style.background = GameState.gameData.usedLetters.includes(letter) ? '#555' : '#2a2a3e';
        letterBtn.style.border = '2px solid #f0a500';
        letterBtn.style.borderRadius = '10px';
        letterBtn.style.display = 'flex';
        letterBtn.style.alignItems = 'center';
        letterBtn.style.justifyContent = 'center';
        letterBtn.style.fontSize = '1.5rem';
        letterBtn.style.fontWeight = 'bold';
        letterBtn.style.cursor = GameState.gameData.usedLetters.includes(letter) ? 'default' : 'pointer';
        letterBtn.style.opacity = GameState.gameData.usedLetters.includes(letter) ? '0.3' : '1';
        letterBtn.style.transition = 'all 0.2s';

        if (!GameState.gameData.usedLetters.includes(letter)) {
            letterBtn.addEventListener('click', () => handleLetterClick(letter));
            letterBtn.addEventListener('mouseenter', () => {
                letterBtn.style.background = '#f0a500';
                letterBtn.style.color = '#000';
            });
            letterBtn.addEventListener('mouseleave', () => {
                letterBtn.style.background = '#2a2a3e';
                letterBtn.style.color = '#fff';
            });
        }
        
        letterGrid.appendChild(letterBtn);
    }
    
    container.appendChild(letterGrid);
    canvas.appendChild(container);
}

function handleLetterClick(letter) {
    const currentPlayer = GameState.players[GameState.currentPlayerIndex];

    if (GameState.gameData.usedLetters.includes(letter)) return;

    saveState();

    GameState.gameData.usedLetters.push(letter);

    // Check if letter is in solution
    let occurrences = 0;
    for (const char of GameState.gameData.solution) {
        if (char === letter) {
            occurrences++;
            if (!GameState.gameData.revealedLetters.includes(letter)) {
                GameState.gameData.revealedLetters.push(letter);
            }
        }
    }
    
    if (occurrences > 0) {
        // Correct letter
        const points = occurrences * GameState.settings.wordPointsPerLetter;
        currentPlayer.score += points;
    } else {
        // Wrong letter
        currentPlayer.score += GameState.settings.wordWrongLetterPenalty;
    }
    
    renderWordWackBoard();
    updateScoreboard();
    
    // Check if word is complete
    const allRevealed = [...GameState.gameData.solution].every(char =>
        GameState.gameData.revealedLetters.includes(char)
    );
    
    if (allRevealed) {
        setTimeout(() => endGame(), 500);
    } else {
        // Move to next player
        GameState.currentPlayerIndex = (GameState.currentPlayerIndex + 1) % GameState.players.length;
        updateCurrentPlayerDisplay();
    }
}

// ============================================
// GAME 12: EMOJI FRENZY
// ============================================
function initEmojiFrenzy() {
    const canvas = document.getElementById('gameCanvas');

    // Initialize player data
    GameState.players.forEach(player => {
        player.score = 0;
        player.data.roundsPlayed = 0;
    });

    const emojis = ['😂', '😍', '🤡', '💀', '😎', '🥳', '😱', '🤩', '🥶', '🤯'];

    GameState.gameData.emojis = [];
    GameState.gameData.currentRound = 1;
    GameState.gameData.throwsThisRound = 0;

    // Create emoji objects with grid-based positioning to prevent overlap
    // Use a 5x3 grid with some randomness within each cell
    const gridCols = 5;
    const gridRows = 3;
    const positions = [];

    for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
            positions.push({ row, col });
        }
    }

    // Shuffle positions
    for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    // Create 12 emojis using the shuffled positions (reduced from 15 to prevent overlap)
    const numEmojis = 12;
    const cellWidth = 100 / gridCols;
    const cellHeight = 100 / gridRows;

    for (let i = 0; i < numEmojis; i++) {
        const pos = positions[i];

        // Add random offset within the cell (but keep some margin)
        // Adjust bounds to account for emoji size to keep them fully inside the border
        const x = (pos.col * cellWidth) + (Math.random() * cellWidth * 0.6 + cellWidth * 0.2);
        const y = (pos.row * cellHeight) + (Math.random() * cellHeight * 0.6 + cellHeight * 0.2);

        const emojiType = emojis[Math.floor(Math.random() * emojis.length)];

        GameState.gameData.emojis.push({
            type: emojiType,
            x: Math.min(Math.max(x, 12), 82), // Tighter bounds to keep emojis inside
            y: Math.min(Math.max(y, 15), 80)
        });
    }

    // IMPORTANT: Pick target emoji from the spawned emojis (not before spawning)
    const spawnedEmojiTypes = GameState.gameData.emojis.map(e => e.type);
    GameState.gameData.targetEmoji = spawnedEmojiTypes[Math.floor(Math.random() * spawnedEmojiTypes.length)];

    renderEmojiFrenzy();
}

function renderEmojiFrenzy() {
    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = '';
    
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.width = '90%';
    container.style.maxWidth = 'min(90vh, 90vw, 1000px)';
    container.style.height = 'min(75vh, 800px)';
    container.style.background = '#1a1a2e';
    container.style.borderRadius = '20px';
    container.style.border = '3px solid #f0a500';
    
    // Round and target display
    const header = document.createElement('div');
    header.style.textAlign = 'center';
    header.style.padding = '20px';
    header.style.fontSize = '1.8rem';
    header.style.fontWeight = 'bold';
    header.innerHTML = `Round ${GameState.gameData.currentRound}/${GameState.settings.emojiRoundsPerGame}<br>TARGET: <span style="font-size: 3rem">${GameState.gameData.targetEmoji}</span>`;
    container.appendChild(header);
    
    // Emoji area
    const emojiArea = document.createElement('div');
    emojiArea.style.position = 'relative';
    emojiArea.style.width = '100%';
    emojiArea.style.height = 'calc(100% - 120px)';
    
    GameState.gameData.emojis.forEach((emoji, index) => {
        const emojiDiv = document.createElement('div');
        emojiDiv.textContent = emoji.type;
        emojiDiv.className = 'emoji-target';
        emojiDiv.style.position = 'absolute';
        emojiDiv.style.left = emoji.x + '%';
        emojiDiv.style.top = emoji.y + '%';
        emojiDiv.style.fontSize = '3rem';
        emojiDiv.style.cursor = 'pointer';
        emojiDiv.style.transition = 'transform 0.2s';
        emojiDiv.style.transform = emoji.type === GameState.gameData.targetEmoji ? 'translate(-50%, -50%) scale(1.2)' : 'translate(-50%, -50%) scale(1)';
        emojiDiv.style.filter = emoji.type === GameState.gameData.targetEmoji ? 'drop-shadow(0 0 10px #f0a500)' : 'none';

        emojiDiv.addEventListener('click', () => handleEmojiClick(index));
        emojiDiv.addEventListener('mouseenter', () => {
            emojiDiv.style.transform = 'translate(-50%, -50%) scale(1.3)';
        });
        emojiDiv.addEventListener('mouseleave', () => {
            emojiDiv.style.transform = emoji.type === GameState.gameData.targetEmoji ? 'translate(-50%, -50%) scale(1.2)' : 'translate(-50%, -50%) scale(1)';
        });

        emojiArea.appendChild(emojiDiv);
    });
    
    container.appendChild(emojiArea);
    canvas.appendChild(container);
}

function handleEmojiClick(index) {
    const emoji = GameState.gameData.emojis[index];
    const currentPlayer = GameState.players[GameState.currentPlayerIndex];
    
    saveState();
    
    let points = 0;
    if (emoji.type === GameState.gameData.targetEmoji) {
        points = GameState.settings.emojiTargetPoints;
    } else {
        points = GameState.settings.emojiPenaltyMode ? 
            -GameState.settings.emojiNonTargetPoints : 
            GameState.settings.emojiNonTargetPoints;
    }
    
    currentPlayer.score += points;
    
    // Respawn emoji if enabled
    if (GameState.settings.emojiRespawnHit) {
        const emojis = ['😂', '😍', '🤡', '💀', '😎', '🥳', '😱', '🤩', '🥶', '🤯'];

        // Find a position that doesn't overlap with existing emojis
        let x, y;
        let attempts = 0;
        const maxAttempts = 20;

        do {
            x = Math.random() * 70 + 10; // Keep in safe bounds
            y = Math.random() * 70 + 10;

            // Check for overlap with other emojis
            const tooClose = GameState.gameData.emojis.some((e, i) => {
                if (i === index) return false; // Don't check against self
                const dx = Math.abs(e.x - x);
                const dy = Math.abs(e.y - y);
                return dx < 25 && dy < 25; // Minimum distance of 25% to reduce overlap
            });

            if (!tooClose || attempts >= maxAttempts) break;
            attempts++;
        } while (attempts < maxAttempts);

        GameState.gameData.emojis[index] = {
            type: emojis[Math.floor(Math.random() * emojis.length)],
            x: Math.min(Math.max(x, 12), 82), // Tighter bounds to match init
            y: Math.min(Math.max(y, 15), 80)
        };
    }

    GameState.gameData.throwsThisRound++;

    // Check if round is over
    if (GameState.gameData.throwsThisRound >= GameState.players.length) {
        GameState.gameData.currentRound++;
        GameState.gameData.throwsThisRound = 0;

        if (GameState.gameData.currentRound > GameState.settings.emojiRoundsPerGame) {
            setTimeout(() => endGame(), 500);
            return;
        } else {
            // New target for next round - pick from currently spawned emojis
            const spawnedEmojiTypes = GameState.gameData.emojis.map(e => e.type);
            GameState.gameData.targetEmoji = spawnedEmojiTypes[Math.floor(Math.random() * spawnedEmojiTypes.length)];
        }
    }
    
    renderEmojiFrenzy();
    updateScoreboard();
    
    // Move to next player
    GameState.currentPlayerIndex = (GameState.currentPlayerIndex + 1) % GameState.players.length;
    updateCurrentPlayerDisplay();
}

// ============================================
// GAME 13: BAD AXE (Trick-Shot HORSE)
// ============================================
function initBadAxe() {
    const canvas = document.getElementById('gameCanvas');
    
    // Initialize player data
    GameState.players.forEach(player => {
        player.data.letters = [];
        player.data.eliminated = false;
        player.score = 0;
    });
    
    GameState.gameData.currentShot = null;
    GameState.gameData.shotCallerId = 0;
    GameState.gameData.currentAttempterId = -1;
    GameState.gameData.phase = 'selectingShot'; // selectingShot, shotCalling, copying
    GameState.gameData.attemptedPlayers = new Set();
    
    // Create bullseye target (reuse from classic bullseye)
    const target = document.createElement('div');
    target.className = 'target-bullseye';
    
    const rings = [
        { size: 60, color: '#FFD700', points: 50, label: 'Bullseye' },
        { size: 120, color: '#ff6b6b', points: 25, label: 'Red' },
        { size: 180, color: '#fff', points: 15, label: 'White' },
        { size: 240, color: '#000', points: 10, label: 'Black' },
        { size: 300, color: '#f0a500', points: 5, label: 'Orange' },
        { size: 360, color: '#1a1a2e', points: 1, label: 'Outer' }
    ];
    
    rings.reverse().forEach((ring, index) => {
        const ringDiv = document.createElement('div');
        ringDiv.className = 'target-ring';
        ringDiv.style.width = ring.size + 'px';
        ringDiv.style.height = ring.size + 'px';
        ringDiv.style.background = ring.color;
        ringDiv.dataset.points = ring.points;
        ringDiv.dataset.label = ring.label;
        ringDiv.style.zIndex = String(index + 1);

        target.appendChild(ringDiv);
    });

    // Add quadrant overlays based on settings
    const shotZoneType = GameState.settings.badaxeShotZoneType;
    if (shotZoneType === 'Quadrant only' || shotZoneType === 'Ring + Quadrant') {
        const quadrants = [
            { name: 'Top-Left', x: '0%', y: '0%' },
            { name: 'Top-Right', x: '50%', y: '0%' },
            { name: 'Bottom-Left', x: '0%', y: '50%' },
            { name: 'Bottom-Right', x: '50%', y: '50%' }
        ];

        quadrants.forEach(quad => {
            const quadDiv = document.createElement('div');
            quadDiv.style.position = 'absolute';
            quadDiv.style.left = quad.x;
            quadDiv.style.top = quad.y;
            quadDiv.style.width = '50%';
            quadDiv.style.height = '50%';
            quadDiv.style.border = '2px solid rgba(255, 255, 255, 0.3)';
            quadDiv.style.zIndex = '100';
            quadDiv.style.pointerEvents = 'auto';
            quadDiv.style.cursor = 'pointer';
            quadDiv.dataset.quadrant = quad.name;

            quadDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                const rect = target.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;
                const radius = Math.sqrt(Math.pow(clickX - rect.width / 2, 2) + Math.pow(clickY - rect.height / 2, 2));

                // Determine which ring was clicked
                let ringLabel = 'Outer';
                for (const ring of rings) {
                    if (radius <= ring.size / 2) {
                        ringLabel = ring.label;
                        break;
                    }
                }

                handleBadAxeHit(ringLabel, quad.name);
            });

            target.appendChild(quadDiv);
        });
    } else {
        // Ring only mode - add click handlers directly to rings
        rings.reverse().forEach((ring) => {
            const ringElements = target.querySelectorAll(`[data-label="${ring.label}"]`);
            ringElements.forEach(ringEl => {
                ringEl.style.pointerEvents = 'auto';
                ringEl.style.cursor = 'pointer';
                ringEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handleBadAxeHit(ring.label, null);
                });
            });
        });
    }

    canvas.appendChild(target);

    // Show shot selection UI
    showBadAxeShotSelection();
}

function showBadAxeShotSelection() {
    const canvas = document.getElementById('gameCanvas');
    
    // Remove any existing selection UI
    const existingUI = document.getElementById('badAxeShotUI');
    if (existingUI) existingUI.remove();
    
    const shotUI = document.createElement('div');
    shotUI.id = 'badAxeShotUI';
    shotUI.style.position = 'absolute';
    shotUI.style.bottom = '20px';
    shotUI.style.left = '50%';
    shotUI.style.transform = 'translateX(-50%)';
    shotUI.style.background = '#2a2a3e';
    shotUI.style.padding = '20px';
    shotUI.style.borderRadius = '15px';
    shotUI.style.border = '3px solid #f0a500';
    shotUI.style.zIndex = '100';
    shotUI.style.textAlign = 'center';
    shotUI.style.maxWidth = '90%';

    const caller = GameState.players[GameState.gameData.shotCallerId];

    shotUI.innerHTML = `
        <h3 style="margin-bottom: 15px;">${caller.name}'s Turn to Set the Shot</h3>
        <p style="margin-bottom: 10px;">Select a ring, then throw to set the challenge!</p>
        <div style="font-size: 0.9rem; color: #aaa;">When you hit a ring, that becomes the challenge for everyone else.</div>
    `;

    canvas.appendChild(shotUI);
}

function handleBadAxeHit(ringLabel, quadrant = null) {
    const shotZoneType = GameState.settings.badaxeShotZoneType;

    saveState();

    if (GameState.gameData.phase === 'selectingShot') {
        // Shot caller is setting the challenge
        const caller = GameState.players[GameState.gameData.shotCallerId];

        GameState.gameData.currentShot = {
            ring: ringLabel,
            quadrant: quadrant,
            callerId: GameState.gameData.shotCallerId
        };

        // Don't award points to shot caller - they're setting the challenge, not scoring

        GameState.gameData.phase = 'copying';
        GameState.gameData.attemptedPlayers = new Set(); // Reset for new round
        GameState.gameData.currentAttempterId = (GameState.gameData.shotCallerId + 1) % GameState.players.length;

        // Skip eliminated players
        while (GameState.players[GameState.gameData.currentAttempterId].data.eliminated) {
            GameState.gameData.currentAttempterId = (GameState.gameData.currentAttempterId + 1) % GameState.players.length;

            // Safety: if all eliminated except caller, end game
            const activeCount = GameState.players.filter(p => !p.data.eliminated).length;
            if (activeCount <= 1) {
                setTimeout(() => endGame(), 2500);
                return;
            }
        }

        updateBadAxeUI();
    } else if (GameState.gameData.phase === 'copying') {
        // Other player attempting to copy
        const attempter = GameState.players[GameState.gameData.currentAttempterId];

        // Determine success based on shot zone type
        let success = false;
        if (shotZoneType === 'Ring only') {
            success = (ringLabel === GameState.gameData.currentShot.ring);
        } else if (shotZoneType === 'Quadrant only') {
            success = (quadrant === GameState.gameData.currentShot.quadrant);
        } else if (shotZoneType === 'Ring + Quadrant') {
            success = (ringLabel === GameState.gameData.currentShot.ring && quadrant === GameState.gameData.currentShot.quadrant);
        }

        if (success) {
            // Successful copy - award points and show feedback
            attempter.score += 10;

            // Show success message briefly
            const existingUI = document.getElementById('badAxeShotUI');
            if (existingUI) {
                let shotDescription = GameState.gameData.currentShot.ring;
                if (GameState.gameData.currentShot.quadrant) {
                    shotDescription = `${GameState.gameData.currentShot.ring} (${GameState.gameData.currentShot.quadrant})`;
                }
                existingUI.innerHTML = `
                    <h3 style="color: #4CAF50;">✓ Success!</h3>
                    <p>${attempter.name} matched the shot: ${shotDescription}!</p>
                    <p style="margin-top: 10px; font-size: 1.5rem;">+10 points</p>
                `;
                setTimeout(() => updateBadAxeUI(), 1000);
            }
        } else {
            // Add a letter
            const letters = ['B', 'A', 'D', 'A', 'X', 'E'];
            const nextLetter = letters[attempter.data.letters.length];
            attempter.data.letters.push(nextLetter);

            // Show miss message
            const existingUI = document.getElementById('badAxeShotUI');
            if (existingUI) {
                let attemptDescription = ringLabel;
                if (quadrant) {
                    attemptDescription = `${ringLabel} (${quadrant})`;
                }
                let targetDescription = GameState.gameData.currentShot.ring;
                if (GameState.gameData.currentShot.quadrant) {
                    targetDescription = `${GameState.gameData.currentShot.ring} (${GameState.gameData.currentShot.quadrant})`;
                }
                existingUI.innerHTML = `
                    <h3 style="color: #ff6b6b;">✗ Miss!</h3>
                    <p>${attempter.name} hit ${attemptDescription} instead of ${targetDescription}</p>
                    <p style="margin-top: 10px; font-size: 1.5rem;">+${nextLetter}</p>
                `;
                setTimeout(() => updateBadAxeUI(), 1000);
            }

            // Check if eliminated
            if (attempter.data.letters.length >= GameState.settings.badaxeLettersToEliminate) {
                attempter.data.eliminated = true;
            }
        }

        updateScoreboard();

        // Track who has attempted this shot
        if (!GameState.gameData.attemptedPlayers) {
            GameState.gameData.attemptedPlayers = new Set();
        }
        GameState.gameData.attemptedPlayers.add(GameState.gameData.currentAttempterId);

        // Move to next attempter
        GameState.gameData.currentAttempterId = (GameState.gameData.currentAttempterId + 1) % GameState.players.length;

        // Skip eliminated players and shot caller
        let found = false;
        for (let i = 0; i < GameState.players.length; i++) {
            const player = GameState.players[GameState.gameData.currentAttempterId];
            // Check if this player hasn't attempted yet, isn't eliminated, and isn't the shot caller
            if (!player.data.eliminated &&
                GameState.gameData.currentAttempterId !== GameState.gameData.shotCallerId &&
                !GameState.gameData.attemptedPlayers.has(GameState.gameData.currentAttempterId)) {
                found = true;
                break;
            }
            GameState.gameData.currentAttempterId = (GameState.gameData.currentAttempterId + 1) % GameState.players.length;
        }

        if (!found) {
            // Round complete, move to next shot caller
            GameState.gameData.attemptedPlayers = new Set(); // Reset for next round
            GameState.gameData.shotCallerId = (GameState.gameData.shotCallerId + 1) % GameState.players.length;

            // Skip eliminated
            while (GameState.players[GameState.gameData.shotCallerId].data.eliminated) {
                GameState.gameData.shotCallerId = (GameState.gameData.shotCallerId + 1) % GameState.players.length;
            }

            GameState.gameData.phase = 'selectingShot';
            GameState.gameData.currentShot = null;

            // Check win condition
            const activeCount = GameState.players.filter(p => !p.data.eliminated).length;
            if (activeCount <= 1) {
                setTimeout(() => endGame(), 2500);
                return;
            }

            showBadAxeShotSelection();
        }

        updateBadAxeUI();
    }
}

function updateBadAxeUI() {
    const existingUI = document.getElementById('badAxeShotUI');
    if (existingUI) existingUI.remove();

    const canvas = document.getElementById('gameCanvas');
    const shotUI = document.createElement('div');
    shotUI.id = 'badAxeShotUI';
    shotUI.style.position = 'absolute';
    shotUI.style.bottom = '20px';
    shotUI.style.left = '50%';
    shotUI.style.transform = 'translateX(-50%)';
    shotUI.style.background = '#2a2a3e';
    shotUI.style.padding = '20px';
    shotUI.style.borderRadius = '15px';
    shotUI.style.border = '3px solid #f0a500';
    shotUI.style.zIndex = '100';
    shotUI.style.textAlign = 'center';
    shotUI.style.maxWidth = '90%';

    if (GameState.gameData.phase === 'copying') {
        const attempter = GameState.players[GameState.gameData.currentAttempterId];
        let shotDescription = GameState.gameData.currentShot.ring;
        if (GameState.gameData.currentShot.quadrant) {
            shotDescription = `${GameState.gameData.currentShot.ring} (${GameState.gameData.currentShot.quadrant})`;
        }
        shotUI.innerHTML = `
            <h3>Challenge: ${shotDescription}</h3>
            <p>${attempter.name}'s turn to copy the shot!</p>
            <p style="margin-top: 10px; color: #aaa;">Letters: ${attempter.data.letters.join(' ') || 'None'}</p>
        `;

        // Update current player index for display
        GameState.currentPlayerIndex = GameState.gameData.currentAttempterId;
        updateCurrentPlayerDisplay();
    } else if (GameState.gameData.phase === 'selectingShot') {
        const shotZoneType = GameState.settings.badaxeShotZoneType;
        let instructions = 'Select a ring, then throw to set the challenge!';
        if (shotZoneType === 'Quadrant only') {
            instructions = 'Select a quadrant, then throw to set the challenge!';
        } else if (shotZoneType === 'Ring + Quadrant') {
            instructions = 'Select a ring and quadrant combination, then throw to set the challenge!';
        }
        shotUI.innerHTML = `
            <h3 style="margin-bottom: 15px;">${GameState.players[GameState.gameData.shotCallerId].name}'s Turn to Set the Shot</h3>
            <p style="margin-bottom: 10px;">${instructions}</p>
            <div style="font-size: 0.9rem; color: #aaa;">When you hit, that becomes the challenge for everyone else.</div>
        `;

        // Update current player index for display
        GameState.currentPlayerIndex = GameState.gameData.shotCallerId;
        updateCurrentPlayerDisplay();
    }

    canvas.appendChild(shotUI);
}

// ============================================
// GAME 14: INFECTION MODE (Team Conversion)
// ============================================
function initInfectionMode() {
    const canvas = document.getElementById('gameCanvas');

    // Initialize teams
    const initialInfected = GameState.settings.infectionInitialInfected;
    GameState.players.forEach((player, index) => {
        player.data.team = index < initialInfected ? 'Infected' : 'Survivor';
        player.data.duelScore = 0;
        player.data.duelWins = 0;
        player.score = 0;
    });

    GameState.gameData.survivorIndex = initialInfected;
    GameState.gameData.infectedIndex = 0;
    GameState.gameData.duelPhase = 'survivor'; // survivor, infected
    GameState.gameData.throwsThisDuel = 0;
    GameState.gameData.survivorDuelWins = 0;
    GameState.gameData.targetDuelWins = 10; // Survivors need 10 duel wins to win

    // Initialize game timer (convert minutes to seconds)
    GameState.gameData.gameTimeRemaining = GameState.settings.infectionGameTime * 60;
    GameState.gameData.gameTimerInterval = setInterval(() => {
        // Guard: Only update if we're still in Infection Mode
        if (GameState.currentGame !== 'infectionMode') {
            clearInterval(GameState.gameData.gameTimerInterval);
            return;
        }

        GameState.gameData.gameTimeRemaining--;
        if (GameState.gameData.gameTimeRemaining <= 0) {
            clearInterval(GameState.gameData.gameTimerInterval);
            // Survivors win if any are left
            const survivorCount = GameState.players.filter(p => p.data.team === 'Survivor').length;
            if (survivorCount > 0) {
                GameState.players.forEach(p => {
                    if (p.data.team === 'Survivor') p.score = 100;
                });
                setTimeout(() => endGame(), 500);
            }
        } else {
            renderInfectionMode();
        }
    }, 1000);

    renderInfectionMode();
}

function updateInfectionModeScoreboard() {
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = '';
    scoreboard.style.display = 'flex';
    scoreboard.style.flexDirection = 'column';
    scoreboard.style.gap = '15px';

    // Timer and Win Counter Display
    const timerDisplay = document.createElement('div');
    timerDisplay.style.textAlign = 'center';
    timerDisplay.style.fontSize = '1.2rem';
    timerDisplay.style.color = '#f0a500';

    const minutes = Math.floor(GameState.gameData.gameTimeRemaining / 60);
    const seconds = GameState.gameData.gameTimeRemaining % 60;
    const timeColor = GameState.gameData.gameTimeRemaining < 60 ? '#f44336' : '#f0a500';

    timerDisplay.innerHTML = `
        <div style="display: flex; justify-content: center; gap: 20px; align-items: center; flex-wrap: wrap;">
            <div style="background: #2a2a3e; padding: 10px 20px; border-radius: 10px; border: 3px solid ${timeColor};">
                <div style="font-size: 0.8rem; color: #aaa;">Time Remaining</div>
                <div style="font-size: 1.5rem; font-weight: bold; color: ${timeColor};">
                    ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}
                </div>
            </div>
            <div style="background: #2a2a3e; padding: 10px 20px; border-radius: 10px; border: 3px solid #4CAF50;">
                <div style="font-size: 0.8rem; color: #aaa;">Survivor Duel Wins</div>
                <div style="font-size: 1.5rem; font-weight: bold; color: #4CAF50;">
                    ${GameState.gameData.survivorDuelWins} / ${GameState.gameData.targetDuelWins}
                </div>
            </div>
        </div>
    `;
    scoreboard.appendChild(timerDisplay);

    // Duel Info Display
    const survivor = GameState.players.find((p, i) => p.data.team === 'Survivor' && i === GameState.gameData.survivorIndex);
    const infected = GameState.players.find((p, i) => p.data.team === 'Infected' && i === GameState.gameData.infectedIndex);

    if (survivor && infected) {
        const currentTurn = GameState.gameData.duelPhase === 'survivor' ? survivor.name : infected.name;
        const currentTeam = GameState.gameData.duelPhase === 'survivor' ? 'Survivor' : 'Infected';
        const teamColor = GameState.gameData.duelPhase === 'survivor' ? '#4CAF50' : '#f44336';

        const duelInfo = document.createElement('div');
        duelInfo.style.textAlign = 'center';
        duelInfo.style.padding = '10px';
        duelInfo.style.background = '#2a2a3e';
        duelInfo.style.borderRadius = '10px';
        duelInfo.style.border = '2px solid #f0a500';

        duelInfo.innerHTML = `
            <div style="font-size: 1rem; margin-bottom: 5px;">
                <strong>DUEL:</strong> ${survivor.name} vs ${infected.name}
            </div>
            <div style="font-size: 0.9rem; margin-bottom: 5px;">
                Survivor: ${survivor.data.duelScore} | Infected: ${infected.data.duelScore}
            </div>
            <div style="padding: 8px; background: ${teamColor}; border-radius: 8px; color: #fff; font-weight: bold; font-size: 0.9rem;">
                Current Turn: ${currentTurn} (${currentTeam})
            </div>
        `;
        scoreboard.appendChild(duelInfo);
    }
}

function renderInfectionMode() {
    // Update custom scoreboard
    updateInfectionModeScoreboard();

    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = '';

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.gap = '20px';
    container.style.justifyContent = 'center';

    // Survivors column
    const survivorsCol = document.createElement('div');
    survivorsCol.style.flex = '1';
    survivorsCol.style.background = '#2a2a3e';
    survivorsCol.style.padding = '20px';
    survivorsCol.style.borderRadius = '15px';
    survivorsCol.style.border = '3px solid #4CAF50';

    survivorsCol.innerHTML = '<h3 style="color: #4CAF50; text-align: center;">Survivors 🧑</h3>';

    GameState.players.forEach((player, index) => {
        if (player.data.team === 'Survivor') {
            const playerDiv = document.createElement('div');
            playerDiv.style.padding = '10px';
            playerDiv.style.margin = '5px 0';
            playerDiv.style.background = index === GameState.gameData.survivorIndex ? '#4CAF50' : '#1a1a2e';
            playerDiv.style.borderRadius = '8px';
            playerDiv.textContent = player.name;
            playerDiv.style.textAlign = 'center';
            survivorsCol.appendChild(playerDiv);
        }
    });

    // Infected column
    const infectedCol = document.createElement('div');
    infectedCol.style.flex = '1';
    infectedCol.style.background = '#2a2a3e';
    infectedCol.style.padding = '20px';
    infectedCol.style.borderRadius = '15px';
    infectedCol.style.border = '3px solid #f44336';

    infectedCol.innerHTML = '<h3 style="color: #f44336; text-align: center;">Infected 🦠</h3>';

    GameState.players.forEach((player, index) => {
        if (player.data.team === 'Infected') {
            const playerDiv = document.createElement('div');
            playerDiv.style.padding = '10px';
            playerDiv.style.margin = '5px 0';
            playerDiv.style.background = index === GameState.gameData.infectedIndex ? '#f44336' : '#1a1a2e';
            playerDiv.style.borderRadius = '8px';
            playerDiv.textContent = player.name;
            playerDiv.style.textAlign = 'center';
            infectedCol.appendChild(playerDiv);
        }
    });

    container.appendChild(survivorsCol);
    container.appendChild(infectedCol);

    canvas.appendChild(container);

    // Simple target for dueling
    const target = document.createElement('div');
    target.className = 'target-bullseye';
    target.style.marginTop = '30px';

    // Use percentages for responsive scaling
    const rings = [
        { size: '15%', color: '#FFD700', points: 50, label: '50' },
        { size: '30%', color: '#ff6b6b', points: 25, label: '25' },
        { size: '45%', color: '#fff', points: 15, label: '15' },
        { size: '60%', color: '#000', points: 10, label: '10' },
        { size: '75%', color: '#f0a500', points: 5, label: '5' },
        { size: '90%', color: '#1a1a2e', points: 1, label: '1' }
    ];

    rings.reverse().forEach((ring, index) => {
        const ringDiv = document.createElement('div');
        ringDiv.className = 'target-ring';
        ringDiv.style.width = ring.size;
        ringDiv.style.height = ring.size;
        ringDiv.style.background = ring.color;
        ringDiv.dataset.points = ring.points;
        ringDiv.style.zIndex = String(index + 1);

        // Create label element positioned on the ring edge
        const label = document.createElement('div');
        label.className = 'ring-label';
        label.textContent = ring.label;
        label.style.position = 'absolute';
        // Center the label for the smallest ring (50 points), move others up
        if (ring.points === 50) {
            label.style.top = '50%';
            label.style.transform = 'translate(-50%, -50%)';
        } else {
            label.style.top = '5px';
            label.style.transform = 'translateX(-50%)';
        }
        label.style.left = '50%';
        label.style.fontSize = 'min(1.2rem, 1.8vw, 1.8vh)';
        label.style.fontWeight = 'bold';
        label.style.color = ring.color === '#fff' || ring.color === '#FFD700' ? '#000' : '#fff';
        label.style.pointerEvents = 'none';
        label.style.zIndex = '10';
        label.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';

        ringDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            handleInfectionHit(ring.points);
        });

        ringDiv.appendChild(label);
        target.appendChild(ringDiv);
    });

    canvas.appendChild(target);
}

function handleInfectionHit(points) {
    const throwsPerDuel = GameState.settings.infectionThrowsPerDuel;

    saveState();

    let playerName;
    if (GameState.gameData.duelPhase === 'survivor') {
        const survivor = GameState.players[GameState.gameData.survivorIndex];
        survivor.data.duelScore += points;
        playerName = survivor.name;
        GameState.gameData.duelPhase = 'infected';
    } else {
        const infected = GameState.players[GameState.gameData.infectedIndex];
        infected.data.duelScore += points;
        playerName = infected.name;
        GameState.gameData.duelPhase = 'survivor';
    }

    // Show hit feedback
    const canvas = document.getElementById('gameCanvas');
    const hitFeedback = document.createElement('div');
    hitFeedback.style.position = 'fixed';
    hitFeedback.style.top = '50%';
    hitFeedback.style.left = '50%';
    hitFeedback.style.transform = 'translate(-50%, -50%)';
    hitFeedback.style.background = 'rgba(240, 165, 0, 0.95)';
    hitFeedback.style.color = '#fff';
    hitFeedback.style.padding = '20px 40px';
    hitFeedback.style.borderRadius = '15px';
    hitFeedback.style.fontSize = '1.5rem';
    hitFeedback.style.fontWeight = 'bold';
    hitFeedback.style.zIndex = '1000';
    hitFeedback.style.boxShadow = '0 0 20px rgba(240, 165, 0, 0.6)';
    hitFeedback.innerHTML = `${playerName}: +${points} points`;
    canvas.appendChild(hitFeedback);

    setTimeout(() => hitFeedback.remove(), 1000);

    GameState.gameData.throwsThisDuel++;

    // Check if duel is over
    if (GameState.gameData.throwsThisDuel >= throwsPerDuel * 2) {
        const survivor = GameState.players[GameState.gameData.survivorIndex];
        const infected = GameState.players[GameState.gameData.infectedIndex];

        if (infected.data.duelScore > survivor.data.duelScore) {
            // Infected wins - convert survivor
            survivor.data.team = 'Infected';
        } else if (survivor.data.duelScore > infected.data.duelScore) {
            // Survivor wins - increment win counter
            GameState.gameData.survivorDuelWins++;
            survivor.data.duelWins++;

            // Check if survivors reached target duel wins
            if (GameState.gameData.survivorDuelWins >= GameState.gameData.targetDuelWins) {
                clearInterval(GameState.gameData.gameTimerInterval);
                GameState.players.forEach(p => {
                    if (p.data.team === 'Survivor') p.score = 100;
                });
                setTimeout(() => endGame(), 500);
                return;
            }
        }

        // Reset duel scores
        survivor.data.duelScore = 0;
        infected.data.duelScore = 0;
        GameState.gameData.throwsThisDuel = 0;
        GameState.gameData.duelPhase = 'survivor';

        // Check win condition
        const survivorCount = GameState.players.filter(p => p.data.team === 'Survivor').length;
        if (survivorCount === 0) {
            // Infected win
            clearInterval(GameState.gameData.gameTimerInterval);
            GameState.players.forEach(p => {
                if (p.data.team === 'Infected') p.score = 100;
            });
            setTimeout(() => endGame(), 500);
            return;
        }

        // Find next duel pair
        GameState.gameData.survivorIndex = GameState.players.findIndex(p => p.data.team === 'Survivor');
        GameState.gameData.infectedIndex = GameState.players.findIndex(p => p.data.team === 'Infected');
    }

    renderInfectionMode();
}

// ============================================
// GAME 15: LANDMINES
// ============================================
function initLandmines() {
    const canvas = document.getElementById('gameCanvas');
    
    // Initialize player data
    GameState.players.forEach(player => {
        player.score = 0;
        player.data.totalScore = 0;
    });
    
    const targetScore = GameState.settings.landminesTargetScore;
    const landmineScores = GameState.settings.landminesScores.split(',').map(s => parseInt(s.trim()));
    const checkpointInterval = GameState.settings.landminesCheckpointInterval;
    
    GameState.gameData.targetScore = targetScore;
    GameState.gameData.landmineScores = landmineScores;
    GameState.gameData.checkpointInterval = checkpointInterval;
    
    renderLandminesBoard();
}

function renderLandminesBoard() {
    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = '';

    const mainContainer = document.createElement('div');
    mainContainer.style.display = 'flex';
    mainContainer.style.flexDirection = 'column';
    mainContainer.style.gap = '20px';
    mainContainer.style.maxWidth = '1200px';
    mainContainer.style.margin = '0 auto';
    mainContainer.style.alignItems = 'center';

    // Combined scoreboard at the top
    const currentPlayer = GameState.players[GameState.currentPlayerIndex];
    const nextCheckpoint = Math.ceil(currentPlayer.score / GameState.gameData.checkpointInterval) * GameState.gameData.checkpointInterval;
    const pointsToCheckpoint = nextCheckpoint - currentPlayer.score;
    const upcomingLandmines = GameState.gameData.landmineScores.filter(m => m > currentPlayer.score && m <= currentPlayer.score + 50);

    let landmineWarning = '';
    if (upcomingLandmines.length > 0) {
        landmineWarning = `<div style="color: #f44336; margin-top: 10px; font-weight: bold;">⚠️ Landmines ahead: ${upcomingLandmines.join(', ')} 💣</div>`;
    }

    const scoreIndicator = document.createElement('div');
    scoreIndicator.style.background = '#2a2a3e';
    scoreIndicator.style.padding = '15px 20px';
    scoreIndicator.style.borderRadius = '15px';
    scoreIndicator.style.border = '3px solid #f0a500';
    scoreIndicator.style.display = 'flex';
    scoreIndicator.style.alignItems = 'center';
    scoreIndicator.style.justifyContent = 'space-between';
    scoreIndicator.style.gap = '30px';
    scoreIndicator.style.width = '100%';
    scoreIndicator.style.flexWrap = 'wrap';
    scoreIndicator.innerHTML = `
        <div style="font-size: 1.2rem; color: #f0a500; font-weight: bold;">${currentPlayer.name}'s Turn</div>
        <div style="font-size: 1.8rem; color: #4CAF50; font-weight: bold;">Score: ${currentPlayer.score}</div>
        <div style="font-size: 1rem; color: #aaa;">Next: ${nextCheckpoint} (${pointsToCheckpoint} pts)</div>
        <div style="font-size: 1rem; color: #aaa;">Target: ${GameState.gameData.targetScore}</div>
        ${upcomingLandmines.length > 0 ? `<div style="color: #f44336; font-weight: bold; font-size: 1rem;">⚠️ Landmines: ${upcomingLandmines.join(', ')} 💣</div>` : ''}
    `;
    mainContainer.appendChild(scoreIndicator);

    // Content container with ladder and target
    const contentContainer = document.createElement('div');
    contentContainer.style.display = 'flex';
    contentContainer.style.gap = '20px';
    contentContainer.style.alignItems = 'flex-start';
    contentContainer.style.width = '100%';

    // Ladder visualization
    const ladder = document.createElement('div');
    ladder.id = 'landminesLadder';
    ladder.style.flex = '0 0 250px';
    ladder.style.background = '#2a2a3e';
    ladder.style.padding = '20px';
    ladder.style.borderRadius = '15px';
    ladder.style.minHeight = '500px';
    ladder.style.maxHeight = '600px';
    ladder.style.overflowY = 'auto';
    ladder.style.position = 'relative';
    ladder.style.scrollbarWidth = 'thin';
    ladder.style.scrollbarColor = '#f0a500 #2a2a3e';

    const targetScore = GameState.gameData.targetScore;
    const landmines = GameState.gameData.landmineScores;

    const existingLadder = document.getElementById('landminesLadder');
    const savedScrollTop = existingLadder ? existingLadder.scrollTop : 0;

    for (let score = 0; score <= targetScore; score += 5) {
        const rung = document.createElement('div');
        rung.style.padding = '10px';
        rung.style.margin = '5px 0';
        rung.style.borderRadius = '8px';
        rung.style.position = 'relative';
        rung.dataset.score = score;

        if (landmines.includes(score)) {
            rung.style.background = '#f44336';
            rung.innerHTML = `${score} 💣`;
        } else {
            rung.style.background = '#1a1a2e';
            rung.textContent = score;
        }

        GameState.players.forEach(player => {
            if (player.score === score) {
                const marker = document.createElement('span');
                marker.textContent = ` 🎯 ${player.name}`;
                marker.style.color = '#f0a500';
                rung.appendChild(marker);
            }
        });

        ladder.insertBefore(rung, ladder.firstChild);
    }

    setTimeout(() => {
        if (savedScrollTop > 0) {
            ladder.scrollTop = savedScrollTop;
        }
    }, 0);

    // Bullseye target
    const targetArea = document.createElement('div');
    targetArea.style.flex = '1';
    targetArea.style.display = 'flex';
    targetArea.style.justifyContent = 'center';
    targetArea.style.alignItems = 'center';

    const target = document.createElement('div');
    target.className = 'target-bullseye';

    // Use percentages for responsive scaling
    const rings = [
        { size: '15%', color: '#FFD700', points: 50, label: '50' },
        { size: '30%', color: '#ff6b6b', points: 25, label: '25' },
        { size: '45%', color: '#fff', points: 15, label: '15' },
        { size: '60%', color: '#000', points: 10, label: '10' },
        { size: '75%', color: '#f0a500', points: 5, label: '5' },
        { size: '90%', color: '#1a1a2e', points: 1, label: '1' }
    ];

    rings.reverse().forEach((ring, index) => {
        const ringDiv = document.createElement('div');
        ringDiv.className = 'target-ring';
        ringDiv.style.width = ring.size;
        ringDiv.style.height = ring.size;
        ringDiv.style.background = ring.color;
        ringDiv.dataset.points = ring.points;
        ringDiv.style.zIndex = String(index + 1);

        // Create label element positioned on the ring edge
        const label = document.createElement('div');
        label.className = 'ring-label';
        label.textContent = ring.label;
        label.style.position = 'absolute';
        // Center the label for the smallest ring (50 points), move others up
        if (ring.points === 50) {
            label.style.top = '50%';
            label.style.transform = 'translate(-50%, -50%)';
        } else {
            label.style.top = '5px';
            label.style.transform = 'translateX(-50%)';
        }
        label.style.left = '50%';
        label.style.fontSize = 'min(1.2rem, 1.8vw, 1.8vh)';
        label.style.fontWeight = 'bold';
        label.style.color = ring.color === '#fff' || ring.color === '#FFD700' ? '#000' : '#fff';
        label.style.pointerEvents = 'none';
        label.style.zIndex = '10';
        label.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';

        ringDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            handleLandminesHit(ring.points);
        });

        ringDiv.appendChild(label);
        target.appendChild(ringDiv);
    });

    targetArea.appendChild(target);

    contentContainer.appendChild(ladder);
    contentContainer.appendChild(targetArea);
    mainContainer.appendChild(contentContainer);
    canvas.appendChild(mainContainer);
}

function handleLandminesHit(points) {
    const currentPlayer = GameState.players[GameState.currentPlayerIndex];
    
    saveState();
    
    const newScore = currentPlayer.score + points;
    const targetScore = GameState.gameData.targetScore;
    const landmines = GameState.gameData.landmineScores;
    
    if (landmines.includes(newScore)) {
        // Hit a landmine! Go back to last checkpoint
        const checkpoint = Math.floor(currentPlayer.score / GameState.gameData.checkpointInterval) * GameState.gameData.checkpointInterval;
        currentPlayer.score = checkpoint;
    } else if (newScore > targetScore && GameState.settings.landminesOverTargetRule === 'Exact Only') {
        // Bust - go back to checkpoint
        const checkpoint = Math.floor(currentPlayer.score / GameState.gameData.checkpointInterval) * GameState.gameData.checkpointInterval;
        currentPlayer.score = checkpoint;
    } else {
        currentPlayer.score = newScore;
    }
    
    renderLandminesBoard();
    updateScoreboard();
    
    // Check win
    if (currentPlayer.score >= targetScore) {
        setTimeout(() => endGame(), 500);
        return;
    }
    
    // Next player
    GameState.currentPlayerIndex = (GameState.currentPlayerIndex + 1) % GameState.players.length;
    updateCurrentPlayerDisplay();
}

// ============================================
// GAME 16: THROW ROYALE (Battle Royale)
// ============================================
function initThrowRoyale() {
    const canvas = document.getElementById('gameCanvas');
    
    // Initialize player data
    GameState.players.forEach(player => {
        player.data.lives = GameState.settings.royaleStartingLives;
        player.data.eliminated = false;
        player.data.roundScore = 0;
        player.score = 0;
    });
    
    GameState.gameData.round = 1;
    GameState.gameData.currentThrower = 0;
    
    renderThrowRoyale();
}

function renderThrowRoyale() {
    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = '';

    const container = document.createElement('div');
    container.style.textAlign = 'center';

    // Round display
    const roundDiv = document.createElement('div');
    roundDiv.innerHTML = `<h2 style="color: #f0a500;">Round ${GameState.gameData.round}</h2>`;
    roundDiv.style.marginBottom = '20px';
    container.appendChild(roundDiv);

    // Lives display
    const livesContainer = document.createElement('div');
    livesContainer.style.display = 'flex';
    livesContainer.style.justifyContent = 'center';
    livesContainer.style.gap = '20px';
    livesContainer.style.marginBottom = '30px';
    livesContainer.style.flexWrap = 'wrap';

    const activePlayers = GameState.players.filter(p => !p.data.eliminated);
    let activeIndex = 0;

    GameState.players.forEach((player, index) => {
        if (!player.data.eliminated) {
            const isCurrentThrower = activeIndex === GameState.gameData.currentThrower;
            const playerDiv = document.createElement('div');
            playerDiv.style.background = isCurrentThrower ? '#f0a500' : '#2a2a3e';
            playerDiv.style.padding = '15px';
            playerDiv.style.borderRadius = '10px';
            playerDiv.style.minWidth = '120px';
            playerDiv.style.border = isCurrentThrower ? '3px solid #FFD700' : 'none';

            const hearts = '❤️'.repeat(player.data.lives);
            const roundScore = player.data.roundScore || 0;
            const scoreDisplay = roundScore > 0 ? `<div style="font-size: 1.2rem; color: #4CAF50; margin-top: 5px;">+${roundScore} pts</div>` : '';
            playerDiv.innerHTML = `
                <div style="font-weight: bold; color: ${isCurrentThrower ? '#000' : '#fff'};">${player.name}${isCurrentThrower ? ' 🎯' : ''}</div>
                <div style="font-size: 1.5rem; margin-top: 5px;">${hearts}</div>
                ${scoreDisplay}
            `;

            livesContainer.appendChild(playerDiv);
            activeIndex++;
        }
    });

    container.appendChild(livesContainer);
    
    // Bullseye target
    const target = document.createElement('div');
    target.className = 'target-bullseye';
    
    // Use percentages for responsive scaling
    const rings = [
        { size: '15%', color: '#FFD700', points: 50, label: '50' },
        { size: '30%', color: '#ff6b6b', points: 25, label: '25' },
        { size: '45%', color: '#fff', points: 15, label: '15' },
        { size: '60%', color: '#000', points: 10, label: '10' },
        { size: '75%', color: '#f0a500', points: 5, label: '5' },
        { size: '90%', color: '#1a1a2e', points: 1, label: '1' }
    ];

    rings.reverse().forEach((ring, index) => {
        const ringDiv = document.createElement('div');
        ringDiv.className = 'target-ring';
        ringDiv.style.width = ring.size;
        ringDiv.style.height = ring.size;
        ringDiv.style.background = ring.color;
        ringDiv.dataset.points = ring.points;
        ringDiv.style.zIndex = String(index + 1);

        // Create label element positioned on the ring edge
        const label = document.createElement('div');
        label.className = 'ring-label';
        label.textContent = ring.label;
        label.style.position = 'absolute';
        // Center the label for the smallest ring (50 points), move others up
        if (ring.points === 50) {
            label.style.top = '50%';
            label.style.transform = 'translate(-50%, -50%)';
        } else {
            label.style.top = '5px';
            label.style.transform = 'translateX(-50%)';
        }
        label.style.left = '50%';
        label.style.fontSize = 'min(1.2rem, 1.8vw, 1.8vh)';
        label.style.fontWeight = 'bold';
        label.style.color = ring.color === '#fff' || ring.color === '#FFD700' ? '#000' : '#fff';
        label.style.pointerEvents = 'none';
        label.style.zIndex = '10';
        label.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';

        ringDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            handleRoyaleHit(ring.points);
        });

        ringDiv.appendChild(label);
        target.appendChild(ringDiv);
    });
    
    container.appendChild(target);
    canvas.appendChild(container);
}

function handleRoyaleHit(points) {
    const activePlayers = GameState.players.filter(p => !p.data.eliminated);
    const currentPlayer = activePlayers[GameState.gameData.currentThrower];

    saveState();

    currentPlayer.data.roundScore = points;
    currentPlayer.score = points; // Update main score for scoreboard

    // Update the current player index to show in scoreboard
    GameState.currentPlayerIndex = GameState.players.indexOf(currentPlayer);
    updateCurrentPlayerDisplay();
    updateScoreboard();

    GameState.gameData.currentThrower++;

    // Check if round is complete
    if (GameState.gameData.currentThrower >= activePlayers.length) {
        // Render first to show all scores
        renderThrowRoyale();

        // Then process round results after a delay
        setTimeout(() => {
            // Find lowest score(s)
            const scores = activePlayers.map(p => p.data.roundScore);
            const minScore = Math.min(...scores);

            // Apply penalty
            activePlayers.forEach(player => {
                if (player.data.roundScore === minScore) {
                    player.data.lives--;
                    if (player.data.lives <= 0) {
                        player.data.eliminated = true;
                        player.score = 0;
                    }
                }
                player.data.roundScore = 0;
            });

            // Check win condition
            const remaining = GameState.players.filter(p => !p.data.eliminated).length;
            if (remaining <= 1) {
                GameState.players.forEach(p => {
                    if (!p.data.eliminated) p.score = 100;
                });
                updateScoreboard();
                setTimeout(() => endGame(), 500);
                return;
            }

            // Next round
            GameState.gameData.round++;
            GameState.gameData.currentThrower = 0;

            // Update to first active player
            const nextActivePlayers = GameState.players.filter(p => !p.data.eliminated);
            if (nextActivePlayers.length > 0) {
                GameState.currentPlayerIndex = GameState.players.indexOf(nextActivePlayers[0]);
                updateCurrentPlayerDisplay();
            }

            renderThrowRoyale();
        }, 2000); // 2 second delay to show all scores
        return;
    }

    renderThrowRoyale();
}

// ============================================
// GAME 17: DATE NIGHT MODE
// ============================================
function initDateNight() {
    const canvas = document.getElementById('gameCanvas');

    // Initialize player data
    GameState.players.forEach(player => {
        player.data.throws = 0;
        player.score = 0;
    });

    // Date dare prompts
    GameState.gameData.dateDares = [
        "Take a selfie together!",
        "Switch lanes with another couple!",
        "Loser buys dessert!",
        "Winner picks the next date location!",
        "Share your favorite memory together!",
        "Give your partner a compliment!",
        "Tell each other what you love most about them!",
        "Dance for 30 seconds!",
        "Tell each other a secret!",
        "Share a kiss!",
        "Winner gets a back rub!",
        "Loser does the dishes tonight!",
        "Hold hands for the next 3 throws!",
        "Share your first impression of each other!",
        "Tell your partner why you're grateful for them!",
        "Make a wish together!",
        "Whisper something sweet to your partner!",
        "Give your partner a hug!",
        "Tell your partner your favorite thing about today!",
        "Share what you're looking forward to together!"
    ];

    renderDateNight();
}

function renderDateNight() {
    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = '';

    // Create heart-themed bullseye
    const target = document.createElement('div');
    target.className = 'target-bullseye';
    target.style.filter = 'hue-rotate(330deg)'; // Make it more pink
    
    // Use percentages for responsive scaling
    const rings = [
        { size: '15%', color: '#FFD700', points: 50, label: '50' },
        { size: '30%', color: '#ff6b6b', points: 25, label: '25' },
        { size: '45%', color: '#fff', points: 15, label: '15' },
        { size: '60%', color: '#000', points: 10, label: '10' },
        { size: '75%', color: '#f0a500', points: 5, label: '5' },
        { size: '90%', color: '#1a1a2e', points: 1, label: '1' }
    ];

    rings.reverse().forEach((ring, index) => {
        const ringDiv = document.createElement('div');
        ringDiv.className = 'target-ring';
        ringDiv.style.width = ring.size;
        ringDiv.style.height = ring.size;
        ringDiv.style.background = ring.color;
        ringDiv.dataset.points = ring.points;
        ringDiv.style.zIndex = String(index + 1);

        // Create label element positioned on the ring edge
        const label = document.createElement('div');
        label.className = 'ring-label';
        label.textContent = ring.label;
        label.style.position = 'absolute';
        // Center the label for the smallest ring (50 points), move others up
        if (ring.points === 50) {
            label.style.top = '50%';
            label.style.transform = 'translate(-50%, -50%)';
        } else {
            label.style.top = '5px';
            label.style.transform = 'translateX(-50%)';
        }
        label.style.left = '50%';
        label.style.fontSize = 'min(1.2rem, 1.8vw, 1.8vh)';
        label.style.fontWeight = 'bold';
        label.style.color = ring.color === '#fff' || ring.color === '#FFD700' ? '#000' : '#fff';
        label.style.pointerEvents = 'none';
        label.style.zIndex = '10';
        label.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';

        ringDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            handleDateNightHit(ring.points);
        });

        ringDiv.appendChild(label);
        target.appendChild(ringDiv);
    });
    
    // Add heart bonus zones with visual indicators
    const heartZones = GameState.settings.dateHeartZones;
    for (let i = 0; i < heartZones; i++) {
        const heartContainer = document.createElement('div');
        heartContainer.style.position = 'absolute';
        heartContainer.style.cursor = 'pointer';
        heartContainer.style.zIndex = '100'; // Ensure hearts are above all rings
        heartContainer.dataset.bonus = 'heart';

        // Position at outer rim of the bullseye for better gameplay
        const angle = (360 / heartZones) * i + 45; // +45 to position at corners instead of cardinal points
        const radius = 150; // Position at the outer rim of the orange ring
        const x = Math.cos(angle * Math.PI / 180) * radius;
        const y = Math.sin(angle * Math.PI / 180) * radius;

        heartContainer.style.left = `calc(50% + ${x}px)`;
        heartContainer.style.top = `calc(50% + ${y}px)`;
        heartContainer.style.transform = 'translate(-50%, -50%)';

        // Visual indicator background
        const indicator = document.createElement('div');
        indicator.style.width = '60px';
        indicator.style.height = '60px';
        indicator.style.background = 'radial-gradient(circle, rgba(255, 105, 180, 0.3), rgba(255, 20, 147, 0.1))';
        indicator.style.borderRadius = '50%';
        indicator.style.border = '2px solid #ff69b4';
        indicator.style.display = 'flex';
        indicator.style.alignItems = 'center';
        indicator.style.justifyContent = 'center';
        indicator.style.animation = 'pulse 2s infinite';

        const heart = document.createElement('div');
        heart.textContent = '💕';
        heart.style.fontSize = '2rem';

        indicator.appendChild(heart);
        heartContainer.appendChild(indicator);

        heartContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            handleDateNightHit(10, true);
        });

        heartContainer.addEventListener('mouseenter', () => {
            indicator.style.transform = 'scale(1.2)';
            indicator.style.transition = 'transform 0.2s';
        });

        heartContainer.addEventListener('mouseleave', () => {
            indicator.style.transform = 'scale(1)';
        });

        target.appendChild(heartContainer);
    }

    canvas.appendChild(target);

    // Add CSS animation for pulse effect if not already added
    if (!document.getElementById('dateNightStyles')) {
        const style = document.createElement('style');
        style.id = 'dateNightStyles';
        style.textContent = `
            @keyframes pulse {
                0%, 100% { box-shadow: 0 0 10px rgba(255, 105, 180, 0.5); }
                50% { box-shadow: 0 0 20px rgba(255, 105, 180, 0.8); }
            }
        `;
        document.head.appendChild(style);
    }
}

function handleDateNightHit(points, isHeart = false) {
    const currentPlayer = GameState.players[GameState.currentPlayerIndex];
    const maxThrows = GameState.settings.dateThrowsPerPlayer;

    if (currentPlayer.data.throws >= maxThrows) return;

    saveState();

    let finalPoints = points;
    if (isHeart) {
        finalPoints = points * GameState.settings.dateHeartMultiplier;

        // Show random date dare
        const dares = GameState.gameData.dateDares;
        const randomDare = dares[Math.floor(Math.random() * dares.length)];

        // Create dare popup
        const darePopup = document.createElement('div');
        darePopup.style.position = 'fixed';
        darePopup.style.top = '50%';
        darePopup.style.left = '50%';
        darePopup.style.transform = 'translate(-50%, -50%)';
        darePopup.style.background = 'linear-gradient(135deg, #ff6b6b, #ff69b4)';
        darePopup.style.padding = '30px 40px';
        darePopup.style.borderRadius = '20px';
        darePopup.style.border = '4px solid #fff';
        darePopup.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
        darePopup.style.zIndex = '1000';
        darePopup.style.textAlign = 'center';
        darePopup.style.animation = 'popIn 0.3s ease-out';
        darePopup.innerHTML = `
            <h2 style="color: #fff; margin: 0 0 15px 0; font-size: 1.8rem;">💕 Date Dare! 💕</h2>
            <p style="color: #fff; font-size: 1.3rem; margin: 0 0 20px 0;">${randomDare}</p>
            <p style="color: #FFD700; font-size: 1.1rem; margin: 0 0 15px 0;">Bonus: +${finalPoints} points!</p>
            <button style="background: #fff; color: #ff6b6b; border: none; padding: 10px 30px; border-radius: 10px; font-size: 1.1rem; font-weight: bold; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Got it! ❤️</button>
        `;

        document.body.appendChild(darePopup);

        // Add pop-in animation
        if (!document.getElementById('darePopupStyles')) {
            const style = document.createElement('style');
            style.id = 'darePopupStyles';
            style.textContent = `
                @keyframes popIn {
                    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        // Click button to dismiss popup
        const button = darePopup.querySelector('button');
        button.addEventListener('click', () => {
            darePopup.style.animation = 'popIn 0.3s ease-out reverse';
            setTimeout(() => darePopup.remove(), 300);
        });
    }

    currentPlayer.score += finalPoints;
    currentPlayer.data.throws++;

    updateScoreboard();

    // Check if turn is over
    if (currentPlayer.data.throws >= maxThrows) {
        const allFinished = GameState.players.every(p => p.data.throws >= maxThrows);
        if (allFinished) {
            setTimeout(() => endGame(), 500);
            return;
        }

        // Switch to next player
        let nextPlayerIndex = (GameState.currentPlayerIndex + 1) % GameState.players.length;
        while (GameState.players[nextPlayerIndex].data.throws >= maxThrows && nextPlayerIndex !== GameState.currentPlayerIndex) {
            nextPlayerIndex = (nextPlayerIndex + 1) % GameState.players.length;
        }

        if (GameState.players[nextPlayerIndex].data.throws < maxThrows) {
            GameState.currentPlayerIndex = nextPlayerIndex;
            updateCurrentPlayerDisplay();
        }
    }
}

// ============================================
// GAME 18: MERRY AXE-MAS (Christmas Mode)
// ============================================
function initMerryAxemas() {
    const canvas = document.getElementById('gameCanvas');

    // Initialize player data
    GameState.players.forEach(player => {
        player.data.throws = 0;
        player.score = 0;
    });

    // Christmas background with snow effect
    canvas.style.background = 'linear-gradient(180deg, #1a1a2e 0%, #0f3a2e 100%)';

    // Add Christmas decorations
    addChristmasDecorations(canvas);

    // Initialize presents/ornaments on tree
    GameState.gameData.presents = [];
    const giftValues = GameState.settings.xmasGiftValues.split(',').map(v => parseInt(v.trim()));

    for (let i = 0; i < 10; i++) {
        GameState.gameData.presents.push({
            value: giftValues[Math.floor(Math.random() * giftValues.length)],
            emoji: ['🎁', '⭐', '🔔', '🎅'][Math.floor(Math.random() * 4)]
        });
    }

    renderXmasTreeWithGifts();
}

function addChristmasDecorations(canvas) {
    // Add snowflakes
    for (let i = 0; i < 15; i++) {
        const snowflake = document.createElement('div');
        snowflake.textContent = '❄️';
        snowflake.style.position = 'absolute';
        snowflake.style.fontSize = '1.5rem';
        snowflake.style.opacity = '0.3';
        snowflake.style.left = Math.random() * 100 + '%';
        snowflake.style.top = Math.random() * 100 + '%';
        snowflake.style.pointerEvents = 'none';
        snowflake.style.animation = `float ${3 + Math.random() * 3}s ease-in-out infinite`;
        canvas.appendChild(snowflake);
    }

    // Add CSS animation if not already added
    if (!document.getElementById('xmasStyles')) {
        const style = document.createElement('style');
        style.id = 'xmasStyles';
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
            }
            @keyframes twinkle {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `;
        document.head.appendChild(style);
    }
}

function renderXmasTreeWithGifts() {
    const canvas = document.getElementById('gameCanvas');

    // Clear existing game content (keep decorations)
    const existingContainers = canvas.querySelectorAll('div:not([style*="position: absolute"])');
    existingContainers.forEach(el => {
        if (!el.textContent.includes('❄️')) {
            el.remove();
        }
    });

    // Add remaining throws display at the top
    const currentPlayer = GameState.players[GameState.currentPlayerIndex];
    const maxThrows = GameState.settings.xmasThrowsPerPlayer;
    const throwsRemaining = maxThrows - (currentPlayer.data.throws || 0);

    const throwsDisplay = document.createElement('div');
    throwsDisplay.style.position = 'absolute';
    throwsDisplay.style.top = '10px';
    throwsDisplay.style.left = '50%';
    throwsDisplay.style.transform = 'translateX(-50%)';
    throwsDisplay.style.textAlign = 'center';
    throwsDisplay.style.fontSize = '1.5rem';
    throwsDisplay.style.fontWeight = 'bold';
    throwsDisplay.style.color = '#f0a500';
    throwsDisplay.style.zIndex = '100';
    throwsDisplay.innerHTML = `Throws Remaining: ${throwsRemaining} / ${maxThrows}`;
    canvas.appendChild(throwsDisplay);

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.width = '90%';
    container.style.maxWidth = 'min(90vh, 90vw, 900px)';
    container.style.height = 'min(90vh, 90vw, 900px)';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';

    // Create large Christmas tree using text/emoji layers
    const tree = document.createElement('div');
    tree.style.position = 'relative';
    tree.style.fontSize = '40rem';
    tree.style.lineHeight = '1';
    tree.style.textAlign = 'center';
    tree.style.filter = 'drop-shadow(0 0 20px rgba(76, 175, 80, 0.6))';
    tree.textContent = '🎄';

    // Add twinkling star on top
    const star = document.createElement('div');
    star.textContent = '⭐';
    star.style.position = 'absolute';
    star.style.top = '-40px';
    star.style.left = '50%';
    star.style.transform = 'translateX(-50%)';
    star.style.fontSize = '4rem';
    star.style.animation = 'twinkle 1.5s ease-in-out infinite';
    star.style.filter = 'drop-shadow(0 0 10px #FFD700)';
    tree.appendChild(star);

    // Position gifts/ornaments on the tree using a grid pattern
    const treePositions = [
        { x: '50%', y: '20%' },  // Top
        { x: '35%', y: '35%' },  // Upper left
        { x: '65%', y: '35%' },  // Upper right
        { x: '25%', y: '50%' },  // Middle left
        { x: '50%', y: '50%' },  // Center
        { x: '75%', y: '50%' },  // Middle right
        { x: '20%', y: '65%' },  // Lower left
        { x: '45%', y: '65%' },  // Lower mid-left
        { x: '80%', y: '65%' },  // Lower right
        { x: '50%', y: '80%' }   // Bottom
    ];

    GameState.gameData.presents.forEach((present, index) => {
        // Skip already collected presents
        if (present.collected) return;

        const pos = treePositions[index];
        const giftDiv = document.createElement('div');
        giftDiv.textContent = present.emoji;
        giftDiv.style.position = 'absolute';
        giftDiv.style.left = pos.x;
        giftDiv.style.top = pos.y;
        giftDiv.style.transform = 'translate(-50%, -50%)';
        giftDiv.style.fontSize = '3rem';
        giftDiv.style.cursor = 'pointer';
        giftDiv.style.transition = 'transform 0.2s, filter 0.2s';
        giftDiv.style.filter = 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))';
        giftDiv.style.zIndex = '10';

        giftDiv.addEventListener('mouseenter', () => {
            giftDiv.style.transform = 'translate(-50%, -50%) scale(1.3)';
            giftDiv.style.filter = 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.9))';
        });

        giftDiv.addEventListener('mouseleave', () => {
            giftDiv.style.transform = 'translate(-50%, -50%) scale(1)';
            giftDiv.style.filter = 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))';
        });

        giftDiv.addEventListener('click', () => {
            handleXmasGiftClick(index);
        });

        tree.appendChild(giftDiv);
    });

    container.appendChild(tree);
    canvas.appendChild(container);

    // Add miss handler for clicking outside gifts
    canvas.addEventListener('click', handleXmasMiss);
}

function handleXmasMiss(e) {
    // Only handle clicks on canvas/tree background, not on gifts
    if (e.target.id === 'gameCanvas' || e.target.textContent === '🎄' || e.target.textContent === '⭐') {
        const currentPlayer = GameState.players[GameState.currentPlayerIndex];
        const maxThrows = GameState.settings.xmasThrowsPerPlayer;

        if (currentPlayer.data.throws >= maxThrows) return;

        saveState();

        currentPlayer.data.throws++;

        if (currentPlayer.data.throws >= maxThrows) {
            const allFinished = GameState.players.every(p => p.data.throws >= maxThrows);
            if (allFinished) {
                updateScoreboard();
                setTimeout(() => endGame(), 500);
                return;
            }

            // Switch to next player
            let nextPlayerIndex = (GameState.currentPlayerIndex + 1) % GameState.players.length;
            while (GameState.players[nextPlayerIndex].data.throws >= maxThrows && nextPlayerIndex !== GameState.currentPlayerIndex) {
                nextPlayerIndex = (nextPlayerIndex + 1) % GameState.players.length;
            }

            if (GameState.players[nextPlayerIndex].data.throws < maxThrows) {
                GameState.currentPlayerIndex = nextPlayerIndex;
                updateCurrentPlayerDisplay();
            }
        }

        renderXmasTreeWithGifts();
        updateScoreboard();
    }
}

// Alias for undo compatibility
function renderMerryAxemas() {
    renderXmasTreeWithGifts();
}

// Keep old function for compatibility but update it
function renderXmasGiftHunt() {
    const canvas = document.getElementById('gameCanvas');
    const existingContainer = canvas.querySelector('.xmas-gift-container');

    // Only recreate if doesn't exist
    if (!existingContainer) {
        canvas.innerHTML = '';
        addChristmasDecorations(canvas);
    }

    const container = existingContainer || document.createElement('div');
    container.className = 'xmas-gift-container';
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.maxWidth = '600px';
    container.style.height = '500px';
    container.style.margin = '20px auto';
    container.style.background = 'linear-gradient(180deg, #1a1a2e 0%, #0f3a2e 100%)';
    container.style.borderRadius = '20px';
    container.style.border = '3px solid #4CAF50';
    container.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.3)';
    container.innerHTML = ''; // Clear previous gifts

    GameState.gameData.presents.forEach((present, index) => {
        const giftDiv = document.createElement('div');
        giftDiv.textContent = present.emoji;
        giftDiv.style.position = 'absolute';
        giftDiv.style.left = present.x + '%';
        giftDiv.style.top = present.y + '%';
        giftDiv.style.fontSize = '3rem';
        giftDiv.style.cursor = 'pointer';
        giftDiv.style.transition = 'transform 0.2s';
        giftDiv.style.filter = 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.5))';
        
        const valueLabel = document.createElement('div');
        valueLabel.textContent = present.value;
        valueLabel.style.fontSize = '0.8rem';
        valueLabel.style.background = '#f0a500';
        valueLabel.style.color = '#000';
        valueLabel.style.padding = '2px 6px';
        valueLabel.style.borderRadius = '5px';
        valueLabel.style.position = 'absolute';
        valueLabel.style.bottom = '-10px';
        valueLabel.style.left = '50%';
        valueLabel.style.transform = 'translateX(-50%)';
        giftDiv.appendChild(valueLabel);
        
        giftDiv.addEventListener('click', () => handleXmasGiftClick(index));
        giftDiv.addEventListener('mouseenter', () => {
            giftDiv.style.transform = 'scale(1.3)';
        });
        giftDiv.addEventListener('mouseleave', () => {
            giftDiv.style.transform = 'scale(1)';
        });
        
        container.appendChild(giftDiv);
    });
    
    canvas.appendChild(container);
}

function handleXmasHit(points) {
    const currentPlayer = GameState.players[GameState.currentPlayerIndex];
    const maxThrows = GameState.settings.xmasThrowsPerPlayer;

    if (currentPlayer.data.throws >= maxThrows) return;

    saveState();

    currentPlayer.score += points;
    currentPlayer.data.throws++;

    updateScoreboard();

    if (currentPlayer.data.throws >= maxThrows) {
        const allFinished = GameState.players.every(p => p.data.throws >= maxThrows);
        if (allFinished) {
            setTimeout(() => endGame(), 500);
            return;
        }

        // Switch to next player
        let nextPlayerIndex = (GameState.currentPlayerIndex + 1) % GameState.players.length;
        while (GameState.players[nextPlayerIndex].data.throws >= maxThrows && nextPlayerIndex !== GameState.currentPlayerIndex) {
            nextPlayerIndex = (nextPlayerIndex + 1) % GameState.players.length;
        }

        if (GameState.players[nextPlayerIndex].data.throws < maxThrows) {
            GameState.currentPlayerIndex = nextPlayerIndex;
            updateCurrentPlayerDisplay();
        }
    }
}

function handleXmasGiftClick(index) {
    const currentPlayer = GameState.players[GameState.currentPlayerIndex];
    const maxThrows = GameState.settings.xmasThrowsPerPlayer;

    if (currentPlayer.data.throws >= maxThrows) return;

    const present = GameState.gameData.presents[index];
    if (present.collected) return; // Don't allow clicking already collected gifts

    saveState();

    currentPlayer.score += present.value;
    currentPlayer.data.throws++;

    // Spawn a new present to replace the collected one
    const giftValues = GameState.settings.xmasGiftValues.split(',').map(v => parseInt(v.trim()));
    GameState.gameData.presents[index] = {
        value: giftValues[Math.floor(Math.random() * giftValues.length)],
        emoji: ['🎁', '⭐', '🔔', '🎅'][Math.floor(Math.random() * 4)]
    };

    if (currentPlayer.data.throws >= maxThrows) {
        const allFinished = GameState.players.every(p => p.data.throws >= maxThrows);
        if (allFinished) {
            updateScoreboard();
            setTimeout(() => endGame(), 500);
            return;
        }

        // Switch to next player
        let nextPlayerIndex = (GameState.currentPlayerIndex + 1) % GameState.players.length;
        while (GameState.players[nextPlayerIndex].data.throws >= maxThrows && nextPlayerIndex !== GameState.currentPlayerIndex) {
            nextPlayerIndex = (nextPlayerIndex + 1) % GameState.players.length;
        }

        if (GameState.players[nextPlayerIndex].data.throws < maxThrows) {
            GameState.currentPlayerIndex = nextPlayerIndex;
            updateCurrentPlayerDisplay();
        }
    }

    renderXmasTreeWithGifts();
    updateScoreboard();
}
