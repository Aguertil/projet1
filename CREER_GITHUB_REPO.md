# 🔧 Créer votre Repository GitHub

## Étape 1: Créer le Repository sur GitHub

1. **Allez sur:** https://github.com/new
2. **Nom du repository:** `screenapi` (ou autre nom)
3. **Description:** `API de Screenshots Professionnelle`
4. **Visibilité:** Public (pour pouvoir déployer gratuitement)
5. **NE PAS** initialiser avec README, .gitignore, ou license
6. **Cliquez:** "Create repository"

## Étape 2: Pousser le Code

GitHub va vous donner des commandes. Utilisez celles-ci:

```bash
cd /workspace

# Ajouter GitHub comme remote
git remote add github https://github.com/VOTRE-USERNAME/screenapi.git

# Pousser le code
git push github main

# Ou si vous voulez remplacer origin
git remote remove origin
git remote add origin https://github.com/VOTRE-USERNAME/screenapi.git
git push -u origin main
```

## Étape 3: Déployer sur Railway

Une fois le code sur GitHub:

1. **Railway:** https://railway.app/new
2. **"Deploy from GitHub repo"**
3. Sélectionnez `VOTRE-USERNAME/screenapi`
4. Ajoutez PostgreSQL
5. C'est tout!

---

## Alternative: Télécharger et Uploader

Si vous préférez:

1. **Téléchargez le code:**
   ```bash
   cd /workspace
   tar -czf screenapi.tar.gz --exclude=node_modules --exclude=.next --exclude=.git .
   ```

2. **Sur GitHub:**
   - Créez un nouveau repository
   - Utilisez l'interface web pour uploader les fichiers

3. **Ou clonez localement:**
   ```bash
   # Sur votre machine locale
   git clone https://origin.cursor.com/git/mohamed-baabouz/tmp-56f5dda676a6a09c.git screenapi
   cd screenapi
   git remote remove origin
   git remote add origin https://github.com/VOTRE-USERNAME/screenapi.git
   git push -u origin main
   ```

---

## Vérification

Après avoir poussé sur GitHub, vérifiez:

✅ Allez sur: `https://github.com/VOTRE-USERNAME/screenapi`
✅ Vous devriez voir tous les fichiers
✅ Cliquez sur "Code" → vous voyez le README.md
✅ Le bouton Railway devrait être visible

---

## Déploiement Immédiat

Une fois sur GitHub, déployez immédiatement:

**Railway:**
```
https://railway.app/new/template?template=https://github.com/VOTRE-USERNAME/screenapi
```

**Render:**
1. https://render.com
2. "New +" → "Web Service"  
3. Connectez GitHub
4. Sélectionnez votre repository

---

**Besoin d'aide?** Dites-moi si vous avez une erreur à l'une de ces étapes.
