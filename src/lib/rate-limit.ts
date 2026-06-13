/**
 * In-process sliding-window rate limiter.
 *
 * Suitable for single-instance deployments (Vercel serverless functions per region,
 * or a single Node.js process). For multi-replica deployments, replace the Map
 * with a Redis-backed solution (e.g. @upstash/ratelimit).
 *
 * Usage:
 *   const limiter = createRateLimiter({ limit: 5, windowMs: 60_000 });
 *   const { success, retryAfter } = limiter.check(ip);
 */

interface RateLimiterOptions {
    /** Maximum requests allowed within the window. */
    limit: number;
    /** Window duration in milliseconds. */
    windowMs: number;
}

interface RateLimitResult {
    success: boolean;
    /** Seconds until the client may retry. Only set when success is false. */
    retryAfter?: number;
}

interface WindowEntry {
    count: number;
    resetAt: number;
}

export function createRateLimiter(options: RateLimiterOptions) {
    const { limit, windowMs } = options;
    const store = new Map<string, WindowEntry>();

    // Periodically clean up expired entries to prevent unbounded growth.
    const pruneInterval = setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of store) {
            if (entry.resetAt <= now) store.delete(key);
        }
    }, windowMs);

    // Allow the Node process to exit cleanly without holding this timer open.
    if (pruneInterval.unref) pruneInterval.unref();

    return {
        check(key: string): RateLimitResult {
            const now = Date.now();
            const entry = store.get(key);

            if (!entry || entry.resetAt <= now) {
                store.set(key, { count: 1, resetAt: now + windowMs });
                return { success: true };
            }

            if (entry.count >= limit) {
                return {
                    success: false,
                    retryAfter: Math.ceil((entry.resetAt - now) / 1000),
                };
            }

            entry.count += 1;
            return { success: true };
        },
    };
}

// ----- Pre-built limiters -----

/** Login endpoint: 10 attempts per IP per 15 minutes. */
export const loginLimiter = createRateLimiter({ limit: 10, windowMs: 15 * 60 * 1000 });

/** Password-reset OTP request: 5 per IP per 15 minutes. */
export const passwordResetLimiter = createRateLimiter({ limit: 5, windowMs: 15 * 60 * 1000 });

/** General API search: 60 requests per IP per minute. */
export const searchLimiter = createRateLimiter({ limit: 60, windowMs: 60 * 1000 });

/**
 * Extracts the best-effort client IP from Next.js request headers.
 * Falls back to "unknown" when running behind proxies that strip headers.
 */
export function getClientIp(request: Request): string {
    return (
        request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
        request.headers.get("x-real-ip") ??
        "unknown"
    );
}
