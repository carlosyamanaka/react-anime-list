import { prisma } from '../config/db.js';

export const AnimeModel = {
    async getAll() {
        return await prisma.anime.findMany();
    },

    async create(anime) {
        const { id, ...animeData } = anime;
        return await prisma.anime.create({ data: animeData });
    }
};
