import { prisma } from '../config/db.js';
import { cacheManager } from '../config/cache.js';
import { SecurityConfig } from '../config/security.js';

export const UserAnimeModel = {
    async findManyByUser(userId) {
        const validatedUserId = SecurityConfig.validateNumericId(userId, 'User ID');
        const cacheKey = cacheManager.generateKey('user_animes', 'user', validatedUserId);

        let animes = cacheManager.get(cacheKey);
        if (animes) {
            return animes;
        }

        animes = await prisma.userAnime.findMany({
            where: { user_id: validatedUserId },
            include: {
                feedbacks: {
                    orderBy: { created_at: 'desc' },
                    take: 3
                }
            },
            orderBy: { created_at: 'desc' }
        });

        cacheManager.set(cacheKey, animes, 300);
        return animes;
    },

    async findById(id, userId) {
        const validatedId = SecurityConfig.validateNumericId(id, 'Anime ID');
        const validatedUserId = SecurityConfig.validateNumericId(userId, 'User ID');
        const cacheKey = cacheManager.generateKey('user_anime', 'id', validatedId, 'user', validatedUserId);

        let anime = cacheManager.get(cacheKey);
        if (anime) {
            return anime;
        }

        anime = await prisma.userAnime.findFirst({
            where: {
                id: validatedId,
                user_id: validatedUserId
            },
            include: {
                feedbacks: {
                    orderBy: { created_at: 'desc' }
                }
            }
        });

        if (anime) {
            cacheManager.set(cacheKey, anime, 600);
        }

        return anime;
    },

    async findByMalId(malId, userId) {
        const validatedMalId = SecurityConfig.validateNumericId(malId, 'MAL ID');
        const validatedUserId = SecurityConfig.validateNumericId(userId, 'User ID');

        return await prisma.userAnime.findFirst({
            where: {
                mal_id: validatedMalId,
                user_id: validatedUserId
            }
        });
    },

    async create(data, userId) {
        const validatedUserId = SecurityConfig.validateNumericId(userId, 'User ID');

        const animeData = {
            ...data,
            user_id: validatedUserId
        };

        const anime = await prisma.userAnime.create({ data: animeData });

        cacheManager.del(cacheManager.generateKey('user_animes', 'user', validatedUserId));
        cacheManager.set(
            cacheManager.generateKey('user_anime', 'id', anime.id, 'user', validatedUserId),
            anime,
            600
        );

        return anime;
    },

    async update(id, data, userId) {
        const anime = await prisma.userAnime.updateMany({
            where: {
                id: parseInt(id),
                user_id: userId
            },
            data
        });

        if (anime.count > 0) {
            const updatedAnime = await this.findById(id, userId);

            cacheManager.del(cacheManager.generateKey('user_animes', 'user', userId));
            cacheManager.set(
                cacheManager.generateKey('user_anime', 'id', id, 'user', userId),
                updatedAnime,
                600
            );

            return updatedAnime;
        }

        return null;
    },

    async searchByName(searchTerm, userId) {
        const cacheKey = cacheManager.generateKey('user_animes_search', 'user', userId, 'term', searchTerm);

        let animes = cacheManager.get(cacheKey);
        if (animes) {
            return animes;
        }

        animes = await prisma.userAnime.findMany({
            where: {
                user_id: userId,
                OR: [
                    {
                        title: {
                            contains: searchTerm,
                            mode: 'insensitive'
                        }
                    },
                    {
                        title_japanese: {
                            contains: searchTerm,
                            mode: 'insensitive'
                        }
                    }
                ]
            },
            include: {
                feedbacks: {
                    orderBy: { created_at: 'desc' },
                    take: 3
                }
            },
            orderBy: [
                { score: 'desc' },
                { created_at: 'desc' }
            ]
        });

        cacheManager.set(cacheKey, animes, 180); // cache por 3 minutos
        return animes;
    },
};
