/**
 * BaseGame.js
 * Abstract class / Base Contract for any Mini-Game injected into #game-container
 */
class BaseGame {
    constructor(canvas, engine) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.engine = engine;
        this.name = "Base Mini-Game";
        this.description = "Default Game Interface";
    }

    /**
     * Called when game starts or restarts
     */
    init() {
        // Reset local game states, entities, score here
    }

    /**
     * Main update loop (dt in seconds)
     */
    update(dt) {
        // Handle input, movement, collisions, physics
    }

    /**
     * Render game graphics onto Canvas context
     */
    render(ctx) {
        // Draw entities, background, effects
    }

    /**
     * Clean up listeners or timers if needed
     */
    destroy() {
        // Cleanup resources
    }
}

window.BaseGame = BaseGame;
