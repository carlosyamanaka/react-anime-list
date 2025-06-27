import { Router } from 'express';
import { AnimeModel, Anime } from '../models/animeModel';

const router = Router();

router.get('/animes', async (req, res) => {
    try {
        const animes = await AnimeModel.getAll();
        res.json(animes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar animes' });
    }
});

router.post('/animes', async (req, res) => {
    try {
        const data: Anime = req.body;
        const newAnime = await AnimeModel.create(data);
        res.status(201).json(newAnime);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar anime' });
    }
});

export default router;
