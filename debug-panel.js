/**
 * DEBUG PANEL
 * Toggleable panel for adjusting all game element sizes in real-time
 * Toggle with: Ctrl+Shift+D
 */

const DebugPanel = {
    isOpen: false,
    panel: null,

    // Configuration values (these will update GameState.settings and CSS)
    config: {
        // Bullseye Games (Classic, 21, BAD AXE, Date Night, etc.)
        bullseye: {
            ring1: 82,
            ring2: 165,
            ring3: 248,
            ring4: 330,
            ring5: 412,
            ring6: 495,
            labelFontSize: 1.2,
            containerSize: 550
        },

        // 21 Game (uses bullseye target)
        game21: {
            ring1: 82,
            ring2: 165,
            ring3: 248,
            ring4: 330,
            ring5: 412,
            ring6: 495,
            labelFontSize: 1.2,
            containerSize: 550
        },

        // Bad Axe (uses bullseye target)
        badAxe: {
            ring1: 82,
            ring2: 165,
            ring3: 248,
            ring4: 330,
            ring5: 412,
            ring6: 495,
            labelFontSize: 1.2,
            containerSize: 550
        },

        // Around the World
        aroundTheWorld: {
            zoneSize: 98,
            zoneRadius: 392,
            positionOffset: 0.65,
            fontSize: 2.0
        },

        // Tic-Tac-Toe
        ticTacToe: {
            gridSize: 900,
            gap: 15,
            fontSize: 6.0,
            borderWidth: 4
        },

        // Target Practice
        targetPractice: {
            targetSize: 120,
            borderWidth: 4,
            fontSize: 2.0,
            moveDuration: 3,
            staticDuration: 5
        },

        // Zombie Hunt
        zombieHunt: {
            zombieSize: 100,
            fontSize: 5.0,
            maxZombies: 5,
            despawnTime: 20,
            minDistance: 12
        },

        // Connect Four
        connectFour: {
            gridWidth: 1050,
            gridHeight: 900,
            padding: 30,
            gap: 12,
            fontSize: 3.0,
            borderWidth: 5
        },

        // Cricket/Knockout
        cricket: {
            boardMaxWidth: 900,
            numberColWidth: 150,
            cellSize: 112,
            fontSize: 3.5,
            gap: 10
        },

        // Axe Crush
        axeCrush: {
            maxWidth: 600,
            gridCols: 7,
            gridRows: 8,
            fontSize: 2.0,
            borderWidth: 2,
            borderRadius: 10,
            gap: 5,
            iconTypes: 5,
            minGroupSize: 3
        },

        // Axe Memory
        axeMemory: {
            maxWidth: 600,
            gridSize: 16,
            fontSize: 2.5,
            borderWidth: 3,
            borderRadius: 10,
            gap: 10,
            revealDuration: 1.5,
            marginTop: 50
        },

        // Axe Word Wack
        wordWack: {
            maxWidth: 600,
            solutionFontSize: 2.5,
            letterSpacing: 5,
            letterFontSize: 1.5,
            borderWidth: 2,
            gap: 10
        },

        // Emoji Frenzy
        emojiFrenzy: {
            containerWidth: 840,
            containerHeight: 700,
            headerFontSize: 2.5,
            targetFontSize: 4.2,
            emojiFontSize: 4.2,
            emojiAreaHeight: 490,
            borderWidth: 3,
            hoverScale: 1.3
        },

        // Date Night
        dateNight: {
            heartSize: 84,
            heartFontSize: 2.8,
            heartRadius: 150,
            darePopupPadding: 30,
            dareTitleFontSize: 1.8,
            dareTextFontSize: 1.3
        },

        // Merry Axe-mas
        merryAxemas: {
            treeFontSize: 39.2,
            starFontSize: 5.6,
            starTopOffset: -56,
            giftFontSize: 3.0,
            containerHeight: 840,
            containerMaxWidth: 840,
            snowflakeFontSize: 1.5
        },

        // Infection Mode
        infection: {
            columnPadding: 20,
            playerPadding: 10,
            borderWidth: 3,
            timerFontSize: 1.5
        },

        // Landmines
        landmines: {
            ladderWidth: 250,
            ladderHeight: 600,
            rungPadding: 10,
            scoreFontSize: 1.8
        },

        // Throw Royale
        throwRoyale: {
            playerPadding: 15,
            playerMinWidth: 120,
            heartFontSize: 1.5,
            scoreFontSize: 1.2,
            borderWidth: 3
        }
    },

    init() {
        // Create toggle keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggle();
            }
        });

        this.createPanel();
        this.createFloatingButton();
    },

    toggle() {
        this.isOpen = !this.isOpen;
        if (this.panel) {
            this.panel.style.display = this.isOpen ? 'block' : 'none';
        }
    },

    createFloatingButton() {
        // Create a floating button for tablet/mobile access
        const button = document.createElement('button');
        button.id = 'debug-toggle-btn';
        button.innerHTML = '🔧';
        button.title = 'Toggle Debug Panel';
        button.onclick = () => this.toggle();
        document.body.appendChild(button);
    },

    createPanel() {
        // Create panel container
        this.panel = document.createElement('div');
        this.panel.id = 'debug-panel';
        this.panel.style.display = 'none';

        // Panel header
        const header = document.createElement('div');
        header.className = 'debug-header';
        header.innerHTML = `
            <h2>🔧 Debug Panel</h2>
            <div class="debug-header-buttons">
                <button onclick="DebugPanel.copyConfig()">📋 Copy Config</button>
                <button onclick="DebugPanel.resetConfig()">🔄 Reset</button>
                <button onclick="DebugPanel.toggle()">✖</button>
            </div>
        `;

        // Panel content (scrollable)
        const content = document.createElement('div');
        content.className = 'debug-content';
        content.innerHTML = this.generateSliders();

        this.panel.appendChild(header);
        this.panel.appendChild(content);
        document.body.appendChild(this.panel);

        // Attach event listeners to all sliders
        this.attachSliderListeners();
    },

    generateSliders() {
        let html = '<div class="debug-hint">Press Ctrl+Shift+D or tap the 🔧 button to toggle this panel</div>';

        // Bullseye Games
        html += this.createSection('🎯 Bullseye Games', 'bullseye', [
            { key: 'ring1', label: 'Ring 1 (Center)', min: 40, max: 200, step: 1, unit: 'px' },
            { key: 'ring2', label: 'Ring 2', min: 80, max: 300, step: 1, unit: 'px' },
            { key: 'ring3', label: 'Ring 3', min: 120, max: 400, step: 1, unit: 'px' },
            { key: 'ring4', label: 'Ring 4', min: 160, max: 500, step: 1, unit: 'px' },
            { key: 'ring5', label: 'Ring 5', min: 200, max: 600, step: 1, unit: 'px' },
            { key: 'ring6', label: 'Ring 6 (Outer)', min: 240, max: 700, step: 1, unit: 'px' },
            { key: 'labelFontSize', label: 'Label Font Size', min: 0.5, max: 3, step: 0.1, unit: 'rem' },
            { key: 'containerSize', label: 'Container Size', min: 400, max: 1000, step: 10, unit: 'px' }
        ]);

        // 21 Game
        html += this.createSection('🎲 21 Game', 'game21', [
            { key: 'ring1', label: 'Ring 1 (7 pts - Center)', min: 40, max: 200, step: 1, unit: 'px' },
            { key: 'ring2', label: 'Ring 2 (5 pts)', min: 80, max: 300, step: 1, unit: 'px' },
            { key: 'ring3', label: 'Ring 3 (3 pts)', min: 120, max: 400, step: 1, unit: 'px' },
            { key: 'ring4', label: 'Ring 4 (2 pts)', min: 160, max: 500, step: 1, unit: 'px' },
            { key: 'ring5', label: 'Ring 5 (1 pt)', min: 200, max: 600, step: 1, unit: 'px' },
            { key: 'ring6', label: 'Ring 6 (0 pts - Outer)', min: 240, max: 700, step: 1, unit: 'px' },
            { key: 'labelFontSize', label: 'Label Font Size', min: 0.5, max: 3, step: 0.1, unit: 'rem' },
            { key: 'containerSize', label: 'Container Size', min: 400, max: 1000, step: 10, unit: 'px' }
        ]);

        // Bad Axe
        html += this.createSection('🏀 BAD AXE', 'badAxe', [
            { key: 'ring1', label: 'Ring 1 (50 pts - Bullseye)', min: 40, max: 200, step: 1, unit: 'px' },
            { key: 'ring2', label: 'Ring 2 (25 pts)', min: 80, max: 300, step: 1, unit: 'px' },
            { key: 'ring3', label: 'Ring 3 (15 pts)', min: 120, max: 400, step: 1, unit: 'px' },
            { key: 'ring4', label: 'Ring 4 (10 pts)', min: 160, max: 500, step: 1, unit: 'px' },
            { key: 'ring5', label: 'Ring 5 (5 pts)', min: 200, max: 600, step: 1, unit: 'px' },
            { key: 'ring6', label: 'Ring 6 (1 pt - Outer)', min: 240, max: 700, step: 1, unit: 'px' },
            { key: 'labelFontSize', label: 'Label Font Size', min: 0.5, max: 3, step: 0.1, unit: 'rem' },
            { key: 'containerSize', label: 'Container Size', min: 400, max: 1000, step: 10, unit: 'px' }
        ]);

        // Around the World
        html += this.createSection('🌍 Around the World', 'aroundTheWorld', [
            { key: 'zoneSize', label: 'Zone Size', min: 50, max: 150, step: 1, unit: 'px' },
            { key: 'zoneRadius', label: 'Zone Radius', min: 200, max: 500, step: 1, unit: 'px' },
            { key: 'positionOffset', label: 'Position Offset', min: 0.3, max: 1, step: 0.05, unit: '' },
            { key: 'fontSize', label: 'Number Font Size', min: 1, max: 4, step: 0.1, unit: 'rem' }
        ]);

        // Tic-Tac-Toe
        html += this.createSection('⭕ Tic-Tac-Toe', 'ticTacToe', [
            { key: 'gridSize', label: 'Grid Size', min: 500, max: 1200, step: 10, unit: 'px' },
            { key: 'gap', label: 'Grid Gap', min: 5, max: 40, step: 1, unit: 'px' },
            { key: 'fontSize', label: 'Symbol Font Size', min: 3, max: 10, step: 0.1, unit: 'rem' },
            { key: 'borderWidth', label: 'Border Width', min: 1, max: 10, step: 1, unit: 'px' }
        ]);

        // Target Practice
        html += this.createSection('🎯 Target Practice', 'targetPractice', [
            { key: 'targetSize', label: 'Target Size', min: 60, max: 250, step: 5, unit: 'px' },
            { key: 'borderWidth', label: 'Border Width', min: 1, max: 10, step: 1, unit: 'px' },
            { key: 'fontSize', label: 'Value Font Size', min: 1, max: 4, step: 0.1, unit: 'rem' },
            { key: 'moveDuration', label: 'Move Duration', min: 1, max: 10, step: 0.5, unit: 's' },
            { key: 'staticDuration', label: 'Static Duration', min: 1, max: 15, step: 0.5, unit: 's' }
        ]);

        // Zombie Hunt
        html += this.createSection('🧟 Zombie Hunt', 'zombieHunt', [
            { key: 'zombieSize', label: 'Zombie Size', min: 50, max: 200, step: 5, unit: 'px' },
            { key: 'fontSize', label: 'Emoji Font Size', min: 2, max: 8, step: 0.1, unit: 'rem' },
            { key: 'maxZombies', label: 'Max Zombies', min: 1, max: 15, step: 1, unit: '' },
            { key: 'despawnTime', label: 'Despawn Time', min: 5, max: 60, step: 1, unit: 's' },
            { key: 'minDistance', label: 'Min Distance', min: 5, max: 30, step: 1, unit: '%' }
        ]);

        // Connect Four
        html += this.createSection('🔴 Connect Four', 'connectFour', [
            { key: 'gridWidth', label: 'Grid Width', min: 600, max: 1400, step: 10, unit: 'px' },
            { key: 'gridHeight', label: 'Grid Height', min: 500, max: 1200, step: 10, unit: 'px' },
            { key: 'padding', label: 'Padding', min: 10, max: 60, step: 5, unit: 'px' },
            { key: 'gap', label: 'Gap', min: 5, max: 30, step: 1, unit: 'px' },
            { key: 'fontSize', label: 'Disc Font Size', min: 1, max: 6, step: 0.1, unit: 'rem' },
            { key: 'borderWidth', label: 'Border Width', min: 1, max: 10, step: 1, unit: 'px' }
        ]);

        // Cricket
        html += this.createSection('🏏 Cricket/Knockout', 'cricket', [
            { key: 'boardMaxWidth', label: 'Board Max Width', min: 600, max: 1200, step: 10, unit: 'px' },
            { key: 'numberColWidth', label: 'Number Column Width', min: 100, max: 250, step: 5, unit: 'px' },
            { key: 'cellSize', label: 'Cell Size', min: 60, max: 180, step: 2, unit: 'px' },
            { key: 'fontSize', label: 'Mark Font Size', min: 2, max: 6, step: 0.1, unit: 'rem' },
            { key: 'gap', label: 'Gap', min: 5, max: 25, step: 1, unit: 'px' }
        ]);

        // Axe Crush
        html += this.createSection('💎 Axe Crush', 'axeCrush', [
            { key: 'maxWidth', label: 'Max Width', min: 400, max: 1000, step: 10, unit: 'px' },
            { key: 'gridCols', label: 'Grid Columns', min: 4, max: 10, step: 1, unit: '' },
            { key: 'gridRows', label: 'Grid Rows', min: 4, max: 12, step: 1, unit: '' },
            { key: 'fontSize', label: 'Icon Font Size', min: 1, max: 4, step: 0.1, unit: 'rem' },
            { key: 'borderWidth', label: 'Border Width', min: 1, max: 5, step: 1, unit: 'px' },
            { key: 'borderRadius', label: 'Border Radius', min: 0, max: 30, step: 1, unit: 'px' },
            { key: 'gap', label: 'Gap', min: 2, max: 20, step: 1, unit: 'px' },
            { key: 'iconTypes', label: 'Icon Types', min: 3, max: 8, step: 1, unit: '' },
            { key: 'minGroupSize', label: 'Min Group Size', min: 2, max: 5, step: 1, unit: '' }
        ]);

        // Axe Memory
        html += this.createSection('🧠 Axe Memory', 'axeMemory', [
            { key: 'maxWidth', label: 'Max Width', min: 400, max: 1000, step: 10, unit: 'px' },
            { key: 'gridSize', label: 'Grid Size', min: 9, max: 36, step: 1, unit: 'tiles' },
            { key: 'fontSize', label: 'Emoji Font Size', min: 1, max: 5, step: 0.1, unit: 'rem' },
            { key: 'borderWidth', label: 'Border Width', min: 1, max: 6, step: 1, unit: 'px' },
            { key: 'borderRadius', label: 'Border Radius', min: 0, max: 30, step: 1, unit: 'px' },
            { key: 'gap', label: 'Gap', min: 5, max: 25, step: 1, unit: 'px' },
            { key: 'revealDuration', label: 'Reveal Duration', min: 0.5, max: 5, step: 0.1, unit: 's' },
            { key: 'marginTop', label: 'Vertical Position (Top Margin)', min: 0, max: 300, step: 5, unit: 'px' }
        ]);

        // Axe Word Wack
        html += this.createSection('📝 Axe Word Wack', 'wordWack', [
            { key: 'maxWidth', label: 'Max Width', min: 400, max: 1000, step: 10, unit: 'px' },
            { key: 'solutionFontSize', label: 'Solution Font Size', min: 1, max: 4, step: 0.1, unit: 'rem' },
            { key: 'letterSpacing', label: 'Letter Spacing', min: 0, max: 15, step: 1, unit: 'px' },
            { key: 'letterFontSize', label: 'Letter Font Size', min: 0.8, max: 3, step: 0.1, unit: 'rem' },
            { key: 'borderWidth', label: 'Border Width', min: 1, max: 5, step: 1, unit: 'px' },
            { key: 'gap', label: 'Gap', min: 5, max: 25, step: 1, unit: 'px' }
        ]);

        // Emoji Frenzy
        html += this.createSection('😀 Emoji Frenzy', 'emojiFrenzy', [
            { key: 'containerWidth', label: 'Container Width', min: 500, max: 1200, step: 10, unit: 'px' },
            { key: 'containerHeight', label: 'Container Height', min: 500, max: 1000, step: 10, unit: 'px' },
            { key: 'headerFontSize', label: 'Header Font Size', min: 1.5, max: 4, step: 0.1, unit: 'rem' },
            { key: 'targetFontSize', label: 'Target Font Size', min: 2, max: 6, step: 0.1, unit: 'rem' },
            { key: 'emojiFontSize', label: 'Emoji Font Size', min: 2, max: 6, step: 0.1, unit: 'rem' },
            { key: 'emojiAreaHeight', label: 'Emoji Area Height', min: 300, max: 800, step: 10, unit: 'px' },
            { key: 'borderWidth', label: 'Border Width', min: 1, max: 6, step: 1, unit: 'px' },
            { key: 'hoverScale', label: 'Hover Scale', min: 1, max: 2, step: 0.1, unit: '' }
        ]);

        // Date Night
        html += this.createSection('💕 Date Night', 'dateNight', [
            { key: 'heartSize', label: 'Heart Size', min: 40, max: 150, step: 2, unit: 'px' },
            { key: 'heartFontSize', label: 'Heart Font Size', min: 1, max: 5, step: 0.1, unit: 'rem' },
            { key: 'heartRadius', label: 'Heart Radius', min: 100, max: 300, step: 5, unit: 'px' },
            { key: 'darePopupPadding', label: 'Dare Popup Padding', min: 10, max: 60, step: 5, unit: 'px' },
            { key: 'dareTitleFontSize', label: 'Dare Title Font', min: 1, max: 3, step: 0.1, unit: 'rem' },
            { key: 'dareTextFontSize', label: 'Dare Text Font', min: 0.8, max: 2, step: 0.1, unit: 'rem' }
        ]);

        // Merry Axe-mas
        html += this.createSection('🎄 Merry Axe-mas', 'merryAxemas', [
            { key: 'treeFontSize', label: 'Tree Font Size', min: 20, max: 60, step: 0.5, unit: 'rem' },
            { key: 'starFontSize', label: 'Star Font Size', min: 3, max: 10, step: 0.1, unit: 'rem' },
            { key: 'starTopOffset', label: 'Star Top Offset', min: -100, max: 0, step: 2, unit: 'px' },
            { key: 'giftFontSize', label: 'Gift Font Size', min: 1.5, max: 6, step: 0.1, unit: 'rem' },
            { key: 'containerHeight', label: 'Container Height', min: 500, max: 1200, step: 10, unit: 'px' },
            { key: 'containerMaxWidth', label: 'Container Max Width', min: 500, max: 1200, step: 10, unit: 'px' },
            { key: 'snowflakeFontSize', label: 'Snowflake Font Size', min: 0.5, max: 3, step: 0.1, unit: 'rem' }
        ]);

        // Infection Mode
        html += this.createSection('🦠 Infection Mode', 'infection', [
            { key: 'columnPadding', label: 'Column Padding', min: 10, max: 50, step: 2, unit: 'px' },
            { key: 'playerPadding', label: 'Player Padding', min: 5, max: 30, step: 1, unit: 'px' },
            { key: 'borderWidth', label: 'Border Width', min: 1, max: 6, step: 1, unit: 'px' },
            { key: 'timerFontSize', label: 'Timer Font Size', min: 0.8, max: 3, step: 0.1, unit: 'rem' }
        ]);

        // Landmines
        html += this.createSection('💣 Landmines', 'landmines', [
            { key: 'ladderWidth', label: 'Ladder Width', min: 150, max: 400, step: 10, unit: 'px' },
            { key: 'ladderHeight', label: 'Ladder Height', min: 400, max: 800, step: 10, unit: 'px' },
            { key: 'rungPadding', label: 'Rung Padding', min: 5, max: 25, step: 1, unit: 'px' },
            { key: 'scoreFontSize', label: 'Score Font Size', min: 0.8, max: 3, step: 0.1, unit: 'rem' }
        ]);

        // Throw Royale
        html += this.createSection('👑 Throw Royale', 'throwRoyale', [
            { key: 'playerPadding', label: 'Player Padding', min: 5, max: 30, step: 1, unit: 'px' },
            { key: 'playerMinWidth', label: 'Player Min Width', min: 80, max: 200, step: 5, unit: 'px' },
            { key: 'heartFontSize', label: 'Heart Font Size', min: 0.8, max: 3, step: 0.1, unit: 'rem' },
            { key: 'scoreFontSize', label: 'Score Font Size', min: 0.8, max: 2, step: 0.1, unit: 'rem' },
            { key: 'borderWidth', label: 'Border Width', min: 1, max: 6, step: 1, unit: 'px' }
        ]);

        return html;
    },

    createSection(title, category, sliders) {
        let html = `
            <div class="debug-section">
                <h3 class="debug-section-title" onclick="this.parentElement.classList.toggle('collapsed')">${title}</h3>
                <div class="debug-sliders">
        `;

        sliders.forEach(slider => {
            const value = this.config[category][slider.key];
            html += `
                <div class="debug-slider-group">
                    <label>
                        <span class="slider-label">${slider.label}</span>
                        <span class="slider-value" data-category="${category}" data-key="${slider.key}">${value}${slider.unit}</span>
                    </label>
                    <input
                        type="range"
                        min="${slider.min}"
                        max="${slider.max}"
                        step="${slider.step}"
                        value="${value}"
                        data-category="${category}"
                        data-key="${slider.key}"
                        data-unit="${slider.unit}"
                    />
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        return html;
    },

    attachSliderListeners() {
        const sliders = this.panel.querySelectorAll('input[type="range"]');
        sliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                const category = e.target.dataset.category;
                const key = e.target.dataset.key;
                const unit = e.target.dataset.unit;
                const value = parseFloat(e.target.value);

                // Update config
                this.config[category][key] = value;

                // Update display
                const valueDisplay = this.panel.querySelector(
                    `.slider-value[data-category="${category}"][data-key="${key}"]`
                );
                if (valueDisplay) {
                    valueDisplay.textContent = `${value}${unit}`;
                }

                // Apply changes in real-time
                this.applyChanges(category, key, value, unit);
            });
        });
    },

    applyChanges(category, key, value, unit) {
        // Apply CSS changes dynamically
        const root = document.documentElement;
        let needsRerender = false;

        // Map config to CSS variables and game settings
        switch(category) {
            case 'bullseye':
            case 'game21':
            case 'badAxe':
                if (key.startsWith('ring')) {
                    root.style.setProperty(`--bullseye-${key}`, `${value}px`);
                } else if (key === 'labelFontSize') {
                    root.style.setProperty('--bullseye-label-font', `${value}rem`);
                } else if (key === 'containerSize') {
                    root.style.setProperty('--bullseye-container-size', `${value}px`);
                }
                needsRerender = true; // Bullseye needs rerender to update ring sizes
                break;

            case 'aroundTheWorld':
                root.style.setProperty(`--aroundTheWorld-${key}`, `${value}${unit}`);
                needsRerender = true; // Around the World needs rerender to reposition zones
                break;

            case 'ticTacToe':
                root.style.setProperty(`--ticTacToe-${key}`, `${value}${unit}`);
                // Only rerender for structural changes, not cosmetic ones
                needsRerender = false;
                break;

            case 'connectFour':
                root.style.setProperty(`--connectFour-${key}`, `${value}${unit}`);
                // Only rerender for structural changes
                needsRerender = false;
                break;

            case 'targetPractice':
                if (key === 'moveDuration' && GameState.settings) {
                    GameState.settings.moveDuration = value;
                } else if (key === 'staticDuration' && GameState.settings) {
                    GameState.settings.staticDuration = value;
                }
                root.style.setProperty(`--target-practice-${key}`, `${value}${unit}`);
                // Don't rerender - CSS changes apply immediately to existing targets
                needsRerender = false;
                break;

            case 'zombieHunt':
                if (key === 'maxZombies' && GameState.settings) {
                    GameState.settings.maxZombies = value;
                } else if (key === 'despawnTime' && GameState.settings) {
                    GameState.settings.zombieDespawnTime = value;
                } else if (key === 'minDistance' && GameState.settings) {
                    GameState.settings.zombieMinDistance = value;
                }
                root.style.setProperty(`--zombie-${key}`, `${value}${unit}`);
                // Don't rerender - CSS changes apply immediately
                needsRerender = false;
                break;

            case 'cricket':
                root.style.setProperty(`--cricket-${key}`, `${value}${unit}`);
                // Don't rerender - CSS changes apply immediately
                needsRerender = false;
                break;

            case 'axeCrush':
                if (GameState.settings) {
                    if (key === 'gridCols') {
                        GameState.settings.crushGridCols = value;
                        needsRerender = true; // Grid size change requires rerender
                    } else if (key === 'gridRows') {
                        GameState.settings.crushGridRows = value;
                        needsRerender = true; // Grid size change requires rerender
                    } else if (key === 'iconTypes') {
                        GameState.settings.crushIconTypes = value;
                        needsRerender = true; // Icon types change requires rerender
                    } else if (key === 'minGroupSize') {
                        GameState.settings.crushMinGroupSize = value;
                        // Min group size doesn't require rerender
                    }
                }
                root.style.setProperty(`--crush-${key}`, `${value}${unit}`);
                break;

            case 'axeMemory':
                if (key === 'gridSize' && GameState.settings) {
                    GameState.settings.memoryGridSize = value;
                    needsRerender = true; // Grid size change requires rerender
                } else if (key === 'revealDuration' && GameState.settings) {
                    GameState.settings.memoryRevealDuration = value;
                    needsRerender = false;
                } else if (key === 'marginTop') {
                    // Margin top changes should rerender to update grid position
                    needsRerender = true;
                } else {
                    // CSS-only changes don't need rerender
                    needsRerender = false;
                }
                root.style.setProperty(`--memory-${key}`, `${value}${unit}`);
                break;

            case 'wordWack':
                root.style.setProperty(`--wordWack-${key}`, `${value}${unit}`);
                // Don't rerender - CSS changes apply immediately
                needsRerender = false;
                break;

            case 'emojiFrenzy':
                root.style.setProperty(`--emojiFrenzy-${key}`, `${value}${unit}`);
                // Don't rerender - CSS changes apply immediately
                needsRerender = false;
                break;

            case 'dateNight':
                root.style.setProperty(`--dateNight-${key}`, `${value}${unit}`);
                needsRerender = true; // Date Night needs rerender for heart repositioning
                break;

            case 'merryAxemas':
                root.style.setProperty(`--merryAxemas-${key}`, `${value}${unit}`);
                needsRerender = true; // Merry Axemas needs rerender for gift repositioning
                break;

            case 'infection':
                root.style.setProperty(`--infection-${key}`, `${value}${unit}`);
                // Don't rerender - CSS changes apply immediately
                needsRerender = false;
                break;

            case 'landmines':
                root.style.setProperty(`--landmines-${key}`, `${value}${unit}`);
                // Don't rerender - CSS changes apply immediately
                needsRerender = false;
                break;

            case 'throwRoyale':
                root.style.setProperty(`--throwRoyale-${key}`, `${value}${unit}`);
                // Don't rerender - CSS changes apply immediately
                needsRerender = false;
                break;

            // Add more cases for other categories...
            default:
                // Generic CSS variable application
                root.style.setProperty(`--${category}-${key}`, `${value}${unit}`);
                needsRerender = false;
        }

        // Trigger re-render only if needed and if game is active
        if (needsRerender && typeof GameState !== 'undefined' && GameState.currentGame) {
            // Re-render the game to apply the new sizes
            const renderFunctionMap = {
                'bullseye': 'initBullseye',
                '21': 'init21Game',
                'ticTacToe': 'initTicTacToe',
                'connectFour': 'initConnectFour',
                'targetPractice': 'initTargetPractice',
                'zombieHunt': 'initZombieHunt',
                'aroundTheWorld': 'initAroundTheWorld',
                'cricket': 'initCricket',
                'knockout': 'initKnockout',
                'badAxe': 'initBadAxe',
                'infection': 'initInfection',
                'landmines': 'initLandmines',
                'throwRoyale': 'initThrowRoyale',
                'dateNight': 'renderDateNight',
                'merryAxemas': 'initMerryAxemas',
                'axeCrush': 'initAxeCrush',
                'axeMemory': 'initAxeMemory',
                'wordWack': 'initWordWack',
                'emojiFrenzy': 'initEmojiFrenzy'
            };

            const renderFunc = renderFunctionMap[GameState.currentGame];
            if (renderFunc && typeof window[renderFunc] === 'function') {
                window[renderFunc]();
            }
        }
    },

    copyConfig() {
        const configText = JSON.stringify(this.config, null, 2);

        // Copy to clipboard
        navigator.clipboard.writeText(configText).then(() => {
            alert('✅ Configuration copied to clipboard!\n\nYou can now paste these values into your code.');
        }).catch(err => {
            // Fallback: show in alert
            const textarea = document.createElement('textarea');
            textarea.value = configText;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('✅ Configuration copied to clipboard!');
        });

        // Also log to console
        console.log('=== DEBUG PANEL CONFIG ===');
        console.log(configText);
        console.log('=========================');
    },

    resetConfig() {
        if (confirm('Reset all values to defaults? This will reload the page.')) {
            location.reload();
        }
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DebugPanel.init());
} else {
    DebugPanel.init();
}
