import jwt from 'jsonwebtoken';
import { SecurityConfig } from '../config/security.js';

const blacklistedTokens = new Set();

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token de acesso requerido' });
    }

    if (blacklistedTokens.has(token)) {
        return res.status(403).json({ error: 'Token inválido' });
    }

    jwt.verify(token, SecurityConfig.jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido ou expirado' });
        }

        req.user = user;
        req.token = token;
        next();
    });
};

export const invalidateToken = (token) => {
    blacklistedTokens.add(token);
};
