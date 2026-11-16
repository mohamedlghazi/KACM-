/* Actualités du club. */
const KACM_NEWS = (function () {
  const IG = "https://www.instagram.com/kacmofficiel/";
  const own = [
    {
      id: "amical-tiznit", cat: "Match Reports", date: "2026-11-15T12:00:00Z",
      title: "Match amical : le Kawkab face à l'Amal Tiznit",
      excerpt: "Rencontre amicale à l'annexe du Grand Stade de Marrakech, avec un but de Youssef Zghoudi.",
      img: "assets/amical/a-13.jpg", pos: "center 6%",
      body: [
        "Le Kawkab Athletic Club Marrakech a disputé le 15 novembre 2026 un match amical face à l'Amal Tiznit (USAT), à l'annexe du Grand Stade de Marrakech. Coup d'envoi à 15h00.",
        "Le club a dévoilé sa composition de départ (« Starting XI ») avant la rencontre, puis a suivi le match en images : coup d'envoi, première période, mi-temps, seconde période et coup de sifflet final.",
        "Youssef Zghoudi a ouvert le score (1-0) pour le Kawkab."
      ],
      gallery: Array.from({ length: 23 }, (_, i) => "assets/amical/a-" + (i + 1) + ".jpg"), ratio: "4/5",
      source: { name: "Instagram @kacmofficiel", url: IG }
    },
    {
      id: "entrainement-14-nov", cat: "Entraînement", date: "2026-11-14T12:00:00Z",
      title: "Séance d'entraînement du 14 novembre",
      excerpt: "Le groupe s'est entraîné la veille du match amical face à l'Amal Tiznit.",
      img: "assets/training/training-4.jpg", pos: "center 34%",
      gallery: Array.from({ length: 11 }, (_, i) => "assets/training/training-" + (i + 1) + ".jpg"), ratio: "4/5",
      body: [
        "Le Kawkab s'est entraîné le 14 novembre 2026, la veille de son match amical contre l'Amal Tiznit. #DimaKawkab"
      ],
      source: { name: "Instagram @kacmofficiel", url: IG }
    },
    {
      id: "79-ans", cat: "Vie du club", date: "2026-09-19T12:00:00Z",
      title: "79 ans d'histoire, 79 ans de passion",
      excerpt: "Le club célèbre son anniversaire avec un message adressé à ses supporters.",
      img: "assets/news/79-ans-full.jpg", fit: "contain", bgc: "#690100",
      body: [
        "Le 19 septembre 2026, le Kawkab a publié un message pour ses 79 ans : « 79 ans d'histoire… 79 ans de passion et de fidélité. Chaque année, nous sommes le Kawkab Athletic Club Marrakech ; chaque année, vous êtes notre fierté et notre soutien. »"
      ],
      source: { name: "Instagram @kacmofficiel", url: IG }
    },
    {
      id: "calendrier-2026-27", cat: "Annonces officielles", date: "2026-08-28T12:00:00Z",
      title: "Le calendrier de la saison 2026/27 est publié",
      excerpt: "Le programme des matchs du Kawkab en Botola Pro Inwi D1 est disponible.",
      img: "assets/news/programme-full.jpg", fit: "contain", bgc: "#f5f5f5",
      body: [
        "Le 28 août 2026, le club a publié le programme des matchs du Kawkab Athletic Club Marrakech pour la saison 2026/2027 en Botola Pro Inwi D1."
      ],
      source: { name: "Instagram @kacmofficiel", url: IG }
    }
  ];
  const press = VERIFIED_DATA.news.filter(n => n.status === "published").map(n => ({
    id: "presse-" + n.id, cat: n.cat, date: n.date, title: n.title, excerpt: n.excerpt, img: n.img, pos: n.id === 1 ? "58% center" : "center",
    body: String(n.body || "").replace(" rapportée par L’Opinion", "").split(/\n\n+/).filter(p => p && !/synthèse renvoie|Consultez le compte rendu/.test(p))
  }));
  /* « À lire aussi » : articles réellement liés (même match, même adversaire, même sujet) */
  const RELATED = {
    "amical-tiznit": ["entrainement-14-nov", "presse-3", "calendrier-2026-27"],
    "entrainement-14-nov": ["amical-tiznit", "presse-1", "presse-2"],
    "79-ans": ["presse-1", "calendrier-2026-27", "amical-tiznit"],
    "calendrier-2026-27": ["presse-2", "presse-3", "amical-tiznit"],
    "presse-1": ["entrainement-14-nov", "79-ans", "calendrier-2026-27"],
    "presse-2": ["presse-3", "calendrier-2026-27", "amical-tiznit"],
    "presse-3": ["amical-tiznit", "presse-2", "calendrier-2026-27"]
  };
  const all = [...own, ...press].sort((a, b) => new Date(b.date) - new Date(a.date));
  all.forEach(a => { a.related = RELATED[a.id] || []; });
  return all;
})();
