import NodeCache from 'node-cache';

class CacheManager {
    constructor() {
        this.cache = new NodeCache({
            stdTTL: 600,
            checkperiod: 120,
            useClones: false
        });
    }

    get(key) {
        const value = this.cache.get(key);
        return value ? JSON.parse(value) : null;
    }

    set(key, value, ttl = 600) {
        const stringValue = JSON.stringify(value);
        this.cache.set(key, stringValue, ttl);
    }

    del(key) {
        this.cache.del(key);
    }

    flush() {
        this.cache.flushAll();
    }

    generateKey(...parts) {
        return parts.join(':');
    }

    getStats() {
        return this.cache.getStats();
    }

    getKeys() {
        return this.cache.keys();
    }
}

export const cacheManager = new CacheManager();
