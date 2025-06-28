import { Router } from 'express';
import { UserAnimeModel } from '../models/userAnimeModel.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateAnime } from '../middleware/validation.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';

const router = Router();

router.get('/animes',
    authenticateToken,
    cacheMiddleware(300),
    async (req, res) => {
        try {
            const animes = await UserAnimeModel.findManyByUser(req.user.id);
            res.json({
                animes,
                user: req.user.username,
                total: animes.length
            });
        } catch (error) {
            console.error('Erro ao buscar animes:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
);

router.get('/animes/:id',
    authenticateToken,
    cacheMiddleware(600),
    async (req, res) => {
        try {
            const { id } = req.params;

            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID deve ser um número' });
            }

            const anime = await UserAnimeModel.findById(id, req.user.id);
            if (!anime) {
                return res.status(404).json({ error: 'Anime não encontrado na sua lista' });
            }

            res.json(anime);
        } catch (error) {
            console.error('Erro ao buscar anime:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
);

router.post('/animes', authenticateToken, validateAnime, async (req, res) => {
    try {
        const data = req.body;

        if (data.id) delete data.id;

        const existing = await UserAnimeModel.findByMalId(data.mal_id, req.user.id);
        if (existing) {
            return res.status(409).json({ error: 'Este anime já está na sua lista' });
        }

        const newAnime = await UserAnimeModel.create(data, req.user.id);

        invalidateCache([
            `route:/animes:${req.user.id}`,
            `user_animes:user:${req.user.id}`
        ]);

        res.status(201).json({
            ...newAnime,
            message: `Anime adicionado à lista de ${req.user.username}`
        });
    } catch (error) {
        console.error('Erro ao criar anime:', error);

        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Este anime já está na sua lista' });
        }

        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.put('/animes/:id',
    authenticateToken,
    validateAnime,
    async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;

            if (data.id) delete data.id;
            if (data.user_id) delete data.user_id;

            const updatedAnime = await UserAnimeModel.update(id, data, req.user.id);

            if (!updatedAnime) {
                return res.status(404).json({ error: 'Anime não encontrado na sua lista' });
            }

            invalidateCache([
                `route:/animes:${req.user.id}`,
                `user_animes:user:${req.user.id}`,
                `user_anime:id:${id}:user:${req.user.id}`
            ]);

            res.json({
                ...updatedAnime,
                message: `Anime atualizado na lista de ${req.user.username}`
            });
        } catch (error) {
            console.error('Erro ao atualizar anime:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
);

router.delete('/animes/:id',
    authenticateToken,
    async (req, res) => {
        try {
            const { id } = req.params;

            const result = await UserAnimeModel.delete(id, req.user.id);

            if (result.count === 0) {
                return res.status(404).json({ error: 'Anime não encontrado na sua lista' });
            }

            invalidateCache([
                `route:/animes:${req.user.id}`,
                `user_animes:user:${req.user.id}`,
                `user_anime:id:${id}:user:${req.user.id}`
            ]);

            res.json({
                message: `Anime removido da lista de ${req.user.username}`
            });
        } catch (error) {
            console.error('Erro ao deletar anime:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
);

router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const animes = await UserAnimeModel.findManyByUser(req.user.id);

        const stats = {
            user: req.user.username,
            totalAnimes: animes.length,
            lastAdded: animes.length > 0 ? animes[0].created_at : null,
            genres: [...new Set(animes.flatMap(anime => anime.genres || []))],
            totalGenres: [...new Set(animes.flatMap(anime => anime.genres || []))].length
        };

        res.json(stats);
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

export default router;
