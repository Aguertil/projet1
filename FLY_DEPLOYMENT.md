# 🚁 Déploiement sur Fly.io (Recommandé)

Fly.io est **LA meilleure option** pour ScreenAPI car:
- ✅ PostgreSQL inclus automatiquement
- ✅ Pas de cold starts (processus persistants)
- ✅ Meilleure performance pour Playwright
- ✅ Configuration ultra-simple (2 minutes)
- ✅ Moins cher que Vercel ($10-20/mois vs $49/mois)

## 🚀 Déploiement Complet (2 minutes)

### Étape 1: Installation Fly CLI

```bash
# macOS/Linux
curl -L https://fly.io/install.sh | sh

# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# Vérifier l'installation
fly version
```

### Étape 2: Connexion

```bash
# Se connecter (créer un compte si nécessaire - gratuit)
fly auth login
```

### Étape 3: Lancer l'Application

```bash
cd /workspace

# Tout est auto-configuré!
fly launch
```

**Fly va vous demander:**

1. **App name:** `screenapi` (ou autre)
2. **Region:** Choisir la plus proche
3. **PostgreSQL:** **OUI** ← Important
4. **Redis:** Optionnel (recommandé: OUI)

**C'est tout!** Fly va:
- Créer l'application
- Créer la base PostgreSQL
- Configurer les variables d'environnement
- Déployer automatiquement

### Étape 4: Tester

```bash
# Votre URL sera: https://screenapi.fly.dev (ou le nom choisi)

# Créer un utilisateur
curl -X POST https://screenapi.fly.dev/api/admin/setup

# Tester un screenshot
curl -X POST https://screenapi.fly.dev/api/v1/screenshot \
  -H "x-api-key: VOTRE_CLE_API" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}' \
  --output test.png
```

## 📋 Configuration Fly.io

Si `fly launch` ne détecte pas automatiquement la config, voici le fichier `fly.toml`:

```toml
# fly.toml
app = "screenapi"
primary_region = "cdg"  # Paris

[build]
  builder = "heroku/buildpacks:20"

[env]
  PORT = "8080"
  NODE_ENV = "production"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1

[[services]]
  protocol = "tcp"
  internal_port = 8080

  [[services.ports]]
    port = 80
    handlers = ["http"]
    force_https = true

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]

  [services.concurrency]
    type = "connections"
    hard_limit = 25
    soft_limit = 20

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 2048
```

## 🗄️ Configuration PostgreSQL

### Créer la Base de Données

```bash
# Si pas déjà créée lors du launch
fly postgres create
```

**Choisir:**
- Region: Même que l'app
- Configuration: Development (gratuit)

### Attacher à l'Application

```bash
fly postgres attach <postgres-app-name>
```

Fly va automatiquement:
- Créer la variable `DATABASE_URL`
- La connecter à votre app

### Exécuter les Migrations

```bash
# Se connecter via proxy
fly proxy 5432 -a <postgres-app-name>

# Dans un autre terminal
export DATABASE_URL="postgresql://postgres:...@localhost:5432/..."
npx prisma db push
```

Ou plus simple:

```bash
# SSH dans votre app
fly ssh console

# Exécuter les migrations
npx prisma db push

# Sortir
exit
```

## 🚀 Commandes Utiles

```bash
# Déployer des changements
fly deploy

# Voir les logs
fly logs

# Ouvrir l'app dans le navigateur
fly open

# Voir le status
fly status

# Scaler (ajouter plus de VMs)
fly scale count 2

# Augmenter la mémoire
fly scale memory 4096

# SSH dans l'app
fly ssh console

# Voir les secrets/variables
fly secrets list

# Ajouter un secret
fly secrets set STRIPE_SECRET_KEY=sk_live_xxx
```

## 💰 Pricing Fly.io

### Gratuit (Allowance Mensuel)
- 3 petites VMs (shared-cpu-1x)
- 3GB RAM total
- 160GB bandwidth
- ✅ **Suffisant pour démarrer!**

### Coûts Si Dépassement

| Ressource | Prix |
|-----------|------|
| shared-cpu-1x (256MB) | $1.94/mois |
| shared-cpu-1x (2GB) | ~$10/mois |
| PostgreSQL (1GB) | ~$5/mois |
| Bandwidth (100GB) | ~$2/mois |

**Total Production:** ~$10-20/mois

### Comparaison avec Vercel

| Critère | Fly.io | Vercel Pro |
|---------|--------|-----------|
| Compute | $10/mois | $20/mois |
| Database | $5/mois | $19/mois (Neon) |
| Redis | Inclus | $10/mois |
| **Total** | **$15/mois** | **$49/mois** |

**Fly.io = 70% moins cher!**

## 🎯 Optimisations

### 1. Autoscaling

```bash
# Auto-start/stop pour économiser
fly scale count 1 --max-per-region 3
```

### 2. Régions Multiples

```bash
# Déployer dans plusieurs régions
fly regions add lhr  # Londres
fly regions add iad  # US Est
```

### 3. Persistent Disk (pour cache Playwright)

```bash
# Ajouter un volume persistant
fly volumes create playwright_cache --size 10

# Modifier fly.toml
[mounts]
  source = "playwright_cache"
  destination = "/root/.cache/ms-playwright"
```

## 🐛 Troubleshooting

### App ne démarre pas

```bash
# Voir les logs détaillés
fly logs

# Vérifier le status
fly status

# Redémarrer
fly apps restart screenapi
```

### Base de données inaccessible

```bash
# Vérifier la connexion
fly postgres db list -a <postgres-app-name>

# Se connecter en CLI
fly postgres connect -a <postgres-app-name>
```

### Out of Memory

```bash
# Augmenter la RAM
fly scale memory 4096

# Ou ajouter plus de VMs
fly scale count 2
```

### Playwright ne fonctionne pas

```bash
# SSH dans l'app
fly ssh console

# Installer manuellement Playwright
npx playwright install chromium --with-deps

# Redémarrer
fly apps restart screenapi
```

## 📊 Monitoring

### Métriques Fly.io

```bash
# Dashboard web
fly dashboard

# Métriques CLI
fly status
fly logs
```

### Intégrations Monitoring

Fly.io supporte:
- Prometheus
- Grafana
- Datadog
- Sentry
- LogDNA

Configuration dans `fly.toml`:

```toml
[metrics]
  port = 9091
  path = "/metrics"
```

## 🔐 Sécurité

### Secrets

```bash
# Ajouter des secrets
fly secrets set DATABASE_URL=postgresql://...
fly secrets set NEXTAUTH_SECRET=$(openssl rand -base64 32)
fly secrets set STRIPE_SECRET_KEY=sk_live_xxx

# Lister les secrets
fly secrets list

# Supprimer un secret
fly secrets unset OLD_SECRET
```

### Firewall

Fly.io inclut un firewall automatique. Pour restreindre l'accès:

```toml
[http_service]
  # Autoriser seulement HTTPS
  force_https = true
  
  # Limiter les connexions
  [http_service.concurrency]
    type = "connections"
    hard_limit = 100
```

## 📝 Dockerfile Optimisé

Si vous voulez un contrôle total, créez un `Dockerfile`:

```dockerfile
FROM node:18-alpine

# Installer Chromium
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Variables d'environnement Playwright
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

WORKDIR /app

# Copier package files
COPY package*.json ./
COPY prisma ./prisma/

# Installer dépendances
RUN npm ci --only=production

# Copier le code
COPY . .

# Build Next.js
RUN npm run build

# Générer Prisma client
RUN npx prisma generate

EXPOSE 8080

CMD ["npm", "start"]
```

Puis:

```bash
fly deploy --dockerfile Dockerfile
```

## ✅ Checklist Déploiement

- [ ] Fly CLI installé
- [ ] Compte Fly.io créé
- [ ] `fly launch` exécuté
- [ ] PostgreSQL créé et attaché
- [ ] Migrations Prisma exécutées
- [ ] Secrets configurés
- [ ] App démarrée
- [ ] Tests API réussis
- [ ] Monitoring configuré

## 🎉 Résultat Final

Après déploiement:

✅ **Application complète en ligne**
- API de screenshots fonctionnelle
- Base de données PostgreSQL
- Pas de cold starts
- Performance optimale
- Monitoring intégré

✅ **Coûts optimisés**
- ~$10-20/mois (vs $49 sur Vercel)
- Allowance gratuit disponible
- Scaling flexible

✅ **Simple à maintenir**
- `fly deploy` pour mettre à jour
- `fly logs` pour debugger
- `fly ssh` pour accéder

---

**Fly.io = La meilleure option pour ScreenAPI! 🚁**

**Temps de déploiement:** 2-5 minutes
**Résultat:** Application 100% fonctionnelle
**Coût:** Gratuit pour démarrer
