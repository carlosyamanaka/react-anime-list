import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const SecurityConfig = {
    bcryptRounds: 12,
    jwtSecret: process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex'),

    async hashPassword(password) {
        if (password.length < 8) {
            throw new Error('Senha deve ter pelo menos 8 caracteres');
        }
        return await bcrypt.hash(password, this.bcryptRounds);
    },

    async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }
};
