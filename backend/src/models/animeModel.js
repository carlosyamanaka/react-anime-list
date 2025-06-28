import { prisma } from '../config/db.js';
import { cacheManager } from '../config/cache.js';

export const AnimeModel = {
    async findMany() {
        const cacheKey = cacheManager.generateKey('animes', 'all');

        let animes = cacheManager.get(cacheKey);
        if (animes) {
            return animes;
        }

        animes = await prisma.anime.findMany();
        cacheManager.set(cacheKey, animes, 300);

        return animes;
    },

    async findById(id) {
        const cacheKey = cacheManager.generateKey('anime', 'id', id);

        let anime = cacheManager.get(cacheKey);
        if (anime) {
            return anime;
        }

        anime = await prisma.anime.findUnique({
            where: { id: parseInt(id) }
        });

        if (anime) {
            cacheManager.set(cacheKey, anime, 600);
        }

        return anime;
    },

    async create(data) {
        const anime = await prisma.anime.create({ data });

        cacheManager.del(cacheManager.generateKey('animes', 'all'));
        cacheManager.set(
            cacheManager.generateKey('anime', 'id', anime.id),
            anime,
            600
        );

        return anime;
    },

    async update(id, data) {
        const anime = await prisma.anime.update({
            where: { id: parseInt(id) },
            data
        });

        cacheManager.del(cacheManager.generateKey('animes', 'all'));
        cacheManager.set(
            cacheManager.generateKey('anime', 'id', id),
            anime,
            600
        );

        return anime;
    },

    async delete(id) {
        const anime = await prisma.anime.delete({
            where: { id: parseInt(id) }
        });

        cacheManager.del(cacheManager.generateKey('animes', 'all'));
        cacheManager.del(cacheManager.generateKey('anime', 'id', id));

        return anime;
    }
};
