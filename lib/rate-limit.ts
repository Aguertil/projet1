import { redis } from './redis';

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

/**
 * Implémente le rate limiting avec l'algorithme sliding window
 * Utilise Redis pour le stockage distribué
 */
export async function rateLimit(
  identifier: string,
  limit: number = 60,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  const key = `rate_limit:${identifier}`;
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;

  try {
    // Récupérer le compteur actuel
    const currentCount = await redis.get(key);
    const count = currentCount ? parseInt(currentCount, 10) : 0;

    // Si pas de clé, créer une nouvelle fenêtre
    if (!currentCount) {
      await redis.set(key, '1', windowSeconds);
      return {
        success: true,
        limit,
        remaining: limit - 1,
        reset: now + windowSeconds * 1000,
      };
    }

    // Vérifier si la limite est dépassée
    if (count >= limit) {
      const ttl = await redis.ttl(key);
      const resetTime = now + ttl * 1000;
      
      return {
        success: false,
        limit,
        remaining: 0,
        reset: resetTime,
        retryAfter: ttl,
      };
    }

    // Incrémenter le compteur
    const newCount = await redis.incr(key);
    
    // S'assurer que la clé a une expiration
    const ttl = await redis.ttl(key);
    if (ttl === -1) {
      await redis.expire(key, windowSeconds);
    }

    return {
      success: true,
      limit,
      remaining: Math.max(0, limit - newCount),
      reset: now + (ttl > 0 ? ttl * 1000 : windowSeconds * 1000),
    };
  } catch (error) {
    console.error('Rate limit error:', error);
    // En cas d'erreur, on laisse passer la requête
    return {
      success: true,
      limit,
      remaining: limit,
      reset: now + windowSeconds * 1000,
    };
  }
}

/**
 * Vérifie le rate limit sans l'incrémenter
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = 60
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  const key = `rate_limit:${identifier}`;
  const now = Date.now();

  try {
    const currentCount = await redis.get(key);
    const count = currentCount ? parseInt(currentCount, 10) : 0;
    const ttl = await redis.ttl(key);
    const resetTime = now + (ttl > 0 ? ttl * 1000 : 60000);

    return {
      allowed: count < limit,
      remaining: Math.max(0, limit - count),
      reset: resetTime,
    };
  } catch (error) {
    console.error('Check rate limit error:', error);
    return {
      allowed: true,
      remaining: limit,
      reset: now + 60000,
    };
  }
}

/**
 * Réinitialise le rate limit pour un identifier
 */
export async function resetRateLimit(identifier: string): Promise<void> {
  const key = `rate_limit:${identifier}`;
  await redis.del(key);
}
