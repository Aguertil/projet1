import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateApiKey } from '@/lib/api-key';

/**
 * Endpoint admin pour créer un utilisateur de test avec une clé API
 * À UTILISER UNIQUEMENT EN DÉVELOPPEMENT
 */
export async function POST() {
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          error: 'Not allowed in production',
          message: 'This endpoint is only available in development mode',
        },
        { status: 403 }
      );
    }

    const email = `demo@screenapi.dev`;
    const name = 'Demo User';

    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: {
        apiKeys: true,
        subscriptions: true,
      },
    });

    if (existingUser) {
      return NextResponse.json({
        message: 'User already exists',
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
        },
        apiKey: existingUser.apiKeys[0]?.key,
        subscription: existingUser.subscriptions[0],
      });
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        emailVerified: new Date(),
      },
    });

    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: 'FREE',
        status: 'ACTIVE',
        creditsTotal: 100,
        creditsUsed: 0,
        creditsRemaining: 100,
      },
    });

    const apiKeyValue = generateApiKey('live');
    const apiKey = await prisma.apiKey.create({
      data: {
        userId: user.id,
        key: apiKeyValue,
        name: 'Demo API Key',
        isActive: true,
        rateLimit: 60,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Demo user created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      apiKey: apiKey.key,
      subscription: {
        plan: subscription.plan,
        creditsTotal: subscription.creditsTotal,
        creditsRemaining: subscription.creditsRemaining,
      },
      nextSteps: [
        'Copy the API key above',
        'Use it in the x-api-key header',
        'Make a POST request to /api/v1/screenshot',
        'Check the documentation at /docs',
      ],
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      {
        error: 'Setup failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          error: 'Not allowed in production',
        },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      include: {
        apiKeys: {
          where: { isActive: true },
          take: 1,
        },
        subscriptions: {
          where: { status: 'ACTIVE' },
          take: 1,
        },
      },
    });

    return NextResponse.json({
      users: users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        apiKey: user.apiKeys[0]?.key || null,
        subscription: user.subscriptions[0] || null,
      })),
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      {
        error: 'Failed to get users',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
