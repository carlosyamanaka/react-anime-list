import validator from 'validator';
import xss from 'xss';

export const sanitizeInput = (req, res, next) => {
    const sanitizeObject = (obj) => {
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string') {
                sanitized[key] = xss(validator.escape(value));
            } else if (typeof value === 'object' && value !== null) {
                sanitized[key] = sanitizeObject(value);
            } else {
                sanitized[key] = value;
            }
        }
        return sanitized;
    };

    if (req.body && typeof req.body === 'object') {
        req.body = sanitizeObject(req.body);
    }

    next();
};

export const validateAnime = (req, res, next) => {
    const { mal_id, title } = req.body;

    if (!mal_id || !validator.isInt(mal_id.toString())) {
        return res.status(400).json({ error: 'mal_id deve ser um número inteiro válido' });
    }

    if (!title || !validator.isLength(title, { min: 1, max: 255 })) {
        return res.status(400).json({ error: 'title deve ter entre 1 e 255 caracteres' });
    }

    next();
};

export const validateUser = (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !validator.isLength(username, { min: 3, max: 30 })) {
        return res.status(400).json({ error: 'Username deve ter entre 3 e 30 caracteres' });
    }

    if (!password || !validator.isLength(password, { min: 8, max: 128 })) {
        return res.status(400).json({ error: 'Password deve ter entre 8 e 128 caracteres' });
    }

    if (!validator.isAlphanumeric(username)) {
        return res.status(400).json({ error: 'Username deve conter apenas letras e números' });
    }

    next();
};
