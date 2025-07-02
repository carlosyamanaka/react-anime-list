import { prisma } from '../config/db.js';
import { SecurityConfig } from '../config/security.js';

export const UserModel = {
    async findByUsername(username) {
        if (!username || typeof username !== 'string') {
            return null;
        }
        const sanitizedUsername = SecurityConfig.sanitizeString(username, 30);
        if (sanitizedUsername.length < 3) {
            return null;
        }

        return await prisma.user.findUnique({ where: { username: sanitizedUsername } });
    },

    async findById(id) {
        const validatedId = SecurityConfig.validateNumericId(id, 'User ID');
        return await prisma.user.findUnique({
            where: { id: validatedId },
            select: {
                id: true,
                username: true,
                created_at: true,
                updated_at: true
            }
        });
    },

    async create(username, password) {
        if (!username || typeof username !== 'string') {
            throw new Error('Username inválido');
        }
        const sanitizedUsername = SecurityConfig.sanitizeString(username, 30);
        if (sanitizedUsername.length < 3) {
            throw new Error('Username deve ter pelo menos 3 caracteres');
        }

        const hashedPassword = await SecurityConfig.hashPassword(password);
        return await prisma.user.create({
            data: { username: sanitizedUsername, password: hashedPassword },
            select: {
                id: true,
                username: true,
                created_at: true
            }
        });
    },

    async validatePassword(username, password) {
        const user = await this.findByUsername(username);
        if (!user) return null;

        const isValid = await SecurityConfig.comparePassword(password, user.password);
        if (!isValid) return null;

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
};
