import { query } from '../config/db';

export interface Anime {
    mal_id: number;
    title: string;
    title_japanese?: string;
    image_url?: string;
    score?: number;
    rank?: number;
    popularity?: number;
    type?: string;
    episodes?: number;
    year?: number;
    rating?: string;
    synopsis?: string;
    url?: string;
    studios?: any;
    genres?: any;
}

export const AnimeModel = {
    async getAll(): Promise<Anime[]> {
        const result = await query('SELECT * FROM animes');
        return result.rows;
    },

    async create(data: Anime): Promise<Anime> {
        const result = await query(
            `INSERT INTO animes (
        mal_id, title, title_japanese, image_url, score, rank, popularity, type,
        episodes, year, rating, synopsis, url, studios, genres
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
      ) RETURNING *`,
            [
                data.mal_id, data.title, data.title_japanese, data.image_url, data.score,
                data.rank, data.popularity, data.type, data.episodes, data.year,
                data.rating, data.synopsis, data.url, data.studios, data.genres
            ]
        );
        return result.rows[0];
    }
};
