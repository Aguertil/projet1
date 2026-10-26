import { prisma } from './prisma';
import { randomBytes, createHash } from 'crypto';

/**
 * Génère une nouvelle clé API sécurisée
 * Format: sk_live_xxx ou sk_test_xxx
 */
export function generateApiKey(environment: 'live' | 'test' = 'live'): string {
  const randomPart = randomBytes(32).toString('hex');
  return `sk_${environment}_${randomPart}`;
}

/**
 * Hash une clé API pour stockage sécurisé
 */
export function hashApiKey(key: string): string {
  return createHash('sha256').update(key).digest('hex');
}

/**
 * Valide le format d'une clé API
 */
export function isValidApiKeyFormat(key: string): boolean {
  return /^sk_(live|test)_[a-f0-9]{64}$/.test(key);
}

/**
 * Vérifie une clé API et retourne les informations associées
 */
export async function verifyApiKey(key: string) {
  if (!isValidApiKeyFormat(key)) {
    return null;
  }

  try {
    const apiKey = await prisma.apiKey.findUnique({
      where: { key },
      include: {
        user: {
          include: {
            subscriptions: {
              where: {
                status: 'ACTIVE',
              },
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
            },
          },
        },
      },
    });

    if (!apiKey) {
      return null;
    }

    // Vérifier si la clé est active
    if (!apiKey.isActive) {
      return null;
    }

    // Vérifier si la clé est expirée
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return null;
    }

    // Mettre à jour lastUsedAt
    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    return {
      apiKey,
      user: apiKey.user,
      subscription: apiKey.user.subscriptions[0] || null,
    };
  } catch (error) {
    console.error('Error verifying API key:', error);
    return null;
  }
}

/**
 * Crée une nouvelle clé API pour un utilisateur
 */
export async function createApiKey(
  userId: string,
  name: string,
  expiresAt?: Date
) {
  const key = generateApiKey('live');

  return await prisma.apiKey.create({
    data: {
      userId,
      key,
      name,
      expiresAt,
    },
  });
}

/**
 * Récupère toutes les clés API d'un utilisateur
 */
export async function getUserApiKeys(userId: string) {
  return await prisma.apiKey.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Désactive une clé API
 */
export async function revokeApiKey(apiKeyId: string, userId: string) {
  return await prisma.apiKey.update({
    where: {
      id: apiKeyId,
      userId,
    },
    data: {
      isActive: false,
    },
  });
}

/**
 * Récupère les statistiques d'utilisation pour une clé API
 */
export async function getApiKeyUsageStats(apiKeyId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const logs = await prisma.usageLog.findMany({
    where: {
      apiKeyId,
      createdAt: {
        gte: startDate,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const totalRequests = logs.length;
  const successfulRequests = logs.filter((log) => log.status === 'SUCCESS').length;
  const failedRequests = logs.filter((log) => log.status === 'FAILED').length;
  const rateLimitedRequests = logs.filter((log) => log.status === 'RATE_LIMITED').length;
  const totalCreditsUsed = logs.reduce((sum, log) => sum + log.creditsUsed, 0);
  const avgDuration = logs.reduce((sum, log) => sum + (log.durationMs || 0), 0) / totalRequests || 0;

  return {
    totalRequests,
    successfulRequests,
    failedRequests,
    rateLimitedRequests,
    totalCreditsUsed,
    avgDuration: Math.round(avgDuration),
    logs: logs.slice(0, 100),
  };
}
