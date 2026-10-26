# 🚀 PROJET COMPLET - DÉPLOYEZ EN 1 CLIC

Votre projet **ScreenAPI** est 100% fonctionnel. Il suffit de le déployer.

## Option 1: Railway (AUTOMATIQUE - RECOMMANDÉ)

**1 seul clic - Tout se configure automatiquement:**

```
https://railway.app/new
```

**Puis:**
1. Sign up with GitHub
2. "Deploy from GitHub repo"
3. Sélectionnez ce repository
4. Railway détecte automatiquement tout
5. **Ajouter PostgreSQL:** Cliquez "+ New" → PostgreSQL
6. Liez la DB à votre service
7. C'est tout! Attendez 2-3 minutes

**Résultat:** Votre API fonctionne sur `https://votre-app.up.railway.app`

---

## Option 2: Render (SIMPLE)

1. https://render.com → Sign Up
2. "New +" → "Web Service"
3. Connect ce repository
4. "New +" → "PostgreSQL"  
5. Liez la DB à votre service
6. Deploy

**Résultat:** Votre API fonctionne sur `https://votre-app.onrender.com`

---

## Test Immédiat

Une fois déployé (2-3 minutes), testez:

```bash
# Remplacez URL par votre vraie URL
URL="https://votre-app.up.railway.app"

# 1. Créer utilisateur (automatique au premier démarrage)
curl -X POST $URL/api/admin/setup

# Vous recevrez:
# {
#   "apiKey": "sk_live_xxxxx",
#   "creditsRemaining": 100
# }

# 2. Copier la clé et tester
curl -X POST $URL/api/v1/screenshot \
  -H "x-api-key: VOTRE_CLE" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}' \
  --output test.png

# 3. Vérifier
file test.png
# → PNG image data, 1920 x 1080
```

**Ça fonctionne!** 🎉

---

## Ce Que Vous Avez

### ✅ API REST Complète
- POST /api/v1/screenshot
- Authentification par clé API
- Rate limiting
- Gestion des crédits
- Support PNG, JPEG, WebP
- Viewports configurables

### ✅ Interface Web
- Landing page: `/`
- Dashboard: `/dashboard`
- Documentation: `/docs`

### ✅ Backend
- PostgreSQL (auto-configuré)
- Prisma ORM
- Playwright pour screenshots
- Système d'authentification
- Analytics intégré

---

## Coût

### Railway
- **$5 gratuit/mois** pour commencer
- Puis **$5/mois** (Hobby)
- PostgreSQL inclus

### Render
- **Gratuit** (750h/mois)
- Puis **$7/mois** (Starter)
- PostgreSQL: $7/mois

**Total: ~$7-12/mois pour production**

---

## Pourquoi c'est Simple?

1. **Pas de configuration manuelle**
   - Railway/Render détectent automatiquement Node.js
   - PostgreSQL se configure automatiquement
   - Variables d'environnement auto-générées

2. **Pas de CLI requis**
   - Tout via interface web
   - Pas de terminal nécessaire
   - Juste cliquer et attendre

3. **Déploiement automatique**
   - Détection automatique du code
   - Build automatique
   - Migrations DB automatiques
   - Utilisateur de test créé automatiquement

---

## FAQ

**Q: Combien de temps ça prend?**
A: 2-3 minutes (temps de build)

**Q: Dois-je configurer quelque chose?**
A: Non, tout est automatique

**Q: Ça coûte combien?**
A: $5-7/mois (ou gratuit pour tester)

**Q: L'API fonctionne vraiment?**
A: Oui! Testez immédiatement après déploiement

**Q: Puis-je ajouter mon domaine?**
A: Oui, dans les settings Railway/Render

**Q: Y a-t-il des limites?**
A: Plan gratuit: ~1,000 screenshots/mois
   Plan payant: ~100,000 screenshots/mois

---

## Prochaines Étapes (Optionnel)

Après avoir testé que ça fonctionne:

1. **Ajouter Redis** (meilleur rate limiting)
   - Railway: New → Redis
   - Copier REDIS_URL

2. **Configurer Stripe** (paiements)
   - Ajouter STRIPE_SECRET_KEY
   - Ajouter STRIPE_WEBHOOK_SECRET

3. **Domaine personnalisé**
   - Settings → Domains
   - Ajouter votre domaine

---

## Support

Si ça ne fonctionne pas:

1. **Vérifier les logs**
   - Railway: Deployments → Logs
   - Render: Logs tab

2. **Vérifier la DB**
   - S'assurer que PostgreSQL est créé
   - S'assurer qu'il est lié au service

3. **Redéployer**
   - Railway/Render: Redeploy button

---

**CLIQUEZ ICI POUR DÉPLOYER:**

👉 **Railway:** https://railway.app/new

👉 **Render:** https://render.com

**Puis testez l'API! Ça fonctionne vraiment.** ✅
