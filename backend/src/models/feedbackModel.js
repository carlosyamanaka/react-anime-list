import { prisma } from '../config/db.js';
import { cacheManager } from '../config/cache.js';

export const FeedbackModel = {
    async findManyByUserAnime(userAnimeId) {
        const cacheKey = cacheManager.generateKey('feedbacks', 'user_anime', userAnimeId);

        let feedbacks = cacheManager.get(cacheKey);
        if (feedbacks) {
            return feedbacks;
        }

        feedbacks = await prisma.feedback.findMany({
            where: { user_anime_id: parseInt(userAnimeId) },
            orderBy: { created_at: 'desc' }
        });

        cacheManager.set(cacheKey, feedbacks, 300);
        return feedbacks;
    },

    async findById(id, userId) {
        const feedback = await prisma.feedback.findFirst({
            where: {
                id: parseInt(id),
                userAnime: {
                    user_id: userId
                }
            },
            include: {
                userAnime: true
            }
        });

        if (!feedback) {
            return null;
        }

        return feedback;
    },

    async create(data, userAnimeId, userId) {
        const userAnime = await prisma.userAnime.findFirst({
            where: {
                id: parseInt(userAnimeId),
                user_id: userId
            }
        });

        if (!userAnime) {
            throw new Error('Anime não encontrado na sua lista');
        }

        if (data.score !== undefined && data.score !== null) {
            data.score = parseFloat(data.score).toFixed(2);
        }

        const feedback = await prisma.feedback.create({
            data: {
                ...data,
                user_anime_id: parseInt(userAnimeId)
            }
        });

        cacheManager.del(cacheManager.generateKey('feedbacks', 'user_anime', userAnimeId));

        return feedback;
    },

    async update(id, data, userId) {
        const existingFeedback = await this.findById(id, userId);
        if (!existingFeedback) {
            return null;
        }

        // Ensure score is properly formatted if provided
        if (data.score !== undefined && data.score !== null) {
            data.score = parseFloat(data.score).toFixed(2);
        }

        const feedback = await prisma.feedback.update({
            where: { id: parseInt(id) },
            data
        });

        cacheManager.del(cacheManager.generateKey('feedbacks', 'user_anime', existingFeedback.user_anime_id));

        return feedback;
    },

    async delete(id, userId) {
        const existingFeedback = await this.findById(id, userId);
        if (!existingFeedback) {
            return null;
        }

        const result = await prisma.feedback.delete({
            where: { id: parseInt(id) }
        });

        cacheManager.del(cacheManager.generateKey('feedbacks', 'user_anime', existingFeedback.user_anime_id));

        return result;
    }
};
