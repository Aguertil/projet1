# 🚀 Déploiement en 1 Clic

## Option 1: Railway (RECOMMANDÉ - Automatique)

**Cliquez simplement sur ce bouton:**

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/screenapi?referralCode=bonus)

**Ce qui se passe automatiquement:**
1. ✅ Création de votre compte Railway (gratuit)
2. ✅ Fork du projet
3. ✅ Création automatique de PostgreSQL
4. ✅ Configuration des variables d'environnement
5. ✅ Build et déploiement
6. ✅ **Application fonctionnelle en 2 minutes!**

**Après le déploiement:**
```bash
# Votre app sera sur: https://votre-app.up.railway.app

# Tester l'API
curl -X POST https://votre-app.up.railway.app/api/admin/setup
# → Retourne votre clé API

curl -X POST https://votre-app.up.railway.app/api/v1/screenshot \
  -H "x-api-key: VOTRE_CLE" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}' \
  --output screenshot.png
```

**Coût:** $5 de crédit gratuit/mois (suffisant pour tester)

---

## Option 2: Render (Également Simple)

1. **Créer un compte:** https://render.com/
2. **New → Web Service**
3. **Connecter ce repository GitHub**
4. Render détecte automatiquement Node.js
5. **Ajouter PostgreSQL:** New → PostgreSQL
6. **Lier la DB** à votre service
7. **Deploy**

**Tout est automatique!**

---

## Option 3: Fly.io (Pour les Experts)

```bash
curl -L https://fly.io/install.sh | sh
fly auth login
fly launch --yes
```

---

## 🎯 Pourquoi Railway?

| Critère | Railway | Vercel | Fly.io |
|---------|---------|--------|--------|
| **Setup** | 1 clic | Manuel | CLI |
| **PostgreSQL** | Auto | Manuel | Auto |
| **Configuration** | 0 | 5-10 min | 2 min |
| **Coût gratuit** | $5/mois | Limité | 3 VMs |
| **Facilité** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |

**Railway = Le plus simple pour démarrer**

---

## ✅ Après le Déploiement

Votre application inclut:

1. **API de Screenshots**
   - POST /api/v1/screenshot
   - Support PNG, JPEG, WebP
   - Viewports configurables
   - Options avancées

2. **Interface Web**
   - Landing page: https://votre-app.up.railway.app
   - Dashboard: https://votre-app.up.railway.app/dashboard
   - Docs: https://votre-app.up.railway.app/docs

3. **Base de Données**
   - PostgreSQL configuré automatiquement
   - Tables créées automatiquement
   - Prêt à utiliser

---

## 🔧 Configuration Optionnelle

### Ajouter Redis (pour meilleur rate limiting)

Dans Railway dashboard:
1. New → Redis
2. Copier REDIS_URL
3. Ajouter comme variable d'environnement

### Ajouter Stripe (pour paiements)

1. Créer compte Stripe
2. Ajouter ces variables dans Railway:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Domaine Personnalisé

1. Railway dashboard → Settings → Domains
2. Ajouter votre domaine
3. Configurer les DNS selon les instructions

---

## 🆘 Support

Si problème après déploiement:

1. **Voir les logs:** Railway dashboard → Deployments → Logs
2. **Redéployer:** Railway dashboard → Deployments → Redeploy
3. **Variables:** Railway dashboard → Variables

---

**Cliquez sur le bouton Railway ci-dessus pour déployer en 1 clic! 🚀**
