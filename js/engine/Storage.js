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

    getHighScore(gameId = 'global') {
        const legacyHigh = parseInt(localStorage.getItem('picko247_highscore')) || 0;
        const stored = this.get('highscore_' + gameId, this.get('highscore', 0));
        return Math.max(stored, legacyHigh);
    }

    saveHighScore(score, gameId = 'global') {
        const current = this.getHighScore(gameId);
        if (score > current) {
            this.set('highscore_' + gameId, score);
            const globalHigh = Math.max(this.get('highscore', 0), score);
            this.set('highscore', globalHigh);
            try {
                localStorage.setItem('picko247_highscore', globalHigh);
            } catch (e) {}

            this.addRecordHistory({
                score: score,
                previousScore: current,
                gameId: gameId,
                date: new Date().toLocaleString('vi-VN')
            });

            return { isNewHigh: true, previousHigh: current, newHigh: score };
        }
        return { isNewHigh: false, previousHigh: current, newHigh: current };
    }

    getRecordHistory() {
        return this.get('records_history', []);
    }

    addRecordHistory(record) {
        const history = this.getRecordHistory();
        history.unshift(record);
        if (history.length > 30) history.pop();
        this.set('records_history', history);
    }
}

window.storageManager = new StorageManager();
