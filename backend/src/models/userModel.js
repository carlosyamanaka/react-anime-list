import bcrypt from 'bcryptjs';
import { prisma } from '../config/db.js';

export const UserModel = {
    async findByUsername(username) {
        const user = await prisma.user.findUnique({ where: { username } });
        return user || null;
    },

    async create(username, password) {
        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { username, password: hashed }
        });
        return user;
    },

    async validatePassword(username, password) {
        const user = await this.findByUsername(username);
        if (!user) return null;
        const valid = await bcrypt.compare(password, user.password);
        return valid ? user : null;
    }
};
