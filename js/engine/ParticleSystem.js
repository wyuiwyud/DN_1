/**
 * ParticleSystem.js
 * Lightweight 2D Particle Engine for HTML5 Canvas FX
 */
class Particle {
    constructor(x, y, vx, vy, color, size, life, shape = 'circle') {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.maxLife = life;
        this.life = life;
        this.shape = shape;
        this.alpha = 1;
        this.gravity = 0;
        this.friction = 0.98;
    }

    update(dt) {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity * dt;

        this.x += this.vx * dt * 60;
        this.y += this.vy * dt * 60;

        this.life -= dt;
        this.alpha = Math.max(0, this.life / this.maxLife);
    }

    render(ctx) {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;

        ctx.beginPath();
        if (this.shape === 'square') {
            ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        } else {
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    createExplosion(x, y, color = '#00f3ff', count = 20, speed = 4) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = (Math.random() * 0.8 + 0.2) * speed;
            const vx = Math.cos(angle) * spd;
            const vy = Math.sin(angle) * spd;
            const size = Math.random() * 4 + 2;
            const life = Math.random() * 0.4 + 0.3;
            this.particles.push(new Particle(x, y, vx, vy, color, size, life));
        }
    }

    createSparkTrail(x, y, color = '#ff007f') {
        const vx = (Math.random() - 0.5) * 1.5;
        const vy = Math.random() * 1.5 + 0.5;
        const size = Math.random() * 3 + 1;
        const life = Math.random() * 0.2 + 0.1;
        this.particles.push(new Particle(x, y, vx, vy, color, size, life, 'square'));
    }

    update(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update(dt);
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    render(ctx) {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].render(ctx);
        }
    }

    clear() {
        this.particles = [];
    }
}

window.particleSystem = new ParticleSystem();
