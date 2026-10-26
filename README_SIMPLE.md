# ScreenAPI - API de Screenshots Professionnelle

## 🚀 Déployer en 1 Clic

**Cliquez sur ce bouton pour déployer votre propre instance:**

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/railwayapp-templates/nextjs-prisma&plugins=postgresql&envs=NEXTAUTH_SECRET&NEXTAUTH_SECRETDesc=Secret+for+NextAuth)

**OU**

### Option 2: Render

1. Allez sur https://render.com
2. Cliquez "New +" → "Web Service"  
3. Connectez ce repository
4. Tout se configure automatiquement!

### Option 3: Ligne de commande

```bash
# Railway
npx railway login
npx railway up

# Ou Render
npx render-cli deploy
```

---

## ✅ Ce Que Vous Obtenez

Une API complète de screenshots avec:

### 🎯 API REST

```bash
POST /api/v1/screenshot
```

**Fonctionnalités:**
- ✅ PNG, JPEG, WebP
- ✅ Desktop, Mobile, Tablet viewports
- ✅ Full-page screenshots
- ✅ Masquage d'éléments
- ✅ Blocage cookies/publicités
- ✅ Rate limiting
- ✅ Système de crédits

### 🖥️ Interface Web

- **Landing Page**: Page d'accueil moderne
- **Dashboard**: Gérez vos clés API et crédits
- **Documentation**: Guide API complet

### 💾 Backend Complet

- **PostgreSQL**: Base de données auto-configurée
- **Prisma ORM**: Gestion de la DB
- **Playwright**: Moteur de screenshots
- **Rate Limiting**: Protection anti-abuse
- **Authentification**: Clés API sécurisées

---

## 🧪 Tester l'API

Après déploiement:

```bash
# 1. Obtenir votre clé API (créée automatiquement)
curl https://votre-app.up.railway.app/api/admin/setup

# 2. Tester un screenshot
curl -X POST https://votre-app.up.railway.app/api/v1/screenshot \
  -H "x-api-key: VOTRE_CLE_API" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "format": "PNG",
    "viewportType": "DESKTOP"
  }' \
  --output screenshot.png
```

---

## 📋 Exemples d'Utilisation

### Node.js

```javascript
const response = await fetch('https://votre-app/api/v1/screenshot', {
  method: 'POST',
  headers: {
    'x-api-key': 'sk_live_xxx',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://example.com',
    format: 'PNG'
  })
});

const buffer = await response.arrayBuffer();
fs.writeFileSync('screenshot.png', Buffer.from(buffer));
```

### Python

```python
import requests

response = requests.post(
    'https://votre-app/api/v1/screenshot',
    headers={'x-api-key': 'sk_live_xxx'},
    json={'url': 'https://example.com', 'format': 'PNG'}
)

with open('screenshot.png', 'wb') as f:
    f.write(response.content)
```

### PHP

```php
$ch = curl_init('https://votre-app/api/v1/screenshot');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'url' => 'https://example.com',
    'format' => 'PNG'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'x-api-key: sk_live_xxx',
    'Content-Type: application/json'
]);
$response = curl_exec($ch);
file_put_contents('screenshot.png', $response);
```

---

## 💰 Coûts

### Railway
- **Gratuit**: $5 de crédit/mois
- **Hobby**: $5/mois
- **Suffisant pour**: 1,000-10,000 screenshots/mois

### Render
- **Gratuit**: 750 heures/mois
- **Starter**: $7/mois
- **Suffisant pour**: 1,000-10,000 screenshots/mois

---

## ⚙️ Configuration (Optionnel)

Toutes ces variables sont **automatiquement configurées**. 

Pour personnaliser:

### Variables d'environnement

```env
# Auto-configurées par Railway/Render
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=généré-automatiquement

# Optionnelles
REDIS_URL=redis://...  # Pour meilleur rate limiting
STRIPE_SECRET_KEY=sk_live_...  # Pour paiements
```

### Ajouter Redis (optionnel)

1. Railway: New → Redis
2. Copier REDIS_URL
3. Ajouter comme variable

### Ajouter Stripe (optionnel)

1. Créer compte Stripe
2. Ajouter: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

---

## 📚 Documentation Complète

- **API Reference**: `/docs` sur votre app
- **Architecture**: Voir [ARCHITECTURE.md](ARCHITECTURE.md)
- **Exemples**: Voir [EXAMPLES.md](EXAMPLES.md)
- **README complet**: Voir [README.md](README.md)

---

## 🔧 Développement Local

```bash
# Cloner
git clone <votre-repo>
cd screenapi

# Installer
npm install
npx playwright install chromium

# Setup DB
npx prisma db push

# Démarrer
npm run dev
```

Visitez: http://localhost:43210

---

## 🆘 Support

- **Issues**: GitHub Issues
- **Documentation**: `/docs` dans l'app
- **Email**: support@votre-domaine.com

---

## ⭐ Fonctionnalités

- [x] API REST complète
- [x] Authentification API key
- [x] Rate limiting
- [x] Système de crédits
- [x] 3 plans (Free, Pro, Enterprise)
- [x] Interface web
- [x] Documentation interactive
- [x] PostgreSQL
- [x] Playwright screenshots
- [x] Multi-format (PNG, JPEG, WebP)
- [x] Multi-viewport (Desktop, Mobile, Tablet)
- [x] Options avancées (full-page, masquage, etc.)

---

## 📜 License

MIT

---

**Déployez maintenant en 1 clic! 🚀**

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)
