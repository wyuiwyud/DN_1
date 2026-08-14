/**
 * InputManager.js
 * Tracks Keyboard, Mouse, and Touch inputs cleanly.
 */
class InputManager {
    constructor() {
        this.keys = {};
        this.keysPressedThisFrame = {};
        this.mouse = {
            x: 0,
            y: 0,
            isDown: false,
            clicked: false
        };
        this.canvas = null;

        this.initListeners();
    }

    setCanvas(canvasElement) {
        this.canvas = canvasElement;
    }

    initListeners() {
        window.addEventListener('keydown', (e) => {
            if (!this.keys[e.code]) {
                this.keysPressedThisFrame[e.code] = true;
            }
            this.keys[e.code] = true;

            // Prevent scroll for game keys
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
                if (document.activeElement === document.body || document.activeElement.tagName === 'CANVAS') {
                    e.preventDefault();
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (this.canvas) {
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.canvas.width / rect.width;
                const scaleY = this.canvas.height / rect.height;
                this.mouse.x = (e.clientX - rect.left) * scaleX;
                this.mouse.y = (e.clientY - rect.top) * scaleY;
            }
        });

        window.addEventListener('mousedown', () => {
            this.mouse.isDown = true;
            this.mouse.clicked = true;
        });

        window.addEventListener('mouseup', () => {
            this.mouse.isDown = false;
        });

        // Touch Listeners
        window.addEventListener('touchstart', (e) => {
            if (this.canvas && e.touches.length > 0) {
                const touch = e.touches[0];
                const rect = this.canvas.getBoundingClientRect();
                const scaleX = this.canvas.width / rect.width;
                const scaleY = this.canvas.height / rect.height;
                this.mouse.x = (touch.clientX - rect.left) * scaleX;
                this.mouse.y = (touch.clientY - rect.top) * scaleY;
                this.mouse.isDown = true;
                this.mouse.clicked = true;
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            this.mouse.isDown = false;
        });
    }

    isKeyDown(code) {
        return !!this.keys[code];
    }

    isKeyPressed(code) {
        return !!this.keysPressedThisFrame[code];
    }

    // Helper directional queries (Supports WASD + Arrow Keys + Touch virtual buttons)
    isLeft() {
        return this.isKeyDown('ArrowLeft') || this.isKeyDown('KeyA') || !!this.keys['VirtualLeft'];
    }

    isRight() {
        return this.isKeyDown('ArrowRight') || this.isKeyDown('KeyD') || !!this.keys['VirtualRight'];
    }

    isUp() {
        return this.isKeyDown('ArrowUp') || this.isKeyDown('KeyW') || !!this.keys['VirtualUp'];
    }

    isDown() {
        return this.isKeyDown('ArrowDown') || this.isKeyDown('KeyS') || !!this.keys['VirtualDown'];
    }

    isAction() {
        return this.isKeyDown('Space') || this.isKeyDown('KeyJ') || this.isKeyDown('Enter') || !!this.keys['VirtualAction'];
    }

    setVirtualKey(keyName, isPressed) {
        this.keys[keyName] = isPressed;
    }

    updateFrameEnd() {
        this.keysPressedThisFrame = {};
        this.mouse.clicked = false;
    }
}

window.inputManager = new InputManager();
