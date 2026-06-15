# domotique_react — Frontend Hoomy

Interface React de l'application Hoomy. Communique avec l'API Symfony exposée sur `http://localhost:8082`.

---

## Prérequis

- [Node.js](https://nodejs.org/) 18+
- L'API (`domotique_api`) doit être démarrée avant de lancer le frontend

---

## Installation

```bash
npm install
```

## Démarrage

```bash
npm run dev
```

L'application est accessible sur [http://localhost:5173](http://localhost:5173).

## Build de production

```bash
npm run build
```

## Autres commandes

```bash
# Prévisualiser le build de production
npm run preview

# Linter
npm run lint
```

---

## Technologies

| Technologie | Rôle |
|---|---|
| React 19 | Framework UI |
| Vite | Bundler / dev server |
| Redux Toolkit | Gestion d'état global |
| React Router | Navigation |
| Axios | Requêtes HTTP vers l'API |
| Tailwind CSS | Styles |
