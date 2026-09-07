/**
 * GameEngine.js
 * Core engine driver for loop execution, state switching, and HTML UI synchronization.
 */
class GameEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error("Canvas element not found!");
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        window.inputManager.setCanvas(this.canvas);

        // Logical Canvas Resolution
        this.canvas.width = 1280;
        this.canvas.height = 720;

        // Loop state
        this.isRunning = false;
        this.isPaused = false;
        this.state = 'IDLE'; // IDLE, PLAYING, PAUSED, GAMEOVER

        this.lastTime = 0;
        this.fps = 60;
        this.frameCount = 0;
        this.fpsTimer = 0;

        this.activeGame = null;
        this.highScore = window.storageManager.getHighScore();
        this.previousHighScore = this.highScore;
        this.isRecordBrokenThisSession = false;

        // Bind update loop
        this.loop = this.loop.bind(this);
    }

    loadGame(gameInstance) {
        if (this.activeGame && typeof this.activeGame.destroy === 'function') {
            this.activeGame.destroy();
        }
        this.activeGame = gameInstance;
        this.activeGame.init();
        this.activeGame.render(this.ctx);
        this.updateGameTitleUI();
        
        const gameId = this.activeGame ? (this.activeGame.id || this.activeGame.name || 'global') : 'global';
        this.highScore = window.storageManager.getHighScore(gameId);
    }

    start() {
        if (!this.activeGame) return;

        const gameId = this.activeGame ? (this.activeGame.id || this.activeGame.name || 'global') : 'global';
        this.previousHighScore = window.storageManager.getHighScore(gameId);
        this.highScore = this.previousHighScore;
        this.isRecordBrokenThisSession = false;

        this.activeGame.init();
        window.particleSystem.clear();
        
        this.state = 'PLAYING';
        this.isPaused = false;
        this.isRunning = true;
        this.lastTime = performance.now();

        this.hideAllOverlays();
        requestAnimationFrame(this.loop);
    }

    pause() {
        if (this.state !== 'PLAYING') return;
        this.state = 'PAUSED';
        this.isPaused = true;
        this.showOverlay('pause-overlay');
    }

    resume() {
        if (this.state !== 'PAUSED') return;
        this.state = 'PLAYING';
        this.isPaused = false;
        this.lastTime = performance.now();
        this.hideAllOverlays();
        requestAnimationFrame(this.loop);
    }

    togglePause() {
        if (this.state === 'PLAYING') {
            this.pause();
        } else if (this.state === 'PAUSED') {
            this.resume();
        }
    }

    gameOver(finalScore) {
        this.state = 'GAMEOVER';
        this.isRunning = false;

        const gameId = this.activeGame ? (this.activeGame.id || this.activeGame.name || 'global') : 'global';
        const res = window.storageManager.saveHighScore(finalScore, gameId);
        const isNewHigh = res.isNewHigh || (finalScore > this.previousHighScore && finalScore > 0);

        if (isNewHigh) {
            this.highScore = finalScore;
        }

        window.audioManager.playSound('gameover');

        // Update GameOver Overlay UI
        const scoreElem = document.getElementById('final-score-display');
        const highElem = document.getElementById('final-highscore-display');
        if (scoreElem) scoreElem.innerText = finalScore;
        if (highElem) highElem.innerText = this.highScore;

        const recordBadge = document.getElementById('new-high-badge');
        if (recordBadge) {
            recordBadge.style.display = isNewHigh ? 'inline-block' : 'none';
        }

        const gameoverTitle = document.querySelector('#gameover-overlay .overlay-title');
        if (gameoverTitle) {
            if (isNewHigh) {
                gameoverTitle.innerHTML = '🏆 TẠO KỶ LỤC MỚI! 🎉';
                gameoverTitle.style.color = '#FACC15';
            } else {
                gameoverTitle.innerHTML = 'GAME OVER';
                gameoverTitle.style.color = 'var(--danger)';
            }
        }

        this.showOverlay('gameover-overlay');
    }

    loop(timestamp) {
        if (!this.isRunning || this.state === 'PAUSED') return;

        const dt = Math.min(0.1, (timestamp - this.lastTime) / 1000);
        this.lastTime = timestamp;

        // Calculate FPS
        this.frameCount++;
        this.fpsTimer += dt;
        if (this.fpsTimer >= 1.0) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsTimer = 0;
            const fpsDisplay = document.getElementById('fps-counter');
            if (fpsDisplay) fpsDisplay.innerText = this.fps + ' FPS';
        }

        // Update Game Logic
        if (this.activeGame) {
            this.activeGame.update(dt);
            window.particleSystem.update(dt);
        }

        // Render Canvas
        if (this.activeGame) {
            this.activeGame.render(this.ctx);
        }

        // Input end frame reset
        window.inputManager.updateFrameEnd();

        // Next frame
        if (this.isRunning && this.state === 'PLAYING') {
            requestAnimationFrame(this.loop);
        }
    }

    updateHUD(stats = {}) {
        if (stats.score !== undefined) {
            const el = document.getElementById('hud-score');
            if (el) el.innerText = stats.score;

            if (stats.score > this.highScore && stats.score > 0) {
                const isFirstTimeInRun = !this.isRecordBrokenThisSession;
                this.isRecordBrokenThisSession = true;
                this.highScore = stats.score;

                const gameId = this.activeGame ? (this.activeGame.id || this.activeGame.name || 'global') : 'global';
                window.storageManager.saveHighScore(stats.score, gameId);

                if (isFirstTimeInRun) {
                    this.showRecordBreakNotification(stats.score);
                }

                if (window.pickoPlatform) {
                    window.pickoPlatform.syncGameScore(stats.score);
                }
            }
        }

        const highEl = document.getElementById('hud-highscore');
        if (highEl) highEl.innerText = this.highScore;

        const sideHigh = document.getElementById('side-user-highscore');
        if (sideHigh) sideHigh.innerText = `${this.highScore} PTS`;

        if (stats.level !== undefined) {
            const el = document.getElementById('hud-level');
            if (el) el.innerText = stats.level;
        }

        if (stats.combo !== undefined) {
            const el = document.getElementById('hud-combo');
            if (el) el.innerText = stats.combo + 'x';
        }

        if (stats.time !== undefined) {
            const el = document.getElementById('hud-time');
            if (el) {
                const mins = String(Math.floor(stats.time / 60)).padStart(2, '0');
                const secs = String(stats.time % 60).padStart(2, '0');
                el.innerText = `${mins}:${secs}`;
            }
        }

        if (stats.health !== undefined && stats.maxHealth !== undefined) {
            const fill = document.getElementById('hud-health-fill');
            const num = document.getElementById('hud-health-num');
            const pct = Math.max(0, Math.min(100, (stats.health / stats.maxHealth) * 100));
            if (fill) fill.style.width = pct + '%';
            if (num) num.innerText = `${Math.ceil(stats.health)}/${stats.maxHealth}`;
        }
    }

    updateGameTitleUI() {
        const titleEl = document.getElementById('active-game-title');
        const descEl = document.getElementById('active-game-desc');
        if (this.activeGame) {
            if (titleEl) titleEl.innerText = this.activeGame.name;
            if (descEl) descEl.innerText = this.activeGame.description;
        }
    }

    showOverlay(id) {
        document.querySelectorAll('.overlay-screen').forEach(el => el.classList.add('hidden'));
        const target = document.getElementById(id);
        if (target) target.classList.remove('hidden');
    }

    hideAllOverlays() {
        document.querySelectorAll('.overlay-screen').forEach(el => el.classList.add('hidden'));
    }

    setResolution(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    showRecordBreakNotification(score) {
        if (window.audioManager) {
            window.audioManager.playSound('coin');
            setTimeout(() => { if (window.audioManager) window.audioManager.playSound('hit'); }, 150);
        }

        if (window.particleSystem && this.canvas) {
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 3;
            window.particleSystem.createExplosion(centerX, centerY, '#FACC15', 40, 8);
            window.particleSystem.createExplosion(centerX, centerY, '#00F3FF', 30, 6);
        }

        let toast = document.getElementById('record-break-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'record-break-toast';
            toast.className = 'record-break-toast';
            const container = document.getElementById('game-container') || document.body;
            container.appendChild(toast);
        }

        toast.innerHTML = `
            <div class="record-toast-content">
                <span class="record-toast-icon">🏆</span>
                <div class="record-toast-text">
                    <div class="record-toast-title">KỶ LỤC MỚI! NEW RECORD!</div>
                    <div class="record-toast-score">${score} PTS</div>
                </div>
            </div>
        `;
        toast.classList.remove('show');
        void toast.offsetWidth; // Force reflow
        toast.classList.add('show');

        if (this.toastTimeout) clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }
}

window.GameEngine = GameEngine;
