# KACM — MVP (7 modules)

Ouvrir `index.html` (ou servir le dossier : `npx serve mvp`). Aucune installation requise.

| Module | Page | Contenu |
|---|---|---|
| 01 Homepage | `#/home` | Hero, centre des matchs (résultat / prochain / classement), billetterie, boutique, équipe, club |
| 02 Match Center | `#/matches`, `#/match/ID` | Calendrier, résultats, direct, classement, fiche match (événements, stats, composition) |
| 03 Équipe & joueurs | `#/team`, `#/player/ID` | Effectif par poste, recherche, staff, fiche joueur |
| 04 Histoire & palmarès | `#/history` | Palmarès, frise chronologique |
| 05 Billetterie | `#/tickets` | Choix match → catégorie → places → paiement sandbox → billet QR, annulation |
| 06 Boutique | `#/store`, `#/cart`, `#/checkout` | Catalogue, fiche produit, panier, code promo (KACM10), commande, facture |
| 08 Stade & localisation | `#/stadium` | Carte, itinéraire, infos pratiques, formulaire de contact |

Sans compte : billets et commandes sont enregistrés dans le navigateur (`#/account/tickets`, `#/account/orders`).
Données de démonstration (localStorage, clé `kacm_demo_v1`) ; paiement simulé. Langues FR / AR / EN.

## Administration
Ouvrir `admin/index.html` (fichiers : `admin/index.html`, `admin/admin.css`, `admin/admin.js`).
Choisir un rôle, puis modifier matchs, joueurs, actualités, produits, billets, commandes, sponsors, paramètres…
Chaque modification est **enregistrée automatiquement** dans le navigateur (localStorage, clé `kacm_demo_v1`) et apparaît sur le site après rechargement.
Pour garder les données, utiliser le même navigateur ; « Réinitialiser » (pied de page du site) remet les données de démonstration.
