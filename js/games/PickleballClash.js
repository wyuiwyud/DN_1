/**
 * PickleballClash.js - "Pickleball Clash 1v1 🏓⚡"
 * 2D Side-view 1v1 Pickleball Arcade match game based on try1.html prototype.
 * Player vs AI opponent with jumping, paddle swinging, net bounce & point scoring mechanics.
 */
class PickleballClash extends BaseGame {
    constructor(canvas, engine) {
        super(canvas, engine);
        this.name = "Pickleball Clash 1v1 🏓⚡";
        this.description = "Đấu Pickleball 1v1 với AI! Di chuyển ⬅️➡️, Nhảy ⬆️, Vung vợt [SPACE] để ghi điểm qua lưới!";
    }

    init() {
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Ground & Net dimensions
        this.groundY = this.height - 50;
        this.net = { x: this.width / 2 - 5, y: this.height - 180, w: 10, h: 130, color: "#95A5A6" };

        // Match Scores
        this.scorePlayer = 0;
        this.scoreAI = 0;
        this.targetScore = 7; // First to 7 points wins match
        this.isMatchOver = false;
        this.matchWinner = null;
        this.gameTime = 0;

        // Ball Entity
        this.ball = {
            x: 200, y: 150, radius: 12,
            vx: 0, vy: 0, gravity: 0.45, bounce: 0.65,
            color: "#D4E157",
            reset: (turnLeft) => {
                this.ball.x = turnLeft ? 200 : this.width - 200;
                this.ball.y = 120;
                this.ball.vx = turnLeft ? 3 : -3;
                this.ball.vy = -4;
            }
        };

        // Player & AI Characters
        this.player = new ClashCharacter(120, this.groundY, "#3498DB", false, this.width, this.height, this.net);
        this.ai = new ClashCharacter(this.width - 160, this.groundY, "#FF69B4", true, this.width, this.height, this.net);

        // Reset ball to player turn
        this.ball.reset(true);

        if (window.app && window.app.logSystem) {
            window.app.logSystem("Pickleball Clash 1v1 đã sẵn sàng! Chơi 1v1 đối đầu AI.", "success");
        }
    }

    update(dt) {
        if (this.isMatchOver) return;

        this.gameTime += dt;

        // 1. Read Inputs (Keyboard & Virtual D-Pad)
        const inMgr = window.inputManager;
        
        // Horizontal Movement (Left / Right / A / D / Touch)
        if (inMgr.isLeft()) {
            this.player.moveLeft();
        }
        if (inMgr.isRight()) {
            this.player.moveRight();
        }

        // Jump (Up / W / ArrowUp)
        if (inMgr.isUp() || inMgr.isKeyPressed('KeyW')) {
            this.player.jump();
        }

        // Paddle Swing (Space / Action Key)
        if (inMgr.isAction() || inMgr.isKeyPressed('Space') || inMgr.isKeyPressed('KeyJ')) {
            this.player.trySwing(this.ball);
        }

        // 2. Update Characters & AI Logic
        this.player.update(dt, this.ball);
        this.ai.update(dt, this.ball);

        // 3. Ball Physics & Collisions
        this.ball.vy += this.ball.gravity;
        this.ball.x += this.ball.vx;
        this.ball.y += this.ball.vy;

        // Ball Collision with Net
        if (this.ball.x + this.ball.radius > this.net.x && this.ball.x - this.ball.radius < this.net.x + this.net.w) {
            if (this.ball.y + this.ball.radius > this.net.y) {
                this.ball.vx *= -0.8;
                window.audioManager.playSound('hit');
            }
        }

        // Ball Collision with Left/Right Walls
        if (this.ball.x - this.ball.radius <= 0) {
            this.ball.x = this.ball.radius;
            this.ball.vx *= -0.8;
        } else if (this.ball.x + this.ball.radius >= this.width) {
            this.ball.x = this.width - this.ball.radius;
            this.ball.vx *= -0.8;
        }

        // Ball Lands on Ground (Scoring Event!)
        if (this.ball.y + this.ball.radius >= this.groundY) {
            this.ball.y = this.groundY - this.ball.radius;
            this.ball.vx = 0;

            if (this.ball.x > this.net.x) {
                // Ball landed on AI side -> Player scores!
                this.scorePlayer++;
                window.particleSystem.createExplosion(this.ball.x, this.ball.y, '#3498DB', 25, 6);
                window.audioManager.playSound('coin');

                if (this.scorePlayer >= this.targetScore) {
                    this.isMatchOver = true;
                    this.matchWinner = 'PLAYER';
                    this.engine.gameOver(this.scorePlayer * 100);
                    if (window.pickoPlatform) window.pickoPlatform.syncGameScore(this.scorePlayer * 100);
                } else {
                    setTimeout(() => this.ball.reset(false), 900); // AI serves
                }
            } else {
                // Ball landed on Player side -> AI scores!
                this.scoreAI++;
                window.particleSystem.createExplosion(this.ball.x, this.ball.y, '#FF69B4', 25, 6);
                window.audioManager.playSound('jump');

                if (this.scoreAI >= this.targetScore) {
                    this.isMatchOver = true;
                    this.matchWinner = 'AI';
                    this.engine.gameOver(this.scorePlayer * 100);
                    if (window.pickoPlatform) window.pickoPlatform.syncGameScore(this.scorePlayer * 100);
                } else {
                    setTimeout(() => this.ball.reset(true), 900); // Player serves
                }
            }

            // Move ball temporarily out of bounds during scoring reset pause
            this.ball.y = 2000;
        }

        // Sync Score & Stats to HUD
        this.engine.updateHUD({
            score: this.scorePlayer * 100,
            time: Math.floor(this.gameTime),
            level: 1,
            combo: 1,
            health: Math.max(0, 100 - (this.scoreAI * 14)),
            maxHealth: 100
        });

        if (window.pickoPlatform) window.pickoPlatform.updateLiveScore(this.scorePlayer * 100);
    }

    render(ctx) {
        // Dark Sports Court Background
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, this.width, this.height);

        // Court Floor Surface
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(0, this.groundY, this.width, this.height - this.groundY);

        // Court White Floor Lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, this.groundY); ctx.lineTo(this.width, this.groundY);
        ctx.stroke();

        // Kitchen / Non-Volley Zone Markings
        ctx.strokeStyle = 'rgba(212, 225, 87, 0.3)';
        ctx.strokeRect(this.net.x - 120, this.groundY - 5, 240, 5);

        // Pickleball Net
        ctx.fillStyle = this.net.color;
        ctx.fillRect(this.net.x, this.net.y, this.net.w, this.net.h);
        
        // White Net Top Tape
        ctx.fillStyle = '#ECF0F1';
        ctx.fillRect(this.net.x - 2, this.net.y, this.net.w + 4, 10);

        // Net Mesh Pattern Lines
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        for (let y = this.net.y + 12; y < this.groundY; y += 12) {
            ctx.beginPath();
            ctx.moveTo(this.net.x, y); ctx.lineTo(this.net.x + this.net.w, y);
            ctx.stroke();
        }

        // Render Characters (Player & AI)
        this.player.draw(ctx);
        this.ai.draw(ctx);

        // Render Flying Pickleball (Yellow plastic ball with holes)
        if (this.ball.y < 1000) {
            ctx.save();
            ctx.fillStyle = this.ball.color;
            ctx.shadowColor = this.ball.color;
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
            ctx.fill();

            // Ball perforated holes
            ctx.fillStyle = 'rgba(17, 24, 39, 0.7)';
            ctx.beginPath();
            ctx.arc(this.ball.x - 3, this.ball.y - 3, 2.5, 0, Math.PI * 2);
            ctx.arc(this.ball.x + 3, this.ball.y + 3, 2.5, 0, Math.PI * 2);
            ctx.arc(this.ball.x, this.ball.y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Render Particle System
        window.particleSystem.render(ctx);

        // Top Scoreboard Banner (PLAYER X - Y AI)
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(this.width / 2 - 140, 15, 280, 45);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.strokeRect(this.width / 2 - 140, 15, 280, 45);

        ctx.font = 'bold 20px Orbitron, sans-serif';
        ctx.textAlign = 'center';

        // Player Score (Blue)
        ctx.fillStyle = '#3498DB';
        ctx.fillText(`BẠN: ${this.scorePlayer}`, this.width / 2 - 60, 44);

        // Separator
        ctx.fillStyle = '#fff';
        ctx.fillText('|', this.width / 2, 44);

        // AI Score (Pink)
        ctx.fillStyle = '#FF69B4';
        ctx.fillText(`MÁY: ${this.scoreAI}`, this.width / 2 + 60, 44);
        ctx.restore();
    }
}

/**
 * Character Class for Player and AI
 */
class ClashCharacter {
    constructor(x, groundY, color, isAI, canvasWidth, canvasHeight, net) {
        this.x = x;
        this.groundY = groundY;
        this.w = 40;
        this.h = 80;
        this.color = color;
        this.speed = 6;
        this.vy = 0;
        this.gravity = 0.75;
        this.y = groundY - this.h;
        this.isGrounded = true;
        this.isAI = isAI;
        this.canvasWidth = canvasWidth;
        this.net = net;
        this.swingTimer = 0;
    }

    moveLeft() {
        this.x = Math.max(0, this.x - this.speed);
    }

    moveRight() {
        const maxX = this.isAI ? this.canvasWidth - this.w : this.net.x - this.w - 10;
        this.x = Math.min(maxX, this.x + this.speed);
    }

    jump() {
        if (this.isGrounded) {
            this.vy = -13;
            this.isGrounded = false;
        }
    }

    trySwing(ball) {
        const dist = Math.hypot(ball.x - (this.x + this.w / 2), ball.y - (this.y + this.h / 2));
        if (dist < 95) {
            this.hitBall(ball, this.isAI ? -1 : 1);
        } else {
            this.swingTimer = 15;
        }
    }

    hitBall(ball, direction) {
        this.swingTimer = 15;
        ball.vx = direction * (7.5 + Math.random() * 3.5);
        ball.vy = -8.5 - Math.random() * 3.5;
        window.audioManager.playSound('hit');
        window.particleSystem.createExplosion(ball.x, ball.y, this.color, 12, 3);
    }

    update(dt, ball) {
        // Gravity & Vertical Position
        this.vy += this.gravity;
        this.y += this.vy;

        if (this.y + this.h >= this.groundY) {
            this.y = this.groundY - this.h;
            this.vy = 0;
            this.isGrounded = true;
        }

        // AI Autonomous Logic
        if (this.isAI) {
            if (ball.x > this.net.x + 20) {
                // Move towards ball
                const targetX = ball.x - this.w / 2;
                if (this.x < targetX - 10 && this.x + this.w < this.canvasWidth - 10) {
                    this.x += this.speed - 1.5;
                } else if (this.x > targetX + 10 && this.x > this.net.x + 20) {
                    this.x -= this.speed - 1.5;
                }

                // AI Jump & Swing
                const dist = Math.hypot(ball.x - (this.x + this.w / 2), ball.y - (this.y + this.h / 2));
                if (dist < 85 && ball.x > this.x - 20) {
                    if (Math.random() < 0.3) this.jump();
                    this.hitBall(ball, -1);
                }
            } else {
                // Return to default defensive position
                const homeX = this.canvasWidth - 160;
                if (this.x < homeX - 5) this.x += this.speed - 2;
                if (this.x > homeX + 5) this.x -= this.speed - 2;
            }
        }
    }

    draw(ctx) {
        // Body
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);

        // Head
        ctx.beginPath();
        ctx.arc(this.x + this.w / 2, this.y - 15, 20, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#fff';
        const eyeX = this.isAI ? this.x + 8 : this.x + 24;
        ctx.beginPath();
        ctx.arc(eyeX, this.y - 18, 5, 0, Math.PI * 2);
        ctx.fill();

        // Paddle
        ctx.fillStyle = "#E74C3C";
        if (this.swingTimer > 0) {
            const reachX = this.isAI ? this.x - 28 : this.x + this.w + 8;
            ctx.fillRect(reachX, this.y + 10, 20, 42);
            this.swingTimer--;
        } else {
            const restX = this.isAI ? this.x - 10 : this.x + this.w - 10;
            ctx.fillRect(restX, this.y + 30, 20, 42);
        }
    }
}

window.PickleballClash = PickleballClash;
