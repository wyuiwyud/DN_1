/**
 * BlankTemplate.js - OFFICIAL COMPETITION STARTER KIT (KHUNG BÀI THI BTC)
 * File chính thức để viết game khi BTC công bố đề bài POLY GAME 2026.
 * Chỉ cần điền logic vào 3 hàm: init(), update(dt), và render(ctx).
 */
class BlankTemplate extends BaseGame {
    constructor(canvas, engine) {
        super(canvas, engine);
        this.name = "POLY Game - Official Exam Canvas";
        this.description = "Khung bài thi rỗng đã sẵn sàng. Điền game logic vào init(), update(), render().";
    }

    /**
     * 1. KHỞI TẠO BẮT ĐẦU (Called on game start or restart)
     */
    init() {
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // --- KHỞI TẠO BIẾN GAME CỦA BẠN TẠI ĐÂY ---
        this.score = 0;
        this.gameTime = 0;
        this.level = 1;
        this.health = 100;

        // Thông báo hệ thống
        if (window.app) {
            window.app.logSystem("Khung bài thi trắng đã sẵn sàng. Hãy code logic vào js/games/BlankTemplate.js!", "success");
        }
    }

    /**
     * 2. CẬP NHẬT LOGIC GAME (Called every frame, dt = delta time in seconds)
     * @param {number} dt 
     */
    update(dt) {
        this.gameTime += dt;

        // --- ĐỌC ĐẦU VÀO PHÍM BẤM & CẬP NHẬT TRẠNG THÁI ---
        // if (window.inputManager.isLeft())  { ... }
        // if (window.inputManager.isRight()) { ... }
        // if (window.inputManager.isUp())    { ... }
        // if (window.inputManager.isDown())  { ... }
        // if (window.inputManager.isAction()) { ... }

        // --- ĐỒNG BỘ THÔNG SỐ LÊN BẢNG THỐNG KÊ GIAO DIỆN WEB ---
        this.engine.updateHUD({
            score: this.score,
            time: Math.floor(this.gameTime),
            level: this.level,
            combo: 1,
            health: this.health,
            maxHealth: 100
        });
    }

    /**
     * 3. VẼ HÌNH ẢNH LÊN CANVAS (Called every frame)
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx) {
        // Clear background
        ctx.fillStyle = '#060814';
        ctx.fillRect(0, 0, this.width, this.height);

        // Cyber Grid Lines Background
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x < this.width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0); ctx.lineTo(x, this.height);
            ctx.stroke();
        }
        for (let y = 0; y < this.height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(0, y); ctx.lineTo(this.width, y);
            ctx.stroke();
        }

        // Render Particle System Effects
        window.particleSystem.render(ctx);

        // --- BANNER PLACEHOLDER CHO NGÀY THI ---
        ctx.save();
        ctx.textAlign = 'center';

        // Glowing Main Title
        ctx.fillStyle = '#00f3ff';
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 15;
        ctx.font = 'bold 26px Orbitron, sans-serif';
        ctx.fillText('POLY GAME 2026 — KHUNG BÀI THI CHÍNH THỨC', this.width / 2, this.height / 2 - 30);

        // Subtitle Status
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffe600';
        ctx.font = '18px Rajdhani, sans-serif';
        ctx.fillText('⚡ ĐÃ SẴN SÀNG NHẬN ĐỀ BTC — CHỜ CÔNG BỐ CHỦ ĐỀ', this.width / 2, this.height / 2 + 10);

        // Instruction Guide
        ctx.fillStyle = '#8a99ad';
        ctx.font = '14px Share Tech Mono, monospace';
        ctx.fillText('Mở file js/games/BlankTemplate.js và viết code logic vào init(), update(), render()', this.width / 2, this.height / 2 + 50);

        ctx.restore();
    }
}

window.BlankTemplate = BlankTemplate;
