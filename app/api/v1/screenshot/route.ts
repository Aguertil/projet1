import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyApiKey } from '@/lib/api-key';
import { rateLimit } from '@/lib/rate-limit';
import { captureScreenshot } from '@/lib/screenshot';
import { prisma } from '@/lib/prisma';

// Schéma de validation pour la requête
const screenshotRequestSchema = z.object({
  url: z.string().url('Invalid URL format'),
  format: z.enum(['PNG', 'JPEG', 'WEBP']).optional().default('PNG'),
  quality: z.number().min(1).max(100).optional(),
  viewportType: z.enum(['DESKTOP', 'MOBILE', 'TABLET', 'CUSTOM']).optional().default('DESKTOP'),
  viewportWidth: z.number().min(200).max(3840).optional(),
  viewportHeight: z.number().min(200).max(2160).optional(),
  fullPage: z.boolean().optional().default(false),
  waitForSelector: z.string().optional(),
  waitForTimeout: z.number().min(1000).max(60000).optional().default(30000),
  hideElements: z.array(z.string()).optional(),
  blockCookies: z.boolean().optional().default(true),
  blockAds: z.boolean().optional().default(false),
});

type ScreenshotRequest = z.infer<typeof screenshotRequestSchema>;

/**
 * Endpoint principal pour capturer des screenshots
 * POST /api/v1/screenshot
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let userId: string | undefined;
  let apiKeyId: string | undefined;

  try {
    // 1. Vérifier la clé API
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'Missing API key',
          message: 'Please provide your API key in the x-api-key header',
        },
        { status: 401 }
      );
    }

    const apiKeyData = await verifyApiKey(apiKey);
    
    if (!apiKeyData) {
      return NextResponse.json(
        {
          error: 'Invalid API key',
          message: 'The provided API key is invalid, expired, or inactive',
        },
        { status: 401 }
      );
    }

    userId = apiKeyData.user.id;
    apiKeyId = apiKeyData.apiKey.id;
    const subscription = apiKeyData.subscription;

    // 2. Vérifier l'abonnement et les crédits
    if (!subscription) {
      return NextResponse.json(
        {
          error: 'No active subscription',
          message: 'Please subscribe to a plan to use the API',
        },
        { status: 403 }
      );
    }

    if (subscription.creditsRemaining <= 0) {
      return NextResponse.json(
        {
          error: 'Insufficient credits',
          message: `You have used all your credits (${subscription.creditsUsed}/${subscription.creditsTotal}). Please upgrade your plan or wait for the next billing cycle.`,
          creditsUsed: subscription.creditsUsed,
          creditsTotal: subscription.creditsTotal,
          creditsRemaining: 0,
        },
        { status: 402 }
      );
    }

    // 3. Rate limiting
    const rateLimitConfig: Record<string, number> = {
      FREE: parseInt(process.env.RATE_LIMIT_FREE || '10'),
      PRO: parseInt(process.env.RATE_LIMIT_PRO || '60'),
      ENTERPRISE: parseInt(process.env.RATE_LIMIT_ENTERPRISE || '300'),
    };

    const limit = rateLimitConfig[subscription.plan] || apiKeyData.apiKey.rateLimit;
    const rateLimitResult = await rateLimit(apiKey, limit, 60);

    // Ajouter les headers de rate limiting
    const headers = {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
      'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
    };

    if (!rateLimitResult.success) {
      // Log l'échec du rate limit
      await prisma.usageLog.create({
        data: {
          userId,
          apiKeyId,
          url: 'rate-limited',
          status: 'RATE_LIMITED',
          creditsUsed: 0,
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          userAgent: request.headers.get('user-agent'),
        },
      });

      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `You have exceeded the rate limit of ${limit} requests per minute. Please try again later.`,
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            ...headers,
            'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
          },
        }
      );
    }

    // 4. Valider les paramètres de la requête
    let body: ScreenshotRequest;
    try {
      const rawBody = await request.json();
      body = screenshotRequestSchema.parse(rawBody);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: 'Validation error',
            message: 'Invalid request parameters',
            details: error.issues,
          },
          { status: 400, headers }
        );
      }
      throw error;
    }

    // 5. Valider le viewport custom
    if (body.viewportType === 'CUSTOM' && (!body.viewportWidth || !body.viewportHeight)) {
      return NextResponse.json(
        {
          error: 'Validation error',
          message: 'viewportWidth and viewportHeight are required when viewportType is CUSTOM',
        },
        { status: 400, headers }
      );
    }

    // 6. Capturer le screenshot
    let screenshotResult;
    try {
      screenshotResult = await captureScreenshot({
        url: body.url,
        format: body.format,
        quality: body.quality,
        viewportType: body.viewportType,
        viewportWidth: body.viewportWidth,
        viewportHeight: body.viewportHeight,
        fullPage: body.fullPage,
        waitForSelector: body.waitForSelector,
        waitForTimeout: body.waitForTimeout,
        hideElements: body.hideElements,
        blockCookies: body.blockCookies,
        blockAds: body.blockAds,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Screenshot capture failed';
      
      // Log l'échec
      await prisma.usageLog.create({
        data: {
          userId,
          apiKeyId,
          url: body.url,
          status: 'FAILED',
          format: body.format,
          viewportType: body.viewportType,
          viewportWidth: body.viewportWidth,
          viewportHeight: body.viewportHeight,
          fullPage: body.fullPage,
          waitForSelector: body.waitForSelector,
          hideElements: body.hideElements?.join(','),
          creditsUsed: 0,
          durationMs: Date.now() - startTime,
          errorMessage,
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          userAgent: request.headers.get('user-agent'),
        },
      });

      return NextResponse.json(
        {
          error: 'Screenshot failed',
          message: errorMessage,
        },
        { status: 500, headers }
      );
    }

    // 7. Déduire les crédits
    const creditsUsed = 1;
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        creditsUsed: subscription.creditsUsed + creditsUsed,
        creditsRemaining: subscription.creditsRemaining - creditsUsed,
      },
    });

    // 8. Créer le log d'utilisation
    const usageLog = await prisma.usageLog.create({
      data: {
        userId,
        apiKeyId,
        url: body.url,
        status: 'SUCCESS',
        format: body.format,
        viewportType: body.viewportType,
        viewportWidth: body.viewportWidth,
        viewportHeight: body.viewportHeight,
        fullPage: body.fullPage,
        waitForSelector: body.waitForSelector,
        hideElements: body.hideElements?.join(','),
        creditsUsed,
        durationMs: screenshotResult.durationMs,
        fileSizeBytes: screenshotResult.fileSizeBytes,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    });

    // 9. Retourner le screenshot
    const totalDuration = Date.now() - startTime;

    return new Response(new Uint8Array(screenshotResult.buffer), {
      status: 200,
      headers: {
        ...headers,
        'Content-Type': `image/${body.format.toLowerCase()}`,
        'Content-Length': screenshotResult.fileSizeBytes.toString(),
        'X-Screenshot-Width': screenshotResult.width.toString(),
        'X-Screenshot-Height': screenshotResult.height.toString(),
        'X-Screenshot-Format': body.format,
        'X-Processing-Time-Ms': totalDuration.toString(),
        'X-Credits-Used': creditsUsed.toString(),
        'X-Credits-Remaining': (subscription.creditsRemaining - creditsUsed).toString(),
        'X-Request-Id': usageLog.id,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Screenshot API error:', error);

    // Log l'erreur si on a l'userId
    if (userId && apiKeyId) {
      try {
        await prisma.usageLog.create({
          data: {
            userId,
            apiKeyId,
            url: 'error',
            status: 'FAILED',
            creditsUsed: 0,
            durationMs: Date.now() - startTime,
            errorMessage: error instanceof Error ? error.message : 'Internal server error',
            ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
            userAgent: request.headers.get('user-agent'),
          },
        });
      } catch (logError) {
        console.error('Error logging failed request:', logError);
      }
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred while processing your request',
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint pour vérifier le status de l'API
 */
export async function GET() {
  return NextResponse.json({
    service: 'ScreenAPI Screenshot Service',
    version: '1.0.0',
    status: 'operational',
    endpoints: {
      screenshot: 'POST /api/v1/screenshot',
    },
    documentation: '/docs',
  });
}
