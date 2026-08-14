/**
 * Storage.js
 * LocalStorage wrapper with safe fallbacks
 */
class StorageManager {
    constructor(prefix = 'POLY_GAME_') {
        this.prefix = prefix;
    }

    get(key, defaultValue = null) {
        try {
            const val = localStorage.getItem(this.prefix + key);
            return val !== null ? JSON.parse(val) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    }

    set(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
        } catch (e) {
            console.warn('LocalStorage unavailable');
        }
    }

    getHighScore() {
        return this.get('highscore', 0);
    }

    saveHighScore(score) {
        const current = this.getHighScore();
        if (score > current) {
            this.set('highscore', score);
            return true;
        }
        return false;
    }
}

window.storageManager = new StorageManager();
