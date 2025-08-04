# 🎨 Whiteboard Interactif Avancé

Une application web de tableau blanc interactif inspirée de **Microsoft Whiteboard** et **Miro**, construite avec React, TypeScript, Vite et Tailwind CSS.

## ✨ Fonctionnalités Avancées

### 🎯 Interface Moderne et Responsive
- **Design épuré** inspiré de Microsoft Whiteboard et Miro
- **Responsive design** adapté à tous les écrans
- **Mode sombre automatique** basé sur les préférences système
- **Animations fluides** avec transitions CSS
- **Grille de fond** pour un meilleur repérage visuel

### 🎨 Types d'Éléments Étendus
- **Post-its** : Notes jaunes éditables
- **Rectangles** : Formes géométriques bleues
- **Cercles** : Formes circulaires roses
- **Triangles** : Formes triangulaires vertes
- **Textes** : Éléments textuels personnalisables
- **Flèches** : Flèches SVG avec pointe
- **Lignes** : Lignes simples SVG
- **Images** : Import et affichage d'images

### 🔧 Système de Manipulation Avancé
- **Drag & Drop fluide** avec événements mouse natifs
- **Redimensionnement** avec 8 handles de contrôle
- **Édition en temps réel** avec double-clic
- **Sélection et suppression** des éléments
- **Rotation et opacité** pour tous les éléments

### 📋 Fonctionnalités Professionnelles
- **Copier/Coller** : Ctrl+C/V avec clipboard
- **Historique complet** : Undo/Redo (Ctrl+Z/Y)
- **Import d'images** : Support de tous les formats
- **Propriétés avancées** : Bordures, couleurs, tailles
- **Raccourcis clavier** : Navigation et actions rapides

## 🛠️ Technologies Utilisées

- **React 18** avec TypeScript
- **Vite** pour le build et le développement
- **Tailwind CSS** pour le design
- **Context API** pour la gestion d'état globale
- **Drag & Drop** natif avec les événements mouse
- **SVG** pour les formes vectorielles

## 🚀 Installation et Démarrage

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build
npm run preview
```

L'application sera accessible à l'adresse : http://localhost:5173

## 🎮 Utilisation

### Barre d'outils (gauche)
#### Formes
- **📝 Post-it** : Ajouter un post-it jaune éditable
- **⬜ Rectangle** : Ajouter un rectangle bleu
- **⭕ Cercle** : Ajouter un cercle rose
- **🔺 Triangle** : Ajouter un triangle vert
- **T Texte** : Ajouter un élément texte
- **➡️ Flèche** : Ajouter une flèche
- **➖ Ligne** : Ajouter une ligne

#### Images
- **🖼️ Importer Image** : Sélectionner et importer une image

#### Actions
- **📋 Copier** : Copier l'élément sélectionné
- **📄 Coller** : Coller l'élément du clipboard
- **↩️ Annuler** : Annuler la dernière action
- **↪️ Rétablir** : Rétablir l'action annulée
- **🗑️ Tout effacer** : Supprimer tous les éléments

### Interactions
- **Clic** : Sélectionner un élément
- **Double-clic** : Éditer le contenu (post-it et texte)
- **Glisser-déposer** : Déplacer les éléments
- **Handles de redimensionnement** : Redimensionner les éléments
- **Delete** : Supprimer l'élément sélectionné
- **Escape** : Désélectionner

### Raccourcis clavier
- **Delete** : Supprimer l'élément sélectionné
- **Escape** : Désélectionner l'élément actuel
- **Enter** : Valider l'édition de texte
- **Ctrl+Z** : Annuler
- **Ctrl+Y** : Rétablir
- **Ctrl+C** : Copier
- **Ctrl+V** : Coller

## 📁 Structure du Projet

```
src/
├── components/
│   ├── Canvas.tsx          # Canevas principal
│   ├── Toolbar.tsx         # Barre d'outils
│   ├── DraggableItem.tsx   # Éléments draggables
│   └── ResizeHandles.tsx   # Handles de redimensionnement
├── context/
│   └── WhiteboardContext.tsx # Contexte global
├── types/
│   └── index.ts            # Types TypeScript
├── App.tsx                 # Composant racine
└── main.tsx               # Point d'entrée
```

## 🎨 Design System

### Couleurs par Type
- **Post-its** : Jaune (`#fef3c7`)
- **Rectangles** : Bleu (`#dbeafe`)
- **Cercles** : Rose (`#fce7f3`)
- **Triangles** : Vert (`#dcfce7`)
- **Flèches** : Noir (`#000000`)
- **Lignes** : Noir (`#000000`)
- **Textes** : Blanc (`#ffffff`)
- **Sélection** : Bleu (`#3b82f6`)

### Animations
- **Transitions fluides** (200ms)
- **Hover effects** avec scale
- **Animations d'apparition**
- **Indicateurs visuels** pour les actions

### Responsive
- **Desktop** : Interface complète
- **Tablette** : Adaptation automatique
- **Mobile** : Interface optimisée

## 🔧 Configuration

### Variables d'environnement
Aucune configuration requise - l'application fonctionne entièrement côté client.

### Personnalisation
Les couleurs et styles peuvent être modifiés dans :
- `src/components/DraggableItem.tsx` : Couleurs des éléments
- `src/index.css` : Styles globaux
- `tailwind.config.js` : Configuration Tailwind

## 🚀 Déploiement

L'application peut être déployée sur n'importe quel service d'hébergement statique :

```bash
# Build de production
npm run build

# Les fichiers seront dans dist/
```

## 📊 Métriques de Performance

- **Bundle size** : 163KB (51KB gzippé)
- **CSS** : 18KB (4KB gzippé)
- **HTML** : 0.46KB (0.30KB gzippé)
- **Temps de build** : 560ms

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- Inspiré par Microsoft Whiteboard et Miro
- Construit avec React et TypeScript
- Stylisé avec Tailwind CSS
- Icônes et emojis pour une meilleure UX

## 📚 Documentation Supplémentaire

- [NEW_FEATURES.md](./NEW_FEATURES.md) - Détails des nouvelles fonctionnalités
- [FEATURES.md](./FEATURES.md) - Fonctionnalités détaillées
- [SUMMARY.md](./SUMMARY.md) - Résumé du projet
