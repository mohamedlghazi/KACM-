# KACM Digital — MVP (9 modules)

HTML, CSS et JavaScript natifs, sans framework ni compilation. Design existant conservé : rouge/blanc, fonds sombres, typographie condensée et grands visuels.

## Démarrer

Dans ce dossier, exécuter `node server.mjs`, puis ouvrir http://127.0.0.1:8080. Administration : http://127.0.0.1:8080/admin/.

Alternative : `python -m http.server 8080 --bind 127.0.0.1`. Le serveur local est recommandé pour partager localStorage entre le site et l'admin ; garder le même navigateur, hôte et port.

| Module | Routes | Composants |
| --- | --- | --- |
| 01 Homepage | `#/home` | Hero/logo, actualités, prochain match/countdown, résultat, classement, billet externe, joueurs, vidéos, produits, partenaires, réseaux, newsletter |
| 02 Match Center | `#/matches`, `#/match/ID` | Calendrier/ICS, résultats, buts/cartons/remplacements, direct saisi dans l'admin, statistiques, classement, preview, formation, rapport, médias, stade |
| 03 Équipe | `#/team`, `#/player/ID` | Recherche, postes, capitaine, staff technique/médical, profil/statistiques, données personnelles selon autorisation |
| 04 Histoire | `#/history` | Timeline, championnats, Coupes du Trône, Coupe de la CAF ; archives à fournir |
| 05 Billetterie | `#/tickets` | Prochains matchs/détails, catégories/prix chez le fournisseur, booking/checkout externe, accès historique fournisseur, confirmation et QR chez le fournisseur |
| 06 Boutique | `#/store`, `#/product/ID`, `#/cart`, `#/checkout` | Composants catalogue, produit, tailles/couleurs, personnalisation, stock, panier, livraison, commande, suivi/facture ; catalogue en attente de données validées |
| 07 Supporters | `#/fans` | Profil, joueur préféré, intérêts/suivi, votes, sondage, pronostic sans enjeu, fan du mois, galerie/modération, Basic/Plus/Premium, carte de présentation et notifications locales |
| 08 Stade | `#/stadium` | Carte/itinéraire, adresse/GPS, accès public/VIP, parking, accessibilité, règles, horaires, stades des prochains matchs, contact/FAQ |
| 09 News & Media | `#/news`, `#/news/ID` | Recherche, filtres catégorie/saison/équipe, articles, communiqués, transferts, interviews, académie, photos, vidéos/KACM TV |
| Mon compte | `#/account/tickets`, `#/account/orders`, `#/account/wishlist` | Billetterie externe, commandes boutique, suivi, facture et favoris |

Les boutons **Acheter un billet** ouvrent directement https://kacm.ticketing.ma/ dans un nouvel onglet. **Infos billetterie**, dans le footer, ouvre le catalogue local. Le fournisseur gère réservation, paiement, historique, confirmation et QR si disponible. Aucune vente de billet ni émission de QR n'a lieu ici ; une synchronisation demanderait son API autorisée.

## Code et administration

Chaque module dispose d'un fichier JS dédié. Lire [ARCHITECTURE.md](ARCHITECTURE.md) pour le plan des fichiers, les conventions `ROUTES`/`A`/`F`/`S`, la persistance et les limites de la démo.

Le dashboard existant permet d'éditer matchs, joueurs, actualités, produits, stocks, commandes et paramètres, et de traiter adhésions et photos. Les données sont stockées dans ce navigateur (clé `kacm_demo_v1`). Le lien « Réinitialiser » en footer restaure les exemples après confirmation.

## Vérification

`node tests/smoke.cjs` : rendu des pages et règles métier (brouillons, ticketing externe, vote unique, adhésion unique, pronostics, stock et checkout).

## Périmètre

MVP de présentation : profils locaux sans authentification réelle, rôles simulés, données sportives sourcées, catalogue commercial à renseigner, paiement boutique simulé, messages/newsletters non envoyés. Photos et portraits officiels, archives, accès précis aux stades et contenu validé sont à fournir par le club. Les photos de référence sont utilisées pour présentation ; les produits ont des illustrations démo. Google Fonts, Maps et YouTube nécessitent Internet. La navigation commune propose FR/AR/EN ; le contenu éditorial reste français.

## Contenu réel — vérification du 16 novembre 2026

La version courante utilise `js/verified-data.js` : 35 noms de joueurs, 33 portraits, 16 équipes et leurs logos, 7 résultats de championnat, 3 synthèses d'actualité avec liens sources. Les photos non disponibles restent explicitement absentes. Les métriques individuelles inconnues sont `—`, jamais zéro inventé.

`#/sources` détaille la provenance et les incertitudes. Le classement est un relevé de Kooralink/SofaScore et conserve les points et l'ordre publiés, y compris lorsqu'ils diffèrent d'un simple calcul victoires × 3 + nuls. La source et la date figurent sur les fiches.

La prochaine opposition référencée est Union Touarga, avec date/heure/lieu non confirmés du fait de calendriers contradictoires. Aucun compte à rebours ni fichier ICS n'est fourni tant que la programmation n'est pas confirmée.

Les produits et tarifs fictifs, sponsors fictifs, abonnements tarifés fictifs et anciens résultats synthétiques ont été retirés du contenu initial. Les composants restent prêts à recevoir les informations validées du club. La migration conserve l'ancien contenu dans `previousDemoSnapshot`, et préserve les profils et commandes locales créés par les utilisateurs. Elle ne s'applique qu'une fois via `verifiedRevision`.

Pour mettre à jour les données : vérifier la source, modifier le snapshot, incrémenter `VERIFIED_DATA.revision`, puis tester. Aucun rafraîchissement automatique ni autorisation d'usage commercial des images n'est présumé. `assets/real/*provenance.json` documente les URL originales.
