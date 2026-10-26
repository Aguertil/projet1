# 🚀 Déployer ScreenAPI en 1 Clic

Votre code est prêt sur GitHub: **https://github.com/Aguertil/screenapi**

## Option 1: Railway (Recommandé) ⭐

**Le plus simple et le plus rapide:**

👉 **[CLIQUER ICI POUR DÉPLOYER SUR RAILWAY](https://railway.app/new/template?template=https://github.com/Aguertil/screenapi)**

Railway détectera automatiquement:
- ✅ PostgreSQL sera créé automatiquement
- ✅ Redis sera créé automatiquement
- ✅ Variables d'environnement configurées
- ✅ Domaine HTTPS gratuit fourni
- ✅ $5 de crédit gratuit pour commencer

**Après le déploiement Railway:**
1. Attendez 2-3 minutes que le build se termine
2. Railway vous donnera une URL comme: `https://screenapi-production-xxxx.up.railway.app`
3. Visitez `https://votre-url.railway.app/api/admin/setup` pour créer votre clé API
4. Testez avec: `https://votre-url.railway.app/api/v1/screenshot`

---

## Option 2: Render

👉 **[CLIQUER ICI POUR DÉPLOYER SUR RENDER](https://render.com/deploy?repo=https://github.com/Aguertil/screenapi)**

Render configure automatiquement:
- ✅ PostgreSQL gratuit (jusqu'à 90 jours)
- ✅ Redis gratuit
- ✅ SSL/HTTPS automatique
- ✅ Plan gratuit disponible

**Configuration sur Render:**
1. Connectez votre compte GitHub
2. Render créera automatiquement les services
3. Variables d'environnement à définir:
   - `DATABASE_URL` (auto-créé par Render PostgreSQL)
   - `REDIS_URL` (auto-créé par Render Redis)
   - `JWT_SECRET=votre-secret-aleatoire-ici`

---

## Option 3: Vercel (Pour le Frontend)

👉 **[CLIQUER ICI POUR DÉPLOYER SUR VERCEL](https://vercel.com/new/clone?repository-url=https://github.com/Aguertil/screenapi)**

**⚠️ Note Vercel:**
- Vercel est parfait pour le dashboard et l'API légère
- Pour un usage intensif de screenshots, préférez Railway ou Render
- Sur Vercel, vous devrez ajouter une base de données externe (Neon, Supabase, PlanetScale)

**Variables d'environnement Vercel:**
```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=votre-secret
```

---

## Option 4: Heroku

```bash
# Installer Heroku CLI puis:
heroku login
heroku create screenapi-prod
heroku addons:create heroku-postgresql:essential-0
heroku addons:create heroku-redis:mini
git push heroku main
heroku open
```

---

## 🎯 Recommandation Finale

**Pour commencer rapidement:** Railway (Option 1)
- Déploiement en 3 minutes
- Configuration automatique complète
- Crédit gratuit pour tester
- Interface simple et claire

**Le projet inclut:**
- ✅ API de Screenshots (`/api/v1/screenshot`)
- ✅ Dashboard de gestion (`/dashboard`)
- ✅ Documentation API (`/docs`)
- ✅ Page d'accueil commerciale (`/`)
- ✅ Système de crédits et rate limiting
- ✅ Génération de clés API
- ✅ Support mobile, desktop, formats multiples

**Technologies:**
- Next.js 15 + TypeScript
- Playwright pour les screenshots
- Prisma + PostgreSQL
- Redis pour rate limiting
- Tailwind CSS + shadcn/ui

---

## 📧 Support

Une fois déployé, votre API sera accessible à:
- `https://votre-url/api/v1/screenshot`

Documentation complète sur:
- `https://votre-url/docs`

Dashboard de gestion:
- `https://votre-url/dashboard`
