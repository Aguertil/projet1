# Déploiement sur Vercel

Ce guide explique comment déployer ScreenAPI sur Vercel.

## ⚠️ Limitations Importantes

### Playwright sur Vercel
- **Taille du bundle**: Chromium est lourd (~150MB), proche de la limite Vercel (250MB)
- **Timeout**: Maximum 60 secondes sur plan Pro (10s sur plan Hobby)
- **Mémoire**: Nécessite au moins 1024MB, recommandé 3008MB
- **Cold starts**: Première requête peut prendre 10-15 secondes

### Recommandations
Pour un service de screenshots en production, **Fly.io ou AWS Lambda** sont plus adaptés car:
- Pas de limite de taille de bundle stricte
- Processus persistants (pas de cold starts)
- Meilleure performance pour Playwright
- Coûts plus prévisibles

## 🚀 Déploiement Rapide

### 1. Prérequis

- Compte Vercel (gratuit: https://vercel.com/signup)
- Plan Pro recommandé pour timeouts de 60s
- Base de données PostgreSQL (Neon, Supabase, ou Vercel Postgres)
- Redis (Upstash recommandé)

### 2. Installation Vercel CLI

```bash
npm install -g vercel
# ou utiliser le CLI local
npx vercel
```

### 3. Connexion à Vercel

```bash
npx vercel login
```

### 4. Variables d'Environnement

Avant de déployer, configurez ces variables dans le dashboard Vercel:

#### Base de Données (REQUIS)
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

**Providers recommandés:**
- [Neon](https://neon.tech) - PostgreSQL serverless gratuit
- [Supabase](https://supabase.com) - PostgreSQL avec auth
- [Vercel Postgres](https://vercel.com/storage/postgres)

#### Redis (RECOMMANDÉ)
```
REDIS_URL=rediss://default:xxx@xxx.upstash.io:6379
```

**Provider recommandé:**
- [Upstash](https://upstash.com) - Redis serverless gratuit

#### NextAuth (REQUIS)
```
NEXTAUTH_URL=https://votre-app.vercel.app
NEXTAUTH_SECRET=votre-secret-genere-avec-openssl
```

Générer un secret:
```bash
openssl rand -base64 32
```

#### Application (RECOMMANDÉ)
```
NEXT_PUBLIC_APP_NAME=ScreenAPI
NEXT_PUBLIC_APP_URL=https://votre-app.vercel.app
```

#### Stripe (OPTIONNEL)
```
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_PRICE_ID_PRO=price_xxx
STRIPE_PRICE_ID_ENTERPRISE=price_xxx
```

### 5. Déployer

```bash
# Mode preview (branche actuelle)
npx vercel

# Mode production
npx vercel --prod
```

### 6. Configuration Post-Déploiement

#### A. Configurer la Base de Données

```bash
# Se connecter à votre déploiement
npx vercel env pull .env.production

# Exécuter les migrations Prisma
DATABASE_URL="votre-url-postgres" npx prisma db push
```

#### B. Tester l'API

```bash
# Créer un utilisateur de test
curl -X POST https://votre-app.vercel.app/api/admin/setup

# Tester un screenshot
curl -X POST https://votre-app.vercel.app/api/v1/screenshot \
  -H "x-api-key: sk_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}' \
  --output screenshot.png
```

## ⚙️ Configuration Vercel

Le fichier `vercel.json` contient:

```json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 60,      // 60s (Pro plan requis)
      "memory": 3008          // Maximum memory
    }
  }
}
```

### Optimisations

1. **Augmenter le timeout** (Plan Pro uniquement):
   - Hobby: 10s max
   - Pro: 60s max
   - Enterprise: 900s max

2. **Augmenter la mémoire**:
   - Minimum recommandé: 1024MB
   - Optimal pour screenshots: 3008MB

3. **Régions**:
   - Par défaut: Toutes les régions Edge
   - Peut être limité à des régions spécifiques pour réduire les coûts

## 📊 Monitoring

### Logs Vercel

```bash
# Voir les logs en temps réel
npx vercel logs --follow

# Logs de production
npx vercel logs --prod
```

### Métriques

Dashboard Vercel fournit:
- Temps d'exécution des fonctions
- Taux d'erreur
- Utilisation mémoire
- Bandwidth

## 🐛 Troubleshooting

### Erreur: "Function size exceeded"

Le bundle Chromium est trop gros. Solutions:
1. Vérifier que `@sparticuz/chromium` est bien utilisé
2. Exclure les fichiers inutiles avec `.vercelignore`
3. Considérer un déploiement sur Fly.io

### Erreur: "Task timed out after 10 seconds"

Vous êtes sur le plan Hobby. Solutions:
1. Upgrader vers Pro pour 60s timeout
2. Réduire `waitForTimeout` dans les requêtes
3. Utiliser `fullPage: false` pour capturer plus vite

### Erreur: "Out of memory"

La fonction manque de mémoire. Solutions:
1. Augmenter `memory` dans `vercel.json` à 3008MB
2. Fermer le browser après chaque capture
3. Éviter les captures de pages très lourdes

### Cold Starts Longs

Première requête prend 10-15s. C'est normal pour Playwright serverless.
Solutions:
1. Utiliser un service de warm-up (ping périodique)
2. Migrer vers Fly.io pour processus persistants
3. Accepter le cold start (acceptable pour usage non temps-réel)

## 💰 Coûts Vercel

### Plan Hobby (Gratuit)
- 100GB bandwidth
- 100 heures compute
- Timeout 10s
- ⚠️ Insuffisant pour production

### Plan Pro ($20/mois)
- 1TB bandwidth
- 1000 heures compute  
- Timeout 60s
- ✅ Adapté pour démarrer

### Estimation (1M screenshots/mois)
- Compute: ~500h à $40/1000h = $20
- Bandwidth: ~50GB (si images petites) = inclus
- **Total: ~$20-40/mois**

## 🔄 CI/CD

Vercel détecte automatiquement:
- **Commits sur main** → Déploiement production
- **Pull requests** → Déploiement preview
- **Autres branches** → Déploiement preview

Pas de configuration nécessaire!

## 🌐 Domaine Personnalisé

1. Aller dans Project Settings → Domains
2. Ajouter votre domaine: `api.votredomaine.com`
3. Configurer les DNS selon les instructions
4. Mettre à jour `NEXTAUTH_URL` et `NEXT_PUBLIC_APP_URL`

## 🔐 Sécurité

### Variables d'Environnement

- Toujours utiliser les variables Vercel (sécurisées)
- Ne JAMAIS committer `.env` avec des vrais secrets
- Utiliser différentes clés pour preview/production

### Rate Limiting

Avec Redis Upstash, le rate limiting fonctionne globalement sur toutes les régions.

## 📝 Checklist de Déploiement

Avant de déployer en production:

- [ ] Base de données PostgreSQL configurée
- [ ] Redis Upstash configuré (optionnel mais recommandé)
- [ ] Toutes les variables d'environnement définies
- [ ] `NEXTAUTH_SECRET` généré de manière sécurisée
- [ ] Plan Vercel Pro activé (pour timeout 60s)
- [ ] Migrations Prisma exécutées
- [ ] Test de l'API admin/setup réussi
- [ ] Test de capture screenshot réussi
- [ ] Monitoring configuré
- [ ] Domaine personnalisé configuré (optionnel)

## 🚀 Alternative Recommandée: Fly.io

Si vous rencontrez des limitations sur Vercel, Fly.io est une excellente alternative:

### Avantages Fly.io
- Pas de cold starts
- Processus persistants
- Meilleure performance Playwright
- Moins cher pour usage intensif
- Plus de contrôle

### Déploiement Fly.io

```bash
# Installer flyctl
curl -L https://fly.io/install.sh | sh

# Se connecter
fly auth login

# Lancer l'app
fly launch

# Déployer
fly deploy
```

Voir `FLY_DEPLOYMENT.md` pour le guide complet.

---

**Support:** Consultez [ARCHITECTURE.md](ARCHITECTURE.md) pour plus de détails techniques.
