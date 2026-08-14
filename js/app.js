/**
 * app.js
 * Main application coordinator & DOM controller for POLY Game 2026.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Instantiate Core Engine
    const engine = new GameEngine('canvas');
    window.engine = engine;

    // Load Default Game (Sample Arcade Game)
    const sampleGame = new SampleGame(engine.canvas, engine);
    const blankGame = new BlankTemplate(engine.canvas, engine);

    engine.loadGame(sampleGame);

    // =========================================================================
    // System Logger Helper
    // =========================================================================
    const systemLogBox = document.getElementById('system-log');
    function logSystem(msg, type = 'info') {
        if (!systemLogBox) return;
        const time = new Date().toLocaleTimeString('vi-VN', { hour12: false });
        const div = document.createElement('div');
        div.className = `log-entry ${type}`;
        div.innerText = `[${time}] ${msg}`;
        systemLogBox.appendChild(div);
        systemLogBox.scrollTop = systemLogBox.scrollHeight;
    }
    window.app = { logSystem };

    logSystem("System initialized. Canvas 1280x720 60FPS ready.", "success");
    logSystem("Press [PLAY] to start sample game or switch to Blank Template.", "info");

    // =========================================================================
    // Overlay Buttons (Start, Pause, GameOver, Restart)
    // =========================================================================
    document.getElementById('btn-start-game')?.addEventListener('click', () => {
        engine.start();
        logSystem("Game session started.", "success");
    });

    document.getElementById('btn-resume-game')?.addEventListener('click', () => {
        engine.resume();
        logSystem("Game resumed.", "info");
    });

    document.getElementById('btn-restart-game')?.addEventListener('click', () => {
        engine.start();
        logSystem("Game restarted.", "warn");
    });

    document.getElementById('btn-restart-game-over')?.addEventListener('click', () => {
        engine.start();
        logSystem("Game restarted from Game Over screen.", "warn");
    });

    // Toolbar Pause Button
    document.getElementById('btn-pause-toggle')?.addEventListener('click', () => {
        engine.togglePause();
    });

    // Toolbar Reset Button
    document.getElementById('btn-reset-game')?.addEventListener('click', () => {
        engine.start();
    });

    // =========================================================================
    // Game Selector Dropdown (Demo vs Blank Template for Exam Day)
    // =========================================================================
    const gameSelect = document.getElementById('game-selector');
    if (gameSelect) {
        gameSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            if (val === 'sample') {
                engine.loadGame(sampleGame);
                logSystem("Loaded: Cyber Core (Demo Game)", "info");
            } else if (val === 'blank') {
                engine.loadGame(blankGame);
                logSystem("Loaded: Blank Competition Template", "warn");
            }
            engine.showOverlay('start-overlay');
        });
    }

    // Resolution Selector Dropdown
    const resSelect = document.getElementById('res-selector');
    if (resSelect) {
        resSelect.addEventListener('change', (e) => {
            const [w, h] = e.target.value.split('x').map(Number);
            engine.setResolution(w, h);
            logSystem(`Canvas resolution updated to ${w}x${h}`, "info");
        });
    }

    // Theme Selector Dropdown
    const themeSelect = document.getElementById('theme-selector');
    if (themeSelect) {
        themeSelect.addEventListener('change', (e) => {
            const theme = e.target.value;
            document.body.setAttribute('data-theme', theme);
            logSystem(`UI Theme changed to: ${theme.toUpperCase()}`, "info");
        });
    }

    // =========================================================================
    // Header Audio & UI Controls
    // =========================================================================
    const btnSound = document.getElementById('btn-toggle-sound');
    if (btnSound) {
        btnSound.addEventListener('click', () => {
            const active = window.audioManager.toggleSound();
            btnSound.classList.toggle('active', active);
            btnSound.innerHTML = active ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
            logSystem(`Sound SFX ${active ? 'Enabled' : 'Muted'}`, "info");
        });
    }

    const btnFullscreen = document.getElementById('btn-toggle-fullscreen');
    if (btnFullscreen) {
        btnFullscreen.addEventListener('click', () => {
            const container = document.getElementById('game-container');
            if (!document.fullscreenElement) {
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                }
                btnFullscreen.classList.add('active');
                logSystem("Entered Fullscreen Mode", "info");
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
                btnFullscreen.classList.remove('active');
                logSystem("Exited Fullscreen Mode", "info");
            }
        });
    }

    // =========================================================================
    // Exam Debug & Cheats Panel
    // =========================================================================
    document.getElementById('cheat-add-score')?.addEventListener('click', () => {
        if (engine.activeGame && engine.state === 'PLAYING') {
            engine.activeGame.score = (engine.activeGame.score || 0) + 100;
            logSystem("Debug: Added +100 Score", "warn");
        }
    });

    document.getElementById('cheat-heal')?.addEventListener('click', () => {
        if (engine.activeGame && engine.activeGame.player) {
            engine.activeGame.player.health = engine.activeGame.player.maxHealth || 100;
            logSystem("Debug: Restored Full Health", "success");
        }
    });

    document.getElementById('cheat-clear-hazards')?.addEventListener('click', () => {
        if (engine.activeGame && engine.activeGame.hazards) {
            engine.activeGame.hazards = [];
            window.particleSystem.clear();
            logSystem("Debug: Cleared all active hazards", "warn");
        }
    });

    document.getElementById('btn-clear-highscore')?.addEventListener('click', () => {
        window.storageManager.set('highscore', 0);
        engine.highScore = 0;
        engine.updateHUD({ score: engine.activeGame ? engine.activeGame.score : 0 });
        logSystem("High Score has been reset to 0", "warn");
    });

    // =========================================================================
    // Mobile Touch Virtual D-Pad Buttons
    // =========================================================================
    const touchMap = {
        'btn-touch-up': 'VirtualUp',
        'btn-touch-down': 'VirtualDown',
        'btn-touch-left': 'VirtualLeft',
        'btn-touch-right': 'VirtualRight',
        'btn-touch-action': 'VirtualAction'
    };

    Object.entries(touchMap).forEach(([id, virtualKey]) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                window.inputManager.setVirtualKey(virtualKey, true);
            });
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                window.inputManager.setVirtualKey(virtualKey, false);
            });
            btn.addEventListener('mousedown', () => {
                window.inputManager.setVirtualKey(virtualKey, true);
            });
            btn.addEventListener('mouseup', () => {
                window.inputManager.setVirtualKey(virtualKey, false);
            });
        }
    });

    // =========================================================================
    // Modal Windows (Help / Instructions)
    // =========================================================================
    const modal = document.getElementById('help-modal');
    document.getElementById('btn-open-help')?.addEventListener('click', () => {
        modal?.classList.add('active');
    });
    document.getElementById('btn-close-help')?.addEventListener('click', () => {
        modal?.classList.remove('active');
    });
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    // Global Key Shortcuts (P: Pause, M: Mute, F: Fullscreen, R: Restart)
    window.addEventListener('keydown', (e) => {
        if (e.code === 'KeyP') {
            engine.togglePause();
        } else if (e.code === 'KeyM') {
            btnSound?.click();
        } else if (e.code === 'KeyF') {
            btnFullscreen?.click();
        } else if (e.code === 'KeyR' && e.ctrlKey) {
            // let normal refresh happen
        } else if (e.code === 'KeyR') {
            engine.start();
        }
    });
});
