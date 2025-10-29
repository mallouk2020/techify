const { PrismaClient } = require("@prisma/client");

const prismaClientSingleton = () => {
    // Validate that DATABASE_URL is present
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is required');
    }

    // Parse DATABASE_URL to check SSL configuration
    const databaseUrl = process.env.DATABASE_URL;
    const url = new URL(databaseUrl);
    
    // Log SSL configuration for debugging
    if (process.env.NODE_ENV === "development") {
        console.log(` Database connection: ${url.protocol}//${url.hostname}:${url.port || '3306'}`);
        console.log(`🔒 SSL Mode: ${url.searchParams.get('sslmode') || 'not specified'}`);
    }

    return new PrismaClient({
        // Add logging for debugging
        log: process.env.NODE_ENV === "development" 
            ? ['query', 'info', 'warn', 'error']
            : ['error', 'warn'],
    });
}

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

module.exports = prisma;

if(process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Prisma middleware: defend against accidental password overwrites
try {
    if (typeof prisma.$use === 'function') {
        prisma.$use(async (params, next) => {
            try {
                if (!params || params.model !== 'User') return next(params);

                const bcryptRegex = /^\$2[aby]\$[0-9]{2}\$[./A-Za-z0-9]{53}$/;

                const stripIfInvalid = (obj) => {
                    if (!obj || typeof obj !== 'object') return;
                    if (!Object.prototype.hasOwnProperty.call(obj, 'password')) return;
                    const newPass = obj.password;
                    if (newPass === null) return;
                    if (typeof newPass === 'string' && !bcryptRegex.test(newPass)) {
                        console.warn('[prisma-middleware] Removed invalid password value from payload (not a bcrypt hash).', {
                            model: params.model,
                            action: params.action,
                            where: params.args && params.args.where,
                        });
                        delete obj.password;
                    }
                };

                switch (params.action) {
                    case 'update':
                    case 'updateMany':
                        stripIfInvalid(params.args && params.args.data);
                        break;
                    case 'create':
                        stripIfInvalid(params.args && params.args.data);
                        break;
                    case 'createMany':
                        if (Array.isArray(params.args && params.args.data)) {
                            for (const row of params.args.data) stripIfInvalid(row);
                        } else {
                            stripIfInvalid(params.args && params.args.data);
                        }
                        break;
                    case 'upsert':
                        stripIfInvalid(params.args && params.args.create);
                        stripIfInvalid(params.args && params.args.update);
                        break;
                    default:
                        break;
                }
            } catch (e) {
                throw e;
            }
            return next(params);
        });
    }
} catch (err) {
    console.warn('[prisma-middleware] Failed to install password-protection middleware:', err);
}