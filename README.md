# ConakryMarket

Plateforme e-commerce pour les petits commerçants guinéens (inspirée de Jumia / Amazon).

## Architecture du Projet

Le projet est divisé en deux parties :
- **Backend** (`conakrymarket-backend/`) : API REST Node.js, Express, MongoDB
- **Frontend** (`conakrymarket-frontend/`) : Application React, Vite, Tailwind CSS

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js (v18+)
- MongoDB en cours d'exécution localement (port 27017 par défaut)

### 1. Configuration du Backend

```bash
cd conakrymarket-backend
npm install --legacy-peer-deps
```

*Remarque : Assurez-vous que votre fichier `.env` est correctement configuré avec vos identifiants Cloudinary si vous souhaitez tester l'upload d'images.*

#### Seed de la Base de Données
Pour générer les données de test (clients, 200+ produits, 500+ commandes, 100+ avis) :
```bash
npm run seed
```

#### Lancement du serveur backend
```bash
npm run dev
```
Le serveur démarrera sur `http://localhost:5000`.

### 2. Configuration du Frontend

Ouvrez un nouveau terminal :

```bash
cd conakrymarket-frontend
npm install
npm run dev
```
L'application web démarrera sur `http://localhost:5173`.

---

## Fonctionnalités Principales

- **Authentification** JWT avec rôles (Client / Vendeur).
- **Catalogue Dynamique** avec filtrage par catégorie, prix, et ville.
- **Formulaires Intelligents** (champs spécifiques selon la catégorie de produit).
- **Tableau de Bord Vendeur** avec 4 graphiques (Chart.js) alimentés par des pipelines MongoDB d'agrégation ($unwind).
- **Gestion des Commandes et Stocks** avec décrémentation atomique ($inc).
- **Design Premium** (Tailwind CSS, Thème Orange/Vert).

## Connexion Test

Le script de seed génère plusieurs comptes de test. Vous pouvez ouvrir MongoDB Compass (connexion à `mongodb://localhost:27017/conakrymarket`) pour voir les emails générés, ou créer un nouveau compte via l'interface d'inscription de l'application.
