import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/search/animes', authenticateToken, async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.length < 2) {
            return res.status(400).json({
                error: 'Query deve ter pelo menos 2 caracteres'
            });
        }

        // Aqui você pode integrar com a API do MyAnimeList ou outra API
        // Por enquanto, retornando exemplo
        const mockResults = [
            {
                mal_id: 1,
                title: "Cowboy Bebop",
                title_japanese: "カウボーイビバップ",
                image_url: "https://cdn.myanimelist.net/images/anime/4/19644.jpg",
                score: 8.75,
                type: "TV",
                episodes: 26,
                year: 1998
            }
        ];

        res.json({
            query: q,
            results: mockResults,
            total: mockResults.length
        });
    } catch (error) {
        console.error('Erro ao buscar animes:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.get('/search/animes/:malId', authenticateToken, async (req, res) => {
    try {
        const { malId } = req.params;

        // Aqui você buscaria os detalhes completos do anime na API externa
        const mockAnime = {
            mal_id: parseInt(malId),
            title: "Cowboy Bebop",
            title_japanese: "カウボーイビバップ",
            image_url: "https://cdn.myanimelist.net/images/anime/4/19644.jpg",
            score: 8.75,
            rank: 29,
            popularity: 42,
            type: "TV",
            episodes: 26,
            year: 1998,
            rating: "R - 17+ (violence & profanity)",
            synopsis: "In the year 2071, humanity has colonized several of the planets...",
            url: "https://myanimelist.net/anime/1/Cowboy_Bebop",
            studios: ["Sunrise"],
            genres: ["Action", "Adventure", "Comedy", "Drama", "Sci-Fi", "Space"]
        };

        res.json(mockAnime);
    } catch (error) {
        console.error('Erro ao buscar detalhes do anime:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

export default router;
