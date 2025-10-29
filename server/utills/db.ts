import { PrismaClient } from "@prisma/client"; 

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

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if(process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Prisma middleware: defend against accidental password overwrites
// - If an update to the User model includes `password`, ensure the new value
//   looks like a bcrypt hash before allowing it. This is a defensive, low-risk
//   safeguard applied at the ORM layer.
try {
    // $use exists on PrismaClient instances
    if (typeof (prisma as any).$use === 'function') {
        (prisma as any).$use(async (params: any, next: any) => {
            try {
                // Only defend the User model
                if (!params || params.model !== 'User') return next(params);

                const bcryptRegex = /^\$2[aby]\$[0-9]{2}\$[./A-Za-z0-9]{53}$/;

                const stripIfInvalid = (obj: any) => {
                    if (!obj || typeof obj !== 'object') return;
                    if (!Object.prototype.hasOwnProperty.call(obj, 'password')) return;
                    const newPass = obj.password;
                    // Allow explicit null (intentional removal)
                    if (newPass === null) return;

                    // Add detailed debug logging to help trace accidental password writes.
                    try {
                        const passType = typeof newPass;
                        const passLen = (typeof newPass === 'string') ? newPass.length : null;
                        const looksLikeBcrypt = typeof newPass === 'string' && bcryptRegex.test(newPass);
                        console.warn('[prisma-middleware] Detected password field on User payload', {
                            model: params.model,
                            action: params.action,
                            where: params.args && params.args.where,
                            passType,
                            passLen,
                            looksLikeBcrypt,
                        });
                    } catch (logErr) {
                        // ignore logging failures
                    }

                    // Defensive behavior: if the provided value is a string but does not
                    // look like a bcrypt hash, remove it from the payload to avoid
                    // accidentally overwriting the stored hashed password with plaintext.
                    // This preserves existing behavior but leaves better logs for diagnosis.
                    if (typeof newPass === 'string' && !bcryptRegex.test(newPass)) {
                        console.warn('[prisma-middleware] Removed invalid password value from payload (not a bcrypt hash).', {
                            model: params.model,
                            action: params.action,
                            where: params.args && params.args.where,
                        });
                        delete obj.password;
                    }
                };

                // Cover common write actions that can set password
                switch (params.action) {
                    case 'update':
                    case 'updateMany':
                        stripIfInvalid(params.args && params.args.data);
                        break;
                    case 'create':
                        stripIfInvalid(params.args && params.args.data);
                        break;
                    case 'createMany':
                        // createMany.data may be an array of objects
                        if (Array.isArray(params.args && params.args.data)) {
                            for (const row of params.args.data) stripIfInvalid(row);
                        } else {
                            stripIfInvalid(params.args && params.args.data);
                        }
                        break;
                    case 'upsert':
                        // upsert usually has { create: {...}, update: {...} }
                        stripIfInvalid(params.args && params.args.create);
                        stripIfInvalid(params.args && params.args.update);
                        break;
                    default:
                        // no-op for other actions
                        break;
                }
            } catch (e) {
                // Re-throw to surface to caller
                throw e;
            }
            return next(params);
        });
    }
} catch (err) {
    // Non-fatal: if middleware can't be installed, log and continue. The DB-level
    // protections (SQL scripts) are the authoritative safety net.
    console.warn('[prisma-middleware] Failed to install password-protection middleware:', err);
}