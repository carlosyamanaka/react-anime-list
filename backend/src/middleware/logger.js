import fs from 'fs';
import path from 'path';

const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const getLogFileName = (type) => {
    const date = new Date().toISOString().split('T')[0];
    return path.join(logDir, `${type}-${date}.log`);
};

const writeLog = (type, data) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${JSON.stringify(data)}\n`;

    fs.appendFileSync(getLogFileName(type), logEntry);
};

export const logAuthentication = (req, res, next) => {
    const originalSend = res.send;

    res.send = function (data) {
        const logData = {
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            endpoint: req.originalUrl,
            method: req.method,
            status: res.statusCode,
            timestamp: new Date().toISOString()
        };

        if (req.originalUrl.includes('/login') || req.originalUrl.includes('/register')) {
            if (res.statusCode >= 400) {
                logData.error = 'Authentication failed';
                logData.username = req.body?.username;
                writeLog('auth-errors', logData);
            } else {
                logData.success = 'Authentication successful';
                writeLog('auth-success', logData);
            }
        }

        originalSend.call(this, data);
    };

    next();
};

export const logActivity = (req, res, next) => {
    const startTime = Date.now();

    res.on('finish', () => {
        const logData = {
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            responseTime: `${Date.now() - startTime}ms`,
            user: req.user?.username || 'anonymous',
            timestamp: new Date().toISOString()
        };

        if (res.statusCode >= 400) {
            writeLog('errors', logData);
        } else {
            writeLog('activity', logData);
        }
    });

    next();
};
