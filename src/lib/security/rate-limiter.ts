import { logger } from '@/lib/logger';

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// In-memory sliding window fallback store
const memoryStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Rate Limiter abstraction supporting Upstash Redis REST API
 * with automatic fallback to high-efficiency in-memory store.
 */
export class RateLimiter {
  private redisUrl?: string;
  private redisToken?: string;

  constructor() {
    this.redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    this.redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  }

  /**
   * Evaluates if the identifier (IP address, user ID, or session key) is within limits.
   * @param identifier Client identifier (IP or user ID)
   * @param limit Max allowed requests within duration
   * @param durationInSeconds Time window in seconds
   */
  async limit(
    identifier: string,
    limit: number = 20,
    durationInSeconds: number = 60
  ): Promise<RateLimitResult> {
    const key = `ratelimit:${identifier}`;

    // If Upstash Redis credentials are provided, call Upstash REST API
    if (this.redisUrl && this.redisToken) {
      try {
        const response = await fetch(`${this.redisUrl}/pipeline`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.redisToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([
            ['INCR', key],
            ['EXPIRE', key, durationInSeconds, 'NX'],
          ]),
        });

        if (response.ok) {
          const results = await response.json();
          const count = results[0]?.result || 1;
          const remaining = Math.max(0, limit - count);

          return {
            success: count <= limit,
            limit,
            remaining,
            reset: Math.floor(Date.now() / 1000) + durationInSeconds,
          };
        }
      } catch (err) {
        logger.warn('Upstash rate limit request failed, falling back to memory store', { error: err });
      }
    }

    // In-memory fallback
    const now = Date.now();
    const entry = memoryStore.get(key);

    if (!entry || now > entry.resetAt) {
      memoryStore.set(key, { count: 1, resetAt: now + durationInSeconds * 1000 });
      return {
        success: true,
        limit,
        remaining: limit - 1,
        reset: Math.floor((now + durationInSeconds * 1000) / 1000),
      };
    }

    entry.count += 1;
    const remaining = Math.max(0, limit - entry.count);

    return {
      success: entry.count <= limit,
      limit,
      remaining,
      reset: Math.floor(entry.resetAt / 1000),
    };
  }
}

export const rateLimiter = new RateLimiter();
