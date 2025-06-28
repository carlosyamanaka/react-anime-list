import { Router } from 'express';
import { cacheManager } from '../config/cache.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/cache/clear', authenticateToken, async (req, res) => {
    try {
        cacheManager.flush();
        res.json({ message: 'Cache limpo com sucesso' });
    } catch (error) {
        console.error('Erro ao limpar cache:', error);
        res.status(500).json({ error: 'Erro ao limpar cache' });
    }
});

router.get('/cache/stats', authenticateToken, async (req, res) => {
    try {
        const stats = {
            keys: cacheManager.getKeys().length,
            stats: cacheManager.getStats(),
            allKeys: cacheManager.getKeys()
        };

        res.json(stats);
    } catch (error) {
        console.error('Erro ao obter stats do cache:', error);
        res.status(500).json({ error: 'Erro ao obter estatísticas' });
    }
});

router.delete('/cache/:key', authenticateToken, async (req, res) => {
    try {
        const { key } = req.params;
        cacheManager.del(key);
        res.json({ message: `Cache key '${key}' removida com sucesso` });
    } catch (error) {
        console.error('Erro ao remover cache key:', error);
        res.status(500).json({ error: 'Erro ao remover cache key' });
    }
});

export default router;
