/**
 * SampleGame.js - "CYBER CORE: NEON REACTION"
 * Full working arcade mini-game demonstrating pure JS + HTML5 Canvas mechanics,
 * collisions, particle FX, procedural audio, and HUD score integration.
 */
class SampleGame extends BaseGame {
    constructor(canvas, engine) {
        super(canvas, engine);
        this.name = "Cyber Core: Neon Reaction";
        this.description = "Dodge red hazards, shoot pulses [SPACE], collect cyan energy cores!";
    }

    init() {
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Player properties
        this.player = {
            x: this.width / 2,
            y: this.height / 2,
            radius: 18,
            speed: 350,
            health: 100,
            maxHealth: 100,
            angle: 0
        };

        // Entities
        this.bullets = [];
        this.cores = [];
        this.hazards = [];

        // Game stats
        this.score = 0;
        this.combo = 1;
        this.level = 1;
        this.shootTimer = 0;

        // Timers
        this.coreSpawnTimer = 0;
        this.hazardSpawnTimer = 0;
        this.gameTime = 0;

        // Initial Spawns
        for (let i = 0; i < 5; i++) {
            this.spawnCore();
        }
    }

    spawnCore() {
        this.cores.push({
            x: Math.random() * (this.width - 60) + 30,
            y: Math.random() * (this.height - 60) + 30,
            radius: 10,
            pulse: 0,
            value: 10
        });
    }

    spawnHazard() {
        const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
        let x, y, vx, vy;
        const speed = 120 + Math.random() * 80 + (this.level * 15);

        if (side === 0) {
            x = Math.random() * this.width;
            y = -20;
            vx = (Math.random() - 0.5) * 100;
            vy = speed;
        } else if (side === 1) {
            x = this.width + 20;
            y = Math.random() * this.height;
            vx = -speed;
            vy = (Math.random() - 0.5) * 100;
        } else if (side === 2) {
            x = Math.random() * this.width;
            y = this.height + 20;
            vx = (Math.random() - 0.5) * 100;
            vy = -speed;
        } else {
            x = -20;
            y = Math.random() * this.height;
            vx = speed;
            vy = (Math.random() - 0.5) * 100;
        }

        this.hazards.push({
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            radius: 14 + Math.random() * 8,
            rotation: 0,
            rotSpeed: (Math.random() - 0.5) * 4
        });
    }

    shoot() {
        if (this.shootTimer > 0) return;
        this.shootTimer = 0.18; // Cooldown

        const dx = window.inputManager.mouse.x - this.player.x;
        const dy = window.inputManager.mouse.y - this.player.y;
        let angle = Math.atan2(dy, dx);

        // Default shoot in facing direction if mouse stationary
        if (Math.hypot(dx, dy) < 10) {
            angle = this.player.angle;
        }

        const speed = 650;
        this.bullets.push({
            x: this.player.x,
            y: this.player.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: 4,
            life: 1.2
        });

        window.audioManager.playSound('laser');
    }

    update(dt) {
        this.gameTime += dt;
        if (this.shootTimer > 0) this.shootTimer -= dt;

        // Level scaling
        this.level = 1 + Math.floor(this.score / 150);

        // Player Movement
        let moveX = 0;
        let moveY = 0;

        if (window.inputManager.isLeft()) moveX -= 1;
        if (window.inputManager.isRight()) moveX += 1;
        if (window.inputManager.isUp()) moveY -= 1;
        if (window.inputManager.isDown()) moveY += 1;

        if (moveX !== 0 && moveY !== 0) {
            moveX *= 0.7071;
            moveY *= 0.7071;
        }

        this.player.x += moveX * this.player.speed * dt;
        this.player.y += moveY * this.player.speed * dt;

        // Clamp inside bounds
        this.player.x = Math.max(this.player.radius, Math.min(this.width - this.player.radius, this.player.x));
        this.player.y = Math.max(this.player.radius, Math.min(this.height - this.player.radius, this.player.y));

        // Aim angle towards mouse
        const mdx = window.inputManager.mouse.x - this.player.x;
        const mdy = window.inputManager.mouse.y - this.player.y;
        if (Math.hypot(mdx, mdy) > 10) {
            this.player.angle = Math.atan2(mdy, mdx);
        }

        // Particle trail
        if (moveX !== 0 || moveY !== 0) {
            window.particleSystem.createSparkTrail(this.player.x, this.player.y, '#00f3ff');
        }

        // Action / Shoot
        if (window.inputManager.isAction() || window.inputManager.mouse.isDown) {
            this.shoot();
        }

        // Spawners
        this.coreSpawnTimer += dt;
        if (this.coreSpawnTimer > 2.5 && this.cores.length < 8) {
            this.spawnCore();
            this.coreSpawnTimer = 0;
        }

        this.hazardSpawnTimer += dt;
        const spawnInterval = Math.max(0.4, 1.8 - (this.level * 0.15));
        if (this.hazardSpawnTimer > spawnInterval) {
            this.spawnHazard();
            this.hazardSpawnTimer = 0;
        }

        // Update Bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const b = this.bullets[i];
            b.x += b.vx * dt;
            b.y += b.vy * dt;
            b.life -= dt;

            // Remove out of bounds or expired
            if (b.life <= 0 || b.x < 0 || b.x > this.width || b.y < 0 || b.y > this.height) {
                this.bullets.splice(i, 1);
            }
        }

        // Update Hazards & Collision with Bullets/Player
        for (let i = this.hazards.length - 1; i >= 0; i--) {
            const h = this.hazards[i];
            h.x += h.vx * dt;
            h.y += h.vy * dt;
            h.rotation += h.rotSpeed * dt;

            // Check collision with bullets
            for (let j = this.bullets.length - 1; j >= 0; j--) {
                const b = this.bullets[j];
                const dist = Math.hypot(h.x - b.x, h.y - b.y);
                if (dist < h.radius + b.radius) {
                    // Destroy hazard!
                    window.particleSystem.createExplosion(h.x, h.y, '#ff007f', 16, 5);
                    window.audioManager.playSound('explosion');
                    
                    this.score += 20 * this.combo;
                    this.combo = Math.min(10, this.combo + 1);

                    this.hazards.splice(i, 1);
                    this.bullets.splice(j, 1);
                    break;
                }
            }

            if (!this.hazards[i]) continue;

            // Check collision with Player
            const pDist = Math.hypot(h.x - this.player.x, h.y - this.player.y);
            if (pDist < h.radius + this.player.radius) {
                // Player hit!
                this.player.health -= 25;
                this.combo = 1;
                window.particleSystem.createExplosion(this.player.x, this.player.y, '#ff3366', 25, 6);
                window.audioManager.playSound('hit');

                this.hazards.splice(i, 1);

                if (this.player.health <= 0) {
                    this.player.health = 0;
                    this.engine.gameOver(this.score);
                }
            } else if (h.x < -50 || h.x > this.width + 50 || h.y < -50 || h.y > this.height + 50) {
                this.hazards.splice(i, 1);
            }
        }

        // Update Cores & Collection
        for (let i = this.cores.length - 1; i >= 0; i--) {
            const c = this.cores[i];
            c.pulse += dt * 4;

            const dist = Math.hypot(c.x - this.player.x, c.y - this.player.y);
            if (dist < c.radius + this.player.radius) {
                // Collect core!
                this.score += c.value * this.combo;
                this.player.health = Math.min(this.player.maxHealth, this.player.health + 5);
                window.particleSystem.createExplosion(c.x, c.y, '#00ff88', 12, 3);
                window.audioManager.playSound('pickup');

                this.cores.splice(i, 1);
            }
        }

        // Sync Engine HUD stats
        this.engine.updateHUD({
            score: this.score,
            level: this.level,
            combo: this.combo,
            health: this.player.health,
            maxHealth: this.player.maxHealth,
            time: Math.floor(this.gameTime)
        });
    }

    render(ctx) {
        // Clear Canvas
        ctx.fillStyle = '#070913';
        ctx.fillRect(0, 0, this.width, this.height);

        // Draw Cyber Grid background
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
        ctx.lineWidth = 1;
        const gridSize = 40;
        for (let x = 0; x < this.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.height);
            ctx.stroke();
        }
        for (let y = 0; y < this.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
            ctx.stroke();
        }

        // Draw Energy Cores (Cyan glowing circles)
        for (const c of this.cores) {
            const r = c.radius + Math.sin(c.pulse) * 2;
            ctx.save();
            ctx.fillStyle = '#00ff88';
            ctx.shadowColor = '#00ff88';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Draw Bullets (Cyan energetic beams)
        for (const b of this.bullets) {
            ctx.save();
            ctx.fillStyle = '#00f3ff';
            ctx.shadowColor = '#00f3ff';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Draw Hazards (Magenta spinning octagons)
        for (const h of this.hazards) {
            ctx.save();
            ctx.translate(h.x, h.y);
            ctx.rotate(h.rotation);
            ctx.strokeStyle = '#ff007f';
            ctx.fillStyle = 'rgba(255, 0, 127, 0.2)';
            ctx.shadowColor = '#ff007f';
            ctx.shadowBlur = 15;
            ctx.lineWidth = 2;

            ctx.beginPath();
            const sides = 6;
            for (let s = 0; s < sides; s++) {
                const a = (s / sides) * Math.PI * 2;
                const px = Math.cos(a) * h.radius;
                const py = Math.sin(a) * h.radius;
                if (s === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }

        // Draw Particles
        window.particleSystem.render(ctx);

        // Draw Player Ship (Glowing triangle facing direction)
        ctx.save();
        ctx.translate(this.player.x, this.player.y);
        ctx.rotate(this.player.angle);

        ctx.strokeStyle = '#00f3ff';
        ctx.fillStyle = 'rgba(0, 243, 255, 0.3)';
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 20;
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(this.player.radius * 1.3, 0);
        ctx.lineTo(-this.player.radius, -this.player.radius * 0.8);
        ctx.lineTo(-this.player.radius * 0.5, 0);
        ctx.lineTo(-this.player.radius, this.player.radius * 0.8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }
}

window.SampleGame = SampleGame;
