import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel.js';
import { SecurityConfig } from '../config/security.js';
import { authRateLimit } from '../middleware/security.js';
import { validateUser } from '../middleware/validation.js';
import { invalidateToken } from '../middleware/auth.js';

const router = Router();

router.post('/auth/sessions', authRateLimit, validateUser, async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await UserModel.validatePassword(username, password);
        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            SecurityConfig.jwtSecret,
            { expiresIn: '2h' }
        );

        res.json({ token, expiresIn: '2h' });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.post('/auth/users', authRateLimit, validateUser, async (req, res) => {
    try {
        const { username, password } = req.body;

        const existing = await UserModel.findByUsername(username);
        if (existing) {
            return res.status(409).json({ error: 'Username já existe' });
        }

        const user = await UserModel.create(username, password);
        res.status(201).json({ id: user.id, username: user.username });
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.delete('/auth/sessions', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
        invalidateToken(token);
    }
    res.json({ message: 'Logout realizado com sucesso' });
});

export default router;
