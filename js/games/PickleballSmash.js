/**
 * PickleballSmash.js - "Pickleball Smash 🏓💥"
 * Fruit-Ninja style Pickleball slicing game for Picko 247 Sports & Play Hub.
 * Strictly adheres to 100% BTC Specification & Scoring Rules.
 */
class PickleballSmash extends BaseGame {
    constructor(canvas, engine) {
        super(canvas, engine);
        this.name = "Pickleball Smash 🏓💥";
        this.description = "Vuốt chuột/tay vung vợt chém bóng Pickleball xanh bay theo đường cong! Tránh quả bom!";
    }

    init() {
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Game State
        this.score = 0;
        this.lives = 3;
        this.maxLives = 3;
        this.comboCount = 0;
        this.comboTimer = 0;
        this.gameTime = 0;
        this.level = 1;

        // Entities
        this.balls = [];       // Active flying balls/bombs
        this.halfBalls = [];   // Sliced ball halves falling down
        this.floatingTexts = [];// "+10", "COMBO x3!"
        this.sliceTrail = [];  // Array of {x, y, life} for electric cyan trail

        // Spawner Timers
        this.spawnTimer = 0;
        this.spawnInterval = 1.4;

        // Gravity Acceleration
        this.gravity = 780; // px/s^2

        // Swipe interpolation tracking
        this.prevMouse = { x: 0, y: 0, isDown: false };
        this.sliceVel = 0;

        if (window.app && window.app.logSystem) {
            window.app.logSystem("Pickleball Smash sẵn sàng! Vuốt chuột/tay để vung vợt chém bóng.", "success");
        }
    }

    spawnWave() {
        const count = Math.min(5, Math.floor(Math.random() * 2) + 1 + Math.floor(this.level / 2));
        for (let i = 0; i < count; i++) {
            const isBomb = Math.random() < Math.min(0.35, 0.15 + (this.level * 0.04));
            
            const startX = Math.random() * (this.width - 300) + 150;
            const startY = this.height + 40;

            // Target arc peak
            const targetX = this.width / 2 + (Math.random() - 0.5) * (this.width * 0.5);
            const peakY = Math.random() * 200 + 100;

            // Parabolic flight physics
            const flightTime = Math.sqrt((2 * (startY - peakY)) / this.gravity);
            const vy = -this.gravity * flightTime;
            const vx = (targetX - startX) / flightTime;

            this.balls.push({
                x: startX,
                y: startY,
                vx: vx,
                vy: vy,
                radius: isBomb ? 24 : 30,
                isBomb: isBomb,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 6,
                sliced: false,
                color: isBomb ? '#ff0055' : '#ccff00'
            });
        }
    }

    update(dt) {
        this.gameTime += dt;

        // Level increases every 500 points
        this.level = 1 + Math.floor(this.score / 500);
        this.spawnInterval = Math.max(0.6, 1.5 - (this.level * 0.12));

        // Spawner
        this.spawnTimer += dt;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnWave();
            this.spawnTimer = 0;
        }

        // Touch & Mouse Swipe Interpolation
        const curMouse = window.inputManager.mouse;
        if (curMouse.isDown || window.inputManager.isKeyDown('Space')) {
            const dx = curMouse.x - this.prevMouse.x;
            const dy = curMouse.y - this.prevMouse.y;
            this.sliceVel = Math.hypot(dx, dy);

            if (this.sliceVel > 3 || curMouse.clicked) {
                this.sliceTrail.push({ x: curMouse.x, y: curMouse.y, life: 0.22 });
            }
        }

        // Decay trail
        for (let i = this.sliceTrail.length - 1; i >= 0; i--) {
            this.sliceTrail[i].life -= dt;
            if (this.sliceTrail[i].life <= 0) {
                this.sliceTrail.splice(i, 1);
            }
        }

        // Combo decay within 1 second
        if (this.comboTimer > 0) {
            this.comboTimer -= dt;
            if (this.comboTimer <= 0) {
                this.comboCount = 0;
            }
        }

        // Swipe Line-Circle Collision Detection
        if (this.sliceTrail.length >= 2) {
            const p1 = this.sliceTrail[this.sliceTrail.length - 2];
            const p2 = this.sliceTrail[this.sliceTrail.length - 1];

            for (let i = this.balls.length - 1; i >= 0; i--) {
                const b = this.balls[i];
                if (b.sliced) continue;

                if (this.lineCircleIntersect(p1.x, p1.y, p2.x, p2.y, b.x, b.y, b.radius)) {
                    b.sliced = true;

                    if (b.isBomb) {
                        // CHÉM BOM: Nổ đỏ, mất 1 mạng, tiếng nổ (explosion)
                        window.particleSystem.createExplosion(b.x, b.y, '#ff0055', 30, 8);
                        window.audioManager.playSound('explosion');

                        this.lives--;
                        this.comboCount = 0;
                        this.floatingTexts.push({ x: b.x, y: b.y, text: "BOM! -1 MẠNG", color: "#ff0055", life: 1.0 });

                        this.balls.splice(i, 1);

                        if (this.lives <= 0) {
                            this.lives = 0;
                            this.engine.gameOver(this.score);
                            if (window.pickoPlatform) window.pickoPlatform.syncGameScore(this.score);
                            return;
                        }
                    } else {
                        // CHÉM BÓNG PICKLEBALL: +10 * (1 + combo), tiếng vợt (hit)
                        this.comboCount++;
                        this.comboTimer = 1.0; // 1s window for combo chaining

                        const pts = 10 * Math.max(1, this.comboCount);
                        this.score += pts;

                        window.particleSystem.createExplosion(b.x, b.y, '#ccff00', 20, 5);
                        window.audioManager.playSound('hit');

                        // Split ball into 2 falling halves
                        this.halfBalls.push({
                            x: b.x - 10, y: b.y, vx: b.vx - 130, vy: b.vy - 60,
                            rotation: b.rotation, rotSpeed: -9, life: 1.2, color: b.color
                        });
                        this.halfBalls.push({
                            x: b.x + 10, y: b.y, vx: b.vx + 130, vy: b.vy - 60,
                            rotation: b.rotation, rotSpeed: 9, life: 1.2, color: b.color
                        });

                        // Floating score text
                        const textLabel = this.comboCount >= 2 ? `COMBO x${this.comboCount}! +${pts}` : `+${pts}`;
                        this.floatingTexts.push({
                            x: b.x, y: b.y, text: textLabel,
                            color: this.comboCount >= 2 ? "#ffe600" : "#00f0ff", life: 0.85
                        });

                        this.balls.splice(i, 1);
                    }
                }
            }
        }

        // Update Flying Balls physics
        for (let i = this.balls.length - 1; i >= 0; i--) {
            const b = this.balls[i];
            b.vy += this.gravity * dt;
            b.x += b.vx * dt;
            b.y += b.vy * dt;
            b.rotation += b.rotSpeed * dt;

            // Missed ball falling off screen bottom
            if (b.y > this.height + 60) {
                if (!b.isBomb && !b.sliced) {
                    // Missed ball penalty (-1 Life, sound 'jump')
                    this.lives--;
                    this.comboCount = 0;
                    window.audioManager.playSound('jump');
                    this.floatingTexts.push({ x: b.x, y: this.height - 50, text: "LỌT BÓNG! -1 MẠNG", color: "#ff3366", life: 1.0 });

                    if (this.lives <= 0) {
                        this.lives = 0;
                        this.engine.gameOver(this.score);
                        if (window.pickoPlatform) window.pickoPlatform.syncGameScore(this.score);
                        return;
                    }
                }
                this.balls.splice(i, 1);
            }
        }

        // Update Sliced Halves physics
        for (let i = this.halfBalls.length - 1; i >= 0; i--) {
            const h = this.halfBalls[i];
            h.vy += this.gravity * dt;
            h.x += h.vx * dt;
            h.y += h.vy * dt;
            h.rotation += h.rotSpeed * dt;
            h.life -= dt;
            if (h.life <= 0 || h.y > this.height + 100) {
                this.halfBalls.splice(i, 1);
            }
        }

        // Update Floating Text popups
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            ft.y -= 45 * dt;
            ft.life -= dt;
            if (ft.life <= 0) {
                this.floatingTexts.splice(i, 1);
            }
        }

        this.prevMouse = { x: curMouse.x, y: curMouse.y, isDown: curMouse.isDown };

        // Sync Stats to HUD
        this.engine.updateHUD({
            score: this.score,
            time: Math.floor(this.gameTime),
            level: this.level,
            combo: Math.max(1, this.comboCount),
            health: (this.lives / this.maxLives) * 100,
            maxHealth: 100
        });

        if (window.pickoPlatform) window.pickoPlatform.updateLiveScore(this.score);
    }

    lineCircleIntersect(x1, y1, x2, y2, cx, cy, r) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.hypot(dx, dy);
        if (len === 0) return Math.hypot(cx - x1, cy - y1) <= r;

        const u = Math.max(0, Math.min(1, ((cx - x1) * dx + (cy - y1) * dy) / (len * len)));
        const px = x1 + u * dx;
        const py = y1 + u * dy;
        return Math.hypot(cx - px, cy - py) <= r;
    }

    render(ctx) {
        // Deep Court Background
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, this.width, this.height);

        // Pickleball Court Lines (Vertical mobile layout emphasis)
        ctx.strokeStyle = 'rgba(204, 255, 0, 0.08)';
        ctx.lineWidth = 2;
        ctx.strokeRect(80, 30, this.width - 160, this.height - 60);

        ctx.beginPath();
        ctx.moveTo(this.width / 2, 30); ctx.lineTo(this.width / 2, this.height - 30); // Net line
        ctx.stroke();

        // Render Sliced Halves
        for (const h of this.halfBalls) {
            ctx.save();
            ctx.translate(h.x, h.y);
            ctx.rotate(h.rotation);
            ctx.fillStyle = h.color;

            ctx.beginPath();
            ctx.arc(0, 0, 26, 0, Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        // Render Flying Balls & Bombs
        for (const b of this.balls) {
            ctx.save();
            ctx.translate(b.x, b.y);
            ctx.rotate(b.rotation);

            if (b.isBomb) {
                // Bomb Hazard with "BOMB" text
                ctx.fillStyle = '#180810';
                ctx.strokeStyle = '#ff0055';
                ctx.lineWidth = 3;
                ctx.shadowColor = '#ff0055';
                ctx.shadowBlur = 15;

                ctx.beginPath();
                ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // Bomb fuse spark
                ctx.strokeStyle = '#ffcc00';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(0, -b.radius);
                ctx.quadraticCurveTo(10, -b.radius - 15, 5, -b.radius - 22);
                ctx.stroke();

                // Spark particle
                ctx.fillStyle = '#ff0055';
                ctx.beginPath();
                ctx.arc(5 + (Math.random() - 0.5) * 4, -b.radius - 22 + (Math.random() - 0.5) * 4, 4, 0, Math.PI * 2);
                ctx.fill();

                // BOMB label text
                ctx.fillStyle = '#ff0055';
                ctx.font = 'bold 12px Orbitron, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('BOMB', 0, 0);
            } else {
                // Yellow/Green Perforated Pickleball
                ctx.fillStyle = '#ccff00';
                ctx.shadowColor = '#ccff00';
                ctx.shadowBlur = 14;
                ctx.beginPath();
                ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
                ctx.fill();

                // Perforated Holes (Black dots)
                ctx.fillStyle = 'rgba(10, 15, 25, 0.75)';
                const holePositions = [
                    { x: 0, y: 0 }, { x: -14, y: -10 }, { x: 14, y: -10 },
                    { x: -12, y: 12 }, { x: 12, y: 12 }, { x: 0, y: -18 }, { x: 0, y: 18 }
                ];
                for (const hole of holePositions) {
                    ctx.beginPath();
                    ctx.arc(hole.x, hole.y, 3.8, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            ctx.restore();
        }

        // Render Particle System
        window.particleSystem.render(ctx);

        // Render Electric Cyan Blade Trail
        if (this.sliceTrail.length >= 2) {
            ctx.save();
            ctx.strokeStyle = '#00f0ff';
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 22;

            for (let i = 0; i < this.sliceTrail.length - 1; i++) {
                const p1 = this.sliceTrail[i];
                const p2 = this.sliceTrail[i + 1];
                const width = (p1.life / 0.22) * 14;

                ctx.lineWidth = width;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
            ctx.restore();
        }

        // Render Floating Score Text Popups
        for (const ft of this.floatingTexts) {
            ctx.save();
            ctx.font = 'bold 22px Rajdhani, sans-serif';
            ctx.fillStyle = ft.color;
            ctx.shadowColor = ft.color;
            ctx.shadowBlur = 12;
            ctx.textAlign = 'center';
            ctx.fillText(ft.text, ft.x, ft.y);
            ctx.restore();
        }

        // Render In-Game Top HUD (Hearts Red ❤❤❤ & Level)
        ctx.save();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Orbitron, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`MẠNG: `, 30, 40);

        for (let l = 0; l < this.maxLives; l++) {
            ctx.fillStyle = l < this.lives ? '#ff0055' : 'rgba(255,255,255,0.2)';
            ctx.font = '22px sans-serif';
            ctx.fillText('❤', 105 + (l * 28), 42);
        }

        ctx.fillStyle = '#ccff00';
        ctx.font = 'bold 16px Orbitron, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`LEVEL ${this.level}`, this.width - 30, 40);

        if (this.comboCount >= 2) {
            ctx.fillStyle = '#ffe600';
            ctx.font = 'bold 20px Orbitron, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`COMBO x${this.comboCount}!`, this.width / 2, 40);
        }
        ctx.restore();
    }
}

window.PickleballSmash = PickleballSmash;
