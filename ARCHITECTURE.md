# Developer guide

HTML/CSS/JavaScript natifs, sans framework, dépendances à installer ou compilation. Scripts classiques avec `defer`, ordre explicite dans `index.html`.

| Fichier | Responsabilité |
| --- | --- |
| `js/data.js` | Schéma et données de démonstration |
| `js/demo-content.js` | Enrichissement non destructif des images et métadonnées |
| `js/core.js` | Store, localStorage, routeur, helpers et événements délégués |
| `js/shared.js` | Cards et composants partagés |
| `js/home.js` | Module 01 : homepage et ses sections |
| `js/matches.js` | Module 02 : calendrier, résultats, direct, classement et détail |
| `js/team.js` | Module 03 : équipe, staff et profils |
| `js/history.js` | Module 04 : frise et palmarès |
| `js/tickets.js` | Module 05 : catalogue et lien vers le fournisseur |
| `js/store.js` | Module 06 : boutique, panier et checkout simulé |
| `js/fans.js` | Module 07 : profil, votes, pronostics, adhésions et galerie |
| `js/stadium.js` | Module 08 : stade, carte et contact |
| `js/media.js` | Module 09 : articles, recherche, filtres, galerie et vidéos |
| `js/account.js` | Espace achats et commandes |
| `js/accessibility.js` | Focus des modales et navigation clavier des tabs |
| `js/boot.js` | Initialisation |
| `css/style.css` | Composants de base existants |
| `css/ref.css` | Design de référence conservé |
| `css/modules.css` | Extensions visuelles et responsive |
| `admin/admin.js` | Dashboard et permissions simulées |
| `admin/moderation.js` | Modération, saison/équipe des articles, billetterie externe |
| `server.mjs` | Serveur statique local avec Node natif |
| `tests/smoke.cjs` | Routes et règles métier |

## Ajouter une page

1. Créer `js/nom.js`, puis enregistrer `ROUTES.nom = (segments, query) => html`.
2. Charger ce fichier dans `index.html` avant `boot.js`.
3. Ajouter un lien `#/nom`.

`ROUTES` contient les pages, `A` les actions (`data-act`), `F` les formulaires (`data-form`) et `S` l'état partagé. Échapper tout texte variable avec `esc()`. Après mutation : `save()` puis `rerender()` si nécessaire. `js/public.js` n'est plus chargé : son code est réparti entre modules.

## Persistance et administration

localStorage : clé `kacm_demo_v1`, version 5. Conserver le même navigateur, hôte et port pour partager les données avec l'admin. Le contenu édité est préservé ; `demo-content.js` complète uniquement les images et métadonnées absentes lors de sa première application. Le rôle choisi dans le dashboard est une simulation d'interface, pas une sécurité serveur.

Le dashboard permet de modifier le contenu existant (matchs, joueurs, actualités, produits, commandes, paramètres) et de traiter les demandes d'adhésion et les photos des supporters. La modification d'une autre fenêtre se répercute via l'événement `storage`.

## Billetterie

URL unique : `TICKETING_URL` dans `js/tickets.js` = `https://kacm.ticketing.ma/`.

Les boutons d'achat ouvrent directement ce fournisseur. Le lien **Infos billetterie** du footer ouvre `#/tickets`, catalogue illustratif avec prochains matchs, détails, catégories et tarifs. Aucun billet, QR ni confirmation de réservation n'est créé localement. Historique, confirmation et QR (si pris en charge) sont délivrés chez le fournisseur ; leur affichage synchronisé ici exigerait son API autorisée.

Le catalogue utilise les catégories de `matches[].sale.cats`. Elles sont explicitement marquées comme démonstration et ne réservent aucun stock du fournisseur.

## Vérifier

`node tests/smoke.cjs` : rendu des routes, brouillons inaccessibles, checkout billet externe, filtres, votes/adhésions uniques, pronostics, stock cumulé et checkout boutique sans vente partielle.

## Contenu et intégrations à fournir pour la production

Scores, effectif, lieux d'accès, prix, sponsors et offres d'adhésion sont illustratifs. Le direct provient d'une saisie de démonstration dans l'admin. Les profils sont locaux sans mot de passe. Paiements boutique, factures, contacts, newsletters et notifications sont simulés ; aucun e-mail n'est envoyé.

Photos de référence issues du site fourni : vérifier les droits avant diffusion. Produits : illustrations SVG marquées démo. Les portraits professionnels et archives restent à fournir par le club ; les emplacements vides sont explicites. Les vidéos ouvrent la chaîne KACM TV et ne prétendent pas lire des highlights spécifiques.

Google Fonts, Google Maps et YouTube demandent une connexion ; les images du site sont locales. Navigation commune FR/AR/EN, contenu éditorial français. Le passage en production nécessitera authentification, autorisations et validation serveur, base de données, API fournisseur, contenu approuvé et services d'envoi.

## Contenu réel — vérification du 16 novembre 2026

La version courante utilise `js/verified-data.js` : 35 noms de joueurs, 33 portraits, 16 équipes et leurs logos, 7 résultats de championnat, 3 synthèses d'actualité avec liens sources. Les photos non disponibles restent explicitement absentes. Les métriques individuelles inconnues sont `—`, jamais zéro inventé.

`#/sources` détaille la provenance et les incertitudes. Le classement est un relevé de Kooralink/SofaScore et conserve les points et l'ordre publiés, y compris lorsqu'ils diffèrent d'un simple calcul victoires × 3 + nuls. La source et la date figurent sur les fiches.

La prochaine opposition référencée est Union Touarga, avec date/heure/lieu non confirmés du fait de calendriers contradictoires. Aucun compte à rebours ni fichier ICS n'est fourni tant que la programmation n'est pas confirmée.

Les produits et tarifs fictifs, sponsors fictifs, abonnements tarifés fictifs et anciens résultats synthétiques ont été retirés du contenu initial. Les composants restent prêts à recevoir les informations validées du club. La migration conserve l'ancien contenu dans `previousDemoSnapshot`, et préserve les profils et commandes locales créés par les utilisateurs. Elle ne s'applique qu'une fois via `verifiedRevision`.

Pour mettre à jour les données : vérifier la source, modifier le snapshot, incrémenter `VERIFIED_DATA.revision`, puis tester. Aucun rafraîchissement automatique ni autorisation d'usage commercial des images n'est présumé. `assets/real/*provenance.json` documente les URL originales.
