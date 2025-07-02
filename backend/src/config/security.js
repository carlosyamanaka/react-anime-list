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
    },

    validateNumericId(id, fieldName = 'ID') {
        if (!id) {
            throw new Error(`${fieldName} é obrigatório`);
        }

        const numericId = parseInt(id);
        if (isNaN(numericId) || numericId <= 0) {
            throw new Error(`${fieldName} deve ser um número inteiro positivo`);
        }

        if (numericId > Number.MAX_SAFE_INTEGER) {
            throw new Error(`${fieldName} é muito grande`);
        }

        return numericId;
    },

    sanitizeString(input, maxLength = 1000) {
        if (typeof input !== 'string') {
            return '';
        }

        let sanitized = input.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, '');

        if (sanitized.length > maxLength) {
            sanitized = sanitized.substring(0, maxLength);
        }

        return sanitized.trim();
    }
};
