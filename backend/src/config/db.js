import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    },

    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],

    errorFormat: 'pretty',
});

prisma.$on('query', (e) => {
    console.log('Query:', e.query);
    console.log('Params:', e.params);
    console.log('Duration:', e.duration + 'ms');
});

prisma.$on('info', (e) => {
    console.log('Info:', e.message);
});

prisma.$on('warn', (e) => {
    console.warn('Warning:', e.message);
});

prisma.$on('error', (e) => {
    console.error('Error:', e.message);
});

export const closePrisma = async () => {
    await prisma.$disconnect();
    console.log('Prisma disconnected');
};

export const withRetry = async (operation, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            console.log(`Tentativa ${i + 1} falhou, tentando novamente...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
};

export const checkHealth = async () => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return { status: 'healthy', timestamp: new Date() };
    } catch (error) {
        return { status: 'unhealthy', error: error.message, timestamp: new Date() };
    }
};
