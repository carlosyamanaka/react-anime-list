import { cacheManager } from '../config/cache.js';

export const cacheMiddleware = (ttl = 600) => {
    return (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }

        const cacheKey = cacheManager.generateKey(
            'route',
            req.originalUrl,
            req.user?.id || 'anonymous'
        );

        try {
            const cachedData = cacheManager.get(cacheKey);

            if (cachedData) {
                return res.json({
                    ...cachedData,
                    fromCache: true
                });
            }

            const originalJson = res.json;
            res.json = function (data) {
                if (res.statusCode === 200) {
                    cacheManager.set(cacheKey, data, ttl);
                }
                originalJson.call(this, data);
            };

            next();
        } catch (error) {
            console.error('Cache middleware error:', error);
            next();
        }
    };
};

export const invalidateCache = (patterns) => {
    patterns.forEach(pattern => {
        if (typeof pattern === 'string') {
            cacheManager.del(pattern);
        } else if (typeof pattern === 'function') {
            pattern(cacheManager);
        }
    });
};
