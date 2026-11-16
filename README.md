# KACM — Kawkab Athletic Club Marrakech

Site du club, reconstruit étape par étape en HTML / CSS / JavaScript natifs (sans framework ni build).

## Avancement

| Étape | Module | État |
| --- | --- | --- |
| 1 | Accueil (header, hero, prochain match, dernier résultat, accès rapides, actualités, joueurs, histoire, supporters, partenaires, footer) | fait |
| 2 | Match Center | à faire |
| 3 | Équipe & joueurs (`team.html` : effectif complet, composition 4-3-3 en 3D, fiche joueur) | fait |
| 4 | News & médias (`news.html` : liste filtrable, fiche article, partage, médias) | fait |
| 5 | Club / institutionnel | à faire |
| 6 | Boutique, supporters, stade, sponsors | à faire |

## Structure

```
index.html        page d'accueil
css/style.css     styles
js/data.js        relevé de données publiques (16/11/2026, non en direct)
js/i18n.js        textes FR / EN / AR
js/common.js      socle commun : langue, menu, notifications (toutes les pages)
js/app.js         accueil : rendu des sections, compte à rebours, diaporama
js/news-data.js   articles (Instagram @kacmofficiel + presse)
js/news.js        page Actualités : filtres, fiche article
news.html         page Actualités
assets/           logo, photos, portraits, logos d'équipes
_old/             ancienne version (conservée, aussi dans l'historique git)
```

## Lancer

Ouvrir `index.html` dans le navigateur (ou, dans VS Code, l'extension Live Server).

## Notes

- Le prochain match (Union Touarga, journée 8) n'a pas de date confirmée : la carte affiche « Date et heure à confirmer » au lieu d'un faux compte à rebours.
- Les emplacements partenaires sont vides en attendant les logos du club.
- Les boutons de pages pas encore créées affichent un message « étape suivante ».
- La billetterie renvoie vers https://kacm.ticketing.ma/.
- Photos issues de sites tiers : vérifier les droits avant diffusion.
