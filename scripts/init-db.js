#!/usr/bin/env node

/**
 * Script d'initialisation automatique de la base de données
 * Crée un utilisateur de test avec une clé API si la DB est vide
 */

const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

function generateApiKey() {
  const randomPart = crypto.randomBytes(32).toString('hex');
  return `sk_live_${randomPart}`;
}

async function initDatabase() {
  try {
    console.log('🔍 Vérification de la base de données...');

    // Vérifier si des utilisateurs existent
    const userCount = await prisma.user.count();

    if (userCount > 0) {
      console.log('✅ Base de données déjà initialisée');
      return;
    }

    console.log('🔨 Initialisation de la base de données...');

    // Créer un utilisateur de démo
    const user = await prisma.user.create({
      data: {
        email: 'demo@screenapi.dev',
        name: 'Demo User',
        emailVerified: new Date(),
      },
    });

    console.log('✅ Utilisateur créé:', user.email);

    // Créer un abonnement FREE
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

    console.log('✅ Abonnement créé:', subscription.plan);

    // Créer une clé API
    const apiKeyValue = generateApiKey();
    const apiKey = await prisma.apiKey.create({
      data: {
        userId: user.id,
        key: apiKeyValue,
        name: 'Default API Key',
        isActive: true,
        rateLimit: 60,
      },
    });

    console.log('✅ Clé API créée');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Base de données initialisée avec succès!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('📋 Informations de connexion:');
    console.log('');
    console.log('  Email:', user.email);
    console.log('  API Key:', apiKeyValue);
    console.log('');
    console.log('🧪 Pour tester l\'API:');
    console.log('');
    console.log(`  curl -X POST \${APP_URL}/api/v1/screenshot \\`);
    console.log(`    -H "x-api-key: ${apiKeyValue}" \\`);
    console.log(`    -H "Content-Type: application/json" \\`);
    console.log(`    -d '{"url": "https://example.com"}' \\`);
    console.log(`    --output screenshot.png`);
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

initDatabase();
