import { prisma } from '../config/db.js';
import { cacheManager } from '../config/cache.js';
import { SecurityConfig } from '../config/security.js';

export const FeedbackModel = {
    async findManyByUserAnime(userAnimeId) {
        const validatedUserAnimeId = SecurityConfig.validateNumericId(userAnimeId, 'User Anime ID');
        const cacheKey = cacheManager.generateKey('feedbacks', 'user_anime', validatedUserAnimeId);

        let feedbacks = cacheManager.get(cacheKey);
        if (feedbacks) {
            return feedbacks;
        }

        feedbacks = await prisma.feedback.findMany({
            where: { user_anime_id: validatedUserAnimeId },
            orderBy: { created_at: 'desc' }
        });

        cacheManager.set(cacheKey, feedbacks, 300);
        return feedbacks;
    },

    async findById(id, userId) {
        const validatedId = SecurityConfig.validateNumericId(id, 'Feedback ID');
        const validatedUserId = SecurityConfig.validateNumericId(userId, 'User ID');

        const feedback = await prisma.feedback.findFirst({
            where: {
                id: validatedId,
                userAnime: {
                    user_id: validatedUserId
                }
            },
            include: {
                userAnime: true
            }
        });

        return feedback;
    },

    async create(data, userAnimeId, userId) {
        const validatedUserAnimeId = SecurityConfig.validateNumericId(userAnimeId, 'User Anime ID');
        const validatedUserId = SecurityConfig.validateNumericId(userId, 'User ID');

        const userAnime = await prisma.userAnime.findFirst({
            where: {
                id: validatedUserAnimeId,
                user_id: validatedUserId
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
                user_anime_id: validatedUserAnimeId
            }
        });

        cacheManager.del(cacheManager.generateKey('feedbacks', 'user_anime', validatedUserAnimeId));

        return feedback;
    },

    async update(id, data, userId) {
        const validatedId = SecurityConfig.validateNumericId(id, 'Feedback ID');
        const validatedUserId = SecurityConfig.validateNumericId(userId, 'User ID');

        const existingFeedback = await this.findById(validatedId, validatedUserId);
        if (!existingFeedback) {
            return null;
        }

        if (data.score !== undefined && data.score !== null) {
            data.score = parseFloat(data.score).toFixed(2);
        }

        const feedback = await prisma.feedback.update({
            where: { id: validatedId },
            data
        });

        cacheManager.del(cacheManager.generateKey('feedbacks', 'user_anime', existingFeedback.user_anime_id));

        return feedback;
    },

    async delete(id, userId) {
        const validatedId = SecurityConfig.validateNumericId(id, 'Feedback ID');
        const validatedUserId = SecurityConfig.validateNumericId(userId, 'User ID');

        const existingFeedback = await this.findById(validatedId, validatedUserId);
        if (!existingFeedback) {
            return null;
        }

        const result = await prisma.feedback.delete({
            where: { id: validatedId }
        });

        cacheManager.del(cacheManager.generateKey('feedbacks', 'user_anime', existingFeedback.user_anime_id));

        return result;
    }
};
