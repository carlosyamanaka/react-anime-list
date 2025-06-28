import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

router.post('/login', (req, res, next) => {
    (async () => {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }
        const user = await UserModel.validatePassword(username, password);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    })().catch(next);
});

router.post('/register', (req, res, next) => {
    (async () => {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }
        const existing = await UserModel.findByUsername(username);
        if (existing) {
            return res.status(409).json({ error: 'Username already exists' });
        }
        const user = await UserModel.create(username, password);
        res.status(201).json({ id: user.id, username: user.username });
    })().catch(next);
});

export default router;
