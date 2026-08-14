/**
 * BlankTemplate.js - COMPETITION DAY STARTER KIT
 * Use this empty template when BTC announces the official Mini Game Topic!
 * Simply write your custom game logic inside init(), update(), and render().
 */
class BlankTemplate extends BaseGame {
    constructor(canvas, engine) {
        super(canvas, engine);
        this.name = "POLY Game Competition Canvas";
        this.description = "Ready for exam topic integration. Fill logic inside init(), update(), and render().";
    }

    /**
     * Called when game starts or restarts
     */
    init() {
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // 1. Initialize your game variables here (e.g. player, enemies, score)
        this.score = 0;
        this.gameTime = 0;
        this.player = {
            x: this.width / 2,
            y: this.height / 2,
            radius: 20,
            speed: 300
        };

        // Notify system log
        if (window.app) window.app.logSystem("Blank Canvas Template initialized - Ready for coding!", "success");
    }

    /**
     * Main Game Loop - Update positions, collisions, inputs
     * @param {number} dt Delta time in seconds (e.g. 0.016 for 60fps)
     */
    update(dt) {
        this.gameTime += dt;

        // 2. Read User Inputs (Arrow Keys / WASD / Space / Mouse)
        if (window.inputManager.isLeft()) this.player.x -= this.player.speed * dt;
        if (window.inputManager.isRight()) this.player.x += this.player.speed * dt;
        if (window.inputManager.isUp()) this.player.y -= this.player.speed * dt;
        if (window.inputManager.isDown()) this.player.y += this.player.speed * dt;

        // Space action example
        if (window.inputManager.isKeyPressed('Space')) {
            window.audioManager.playSound('jump');
            window.particleSystem.createExplosion(this.player.x, this.player.y, '#ffe600', 10, 3);
            this.score += 10;
        }

        // Clamp inside screen bounds
        this.player.x = Math.max(this.player.radius, Math.min(this.width - this.player.radius, this.player.x));
        this.player.y = Math.max(this.player.radius, Math.min(this.height - this.player.radius, this.player.y));

        // 3. Update HUD stats in layout
        this.engine.updateHUD({
            score: this.score,
            time: Math.floor(this.gameTime),
            level: 1,
            combo: 1,
            health: 100,
            maxHealth: 100
        });
    }

    /**
     * Draw your graphics on HTML5 Canvas context (ctx)
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx) {
        // Clear screen
        ctx.fillStyle = '#0a0d1a';
        ctx.fillRect(0, 0, this.width, this.height);

        // Grid lines helper
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        for (let x = 0; x < this.width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0); ctx.lineTo(x, this.height);
            ctx.stroke();
        }
        for (let y = 0; y < this.height; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y); ctx.lineTo(this.width, y);
            ctx.stroke();
        }

        // Render Particles
        window.particleSystem.render(ctx);

        // Render Player placeholder
        ctx.fillStyle = '#00f3ff';
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(this.player.x, this.player.y, this.player.radius, 0, Math.PI * 2);
        ctx.fill();

        // Topic Instructions Box
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.font = '16px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('POLY GAME 2026 - TOPIC INTEGRATION AREA', this.width / 2, 60);
        
        ctx.font = '14px Rajdhani, sans-serif';
        ctx.fillStyle = '#8a99ad';
        ctx.fillText('Move with Arrow / WASD keys | Press [SPACE] for test sound & particles', this.width / 2, 90);
        ctx.fillText('Write your game logic inside js/games/BlankTemplate.js', this.width / 2, 115);
    }
}

window.BlankTemplate = BlankTemplate;
