import { Router } from 'express';
import { FeedbackModel } from '../models/feedbackModel.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateFeedback } from '../middleware/validation.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';

const router = Router();

router.get('/animes/:animeId/feedbacks',
    authenticateToken,
    cacheMiddleware(300),
    async (req, res) => {
        try {
            const { animeId } = req.params;

            if (isNaN(animeId)) {
                return res.status(400).json({ error: 'ID do anime deve ser um número' });
            }

            const feedbacks = await FeedbackModel.findManyByUserAnime(animeId);

            res.json({
                feedbacks,
                animeId: parseInt(animeId),
                total: feedbacks.length
            });
        } catch (error) {
            console.error('Erro ao buscar feedbacks:', error);
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

            if (isNaN(animeId)) {
                return res.status(400).json({ error: 'ID do anime deve ser um número' });
            }

            const newFeedback = await FeedbackModel.create(data, animeId, req.user.id);

            invalidateCache([
                `route:/animes/${animeId}/feedbacks:${req.user.id}`,
                `feedbacks:user_anime:${animeId}`
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

            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID deve ser um número' });
            }

            const feedback = await FeedbackModel.findById(id, req.user.id);
            if (!feedback) {
                return res.status(404).json({ error: 'Feedback não encontrado' });
            }

            res.json(feedback);
        } catch (error) {
            console.error('Erro ao buscar feedback:', error);
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

            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID deve ser um número' });
            }

            const updatedFeedback = await FeedbackModel.update(id, data, req.user.id);

            if (!updatedFeedback) {
                return res.status(404).json({ error: 'Feedback não encontrado' });
            }

            invalidateCache([
                `route:/animes/${updatedFeedback.user_anime_id}/feedbacks:${req.user.id}`,
                `feedbacks:user_anime:${updatedFeedback.user_anime_id}`,
                `route:/feedbacks/${id}:${req.user.id}`
            ]);

            res.json({
                ...updatedFeedback,
                message: `Feedback atualizado por ${req.user.username}`
            });
        } catch (error) {
            console.error('Erro ao atualizar feedback:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
);

router.delete('/feedbacks/:id',
    authenticateToken,
    async (req, res) => {
        try {
            const { id } = req.params;

            if (isNaN(id)) {
                return res.status(400).json({ error: 'ID deve ser um número' });
            }

            const result = await FeedbackModel.delete(id, req.user.id);

            if (!result) {
                return res.status(404).json({ error: 'Feedback não encontrado' });
            }

            invalidateCache([
                `route:/animes/${result.user_anime_id}/feedbacks:${req.user.id}`,
                `feedbacks:user_anime:${result.user_anime_id}`,
                `route:/feedbacks/${id}:${req.user.id}`
            ]);

            res.json({
                message: `Feedback removido por ${req.user.username}`
            });
        } catch (error) {
            console.error('Erro ao deletar feedback:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
);

export default router;
