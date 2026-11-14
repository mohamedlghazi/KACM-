/* Données de DÉMONSTRATION. Rien ici n'est officiel (joueurs, scores, prix, adversaires = fictifs).
   Les années de la frise viennent du brief fourni par l'équipe : à valider avec le club avant publication. */
const DAYS = n => { const d = new Date(); d.setDate(d.getDate() + n); d.setHours(20, 0, 0, 0); return d.toISOString(); };
const PAST = n => { const d = new Date(); d.setDate(d.getDate() - n); d.setHours(15, 0, 0, 0); return d.toISOString(); };

function buildSeed() {
  const lines = [["GK", 2], ["DEF", 6], ["MID", 6], ["ATT", 4]];
  const players = []; let id = 1;
  lines.forEach(([pos, n]) => { for (let i = 0; i < n; i++, id++) players.push({
    id, name: "Joueur Démo " + String(id).padStart(2, "0"), num: id + (id > 9 ? 1 : 0), pos, nat: "MA", birth: "", height: "", weight: "", showPrivate: false,
    joined: "", captain: id === 4, photo: "", bio: "Biographie à renseigner par le club.", status: "active",
    apps: 10 + (id * 3) % 17, goals: pos === "ATT" ? 3 + id % 6 : pos === "MID" ? id % 4 : pos === "DEF" ? id % 2 : 0,
    assists: id % 5, min: 700 + id * 41, yc: id % 4, rc: id % 9 === 0 ? 1 : 0 }); });
  const cats = () => [
    { name: "Virage", price: 30, quota: 3000, sold: 1850, numbered: false },
    { name: "Latérale", price: 80, quota: 1200, sold: 640, numbered: true },
    { name: "Tribune d'honneur", price: 150, quota: 400, sold: 170, numbered: true },
    { name: "VIP", price: 300, quota: 100, sold: 38, numbered: false }];
  const L = [1, 3, 4, 5, 6, 9, 10, 11, 15, 16, 17];
  const mk = (i, o) => Object.assign({ id: i, comp: "Botola Pro", home: true, venue: "Stade (démo)", status: "scheduled", hs: 0, as: 0, minute: 0, events: [],
    stats: null, lineup: L, formation: "4-3-3", report: "", onSale: false, sale: { cats: cats() } }, o);
  return {
    version: 5,
    ui: { lang: "fr", uid: null, role: null },
    settings: {
      heroTitle: "Plus qu'un club... une famille.", heroText: "Ensemble, écrivons une nouvelle page de l'histoire du Kawkab de Marrakech.",
      heroImage: "assets/hero2.jpg", teamImage: "assets/team.webp", logo: "assets/logo.png", coach: "Entraîneur (démo)", whatsapp: "", cod: true, fanOfMonth: "Fan de démonstration",
      social: { facebook: "https://www.facebook.com/KACMOfficiiel", youtube: "https://www.youtube.com/@kacmtv7253", instagram: "https://www.instagram.com/kacmofficiel" },
      stadium: { name: "Stade (démo)", address: "Adresse exacte à confirmer avec le club", lat: "31.6295", lng: "-7.9811", capacity: "À vérifier",
        gates: "Porte A, Porte B (démo)", vip: "Entrée VIP (démo)", parking: "Parkings à confirmer", access: "Accès PMR à confirmer", doors: "Ouverture des portes 2 h avant le coup d'envoi (démo)", rules: "Règlement intérieur à fournir par le club." },
      plans: [
        { code: "basic", name: "Supporter Basic", price: 0, perks: ["Actualités exclusives", "Carte numérique", "Participation aux votes"] },
        { code: "plus", name: "Supporter Plus", price: 150, perks: ["Tout Basic", "-10% boutique", "Alertes billetterie"] },
        { code: "premium", name: "Supporter Premium", price: 400, perks: ["Tout Plus", "Priorité de réservation", "Contenus VIP", "Offres partenaires"] }],
      coupons: { KACM10: 10 }
    },
    players,
    staff: [
      { id: 1, name: "Entraîneur principal (démo)", role: "coach" }, { id: 2, name: "Adjoint (démo)", role: "tech" }, { id: 3, name: "Entraîneur des gardiens (démo)", role: "tech" },
      { id: 4, name: "Préparateur physique (démo)", role: "tech" }, { id: 5, name: "Médecin du club (démo)", role: "med" }, { id: 6, name: "Kinésithérapeute (démo)", role: "med" }],
    matches: [
      mk(1, { opp: "Adversaire A", date: PAST(21), status: "finished", hs: 2, as: 1, report: "Compte rendu de démonstration.",
        events: [{ min: 23, type: "goal", team: "us", pid: 16, label: "Joueur Démo 16" }, { min: 41, type: "yellow", team: "them", label: "Joueur adverse" }, { min: 58, type: "goal", team: "them", label: "Joueur adverse" }, { min: 77, type: "goal", team: "us", pid: 15, label: "Joueur Démo 15" }, { min: 80, type: "sub", team: "us", pid: 17, label: "Entrée : Joueur Démo 17" }],
        stats: { poss: [54, 46], shots: [14, 8], target: [6, 3], corners: [7, 3], fouls: [11, 14] } }),
      mk(2, { opp: "Adversaire B", date: PAST(14), home: false, status: "finished", hs: 0, as: 0, stats: { poss: [49, 51], shots: [7, 9], target: [2, 3], corners: [4, 5], fouls: [15, 12] }, events: [{ min: 66, type: "yellow", team: "us", pid: 4, label: "Joueur Démo 04" }] }),
      mk(3, { opp: "Adversaire C", date: PAST(7), comp: "Coupe du Trône", status: "finished", hs: 1, as: 0, events: [{ min: 88, type: "goal", team: "us", pid: 16, label: "Joueur Démo 16" }], stats: { poss: [58, 42], shots: [12, 4], target: [5, 1], corners: [8, 2], fouls: [9, 13] } }),
      mk(4, { opp: "Adversaire D", date: DAYS(6), onSale: true }),
      mk(5, { opp: "Adversaire E", date: DAYS(13), home: false }),
      mk(6, { opp: "Adversaire F", date: DAYS(20), onSale: true }),
      mk(7, { opp: "Adversaire G", date: DAYS(34), comp: "CAF Confederation Cup", home: true })],
    news: [
      { id: 1, title: "Titre d'article de démonstration n°1", cat: "Actualités", img: "", excerpt: "Extrait court rédigé par l'équipe éditoriale.", body: "Corps de l'article de démonstration.\n\nLe contenu est modifiable depuis le dashboard.", status: "published", date: PAST(1), featured: true, views: 320 },
      { id: 2, title: "Compte rendu : victoire à domicile (démo)", cat: "Match Reports", img: "", excerpt: "Résumé de la rencontre (contenu fictif).", body: "Compte rendu fictif.", status: "published", date: PAST(3), featured: false, views: 210 },
      { id: 3, title: "Séance d'entraînement ouverte (démo)", cat: "Training", img: "", excerpt: "Les joueurs préparent le prochain match.", body: "Texte fictif.", status: "published", date: PAST(5), featured: false, views: 150 },
      { id: 4, title: "Communiqué officiel (démo)", cat: "Communiqués", img: "", excerpt: "Annonce de démonstration.", body: "Texte fictif.", status: "published", date: PAST(8), featured: false, views: 98 },
      { id: 5, title: "Académie : détections U15 (démo)", cat: "Académie", img: "", excerpt: "Informations sur la prochaine détection.", body: "Texte fictif.", status: "published", date: PAST(10), featured: false, views: 77 },
      { id: 6, title: "Conférence de presse du coach (démo)", cat: "Interviews", img: "", excerpt: "Déclarations avant le prochain match.", body: "Texte fictif.", status: "published", date: PAST(12), featured: false, views: 64 },
      { id: 7, title: "Brouillon non publié (démo)", cat: "Transferts", img: "", excerpt: "Visible seulement dans l'admin.", body: "", status: "draft", date: PAST(0), featured: false, views: 0 }],
    videos: [{ id: 1, title: "Résumé du dernier match (démo)", url: "https://www.youtube.com/@kacmtv7253" }, { id: 2, title: "Interview d'après-match (démo)", url: "https://www.youtube.com/@kacmtv7253" }, { id: 3, title: "Coulisses de l'entraînement (démo)", url: "https://www.youtube.com/@kacmtv7253" }],
    standings: [["KACM", 12, 8, 3, 1, 21, 9]].concat(["Équipe Démo A", "Équipe Démo B", "Équipe Démo C", "Équipe Démo D", "Équipe Démo E", "Équipe Démo F", "Équipe Démo G"].map((n, i) => [n, 12, 7 - (i >> 1), 3 + (i % 2), 2 + (i >> 1) + (i % 2 ? 0 : 1), 18 - i, 10 + i])),
    products: [
      ["Maillot domicile", "Maillots domicile", 399, true], ["Maillot extérieur", "Maillots extérieur", 399, true], ["Maillot third", "Maillots third", 429, true],
      ["Training kit", "Training Kits", 299, false], ["Survêtement", "Survêtements", 499, false], ["Écharpe", "Écharpes", 79, false],
      ["Casquette", "Casquettes", 99, false], ["Sac de sport", "Sacs", 199, false], ["Porte-clés", "Accessoires", 39, false], ["Ballon collector", "Produits collectors", 249, false]
    ].map(([name, cat, price, cz], i) => ({ id: i + 1, name: name + " (démo)", cat, price, stock: 40 - i * 3, sizes: cz || cat === "Survêtements" ? "S,M,L,XL" : "Unique", colors: "Rouge,Noir", img: "", desc: "Description produit de démonstration.", customizable: cz, active: true, reviews: i < 3 ? [{ u: "Supporter démo", r: 5 - (i % 2), t: "Avis de démonstration." }] : [] })),
    sponsors: [{ id: 1, name: "Sponsor officiel (démo)", tier: "Officiel", url: "#", logo: "", views: 1200, clicks: 40 }, { id: 2, name: "Partenaire institutionnel (démo)", tier: "Institutionnel", url: "#", logo: "", views: 800, clicks: 22 }, { id: 3, name: "Partenaire commercial (démo)", tier: "Commercial", url: "#", logo: "", views: 640, clicks: 15 }, { id: 4, name: "Partenaire commercial 2 (démo)", tier: "Commercial", url: "#", logo: "", views: 430, clicks: 9 }],
    timeline: [
      { y: 1947, t: "Fondation du club", d: "Naissance du Kawkab Athletic Club Marrakech.", type: "founding" },
      { y: 1958, t: "Champion du Maroc", d: "Premier titre de championnat.", type: "league" },
      { y: 1963, t: "Coupe du Trône", d: "Premier titre de Coupe du Trône.", type: "throne" }, { y: 1964, t: "Coupe du Trône", d: "Deuxième titre consécutif.", type: "throne" }, { y: 1965, t: "Coupe du Trône", d: "Troisième titre consécutif.", type: "throne" },
      { y: 1987, t: "Coupe du Trône", d: "Titre de Coupe du Trône.", type: "throne" }, { y: 1991, t: "Coupe du Trône", d: "Titre de Coupe du Trône.", type: "throne" },
      { y: 1992, t: "Champion du Maroc", d: "Deuxième titre de championnat.", type: "league" }, { y: 1993, t: "Coupe du Trône", d: "Titre de Coupe du Trône.", type: "throne" },
      { y: 1996, t: "Coupe de la CAF (Confédération)", d: "Victoire en compétition africaine.", type: "caf" }],
    notifications: [], users: [], ticketOrders: [], tickets: [], scans: [], memberships: [], registrations: [], contacts: [], newsletter: [], votes: {}, predictions: [], fanPhotos: [], audit: [],
    cart: [], wishlist: [],
    orders: [[1, "Client démo 1", 478, true, "delivered", "card"], [2, "Client démo 2", 399, true, "shipped", "card"], [3, "Client démo 3", 199, false, "pending", "cod"], [4, "Client démo 4", 79, true, "paid", "card"]].map(([id, name, total, paid, status, pay], i) => ({
      id, no: "CMD-" + (1000 + id), uid: 0, items: [{ name: "Produit démo (démo)", size: "M", color: "Rouge", qty: 1, unit: total, custom: null }], sub: total, disc: 0, ship: 0, total, shipName: "Livraison standard", pay, paid, status, name, phone: "0600000000", addr: "Adresse démo, Marrakech", at: PAST(10 - i * 2), tracking: "" })),
    academy: { cats: [["U21", "Catégorie selon structures existantes"], ["U18", "À confirmer"], ["U17", "À confirmer"], ["U16", "À confirmer"]], schedule: "Mardi / Jeudi 17h, Samedi 10h (démo)" },
    analytics: { visits: [310, 280, 340, 390, 420, 380, 450, 470, 430, 520, 560, 510, 600, 640] },
    faq: [["Comment acheter un billet ?", "Choisissez un match, une catégorie, puis payez en ligne. Le billet QR arrive par e-mail et dans « Mes billets »."], ["Puis-je annuler un billet ?", "Selon la politique du club (démo : jusqu'à 48 h avant le match)."], ["Comment suivre ma commande ?", "Dans Mon compte > Mes commandes."], ["Comment inscrire mon enfant à l'académie ?", "Formulaire en ligne avec consentement parental."]]
  };
}
