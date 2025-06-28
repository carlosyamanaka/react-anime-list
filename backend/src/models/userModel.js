import { prisma } from '../config/db.js';
import { SecurityConfig } from '../config/security.js';

export const UserModel = {
    async findByUsername(username) {
        return await prisma.user.findUnique({ where: { username } });
    },

    async create(username, password) {
        const hashedPassword = await SecurityConfig.hashPassword(password);
        return await prisma.user.create({
            data: { username, password: hashedPassword }
        });
    },

    async validatePassword(username, password) {
        const user = await this.findByUsername(username);
        if (!user) return null;

        const isValid = await SecurityConfig.comparePassword(password, user.password);
        return isValid ? user : null;
    }
};
