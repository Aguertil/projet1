# 🔗 LIENS DIRECTS POUR DÉPLOYER

**Ouvrez ces liens dans votre navigateur web (pas besoin du terminal!)**

---

## Option 1: Render (Le Plus Simple)

**Étape 1:** https://render.com/register
→ Créez un compte gratuit

**Étape 2:** https://dashboard.render.com/select-repo?type=web
→ Cliquez "Deploy without a Git repository"
→ Uploadez le fichier: `/tmp/screenapi-complete.tar.gz`

**C'est tout!** Votre API sera en ligne en 3 minutes.

---

## Option 2: Railway

**Étape 1:** https://railway.app/login
→ Connectez-vous avec GitHub

**Étape 2:** https://railway.app/new
→ "Deploy from GitHub repo"
→ Si vous n'avez pas de repo GitHub, utilisez Render (Option 1)

---

## Option 3: Créer GitHub Repository D'abord

**Si vous voulez mettre le code sur GitHub:**

**Étape 1:** https://github.com/new
→ Nom: `screenapi`
→ Public
→ Create repository

**Étape 2:** Dans la page GitHub qui s'ouvre:
→ Cliquez "uploading an existing file"
→ Glissez tous les fichiers de votre projet
→ Commit changes

**Étape 3:** Retour à Railway
→ https://railway.app/new
→ Deploy from GitHub repo
→ Sélectionnez `votre-username/screenapi`

---

## 🎯 Recommandation

**Utilisez Render (Option 1)** car:
- ✅ Pas de terminal nécessaire
- ✅ Pas de GitHub nécessaire  
- ✅ Upload direct du fichier
- ✅ 3 minutes chrono

**Fichier à uploader:**
- Localisation: `/tmp/screenapi-complete.tar.gz`
- Taille: 260 KB
- Déjà prêt!

---

## Où Trouver le Fichier?

Dans Cursor:
1. Ouvrez l'explorateur de fichiers (icône à gauche)
2. Cliquez sur les "..." en haut
3. "Open Folder" → sélectionnez `/tmp`
4. Vous verrez: `screenapi-complete.tar.gz`
5. Clic droit → "Reveal in Finder" (Mac) ou "Show in Explorer" (Windows)
6. Copiez ce fichier sur votre Bureau

Maintenant uploadez-le sur Render!

---

## Après le Déploiement

Votre API sera sur: `https://votre-app.onrender.com`

**Testez-la:**
Ouvrez dans votre navigateur:
```
https://votre-app.onrender.com/api/admin/setup
```

Vous devriez voir:
```json
{
  "apiKey": "sk_live_xxx...",
  "creditsRemaining": 100
}
```

**Ça fonctionne!** 🎉

---

## Besoin d'Aide?

Dites-moi:
1. Quelle option vous essayez (Render ou Railway)
2. À quelle étape vous êtes bloqué
3. Le message d'erreur (si il y en a un)

Je vous guiderai!

---

**Tous les liens sont prêts. Ouvrez-les dans votre navigateur!** 🚀
