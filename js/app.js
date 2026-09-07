/**
 * app.js
 * App coordinator for Picko 247 Sports & Play Hub and TryVibe Pickleball Training 🎯
 */
document.addEventListener('DOMContentLoaded', () => {
    const engine = new GameEngine('canvas');
    window.engine = engine;

    const trainingGame = new PickleballTraining(engine.canvas, engine);
    engine.loadGame(trainingGame);

    function setExpandedGameMode(expand = true) {
        const arcadeLayout = document.querySelector('.game-arcade-layout');
        if (expand) {
            arcadeLayout?.classList.add('expanded-game-mode');
        } else {
            arcadeLayout?.classList.remove('expanded-game-mode');
        }
    }

    let countdownTimerId = null;
    function startCountdownAndGame() {
        setExpandedGameMode(true);
        engine.showOverlay('countdown-overlay');

        const numEl = document.getElementById('countdown-number');
        let count = 3;

        if (numEl) numEl.innerText = count;
        window.audioManager.playSound('hit');

        if (countdownTimerId) clearInterval(countdownTimerId);

        countdownTimerId = setInterval(() => {
            count--;
            if (count > 0) {
                if (numEl) numEl.innerText = count;
                window.audioManager.playSound('hit');
            } else if (count === 0) {
                if (numEl) numEl.innerText = 'GO!';
                window.audioManager.playSound('coin');
            } else {
                clearInterval(countdownTimerId);
                engine.start();
            }
        }, 850);
    }

    function exitGameAndCollapse() {
        if (countdownTimerId) clearInterval(countdownTimerId);
        engine.isRunning = false;
        engine.state = 'IDLE';
        setExpandedGameMode(false);
        engine.showOverlay('start-overlay');
        if (engine.activeGame && engine.ctx) {
            engine.activeGame.init();
            engine.activeGame.render(engine.ctx);
        }
    }

    document.getElementById('btn-start-game')?.addEventListener('click', () => {
        startCountdownAndGame();
    });

    document.getElementById('btn-resume-game')?.addEventListener('click', () => {
        engine.resume();
    });

    document.getElementById('btn-restart-game-over')?.addEventListener('click', () => {
        startCountdownAndGame();
    });

    document.getElementById('btn-exit-game-pause')?.addEventListener('click', exitGameAndCollapse);
    document.getElementById('btn-exit-game-over')?.addEventListener('click', exitGameAndCollapse);
    document.getElementById('btn-exit-game-bar')?.addEventListener('click', exitGameAndCollapse);

    document.getElementById('btn-pause-toggle')?.addEventListener('click', () => {
        engine.togglePause();
    });

    document.getElementById('btn-reset-game')?.addEventListener('click', () => {
        engine.start();
    });

    const btnTheme = document.getElementById('btn-toggle-theme');
    const savedTheme = localStorage.getItem('picko_theme') || 'dark';

    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        if (btnTheme) btnTheme.innerHTML = '<i class="fas fa-moon"></i>';
    }

    if (btnTheme) {
        btnTheme.addEventListener('click', () => {
            const isLight = document.body.classList.toggle('light-theme');
            btnTheme.innerHTML = isLight ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
            localStorage.setItem('picko_theme', isLight ? 'light' : 'dark');
        });
    }

    const btnSound = document.getElementById('btn-toggle-sound');
    if (btnSound) {
        btnSound.addEventListener('click', () => {
            const active = window.audioManager.toggleSound();
            btnSound.classList.toggle('active', active);
            btnSound.innerHTML = active ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
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
            } else if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        });
    }

    window.addEventListener('keydown', (e) => {
        if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
        if (e.code === 'KeyP') {
            engine.togglePause();
        } else if (e.code === 'KeyR') {
            engine.start();
        } else if (e.code === 'KeyF') {
            btnFullscreen?.click();
        }
    });
});
