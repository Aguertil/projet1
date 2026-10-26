# 🚀 Déployer SANS GitHub (Railway CLI)

## Option la Plus Simple: Railway CLI

Vous pouvez déployer directement depuis ce code, sans GitHub!

### Étape 1: Installer Railway CLI

```bash
# Dans le terminal Cursor
npm install -g railway
```

### Étape 2: Se Connecter

```bash
railway login
```

Une page web s'ouvrira pour vous connecter (créez un compte gratuit si besoin).

### Étape 3: Déployer!

```bash
cd /workspace

# Initialiser le projet Railway
railway init

# Ajouter PostgreSQL
railway add postgresql

# Déployer
railway up
```

**C'est tout!** Votre app sera en ligne en 2-3 minutes.

### Étape 4: Obtenir l'URL

```bash
# Voir l'URL de votre app
railway open
```

Votre API sera accessible sur: `https://votre-app.up.railway.app`

---

## Commandes Utiles

```bash
# Voir les logs
railway logs

# Ouvrir le dashboard
railway open

# Ajouter une variable
railway variables set STRIPE_KEY=sk_xxx

# Redéployer
railway up
```

---

## Avantages

✅ **Pas besoin de GitHub**
✅ **Déploiement direct depuis le code**
✅ **PostgreSQL inclus automatiquement**
✅ **Plus rapide** (2 minutes vs 10 minutes avec GitHub)

---

## Alternative: Render sans GitHub

Render peut aussi déployer depuis un fichier local:

```bash
# Créer une archive
cd /workspace
tar -czf screenapi.tar.gz \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.git \
  --exclude=prisma/dev.db \
  .

# Uploader sur Render via leur interface web
# https://render.com → New → Web Service → Upload archive
```

---

## Si Railway CLI Ne Fonctionne Pas

Utilisez le **GitHub workflow** (voir CREER_GITHUB_REPO.md):

1. Créer repository GitHub (2 min)
2. Pousser le code (1 commande)
3. Déployer depuis GitHub (1 clic)

---

**Recommandation:** Utilisez Railway CLI - c'est le plus simple!
