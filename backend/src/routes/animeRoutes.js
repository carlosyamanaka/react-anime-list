import { Router } from 'express';
import { AnimeModel } from '../models/animeModel.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateAnime } from '../middleware/validation.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';

const router = Router();

router.get('/animes',
    authenticateToken,
    cacheMiddleware(300),
    async (req, res) => {
        try {
            const animes = await AnimeModel.findMany();
            res.json(animes);
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

            const anime = await AnimeModel.findById(id);
            if (!anime) {
                return res.status(404).json({ error: 'Anime não encontrado' });
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

        const newAnime = await AnimeModel.create(data);

        invalidateCache([
            `route:/animes:${req.user.id}`,
            'animes:all'
        ]);

        res.status(201).json(newAnime);
    } catch (error) {
        console.error('Erro ao criar anime:', error);

        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Anime com este mal_id já existe' });
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

            const updatedAnime = await AnimeModel.update(id, data);

            invalidateCache([
                `route:/animes:${req.user.id}`,
                'animes:all',
                `anime:id:${id}`
            ]);

            res.json(updatedAnime);
        } catch (error) {
            console.error('Erro ao atualizar anime:', error);

            if (error.code === 'P2025') {
                return res.status(404).json({ error: 'Anime não encontrado' });
            }

            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
);

router.delete('/animes/:id',
    authenticateToken,
    async (req, res) => {
        try {
            const { id } = req.params;

            await AnimeModel.delete(id);

            invalidateCache([
                `route:/animes:${req.user.id}`,
                'animes:all',
                `anime:id:${id}`
            ]);

            res.json({ message: 'Anime deletado com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar anime:', error);

            if (error.code === 'P2025') {
                return res.status(404).json({ error: 'Anime não encontrado' });
            }

            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
);

export default router;
