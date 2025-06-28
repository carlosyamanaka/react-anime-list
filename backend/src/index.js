import express from 'express';
import cors from 'cors';
import animeRoutes from './routes/animeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cacheRoutes from './routes/cacheRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import { securityMiddleware, generalRateLimit } from './middleware/security.js';
import { sanitizeInput } from './middleware/validation.js';
import { logAuthentication, logActivity } from './middleware/logger.js';

const app = express();
const PORT = process.env.PORT || 3000;

<<<<<<< Updated upstream
// securityMiddleware(app);

app.use(express.json({ limit: '10mb' }));
app.use(generalRateLimit);
app.use(sanitizeInput);
app.use(logAuthentication);
app.use(logActivity);

=======
app.use(cors());
app.use(express.json());
app.use('/', animeRoutes);
>>>>>>> Stashed changes
app.use('/', authRoutes);
app.use('/', animeRoutes);
app.use('/', cacheRoutes);
app.use('/', searchRoutes);
app.use('/', feedbackRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
