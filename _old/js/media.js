/** Module 09 — Searchable editorial archive, articles, photos and video links. */
const MEDIA_CATEGORIES = ["Vie du club","Actualités", "Communiqués", "Transferts", "Joueurs", "Training", "Interviews", "Conférences de presse", "Académie", "Match Reports"];

ROUTES.news = ([id], q = {}) => {
  if (id) {
    const n = pubNews().find(n => n.id === +id);
    if (!n) return ROUTES.notfound();
    const related = pubNews().filter(a => a.id !== n.id).slice(0, 3);
    return `<section class="s"><div class="wrap article-layout"><a class="back-link" href="#/news">← Toutes les actualités</a><p class="eyebrow">${esc(n.cat)} · ${fdate(n.date)}</p><h1>${esc(n.title)}</h1><p class="article-lead">${esc(n.excerpt)}</p>${n.img ? img(n.img, "article-photo", n.title) : ""}
    <div class="article-body">${String(n.body || n.excerpt).split(/\n\s*\n/).map(p => `<p>${esc(p)}</p>`).join("")}</div><p class="note">Synthèse de la source : <a href="${esc(n.source)}" target="_blank" rel="noopener">${esc(n.sourceName || "Article original")} ↗</a>. Consultation : 16 novembre 2026.</p><div class="row"><button class="btn ghost sm" data-act="share">Partager</button><a class="btn sm" href="#/fans">Rejoindre les supporters</a></div><h2 class="module-heading">À lire aussi</h2><div class="grid g3">${related.map(newsCard).join("")}</div></div></section>`;
  }
  const mode = ["articles", "photos", "videos"].includes(q.mode) ? q.mode : "articles";
  const seasons = [...new Set(pubNews().map(n => n.season || seasonLabel()))];
  const list = pubNews().filter(n => (!q.cat || n.cat === q.cat) && (!q.season || (n.season || seasonLabel()) === q.season) && (!q.team || (n.team || "Équipe première") === q.team) && `${n.title} ${n.excerpt}`.toLowerCase().includes((q.search || "").toLowerCase()));
  return `<section class="s"><div class="wrap"><div class="head"><div><p class="eyebrow">Le fil du Kawkab</p><h2>Actualités & médias</h2></div><a class="btn ghost sm" href="${esc(S.settings.social.youtube)}" target="_blank" rel="noopener">KACM TV ${ico("external")}</a></div>
  <nav class="tabs" aria-label="Type de média">${[["articles", "Actualités"], ["photos", "Photos"], ["videos", "Vidéos & highlights"]].map(([k, label]) => `<a class="${mode === k ? "on" : ""}" href="#/news?mode=${k}">${label}</a>`).join("")}</nav>
  ${mode === "articles" ? `<form class="media-filters" data-form="newsFilter"><label>Rechercher<input name="search" placeholder="Un sujet, un joueur…" value="${esc(q.search)}"></label><label>Catégorie<select name="cat"><option value="">Toutes les catégories</option>${MEDIA_CATEGORIES.map(c => `<option ${q.cat === c ? "selected" : ""}>${esc(c)}</option>`).join("")}</select></label><label>Saison<select name="season"><option value="">Toutes les saisons</option>${seasons.map(s => `<option ${q.season === s ? "selected" : ""}>${esc(s)}</option>`).join("")}</select></label><label>Équipe<select name="team"><option value="">Toutes les équipes</option>${["Équipe première", "Académie"].map(s => `<option ${q.team === s ? "selected" : ""}>${s}</option>`).join("")}</select></label><button class="btn sm">Filtrer</button></form><p class="mut result-count">${list.length} article(s)</p><div class="grid g3">${list.map(newsCard).join("") || '<div class="panel"><p>Aucun article pour ces filtres.</p><a href="#/news">Réinitialiser les filtres</a></div>'}</div>` : ""}
  ${mode === "photos" ? `<p class="note">Photographies issues du site de référence, utilisées pour cette présentation. Albums illustratifs.</p><div class="grid g3">${["season-wydad.webp", "season-jadida.webp", "season-tanger.webp", "season-meknes.webp", "kacm-cover.webp", "season-safri.webp"].map((file, i) => `<button class="card album-card" data-act="photoOpen" data-arg="${file}"><img loading="lazy" src="assets/reference/${file}" alt="Galerie KACM — photographie ${i + 1}"><span class="b">${["Le Kawkab en match", "Sur le terrain", "Nos couleurs", "Jour de match", "À l'entraînement", "Le banc du Kawkab"][i]}</span></button>`).join("")}</div>` : ""}
  ${mode === "videos" ? `<p class="note">Les vidéos ouvrent la chaîne KACM TV. Les fichiers de résumés, conférences et interviews seront fournis par le club.</p><div class="grid g3">${S.videos.map((v, i) => `<a class="card" href="${esc(v.url)}" target="_blank" rel="noopener">${img(`assets/reference/${["news-wydad.webp", "season-safri.webp", "kacm-cover.webp"][i % 3]}`, "img", v.title)}<div class="b"><span class="eyebrow">${ico("play")} KACM TV</span><h3>${esc(v.title)}</h3><p>Voir sur YouTube ↗</p></div></a>`).join("")}</div>` : ""}</div></section>`;
};
F.newsFilter = d => go("news?" + new URLSearchParams(d));
A.photoOpen = file => {
  if (!["season-wydad.webp", "season-jadida.webp", "season-tanger.webp", "season-meknes.webp", "kacm-cover.webp", "season-safri.webp"].includes(file)) return;
  openModal(`<h3>La saison en images</h3><img class="lightbox-photo" src="assets/reference/${file}" alt="Photographie du Kawkab Marrakech"><p class="mut">Image du site de référence · galerie de démonstration.</p>`);
};
A.newsopen = id => go("news/" + id);
