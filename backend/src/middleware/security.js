import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

export const securityMiddleware = (app) => {
    // app.use(helmet());

    // app.use((req, res, next) => {
    //     if (!req.secure) {
    //         return res.redirect(301, `https://${req.headers.host}${req.url}`);
    //     }
    //     next();
    // });
};

export const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
});

export const generalRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Muitas requisições. Tente novamente em 15 minutos.' },
});
