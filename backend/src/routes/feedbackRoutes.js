import { Router } from 'express';
import { FeedbackModel } from '../models/feedbackModel.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateFeedback } from '../middleware/validation.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';
import { SecurityConfig } from '../config/security.js';

const router = Router();

router.get('/animes/:animeId/feedbacks',
    authenticateToken,
    cacheMiddleware(300),
    async (req, res) => {
        try {
            const { animeId } = req.params;

            const validatedAnimeId = SecurityConfig.validateNumericId(animeId, 'ID do anime');

            const feedbacks = await FeedbackModel.findManyByUserAnime(validatedAnimeId);

            res.json({
                feedbacks,
                animeId: validatedAnimeId,
                total: feedbacks.length
            });
        } catch (error) {
            console.error('Erro ao buscar feedbacks:', error);
            if (error.message.includes('ID do anime')) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
);

router.post('/animes/:animeId/feedbacks',
    authenticateToken,
    validateFeedback,
    async (req, res) => {
        try {
            const { animeId } = req.params;
            const data = req.body;

            const validatedAnimeId = SecurityConfig.validateNumericId(animeId, 'ID do anime');

            const newFeedback = await FeedbackModel.create(data, validatedAnimeId, req.user.id);

            invalidateCache([
                `route:/animes/${validatedAnimeId}/feedbacks:${req.user.id}`,
                `feedbacks:user_anime:${validatedAnimeId}`
            ]);

            res.status(201).json({
                ...newFeedback,
                message: `Feedback adicionado por ${req.user.username}`
            });
        } catch (error) {
            console.error('Erro ao criar feedback:', error);

            if (error.message === 'Anime não encontrado na sua lista') {
                return res.status(404).json({ error: error.message });
            }

            if (error.message.includes('ID do anime')) {
                return res.status(400).json({ error: error.message });
            }

            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
);

router.get('/feedbacks/:id',
    authenticateToken,
    cacheMiddleware(600),
    async (req, res) => {
        try {
            const { id } = req.params;

            const validatedId = SecurityConfig.validateNumericId(id, 'ID');

            const feedback = await FeedbackModel.findById(validatedId, req.user.id);
            if (!feedback) {
                return res.status(404).json({ error: 'Feedback não encontrado' });
            }

            res.json(feedback);
        } catch (error) {
            console.error('Erro ao buscar feedback:', error);
            if (error.message.includes('ID')) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
);

router.put('/feedbacks/:id',
    authenticateToken,
    validateFeedback,
    async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;

            const validatedId = SecurityConfig.validateNumericId(id, 'ID');

            const updatedFeedback = await FeedbackModel.update(validatedId, data, req.user.id);

            if (!updatedFeedback) {
                return res.status(404).json({ error: 'Feedback não encontrado' });
            }

            invalidateCache([
                `route:/animes/${updatedFeedback.user_anime_id}/feedbacks:${req.user.id}`,
                `feedbacks:user_anime:${updatedFeedback.user_anime_id}`,
                `route:/feedbacks/${validatedId}:${req.user.id}`
            ]);

            res.json({
                ...updatedFeedback,
                message: `Feedback atualizado por ${req.user.username}`
            });
        } catch (error) {
            console.error('Erro ao atualizar feedback:', error);
            if (error.message.includes('ID')) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
);

router.delete('/feedbacks/:id',
    authenticateToken,
    async (req, res) => {
        try {
            const { id } = req.params;

            const validatedId = SecurityConfig.validateNumericId(id, 'ID');

            const result = await FeedbackModel.delete(validatedId, req.user.id);

            if (!result) {
                return res.status(404).json({ error: 'Feedback não encontrado' });
            }

            invalidateCache([
                `route:/animes/${result.user_anime_id}/feedbacks:${req.user.id}`,
                `feedbacks:user_anime:${result.user_anime_id}`,
                `route:/feedbacks/${validatedId}:${req.user.id}`
            ]);

            res.json({
                message: `Feedback removido por ${req.user.username}`
            });
        } catch (error) {
            console.error('Erro ao deletar feedback:', error);
            if (error.message.includes('ID')) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
);

export default router;
