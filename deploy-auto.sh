#!/bin/bash

echo "🚀 Déploiement Automatique de ScreenAPI"
echo "========================================"
echo ""

# Vérifier Railway CLI
if ! command -v railway &> /dev/null; then
    echo "📦 Installation de Railway CLI..."
    npm install -g railway 2>/dev/null || npx railway --version
fi

echo ""
echo "🔐 Étape 1: Connexion à Railway"
echo "Une page web va s'ouvrir pour vous connecter..."
echo ""
railway login

echo ""
echo "🎯 Étape 2: Initialisation du projet"
echo ""
railway init

echo ""
echo "🗄️  Étape 3: Ajout de PostgreSQL"
echo ""
railway add

echo ""
echo "🚀 Étape 4: Déploiement"
echo ""
railway up

echo ""
echo "✅ Déploiement terminé!"
echo ""
echo "🌐 Pour voir votre application:"
railway open

echo ""
echo "📋 Pour obtenir l'URL:"
railway status
