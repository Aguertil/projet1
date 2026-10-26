#!/bin/bash

# 🚀 Script de Déploiement Production Automatique
# Configure et déploie ScreenAPI sur Vercel avec PostgreSQL

set -e

echo "🚀 ScreenAPI - Déploiement Production Automatique"
echo "=================================================="
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier les prérequis
echo "📋 Vérification des prérequis..."

if ! command -v npx &> /dev/null; then
    echo -e "${RED}❌ npm/npx n'est pas installé${NC}"
    exit 1
fi

if ! command -v openssl &> /dev/null; then
    echo -e "${RED}❌ openssl n'est pas installé${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prérequis installés${NC}"
echo ""

# Connexion Vercel
echo "🔐 Connexion à Vercel..."
if ! npx vercel whoami &> /dev/null; then
    echo "Veuillez vous connecter à Vercel:"
    npx vercel login
else
    echo -e "${GREEN}✅ Déjà connecté à Vercel${NC}"
fi
echo ""

# Lier le projet
echo "🔗 Liaison du projet Vercel..."
if [ ! -f ".vercel/project.json" ]; then
    npx vercel link
else
    echo -e "${GREEN}✅ Projet déjà lié${NC}"
fi
echo ""

# Configuration DATABASE_URL
echo "📊 Configuration de la base de données..."
echo ""
echo -e "${YELLOW}IMPORTANT: Vous devez créer une base PostgreSQL gratuite${NC}"
echo ""
echo "Option 1 - Neon (Recommandé):"
echo "  1. Allez sur: https://console.neon.tech/signup"
echo "  2. Créez un compte (gratuit)"
echo "  3. Créez un projet"
echo "  4. Copiez la 'Connection String'"
echo ""
echo "Option 2 - Supabase:"
echo "  1. Allez sur: https://supabase.com/dashboard/sign-up"
echo "  2. Créez un projet"
echo "  3. Settings → Database → Connection String (Session mode)"
echo ""
read -p "Avez-vous créé une base de données? (o/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[OoYy]$ ]]; then
    echo -e "${YELLOW}⚠️  Veuillez créer une base de données et relancer ce script${NC}"
    exit 1
fi

echo ""
read -p "Entrez votre DATABASE_URL PostgreSQL: " DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL ne peut pas être vide${NC}"
    exit 1
fi

# Générer NEXTAUTH_SECRET
echo ""
echo "🔑 Génération de NEXTAUTH_SECRET..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo -e "${GREEN}✅ Secret généré${NC}"

# Demander NEXTAUTH_URL
echo ""
echo "🌐 Configuration NEXTAUTH_URL..."
echo "Ceci sera votre URL de production Vercel"
echo "Format: https://votre-app.vercel.app"
read -p "Entrez votre URL Vercel (ou laissez vide pour configurer plus tard): " NEXTAUTH_URL

# Configurer les variables d'environnement
echo ""
echo "⚙️  Configuration des variables d'environnement Vercel..."

echo "$DATABASE_URL" | npx vercel env add DATABASE_URL production
echo -e "${GREEN}✅ DATABASE_URL configuré${NC}"

echo "$NEXTAUTH_SECRET" | npx vercel env add NEXTAUTH_SECRET production
echo -e "${GREEN}✅ NEXTAUTH_SECRET configuré${NC}"

if [ ! -z "$NEXTAUTH_URL" ]; then
    echo "$NEXTAUTH_URL" | npx vercel env add NEXTAUTH_URL production
    echo -e "${GREEN}✅ NEXTAUTH_URL configuré${NC}"
fi

# Exécuter les migrations
echo ""
echo "🗄️  Exécution des migrations Prisma..."
export DATABASE_URL="$DATABASE_URL"
npx prisma db push --skip-generate

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migrations réussies${NC}"
else
    echo -e "${RED}❌ Erreur lors des migrations${NC}"
    exit 1
fi

# Déployer
echo ""
echo "🚀 Déploiement sur Vercel..."
npx vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo -e "${GREEN}✅ DÉPLOIEMENT RÉUSSI!${NC}"
    echo "=========================================="
    echo ""
    echo "🎉 Votre application est maintenant en ligne!"
    echo ""
    echo "📝 Prochaines étapes:"
    echo "  1. Visitez votre application sur Vercel"
    echo "  2. Testez: curl -X POST https://votre-app.vercel.app/api/admin/setup"
    echo "  3. Copiez la clé API retournée"
    echo "  4. Testez un screenshot avec cette clé"
    echo ""
    echo "📚 Documentation:"
    echo "  - Guide complet: README.md"
    echo "  - API: /docs sur votre site"
    echo "  - Exemples: EXAMPLES.md"
    echo ""
else
    echo -e "${RED}❌ Erreur lors du déploiement${NC}"
    exit 1
fi
