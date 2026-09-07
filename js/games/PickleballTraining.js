/**
 * PickleballTraining.js - "Pickleball Training 🏓🎯 (Chế Độ Tập Luyện - TryVibe Official)"
 * Direct 1:1 Integration of TryVibe.html prototype.
 * Runs smoothly at 60 FPS with Try: ✔️ ✔️ / ❌ ❌ lives system, automatic ball machine,
 * Space key preventDefault, score tracking, audio FX, and Picko Platform sync.
 */
class PickleballTraining extends BaseGame {
    constructor(canvas, engine) {
        super(canvas, engine);
        this.name = "Pickleball Training 🏓🎯";
        this.description = "Official Training Hub (TryVibe): Rèn luyện phản xạ đỉnh cao! Đón và đánh trả các đường bóng từ máy bắn tự động qua lưới.";
    }

    init() {
        this.width = this.canvas.width;   // 1280
        this.height = this.canvas.height; // 720

        this.groundY = 630; // Matches groundY in 720p resolution

        // Lives & Match Scores from TryVibe.html
        this.lives = 2;
        this.maxLives = 2;
        this.score = 0;
        this.isGameOver = false;
        this.gameTime = 0;

        // TryVibe Net Dimensions (Scaled to 1280x720) — hạ thấp hơn một chút
        this.net = {
            x: 632,
            y: 432,
            w: 24,
            h: 198
        };

        // Active Flying Balls Array
        this.balls = [];

        // Firing Machine Entity (At right court side)
        this.machine = {
            x: 1120,
            y: 486,
            w: 104,
            h: 144,
            shootTimer: 0,
            shootInterval: 1.2, // 1.2s shooting interval matching TryVibe
            draw: (ctx) => {
                const mx = this.machine.x;
                const my = this.machine.y;
                const mw = this.machine.w;
                const mh = this.machine.h;

                // Machine shadow on court
                ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
                ctx.beginPath();
                ctx.ellipse(mx + mw / 2, this.groundY, 72, 19, 0, 0, Math.PI * 2);
                ctx.fill();

                // Ball hopper balls on top
                ctx.fillStyle = "#D4E157";
                ctx.beginPath(); ctx.arc(mx + 24, my - 8, 13, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(mx + 51, my - 19, 13, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(mx + 80, my - 8, 13, 0, Math.PI * 2); ctx.fill();

                // Transparent hopper container
                ctx.fillStyle = "rgba(236, 240, 241, 0.25)";
                ctx.beginPath();
                ctx.moveTo(mx - 16, my - 40);
                ctx.lineTo(mx + mw + 16, my - 40);
                ctx.lineTo(mx + mw, my);
                ctx.lineTo(mx, my);
                ctx.fill();

                // Metallic body with gradient
                let bodyGrad = ctx.createLinearGradient(mx, my, mx + mw, my);
                bodyGrad.addColorStop(0, "#95A5A6");
                bodyGrad.addColorStop(0.5, "#BDC3C7");
                bodyGrad.addColorStop(1, "#7F8C8D");
                ctx.fillStyle = bodyGrad;

                ctx.fillRect(mx, my + 8, mw, mh - 16);
                ctx.fillRect(mx + 8, my, mw - 16, mh);

                // Heavy wheels
                ctx.fillStyle = "#111";
                ctx.beginPath(); ctx.arc(mx + 19, my + mh, 26, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(mx + mw - 19, my + mh, 26, 0, Math.PI * 2); ctx.fill();

                ctx.fillStyle = "#BDC3C7";
                ctx.beginPath(); ctx.arc(mx + 19, my + mh, 11, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(mx + mw - 19, my + mh, 11, 0, Math.PI * 2); ctx.fill();

                // Cannon Barrel
                ctx.save();
                ctx.translate(mx - 8, my + 48);
                ctx.rotate(-Math.PI / 6);

                let barrelGrad = ctx.createLinearGradient(-64, -19, 0, -19);
                barrelGrad.addColorStop(0, "#34495E");
                barrelGrad.addColorStop(1, "#17202A");
                ctx.fillStyle = barrelGrad;
                ctx.fillRect(-72, -19, 80, 38);

                ctx.fillStyle = "#E74C3C";
                ctx.fillRect(-72, -22, 10, 44);
                ctx.restore();

                // LED status light (green pulse)
                ctx.shadowBlur = 10;
                ctx.shadowColor = "#2ECC71";
                ctx.fillStyle = "#2ECC71";
                ctx.beginPath(); ctx.arc(mx + 51, my + 38, 6, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(mx + 51, my + 58, 6, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;
            },
            shoot: () => {
                if (this.isGameOver) return;
                const mx = this.machine.x;
                const my = this.machine.y;

                const newBall = {
                    x: mx - 72,
                    y: my + 16,
                    radius: 18,
                    vy: -(580 + Math.random() * 120),
                    vx: -(420 + Math.random() * 140),
                    gravity: 850,
                    color: "#D4E157",
                    isHitByPlayer: false,
                    hasScored: false,
                    crossedNet: false,
                    isActive: true
                };

                this.balls.push(newBall);
                if (window.audioManager) window.audioManager.playSound('hit');
                if (this.balls.length > 10) this.balls.shift();
            }
        };

        // Player Character Entity (TryVibe setup)
        this.player = {
            x: 240,
            y: this.groundY - 144,
            w: 64,
            h: 144,
            speed: 550,
            vy: 0,
            gravity: 1350,
            isGrounded: false,
            swingTimer: 0,
            walkFrame: 0,
            isMoving: false,
            draw: (ctx) => {
                const px = this.player;
                const cx = px.x + px.w / 2;
                const cy = px.y + px.h / 2;

                if (px.isMoving && px.isGrounded) px.walkFrame += 0.35;
                else px.walkFrame = 0;

                const bob = px.isGrounded ? Math.abs(Math.sin(px.walkFrame)) * 8 : -8;
                const legSwing = px.isGrounded ? Math.sin(px.walkFrame) * 22 : 0;
                const charY = cy - bob;

                // Player Shadow
                ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
                ctx.beginPath();
                ctx.ellipse(cx, this.groundY, 32, 8, 0, 0, Math.PI * 2);
                ctx.fill();

                // Legs
                ctx.strokeStyle = "#34495E"; ctx.lineWidth = 10; ctx.lineCap = "round";
                ctx.beginPath(); ctx.moveTo(cx - 8, charY + 24); ctx.lineTo(cx - 8 + legSwing, px.y + px.h); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx + 8, charY + 24); ctx.lineTo(cx + 8 - legSwing, px.y + px.h); ctx.stroke();

                // Shoes
                ctx.fillStyle = "#ECF0F1";
                ctx.beginPath(); ctx.arc(cx - 8 + legSwing + (legSwing > 0 ? 8 : -8), px.y + px.h, 8, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(cx + 8 - legSwing + (legSwing < 0 ? 8 : -8), px.y + px.h, 8, 0, Math.PI * 2); ctx.fill();

                // Athletic Shirt
                ctx.fillStyle = "#F39C12";
                ctx.beginPath(); ctx.moveTo(cx - 22, charY - 24); ctx.lineTo(cx + 22, charY - 24);
                ctx.lineTo(cx + 19, charY + 30); ctx.lineTo(cx - 19, charY + 30); ctx.fill();
                ctx.fillStyle = "white"; ctx.fillRect(cx - 6, charY - 16, 12, 32);

                // Head & Visor
                const headY = charY - 44;
                ctx.fillStyle = "#FAD7A1";
                ctx.beginPath(); ctx.arc(cx, headY, 24, 0, Math.PI * 2); ctx.fill();

                // Eye
                ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc(cx + 10, headY - 4, 9, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = "black"; ctx.beginPath(); ctx.arc(cx + 12, headY - 4, 3, 0, Math.PI * 2); ctx.fill();

                // Eyebrow
                ctx.strokeStyle = "#8E44AD"; ctx.lineWidth = 3;
                ctx.beginPath(); ctx.moveTo(cx + 3, headY - 14); ctx.lineTo(cx + 15, headY - 11); ctx.stroke();

                // Cap/Visor
                ctx.fillStyle = "#3498DB";
                ctx.beginPath(); ctx.arc(cx, headY - 8, 24, Math.PI, Math.PI * 2); ctx.fill();
                ctx.fillRect(cx - 35, headY - 8, 19, 6);

                // Racket & Arm Pivot
                ctx.save();
                ctx.translate(cx, charY - 16);

                let angle = -Math.PI / 6;
                if (px.swingTimer > 0) {
                    let progress = px.swingTimer / 0.25; // 0.25s duration
                    angle = -Math.PI / 6 - (progress * Math.PI * 0.7);
                    px.swingTimer -= 0.016;
                }

                ctx.rotate(angle);

                // Arm
                ctx.strokeStyle = "#FAD7A1"; ctx.lineWidth = 9; ctx.lineCap = "round";
                ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 28); ctx.stroke();

                // Racket Handle
                ctx.strokeStyle = "#2C3E50"; ctx.lineWidth = 8;
                ctx.beginPath(); ctx.moveTo(0, 28); ctx.lineTo(0, 44); ctx.stroke();

                // Racket Head
                ctx.fillStyle = "#E74C3C";
                ctx.shadowBlur = 10;
                ctx.shadowColor = "#E74C3C";
                ctx.beginPath(); ctx.ellipse(0, 64, 18, 26, 0, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;

                ctx.restore();
            },
            update: (dt) => {
                const px = this.player;
                px.vy += px.gravity * dt;
                px.y += px.vy * dt;

                if (px.y + px.h >= this.groundY) {
                    px.y = this.groundY - px.h;
                    px.vy = 0;
                    px.isGrounded = true;
                }
            },
            jump: () => {
                const px = this.player;
                if (px.isGrounded) {
                    px.vy = -650;
                    px.isGrounded = false;
                    if (window.audioManager) window.audioManager.playSound('jump');
                }
            },
            swing: () => {
                const px = this.player;
                px.swingTimer = 0.25;

                // Check ball hit collision
                for (let i = 0; i < this.balls.length; i++) {
                    let b = this.balls[i];
                    if (b.isActive && !b.isHitByPlayer) {
                        const dist = Math.hypot(b.x - (px.x + px.w / 2), b.y - (px.y + px.h / 2));
                        if (dist < 150 && b.x > px.x - 50 && b.x < px.x + 130) {
                            // TryVibe trajectory ratio scaled to 720p
                            b.vx = 620 + Math.random() * 180;
                            b.vy = -(520 + Math.random() * 120);
                            b.isHitByPlayer = true;
                            b.crossedNet = false;
                            b.hasScored = false;
                            if (window.particleSystem) {
                                window.particleSystem.createExplosion(b.x, b.y, '#D4E157', 18, 5);
                            }
                            if (window.audioManager) window.audioManager.playSound('hit');
                            break;
                        }
                    }
                }
            }
        };

        this.resetGameOverOverlay();
        this.syncLivesDisplay();

        const sideHigh = document.getElementById('side-user-highscore');
        if (sideHigh) sideHigh.innerText = `${this.engine.highScore} PTS`;

        if (window.app && window.app.logSystem) {
            window.app.logSystem("Pickleball Training (TryVibe) đã được tích hợp hoàn chỉnh!", "success");
        }
    }

    resetGameOverOverlay() {
        const gameoverTitle = document.querySelector('#gameover-overlay .overlay-title');
        if (gameoverTitle) {
            gameoverTitle.innerHTML = 'GAME OVER';
            gameoverTitle.style.color = 'var(--danger)';
        }
    }

    syncLivesDisplay() {
        const try1 = document.getElementById('try1');
        const try2 = document.getElementById('try2');
        if (!try1 || !try2) return;

        try1.classList.remove('lost');
        try2.classList.remove('lost');

        if (this.lives >= 2) {
            try1.innerText = '✔️';
            try2.innerText = '✔️';
        } else if (this.lives === 1) {
            try1.innerText = '✔️';
            try2.innerText = '❌';
            try2.classList.add('lost');
        } else {
            try1.innerText = '❌';
            try2.innerText = '❌';
            try1.classList.add('lost');
            try2.classList.add('lost');
        }
    }

    scoreBall(b) {
        if (b.hasScored) return;
        b.hasScored = true;
        b.crossedNet = true;
        this.score++;
        if (window.audioManager) window.audioManager.playSound('coin');
        if (window.particleSystem) {
            window.particleSystem.createExplosion(b.x, b.y, '#2ECC71', 20, 6);
        }
        if (window.pickoPlatform) window.pickoPlatform.updateLiveScore(this.score);
    }

    handleNetFault(b) {
        b.isActive = false;
        if (window.audioManager) window.audioManager.playSound('explosion');
        if (window.particleSystem) {
            window.particleSystem.createExplosion(b.x, b.y, '#E74C3C', 16, 5);
        }
        this.loseLife();
    }

    processPlayerBallNet(b, prevX) {
        const netLeft = this.net.x;
        const netRight = this.net.x + this.net.w;
        const netTop = this.net.y;

        const inNetX = b.x + b.radius > netLeft && b.x - b.radius < netRight;
        const inNetY = b.y + b.radius > netTop && b.y - b.radius < this.groundY;

        // Trúng lưới mà chưa qua → mất mạng
        if (inNetX && inNetY) {
            this.handleNetFault(b);
            return true;
        }

        // Vừa vượt qua mặt phẳng lưới sang sân đối phương
        const justCrossed = b.x - b.radius > netRight && prevX - b.radius <= netRight;
        if (justCrossed) {
            if (b.y + b.radius <= netTop + 40) {
                this.scoreBall(b);
            }
            b.isActive = false;
            return true;
        }

        return false;
    }

    update(dt) {
        if (this.isGameOver) return;
        this.gameTime += dt;

        // Player Controls (A / D / Left / Right / W / Space / J)
        const inMgr = window.inputManager;
        this.player.isMoving = false;

        if ((inMgr.isLeft() || inMgr.isKeyPressed('KeyA')) && this.player.x > 30) {
            this.player.x -= this.player.speed * dt;
            this.player.isMoving = true;
        }

        if ((inMgr.isRight() || inMgr.isKeyPressed('KeyD')) && this.player.x + this.player.w < this.net.x - 30) {
            this.player.x += this.player.speed * dt;
            this.player.isMoving = true;
        }

        if (inMgr.isUp() || inMgr.isKeyPressed('KeyW')) {
            this.player.jump();
        }

        if (inMgr.isAction() || inMgr.isKeyPressed('Space') || inMgr.isKeyPressed('KeyJ')) {
            this.player.swing();
        }

        this.player.update(dt);

        // Machine firing interval
        this.machine.shootTimer += dt;
        if (this.machine.shootTimer >= this.machine.shootInterval) {
            this.machine.shoot();
            this.machine.shootTimer = 0;
        }

        // Balls Physics & Collisions
        for (let i = this.balls.length - 1; i >= 0; i--) {
            let b = this.balls[i];
            if (!b.isActive) continue;

            b.vy += b.gravity * dt;
            const prevX = b.x;
            b.x += b.vx * dt;
            b.y += b.vy * dt;

            // Bóng do người chơi đánh: chỉ cộng điểm khi qua lưới, trúng lưới thì mất mạng
            if (b.isHitByPlayer && !b.hasScored) {
                if (this.processPlayerBallNet(b, prevX)) {
                    continue;
                }
            }

            // Lưới chỉ nảy bóng từ máy bắn (bóng chưa bị đánh)
            if (!b.isHitByPlayer) {
                if (b.x + b.radius > this.net.x && b.x - b.radius < this.net.x + this.net.w) {
                    if (b.y + b.radius > this.net.y) {
                        b.vx *= -0.7;
                        if (window.audioManager) window.audioManager.playSound('hit');
                    }
                }
            }

            // Bóng đã đánh nhưng rơi sân mình / bay lệch — không cộng điểm, không trừ mạng
            if (b.isHitByPlayer && !b.hasScored) {
                if (b.y + b.radius >= this.groundY || b.x >= this.width - 40 || b.x + b.radius < 0) {
                    b.isActive = false;
                    continue;
                }
            }

            // Ground Bounce & Miss penalty
            if (b.y + b.radius >= this.groundY) {
                b.y = this.groundY - b.radius;
                b.isActive = false;
                if (b.x < this.net.x && !b.isHitByPlayer) {
                    this.loseLife();
                }
            }

            // Off screen left penalty
            if (b.x + b.radius < 0) {
                b.isActive = false;
                this.loseLife();
            }
        }

        // Clean up inactive balls
        this.balls = this.balls.filter(b => b.isActive);

        // Sync Engine HUD
        this.engine.updateHUD({
            score: this.score,
            time: Math.floor(this.gameTime),
            health: (this.lives / this.maxLives) * 100
        });
    }

    loseLife() {
        if (this.isGameOver) return;
        this.lives--;
        this.syncLivesDisplay();
        if (window.audioManager) window.audioManager.playSound('explosion');

        if (this.lives <= 0) {
            this.lives = 0;
            this.isGameOver = true;
            const isNewHigh = this.score > this.engine.previousHighScore && this.score > 0;
            this.engine.gameOver(this.score);
            
            const gameoverTitle = document.querySelector('#gameover-overlay .overlay-title');
            if (gameoverTitle && isNewHigh) {
                gameoverTitle.innerHTML = '🏆 TẠO KỶ LỤC MỚI! 🎉';
                gameoverTitle.style.color = '#FACC15';
            }

            if (window.pickoPlatform) window.pickoPlatform.syncGameScore(this.score);

            const sideHigh = document.getElementById('side-user-highscore');
            if (sideHigh) sideHigh.innerText = `${this.engine.highScore} PTS`;
        }
    }

    render(ctx) {
        // Deep Court Background
        let bgGrad = ctx.createLinearGradient(0, 0, 0, this.groundY);
        bgGrad.addColorStop(0, "#111827");
        bgGrad.addColorStop(1, "#1F2937");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, this.width, this.groundY);

        // Court Floor Surface
        let courtGrad = ctx.createLinearGradient(0, this.groundY, 0, this.height);
        courtGrad.addColorStop(0, "#27AE60");
        courtGrad.addColorStop(1, "#145A32");
        ctx.fillStyle = courtGrad;
        ctx.fillRect(0, this.groundY, this.width, this.height - this.groundY);

        // White Court Boundary Lines
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.fillRect(0, this.groundY + 12, this.width, 4);
        ctx.fillRect(0, this.groundY + 45, this.width, 6);

        // Net Mesh & Posts (TryVibe net styling)
        const nX = this.net.x, nY = this.net.y, nW = this.net.w, nH = this.net.h;
        let poleGrad = ctx.createLinearGradient(nX, nY, nX + nW, nY);
        poleGrad.addColorStop(0, "#BDC3C7");
        poleGrad.addColorStop(1, "#7F8C8D");
        ctx.fillStyle = poleGrad;
        ctx.fillRect(nX + 2, nY, nW - 4, nH);

        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 15; i < nH; i += 12) {
            ctx.moveTo(nX - 4, nY + i); ctx.lineTo(nX + nW + 4, nY + i);
        }
        for (let i = 2; i < nW; i += 6) {
            ctx.moveTo(nX + i, nY); ctx.lineTo(nX + i, nY + nH);
        }
        ctx.stroke();

        ctx.fillStyle = "#ECF0F1";
        ctx.fillRect(nX - 4, nY, nW + 8, 14);

        // Draw Firing Machine & Player
        this.machine.draw(ctx);
        this.player.draw(ctx);

        // Draw Flying Balls & Ground Shadows
        for (let i = 0; i < this.balls.length; i++) {
            let b = this.balls[i];
            if (b.isActive && b.y < this.groundY) {
                // Ball Shadow on Court
                ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
                ctx.beginPath();
                let shadowWidth = Math.max(6, b.radius + (this.groundY - b.y) * 0.04);
                ctx.ellipse(b.x, this.groundY, shadowWidth, shadowWidth / 3, 0, 0, Math.PI * 2);
                ctx.fill();

                // Ball Entity with glow
                ctx.fillStyle = b.color;
                ctx.shadowColor = b.color;
                ctx.shadowBlur = 10;
                ctx.beginPath(); ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;

                // Perforated Holes
                ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
                ctx.beginPath(); ctx.arc(b.x - 5, b.y - 5, 3, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(b.x + 6, b.y - 2, 3, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(b.x - 2, b.y + 6, 3, 0, Math.PI * 2); ctx.fill();
            }
        }

        // Draw Particles
        if (window.particleSystem) window.particleSystem.render(ctx);

        // Top HUD Try Lives Counter (Try: ✔️ ✔️ / ❌ ❌)
        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.font = 'bold 18px Orbitron, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText("TRY: ", 30, 45);

        for (let l = 0; l < this.maxLives; l++) {
            const hasLife = (this.maxLives - l) <= this.lives;
            ctx.font = '24px sans-serif';
            ctx.fillText(hasLife ? "✔️" : "❌", 95 + (l * 38), 47);
        }

        ctx.fillStyle = "#D4E157";
        ctx.font = 'bold 20px Orbitron, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`ĐIỂM: ${this.score}`, this.width - 30, 45);
        ctx.restore();
    }
}

window.PickleballTraining = PickleballTraining;
