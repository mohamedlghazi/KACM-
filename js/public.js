/* Pages publiques — modules 01 à 12 */
const pubNews = () => S.news.filter(n => n.status === "published" || (n.status === "scheduled" && new Date(n.date) <= new Date())).sort((a, b) => new Date(b.date) - new Date(a.date));
const stars = n => `<span class="stars" aria-label="${Math.round(n)} sur 5">${[1, 2, 3, 4, 5].map(i => ico("star", i <= Math.round(n) ? "f" : "")).join("")}</span>`;
const head = (eb, title, link) => `<div class="head"><div><div class="eyebrow">${esc(eb)}</div><h2>${accent(title)}</h2></div>${link ? `<a class="btn ghost sm" href="${link}">${t("more")} →</a>` : ""}</div>`;
const newsCard = n => `<a class="card" href="#/news/${n.id}">${img(n.img, "img", n.cat)}<div class="b"><small>${esc(n.cat)} · ${fdate(n.date, { day: "numeric", month: "short", year: "numeric" })}</small><h3>${esc(n.title)}</h3><p>${esc(n.excerpt)}</p></div></a>`;
const resCard = m => `<a class="res" href="#/match/${m.id}"><span>${m.home ? "KACM" : esc(m.opp)}</span><span class="sc">${score(m)}</span><span>${m.home ? esc(m.opp) : "KACM"}</span></a>`;
const fixCard = m => `<div class="fix"><div><b>${fdate(m.date, { day: "numeric", month: "short" })}</b><br><small>${ftime(m.date)}</small></div><div><a href="#/match/${m.id}"><b>${matchTitle(m)}</b></a><br><small>${esc(m.comp)} · ${m.home ? "Domicile" : "Extérieur"} · ${esc(m.venue)}</small></div><div class="row"><button class="btn ghost sm" data-act="dl" data-arg="${m.id}">${ico("cal")} Agenda</button>${m.onSale ? `<a class="btn sm" href="#/tickets?m=${m.id}">Billets</a>` : ""}</div></div>`;
const productCard = p => `<a class="card" href="#/product/${p.id}">${img(p.img, "img", p.name)}<div class="b"><small>${esc(p.cat)}</small><h3>${esc(p.name)}</h3><div class="price">${money(p.price)}</div></div></a>`;
const playerCard = p => `<a class="card" href="#/player/${p.id}">${avatar(p)}<div class="b"><small>${p.pos}${p.captain ? " · Capitaine" : ""}</small><h3>${esc(p.name)}</h3></div></a>`;
const POSL = { GK: "Gardiens", DEF: "Défenseurs", MID: "Milieux", ATT: "Attaquants" };

/* 01 — Accueil (architecture issue de la maquette validée) */
const TILE_LABELS = [["team", "Bloc « Notre équipe »"], ["history", "Bloc « Notre histoire » (photo d'archive)"], ["palmares", "Bloc « Nos palmarès » (trophées)"], ["shop", "Bloc « Boutique »"], ["tickets", "Bloc « Billetterie »"], ["fans", "Bloc « Supporters »"], ["academy", "Bloc « Académie »"], ["media", "Bloc « KACM Media »"]];
const bgOf = k => { const u = (S.settings.tiles || {})[k]; return u ? `background-image:url('${esc(u)}')` : ""; };
const crest = name => name === "KACM" && S.settings.logo ? `<img class="crest" src="${esc(S.settings.logo)}" alt="KACM">` : `<span class="crest ph" title="Logo adverse non fourni">${esc(String(name).replace(/[^A-Za-zÀ-ÿ0-9 ]/g, "").split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase())}</span>`;
const pan = (k, cls, eb, title, text, label, href) => `<div class="pan ${cls}"><div class="pbg" style="${bgOf(k)}"></div><div class="ptx">${eb ? `<small>${eb}</small>` : ""}<h3>${title}</h3>${text ? `<p>${text}</p>` : ""}<a class="btn sm" href="#/${href}">${label} ${ico("arrow")}</a></div></div>`;
const newsCard2 = n => `<a class="card nc2" href="#/news/${n.id}"><div class="nimg">${img(n.img, "img", n.cat)}<span class="tag">${esc(n.cat)}</span></div><div class="b"><small>${ico("cal")} ${fdate(n.date, { day: "numeric", month: "short", year: "numeric" })}</small><h3>${esc(n.title)}</h3><span class="more">Lire l'article ${ico("arrow")}</span></div></a>`;
ROUTES.home = () => {
  /* Accueil : structure et style repris de l'exemple (header, hero, centre des matchs, actualités, équipe, club, footer) — contenu = données de démonstration */
  const s = S.settings, nm = nextMatch(), lm = lastMatch(), sea = seasonLabel(), comp = (nm || lm || {}).comp || "Botola Pro";
  const L = s.timeline_unused, tl = S.timeline, yrs = ty => tl.filter(x => x.type === ty).map(x => x.y);
  const code = n => String(n).replace(/[^A-Za-zÀ-ÿ ]/g, "").split(" ").filter(Boolean).map(w => w[0]).join("").toUpperCase().slice(0, 3) || "ADV";
  const nm3 = (m, n) => (n === "KACM" ? "Kawkab Marrakech" : n);
  const hs = m => (m.home ? [m.hs, m.as] : [m.as, m.hs]);
  const teamBox = n => `<div class="team">${crest(n)}<strong>${esc(nm3(0, n))}</strong></div>`;
  const dmy = (iso, o) => fdate(iso, o || { day: "numeric", month: "short", year: "numeric" });
  const hero = `<section class="hero" id="accueil" aria-labelledby="hero-title"><picture class="hero-image">${s.heroImage ? `<img src="${esc(s.heroImage)}" alt="L'équipe du Kawkab Marrakech à l'entraînement" width="2048" height="1152">` : ""}</picture><div class="hero-gradient"></div>
    <div class="wrap hero-inner"><div class="hero-copy"><p class="eyebrow hero-kicker"><span></span> ${esc(comp)} <b>·</b> Saison ${sea}</p><h1 id="hero-title">KAWKAB<br>MARRAKECH<span>.</span></h1><p class="hero-subtitle">Le club de la Ville Rouge, depuis 1947.</p>
      <div class="hero-actions"><a class="button" href="#/matches">Les matchs ${ico("arrow")}</a><a class="button ghost" href="#/history">Découvrir le club ${ico("arrow")}</a></div></div>
      ${lm ? `<a class="hero-result" href="#/match/${lm.id}" aria-label="Voir le résultat"><span><i></i> Dernier résultat</span><strong>KACM <b>${lm.hs} – ${lm.as}</b> ${esc(code(lm.opp))}</strong>${ico("arrow")}</a>` : ""}</div></section>`;
  /* centre des matchs */
  const [lh, la] = lm ? hs(lm) : [0, 0], [nh] = nm ? [nm.home] : [true];
  const cardLast = lm ? `<article class="match-card"><div class="match-card-head"><span class="match-label">Dernier résultat</span><span>${dmy(lm.date)} · ${esc(lm.comp)}</span></div><div class="match-teams">${teamBox(lm.home ? "KACM" : lm.opp)}<div class="match-score"><strong>${lh}<span>–</span>${la}</strong><span>Terminé</span></div>${teamBox(lm.home ? lm.opp : "KACM")}</div><div class="match-card-foot"><span>${esc(lm.venue)}</span><a href="#/match/${lm.id}">Le résumé ${ico("arrow")}</a></div></article>` : `<article class="match-card"><div class="match-card-head"><span class="match-label">Dernier résultat</span></div><p style="padding:24px 17px;color:var(--muted)">Aucun résultat pour le moment.</p></article>`;
  const cardNext = nm ? `<article class="match-card"><div class="match-card-head"><span class="match-label next">Prochain match</span><span>${dmy(nm.date)} · ${esc(nm.comp)}</span></div><div class="match-teams">${teamBox(nm.home ? "KACM" : nm.opp)}<div class="match-score versus"><strong>VS</strong><span>${nm.home ? "À domicile" : "À l'extérieur"}</span></div>${teamBox(nm.home ? nm.opp : "KACM")}</div><div class="match-card-foot"><span>${ftime(nm.date)} · ${esc(nm.venue)}</span><button class="text-button" type="button" data-act="mtab" data-arg="fixtures">Calendrier ${ico("arrow")}</button></div></article>` : `<article class="match-card"><div class="match-card-head"><span class="match-label next">Prochain match</span></div><p style="padding:24px 17px;color:var(--muted)">Aucun match programmé.</p></article>`;
  const tb = table(), ri = tb.findIndex(r => r.n === "KACM"), rk = ri + 1, me = tb[ri] || { pts: 0 };
  const cardRank = `<article class="match-rank"><div><p class="eyebrow">Classement</p><strong>${rk}<sup>${rk === 1 ? "er" : "e"}</sup></strong><p>Kawkab Marrakech</p></div><div class="rank-bottom"><span><b>${me.pts}</b> points</span><button class="text-button" type="button" data-act="mtab" data-arg="table" aria-label="Voir le classement">${ico("arrow")}</button></div></article>`;
  const MON = ["JAN", "FÉV", "MAR", "AVR", "MAI", "JUN", "JUL", "AOÛ", "SEP", "OCT", "NOV", "DÉC"];
  const fx = S.matches.filter(m => m.status === "scheduled").sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 3);
  const fixtures = fx.map(m => { const d = new Date(m.date); return `<div class="fixture-row"><time datetime="${m.date.slice(0, 10)}"><strong>${String(d.getDate()).padStart(2, "0")}</strong> ${MON[d.getMonth()]}</time><div><small>${esc(m.comp)} · ${m.home ? "Domicile" : "Extérieur"}</small><strong>${m.home ? "Kawkab Marrakech – " + esc(m.opp) : esc(m.opp) + " – Kawkab Marrakech"}</strong></div><span>${ftime(m.date)}</span></div>`; }).join("") || `<p style="padding:20px 17px;color:var(--muted)">Aucun match programmé.</p>`;
  const rows = tb.slice(0, 5).map((r, i) => `<tr class="${r.n === "KACM" ? "current-club" : ""}"><td>${i + 1}</td><th scope="row">${r.n === "KACM" ? "Kawkab Marrakech" : esc(r.n)}</th><td>${r.p}</td><td>${r.gf - r.ga > 0 ? "+" : ""}${r.gf - r.ga}</td><td>${r.pts}</td></tr>`).join("");
  const matchSec = `<section class="match-section" id="matchs" aria-labelledby="match-title"><div class="wrap section-inner"><div class="section-head"><div><p class="eyebrow section-kicker">${esc(comp)} · ${sea}</p><h2 id="match-title">CENTRE DES MATCHS</h2></div>
    <div class="match-tabs" role="tablist" aria-label="Informations sur les matchs"><button type="button" role="tab" id="tab-overview" aria-selected="true" data-act="mtab" data-arg="overview">À la une</button><button type="button" role="tab" id="tab-fixtures" aria-selected="false" tabindex="-1" data-act="mtab" data-arg="fixtures">Calendrier</button><button type="button" role="tab" id="tab-table" aria-selected="false" tabindex="-1" data-act="mtab" data-arg="table">Classement</button></div></div>
    <div class="match-grid" id="panel-overview" role="tabpanel" aria-labelledby="tab-overview">${cardLast}${cardNext}${cardRank}</div>
    <div class="data-panel" id="panel-fixtures" role="tabpanel" aria-labelledby="tab-fixtures" hidden>${fixtures}<div class="data-foot"><a href="#/matches?tab=cal">Calendrier complet ${ico("arrow")}</a></div></div>
    <div class="data-panel" id="panel-table" role="tabpanel" aria-labelledby="tab-table" hidden><table><caption>Classement (données de démonstration)</caption><thead><tr><th scope="col">Rang</th><th scope="col">Club</th><th scope="col" title="Matchs joués">J</th><th scope="col" title="Différence de buts">Diff.</th><th scope="col" title="Points">Pts</th></tr></thead><tbody>${rows}</tbody></table><div class="data-foot"><a href="#/matches?tab=table">Classement complet ${ico("arrow")}</a></div></div></div></section>`;
  /* prochain match + compte à rebours + billet */
  const cdu = u => `<div><b data-u="${u[0]}">00</b><span>${u[1]}</span></div>`;
  const nextSec = nm ? `<section class="next-section" id="prochain" aria-labelledby="nx-title"><div class="wrap section-inner next-inner"><div class="next-copy"><p class="eyebrow section-kicker">Prochain match · ${esc(nm.comp)}</p><h2 id="nx-title">${nm.home ? "KAWKAB MARRAKECH" : esc(nm.opp).toUpperCase()}<br><em>VS</em> ${nm.home ? esc(nm.opp).toUpperCase() : "KAWKAB MARRAKECH"}</h2><p class="next-meta">${fdate(nm.date, { weekday: "long", day: "numeric", month: "long" })} · ${ftime(nm.date)} · ${esc(nm.venue)}</p>
    <div class="next-actions">${nm.onSale ? `<a class="button" href="#/tickets?m=${nm.id}">Acheter un billet ${ico("ticket")}</a>` : `<a class="button" href="#/tickets">Billetterie ${ico("ticket")}</a>`}<a class="button ghost" href="#/match/${nm.id}">Fiche du match ${ico("arrow")}</a></div></div>
    <div class="next-cd" data-cd="${nm.date}" aria-label="Compte à rebours">${cdu(["d", "Jours"])}${cdu(["h", "Heures"])}${cdu(["m", "Min"])}${cdu(["s", "Sec"])}</div></div></section>` : "";
  /* actualités */
  const nws = pubNews().slice(0, 3);
  const newsSec = `<section class="news-section" id="actualites" aria-labelledby="news-title"><div class="wrap section-inner"><div class="section-head"><div><p class="eyebrow section-kicker">Le fil du Kawkab</p><h2 id="news-title">DERNIÈRES ACTUALITÉS</h2></div></div><div class="news-grid">${nws.map((n, i) => `<article class="news-card ${i === 0 ? "featured" : i === 2 ? "heritage-card" : ""}"><a href="#" data-act="newsopen" data-arg="${n.id}"><div class="news-image">${n.img ? `<img src="${esc(n.img)}" alt="" width="1050" height="590" loading="lazy">` : `<div class="ph-img"><span>${esc(n.cat)}</span></div>`}</div><div class="news-content"><p class="eyebrow"><span>${esc(n.cat)}</span> <time datetime="${n.date.slice(0, 10)}">${dmy(n.date)}</time></p><h3>${esc(n.title)}</h3>${i === 0 ? `<p>${esc(n.excerpt)}</p>` : ""}<span class="news-arrow">${ico("arrow")}</span></div></a></article>`).join("")}</div></div></section>`;
  /* meilleurs joueurs */
  const tops = [...S.players].filter(p => p.status === "active").sort((a, b) => (b.goals * 2 + b.assists) - (a.goals * 2 + a.assists)).slice(0, 4);
  const playersSec = `<section class="top-section" id="joueurs" aria-labelledby="top-title"><div class="wrap section-inner"><div class="section-head"><div><p class="eyebrow section-kicker">Saison ${sea}</p><h2 id="top-title">MEILLEURS JOUEURS</h2></div><a class="outline-link" href="#/team">Tout l'effectif ${ico("arrow")}</a></div><div class="top-grid">${tops.map((p, i) => `<a class="top-card" href="#/player/${p.id}"><span class="top-rank">${i + 1}</span><div class="top-av">${avatar(p)}</div><small>${POSL[p.pos]} · n°${p.num}</small><strong>${esc(p.name)}</strong><div class="top-stats"><span><b>${p.goals}</b> buts</span><span><b>${p.assists}</b> passes</span><span><b>${p.apps}</b> matchs</span></div></a>`).join("")}</div></div></section>`;
  /* vidéos */
  const vidSec = `<section class="video-section" id="videos" aria-labelledby="vid-title"><div class="wrap section-inner"><div class="section-head"><div><p class="eyebrow section-kicker">KACM TV</p><h2 id="vid-title">DERNIÈRES VIDÉOS</h2></div><a class="outline-link" href="${esc(s.social.youtube)}" target="_blank" rel="noopener">Chaîne YouTube ${ico("arrow")}</a></div><div class="video-grid">${S.videos.slice(0, 3).map(v => `<a class="video-card" href="${esc(v.url)}" target="_blank" rel="noopener"><div class="video-thumb"><span class="play">${ico("play", "f")}</span></div><strong>${esc(v.title)}</strong></a>`).join("")}</div></div></section>`;
  /* boutique */
  const prods = S.products.filter(p => p.active).slice(-4).reverse();
  const shopSec = `<section class="shop-section" id="boutique" aria-labelledby="shop-title"><div class="wrap section-inner"><div class="section-head"><div><p class="eyebrow section-kicker">Boutique officielle</p><h2 id="shop-title">NOUVEAUTÉS</h2></div><a class="outline-link" href="#/store">Toute la boutique ${ico("arrow")}</a></div><div class="shop-grid">${prods.map(p => `<a class="shop-card" href="#/product/${p.id}"><div class="shop-img">${p.img ? `<img src="${esc(p.img)}" alt="" loading="lazy">` : `<div class="ph-img"><span>${esc(p.cat)}</span></div>`}</div><small>${esc(p.cat)}</small><strong>${esc(p.name)}</strong><b>${money(p.price)}</b></a>`).join("")}</div></div></section>`;
  /* partenaires */
  const spSec = `<section class="sponsor-section" id="partenaires" aria-labelledby="sp-title"><div class="wrap section-inner"><div class="section-head"><div><p class="eyebrow section-kicker">Ils nous soutiennent</p><h2 id="sp-title">PARTENAIRES OFFICIELS</h2></div></div><div class="sponsor-row">${S.sponsors.map(x => `<div class="sponsor">${x.logo ? `<img src="${esc(x.logo)}" alt="${esc(x.name)}">` : `<span>${esc(x.name.replace(" (démo)", ""))}</span>`}</div>`).join("")}</div></div></section>`;
  /* newsletter + réseaux */
  const soc = [["facebook", "Facebook"], ["instagram", "Instagram"], ["youtube", "YouTube"]];
  const nlSec = `<section class="nl-section" id="newsletter" aria-labelledby="nl-title"><div class="wrap section-inner nl-inner"><div><p class="eyebrow section-kicker">Newsletter</p><h2 id="nl-title">RESTEZ DANS LE JEU</h2><p>Recevez les actualités, les résultats et les offres du club directement dans votre boîte mail.</p></div>
    <div><form class="nl-form" data-form="newsletter"><input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><input name="email" type="email" required placeholder="Votre adresse e-mail" aria-label="E-mail"><button class="button" type="submit">Je m'abonne</button></form><div class="nl-social">${soc.map(([k, n]) => `<a href="${esc(s.social[k])}" target="_blank" rel="noopener" aria-label="${n}">${ico(k)}<span>${n}</span></a>`).join("")}</div></div></div></section>`;
  /* équipe + club */
  const teamSec = `<section class="team-section" id="equipe" aria-labelledby="team-title"><div class="wrap team-inner"><div class="team-photo">${(s.tiles && s.tiles.team) ? `<img src="${esc(s.tiles.team)}" alt="L'équipe du Kawkab Marrakech" width="1024" height="653" loading="lazy">` : ""}</div><div class="team-copy"><p class="eyebrow section-kicker">Équipe première · ${sea}</p><h2 id="team-title">LES ROUGES<br>ET BLANCS</h2><p>Retrouvez l'effectif, le staff technique et le profil de chaque joueur du Kawkab de Marrakech.</p><a class="button" href="#/team">Voir l'effectif ${ico("arrow")}</a></div></div></section>`;
  const hon = (n, label, ty) => `<div>${ico("trophy")}<dt>${label}</dt><dd>${yrs(ty).length}</dd><dd class="years">${yrs(ty).join(" · ") || "—"}</dd></div>`;
  const clubSec = `<section class="club-section" id="club" aria-labelledby="club-title"><div class="wrap section-inner"><div class="club-copy"><p class="eyebrow section-kicker">Histoire &amp; palmarès</p><h2 id="club-title">MARRAKECH.<br>DEPUIS 1947.</h2><p>Fondé en 1947, le Kawkab porte les couleurs de Marrakech sur les terrains du Maroc. En 1996, il inscrit son nom au palmarès de la Coupe de la CAF.</p><a class="outline-link" href="#/history">L'histoire du club ${ico("arrow")}</a></div>
    <dl class="honours">${hon(0, "Championnats du Maroc", "league")}${hon(0, "Coupes du Trône", "throne")}${hon(0, "Coupe de la CAF", "caf")}</dl></div></section>`;
  return `<div class="rx"><main id="contenu">${hero}${nextSec}${matchSec}${newsSec}${playersSec}${vidSec}${shopSec}${teamSec}${clubSec}${spSec}${nlSec}</main></div>`;
};
const seasonLabel = () => { const d = new Date(), y = d.getMonth() >= 6 ? d.getFullYear() : d.getFullYear() - 1; return y + "/" + String((y + 1) % 100).padStart(2, "0"); };
A.newsopen = id => { const n = byId(S.news, +id); if (!n) return; openModal(`<p class="eyebrow">${esc(n.cat)} · ${fdate(n.date)}</p><h3>${esc(n.title)}</h3><p>${esc(n.body || n.excerpt)}</p>`); };
A.mtab = id => { ["overview", "fixtures", "table"].forEach(k => { const p = $("#panel-" + k), b = $("#tab-" + k); if (p) p.hidden = k !== id; if (b) { b.setAttribute("aria-selected", String(k === id)); b.tabIndex = k === id ? 0 : -1; } }); };
F.newsletter = d => { if (d.website) return; if (S.newsletter.some(n => n.email.toLowerCase() === d.email.toLowerCase())) return toast("Déjà inscrit", "err"); S.newsletter.push({ email: d.email, at: new Date().toISOString(), confirmed: true }); save(); toast("Inscription enregistrée (e-mail de confirmation simulé)"); };

/* 02 — Match Center */
ROUTES.matches = (a, q) => {
  const tab = q.tab || "cal", tabs = [["cal", "Calendrier"], ["res", "Résultats"], ["live", "Direct"], ["table", "Classement"]];
  let body = "";
  if (tab === "cal") body = S.matches.filter(m => m.status === "scheduled").sort((a, b) => new Date(a.date) - new Date(b.date)).map(fixCard).join("") || "<p>Aucun match à venir.</p>";
  if (tab === "res") body = `<div class="grid g3">${S.matches.filter(m => m.status === "finished").sort((a, b) => new Date(b.date) - new Date(a.date)).map(m => `<div>${resCard(m)}<small class="mut">${fdate(m.date)} · ${esc(m.comp)}</small></div>`).join("")}</div>`;
  if (tab === "live") { const lv = liveMatch(); body = lv ? liveView(lv) : `<div class="note">Aucun match en direct. Les scores en direct apparaissent ici dès le coup d'envoi.</div>`; }
  if (tab === "table") body = `<div class="xs"><table><thead><tr><th>#</th><th>Équipe</th><th>J</th><th>G</th><th>N</th><th>P</th><th>BP</th><th>BC</th><th>Diff</th><th>Pts</th></tr></thead><tbody>${table().map((r, i) => `<tr class="${r.n === "KACM" ? "me" : ""}"><td>${i + 1}</td><td>${esc(r.n)}</td><td>${r.p}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${r.gf}</td><td>${r.ga}</td><td>${r.gf - r.ga}</td><td><b>${r.pts}</b></td></tr>`).join("")}</tbody></table></div><p class="mut">Classement de démonstration.</p>`;
  return `<section class="s"><div class="wrap"><div class="eyebrow">Match Center</div><h2>${t("matches")}</h2><div class="tabs">${tabs.map(([k, l]) => `<a href="#/matches?tab=${k}" class="${tab === k ? "on" : ""}">${l}</a>`).join("")}</div>${body}</div></section>`;
};
function eventsList(m) { return m.events.length ? [...m.events].sort((a, b) => b.min - a.min).map(e => `<div class="ev"><b>${e.min}'</b><span>${{ goal: ico("ball") + " But", yellow: ico("card", "f cy") + " Carton jaune", red: ico("card", "f cr") + " Carton rouge", sub: ico("sub") + " Remplacement", note: ico("note") }[e.type] || ""} — ${e.team === "us" ? "KACM" : esc(m.opp)} · ${esc(e.label || "")}</span></div>`).join("") : "<p class='mut'>Aucun événement saisi.</p>"; }
function statsBars(m) { if (!m.stats) return "<p class='mut'>Statistiques non saisies.</p>"; const L = { poss: "Possession %", shots: "Tirs", target: "Tirs cadrés", corners: "Corners", fouls: "Fautes" };
  return Object.entries(L).map(([k, l]) => { const [a, b] = m.stats[k] || [0, 0], tot = (a + b) || 1; return `<div class="bar2"><b>${a}</b><div><small>${l}</small><i><u style="width:${a / tot * 100}%"></u></i></div><b>${b}</b></div>`; }).join(""); }
function liveView(m) { return `<div class="panel"><div class="res" style="box-shadow:none"><span>KACM</span><span class="sc">${m.hs} - ${m.as}</span><span>${esc(m.opp)}</span></div><p><span class="badge live">Direct</span> Minute ${m.minute}'</p></div><div class="two"><div class="panel"><h3>Événements</h3>${eventsList(m)}</div><div class="panel"><h3>Statistiques</h3>${statsBars(m)}</div></div>`; }
function pitch(m) {
  const lines = [1, ...m.formation.split("-").map(Number)], pl = []; let i = 0;
  lines.forEach((n, li) => { for (let j = 0; j < n; j++) { const p = byId(S.players, m.lineup[i++]); if (p) pl.push(`<div class="pl" style="left:${(j + 1) / (n + 1) * 100}%;top:${92 - li * (84 / (lines.length - 1))}%"><b>${p.num}</b>${esc(p.name.replace("Joueur Démo", "J."))}</div>`); } });
  return `<div class="pitch" role="img" aria-label="Formation ${m.formation}">${pl.join("")}</div><p style="text-align:center" class="mut">Formation ${m.formation}</p>`;
}
ROUTES.match = ([id]) => {
  const m = byId(S.matches, id); if (!m) return ROUTES.notfound();
  const st = S.settings.stadium;
  return `<section class="s"><div class="wrap"><a href="#/matches">← Match Center</a><div class="eyebrow" style="margin-top:12px">${esc(m.comp)} · ${m.status === "live" ? '<span class="badge live">Direct</span>' : m.status === "finished" ? "Terminé" : "À venir"}</div><h2>${matchTitle(m)}</h2>
  <div class="panel"><div class="res" style="box-shadow:none"><span>${m.home ? "KACM" : esc(m.opp)}</span><span class="sc">${m.status === "scheduled" ? "vs" : score(m)}</span><span>${m.home ? esc(m.opp) : "KACM"}</span></div><p>${fdate(m.date)} · ${ftime(m.date)} · ${esc(m.venue)}</p>${m.status === "scheduled" ? cd(m.date).replace('class="cd"', 'class="cd" style="color:#111;max-width:380px"') : ""}<div class="row" style="margin-top:14px"><button class="btn ghost sm" data-act="dl" data-arg="${m.id}">${ico("cal")} Ajouter à l'agenda</button>${m.onSale ? `<a class="btn sm" href="#/tickets?m=${m.id}">${t("buy")}</a>` : ""}</div></div>
  <div class="two"><div><div class="panel"><h3>Aperçu du match</h3><p>${m.status === "scheduled" ? "Présentation avant-match à rédiger par la rédaction (démo)." : esc(m.report || "Compte rendu à venir.")}</p></div>
  <div class="panel"><h3>Événements</h3>${eventsList(m)}</div><div class="panel"><h3>Statistiques</h3>${statsBars(m)}</div>
  <div class="panel"><h3>Photos & vidéos</h3><div class="grid g4"><div class="img ph"><span>Photo (démo)</span></div><div class="img ph"><span>Photo (démo)</span></div><div class="img ph"><span>${ico("play", "f")} Vidéo (démo)</span></div></div></div></div>
  <div><div class="panel"><h3>Composition officielle</h3>${pitch(m)}<p style="margin-top:10px"><b>Entraîneur :</b> ${esc(S.settings.coach)}</p></div>
  <div class="panel"><h3>Stade</h3><p>${esc(m.venue)}<br><small class="mut">${esc(st.address)}</small></p><iframe title="Carte" loading="lazy" style="width:100%;height:200px;border:0" src="https://maps.google.com/maps?q=${esc(st.lat)},${esc(st.lng)}&z=14&output=embed"></iframe></div></div></div></div></section>`;
};

/* 03 — Équipe */
ROUTES.team = (a, q) => {
  const pos = q.pos || "", term = (q.s || "").toLowerCase(), pl = S.players.filter(p => p.status === "active" && (!pos || p.pos === pos) && p.name.toLowerCase().includes(term));
  const blocks = (pos ? [pos] : ["GK", "DEF", "MID", "ATT"]).map(k => { const l = pl.filter(p => p.pos === k); return l.length ? `<h3 style="margin:24px 0 12px">${POSL[k]}</h3><div class="grid g4">${l.map(playerCard).join("")}</div>` : ""; }).join("");
  const st = r => S.staff.filter(x => x.role === r).map(x => `<li>${esc(x.name)}</li>`).join("");
  const cap = S.players.find(p => p.captain);
  return `<section class="s"><div class="wrap"><div class="eyebrow">Effectif professionnel</div><h2>${t("team")}</h2>
  <form class="tb" onsubmit="event.preventDefault();go('team?pos='+this.pos.value+'&s='+encodeURIComponent(this.s.value))"><input name="s" placeholder="Rechercher un joueur" value="${esc(q.s || "")}" aria-label="Recherche"><select name="pos" aria-label="Poste"><option value="">Tous les postes</option>${Object.entries(POSL).map(([k, v]) => `<option value="${k}" ${pos === k ? "selected" : ""}>${v}</option>`).join("")}</select><button class="btn sm">Filtrer</button></form>
  ${cap ? `<p><span class="badge">Capitaine</span> ${esc(cap.name)}</p>` : ""}${blocks || "<p>Aucun joueur.</p>"}
  <h3 style="margin:40px 0 12px">Staff</h3><div class="grid g3"><div class="panel"><h3>Entraîneur</h3><ul><li>${esc(S.settings.coach)}</li></ul></div><div class="panel"><h3>Staff technique</h3><ul>${st("tech")}</ul></div><div class="panel"><h3>Staff médical</h3><ul>${st("med")}</ul></div></div></div></section>`;
};
ROUTES.player = ([id]) => {
  const p = byId(S.players, id); if (!p) return ROUTES.notfound();
  const priv = p.showPrivate ? `<tr><th>Naissance</th><td>${esc(p.birth || "—")}</td></tr><tr><th>Taille / Poids</th><td>${esc(p.height || "—")} cm / ${esc(p.weight || "—")} kg</td></tr>` : `<tr><th>Données privées</th><td class="mut">Non publiées (accord du joueur/club requis)</td></tr>`;
  return `<section class="s"><div class="wrap"><a href="#/team">← Effectif</a><div class="split" style="margin-top:16px;align-items:start"><div style="max-width:360px">${avatar(p)}</div><div><div class="eyebrow">${POSL[p.pos]}${p.captain ? " · Capitaine" : ""}</div><h2>${esc(p.name)}</h2><p>${esc(p.bio)}</p>
  <table><tbody><tr><th>Numéro</th><td>${p.num}</td></tr><tr><th>Nationalité</th><td>${esc(p.nat)}</td></tr>${priv}<tr><th>Arrivée</th><td>${esc(p.joined || "—")}</td></tr></tbody></table>
  <h3 style="margin:20px 0 10px">Statistiques de la saison (démo)</h3><div class="kpis">${[["Matchs", p.apps], ["Buts", p.goals], ["Passes déc.", p.assists], ["Minutes", p.min], ["Jaunes", p.yc], ["Rouges", p.rc]].map(([l, v]) => `<div class="kpi"><b>${v}</b><span>${l}</span></div>`).join("")}</div></div></div></div></section>`;
};

/* 04 — Histoire */
ROUTES.history = () => {
  const c = ty => S.timeline.filter(x => x.type === ty);
  const pal = [["Championnat du Maroc", c("league")], ["Coupe du Trône", c("throne")], ["Coupe de la CAF", c("caf")]];
  return `<section class="s"><div class="wrap"><div class="eyebrow">Depuis 1947</div><h2>${t("history")} & Palmarès</h2>
  <div class="kpis">${pal.map(([n, l]) => `<div class="kpi"><b>${l.length}</b><span>${n}<br>${l.map(x => x.y).join(" · ") || "—"}</span></div>`).join("")}</div>
  <div class="split" style="align-items:start"><div class="tl">${[...S.timeline].sort((a, b) => a.y - b.y).map(x => `<div class="it"><div class="y">${x.y}</div><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p><div class="img ph" style="max-width:300px;margin-top:8px"><span>Photo / vidéo d'archive (à fournir)</span></div></div>`).join("")}</div>
  <div class="panel"><h3>Compétitions africaines</h3><p>Vainqueur de la Coupe de la CAF en 1996, le Kawkab a porté les couleurs de Marrakech sur la scène continentale.</p></div></div></div></section>`;
};

A.share = id => { const u = location.href; if (navigator.share) navigator.share({ title: "KACM", url: u }).catch(() => { }); else { navigator.clipboard && navigator.clipboard.writeText(u); toast("Lien copié"); } };

/* 05 — Billetterie */
const TK = { seats: [], cat: 0, qty: 1 };
const seatsTaken = (mid, ci) => S.tickets.filter(x => x.mid === mid && x.ci === ci && x.seat && x.status !== "refunded").map(x => x.seat);
ROUTES.tickets = (a, q) => {
  const list = S.matches.filter(m => m.status === "scheduled" && m.onSale);
  if (!q.m) return `<section class="s"><div class="wrap"><div class="eyebrow">Billetterie</div><h2>${t("tickets")}</h2>${list.map(m => `<div class="fix"><div><b>${fdate(m.date, { day: "numeric", month: "short" })}</b><br><small>${ftime(m.date)}</small></div><div><b>${matchTitle(m)}</b><br><small>${esc(m.comp)} · ${esc(m.venue)}</small></div><a class="btn sm" href="#/tickets?m=${m.id}">Choisir</a></div>`).join("") || "<p>Aucune vente ouverte.</p>"}
    </div></section>`;
  const m = byId(S.matches, q.m); if (!m || !m.onSale) return ROUTES.notfound();
  const ci = +(q.c ?? TK.cat ?? 0), c = m.sale.cats[ci] || m.sale.cats[0], left = c.quota - c.sold, taken = seatsTaken(m.id, ci);
  const seatGrid = c.numbered ? `<h3 style="margin:16px 0 8px">Choisir ${TK.qty} place(s)</h3><div class="seat">${["A", "B", "C", "D"].flatMap(r => Array.from({ length: 10 }, (_, i) => r + (i + 1))).map(s => `<button type="button" data-act="seat" data-arg="${s}" class="${TK.seats.includes(s) ? "on" : ""}" ${taken.includes(s) ? "disabled" : ""}>${s}</button>`).join("")}</div>` : "";
  return `<section class="s"><div class="wrap"><a href="#/tickets">← Matchs</a><div class="eyebrow" style="margin-top:10px">Réservation</div><h2>${matchTitle(m)}</h2><p>${fdate(m.date)} · ${ftime(m.date)} · ${esc(m.venue)}</p>
  <div class="steps"><span class="on">1 Catégorie</span><span>2 Paiement</span><span>3 Billet QR</span></div><div class="two"><div class="panel"><h3>Catégorie</h3><div class="pills">${m.sale.cats.map((x, i) => `<button class="${i === ci ? "on" : ""}" data-act="tkcat" data-arg="${m.id}:${i}">${esc(x.name)} — ${money(x.price)}</button>`).join("")}</div>
   <p>Disponibles : <b>${Math.max(0, left)}</b> / ${c.quota}</p><label>Quantité (max 4) <select data-chg="tkqty">${[1, 2, 3, 4].map(n => `<option ${TK.qty === n ? "selected" : ""}>${n}</option>`).join("")}</select></label>${seatGrid}</div>
   <div class="panel"><h3>Récapitulatif</h3><p>${TK.qty} × ${esc(c.name)}</p><div class="price">${money(c.price * TK.qty)}</div><button class="btn block" style="margin-top:14px" data-act="tkbuy" data-arg="${m.id}:${ci}" ${left < TK.qty ? "disabled" : ""}>Continuer vers le paiement</button><p class="mut" style="margin-top:10px;font-size:.8rem">Annulation/remboursement : jusqu'à 48 h avant le match (politique de démonstration).</p></div></div></div></section>`;
};
A.tkcat = arg => { const [m, i] = arg.split(":"); TK.cat = +i; TK.seats = []; go(`tickets?m=${m}&c=${i}`); };
A.tkqty = v => { TK.qty = +v; TK.seats = TK.seats.slice(0, TK.qty); rerender(); };
A.seat = s => { const i = TK.seats.indexOf(s); if (i >= 0) TK.seats.splice(i, 1); else { if (TK.seats.length >= TK.qty) TK.seats.shift(); TK.seats.push(s); } rerender(); };
A.tkbuy = arg => {
  const [mid, ci] = arg.split(":").map(Number), m = byId(S.matches, mid), c = m.sale.cats[ci];
  if (c.numbered && TK.seats.length !== TK.qty) return toast("Choisissez exactement " + TK.qty + " place(s)", "err");
  if (!user()) return loginModal("Connectez-vous pour acheter vos billets.");
  openModal(`<h3>Paiement (sandbox)</h3><p>${TK.qty} × ${esc(c.name)} — <b>${money(c.price * TK.qty)}</b></p><div class="note">Aucune carte bancaire n'est saisie ni stockée. En production, redirection vers la passerelle de paiement agréée (3-D Secure) et confirmation par webhook signé.</div><button class="btn block" data-act="tkpaid" data-arg="${arg}">Simuler un paiement réussi</button>`);
};
A.tkpaid = arg => {
  const [mid, ci] = arg.split(":").map(Number), m = byId(S.matches, mid), c = m.sale.cats[ci];
  if (c.quota - c.sold < TK.qty) { closeModal(); return toast("Plus assez de places", "err"); }
  const taken = seatsTaken(mid, ci); if (TK.seats.some(s => taken.includes(s))) { closeModal(); return toast("Une place vient d'être prise", "err"); }
  const oid = nextId(S.ticketOrders); S.ticketOrders.push({ id: oid, uid: S.ui.uid, mid, total: c.price * TK.qty, status: "paid", at: new Date().toISOString() });
  for (let i = 0; i < TK.qty; i++) S.tickets.push({ id: nextId(S.tickets), oid, uid: S.ui.uid, mid, ci, cat: c.name, seat: c.numbered ? TK.seats[i] : "", price: c.price, code: "KACM-" + Math.random().toString(36).slice(2, 8).toUpperCase() + "-" + (S.tickets.length + 1), status: "valid" });
  c.sold += TK.qty; notify(`Billets confirmés : ${matchTitle(m).replace(/<[^>]+>/g, "")} (e-mail simulé envoyé)`); TK.seats = []; TK.qty = 1; save(); closeModal(); toast("Paiement confirmé — billets générés"); go("account/tickets");
};
const tkHtml = x => { const m = byId(S.matches, x.mid); return `<div class="tk"><div class="b"><span class="badge ${x.status === "valid" ? "ok" : x.status === "used" ? "gr" : "wn"}">${x.status}</span><h3 style="margin-top:6px">${m ? matchTitle(m) : ""}</h3><p>${m ? fdate(m.date) + " · " + ftime(m.date) : ""}<br>${esc(x.cat)}${x.seat ? " · place " + x.seat : ""} · ${money(x.price)}</p><small class="mut">${x.code}</small>
 <div class="row noprint" style="margin-top:10px"><button class="btn ghost sm" data-act="tkpdf" data-arg="${x.id}">PDF</button>${x.status === "valid" ? `<button class="btn ghost sm" data-act="tkcancel" data-arg="${x.id}">Annuler / rembourser</button>` : ""}</div></div><div class="q">${qr(x.code)}</div></div>`; };
A.tkpdf = id => { const x = byId(S.tickets, id), w = window.open("", "_blank"); if (!w) return toast("Autorisez les pop-ups", "err"); w.document.write(`<title>Billet ${x.code}</title><link rel=stylesheet href="${location.href.replace(/[#?].*$/, "").replace(/[^/]*$/, "")}css/style.css"><body style="padding:20px">${tkHtml(x).replace(/<div class="row noprint".*?<\/div><\/div>/s, "</div>")}<p>Imprimez ou « Enregistrer en PDF ».</p><script>setTimeout(()=>print(),500)<\/script>`); w.document.close(); };
A.tkcancel = id => { const x = byId(S.tickets, id), m = byId(S.matches, x.mid);
  if (new Date(m.date) - Date.now() < 48 * 3600e3) return toast("Annulation impossible à moins de 48 h du match", "err");
  x.status = "refunded"; m.sale.cats[x.ci].sold--; const o = byId(S.ticketOrders, x.oid); if (o && S.tickets.filter(t => t.oid === o.id && t.status !== "refunded").length === 0) o.status = "refunded"; notify("Remboursement de billet enregistré (démo)"); save(); toast("Billet annulé, remboursement initié"); rerender(); };

/* 06 — Boutique */
const CK = { coupon: "", ship: "std" };
const SHIP = { pickup: ["Retrait au stade", 0], std: ["Livraison standard", 30], exp: ["Express", 60] };
ROUTES.store = (a, q) => {
  const cats = [...new Set(S.products.map(p => p.cat))], term = (q.q || "").toLowerCase(), l = S.products.filter(p => p.active && (!q.cat || p.cat === q.cat) && p.name.toLowerCase().includes(term));
  return `<section class="s"><div class="wrap"><div class="eyebrow">Boutique officielle</div><h2>${t("store")}</h2><div class="pills"><button class="${!q.cat ? "on" : ""}" onclick="go('store')">Tout</button>${cats.map(c => `<button class="${q.cat === c ? "on" : ""}" onclick="go('store?cat='+encodeURIComponent(this.textContent))">${esc(c)}</button>`).join("")}</div>
  <form class="tb" onsubmit="event.preventDefault();go('store?q='+encodeURIComponent(this.q.value))"><input name="q" placeholder="Rechercher un produit" value="${esc(q.q || "")}" aria-label="Recherche"><button class="btn sm">Rechercher</button></form><div class="grid g4">${l.map(productCard).join("") || "<p>Aucun produit.</p>"}</div></div></section>`;
};
const avg = p => p.reviews.length ? p.reviews.reduce((a, r) => a + r.r, 0) / p.reviews.length : 0;
ROUTES.product = ([id]) => {
  const p = byId(S.products, id); if (!p) return ROUTES.notfound(); const wl = S.wishlist.includes(p.id);
  return `<section class="s"><div class="wrap"><a href="#/store">← Boutique</a><div class="split" style="margin-top:16px;align-items:start">${img(p.img, "img", p.name).replace('class="img', 'style="aspect-ratio:1" class="img')}<div><div class="eyebrow">${esc(p.cat)}</div><h2>${esc(p.name)}</h2>${stars(avg(p))}<div class="price" style="margin:8px 0">${money(p.price)}</div><p>${esc(p.desc)}</p>
  <form class="form" data-form="addcart" style="margin-top:16px"><input type="hidden" name="pid" value="${p.id}"><div class="two-c"><label>Taille<select name="size">${p.sizes.split(",").map(s => `<option>${esc(s.trim())}</option>`).join("")}</select></label><label>Couleur<select name="color">${p.colors.split(",").map(s => `<option>${esc(s.trim())}</option>`).join("")}</select></label></div>
  ${p.customizable ? `<div class="two-c"><label>Nom floqué (optionnel)<input name="cname" maxlength="12"></label><label>Numéro (optionnel)<input name="cnum" type="number" min="0" max="99"></label></div><small class="mut">Personnalisation +50 MAD</small>` : ""}
  <label>Quantité<input type="number" name="qty" value="1" min="1" max="${Math.max(1, p.stock)}"></label><p>${p.stock > 0 ? `En stock : ${p.stock}` : "<b style='color:var(--red)'>Rupture de stock</b>"}</p><div class="row"><button class="btn" ${p.stock < 1 ? "disabled" : ""}>Ajouter au panier</button><button type="button" class="btn ghost" data-act="wish" data-arg="${p.id}">${ico("heart", wl ? "f" : "")} ${wl ? "Dans ma wishlist" : "Wishlist"}</button></div></form></div></div>
  <h3 style="margin:30px 0 10px">Avis (${p.reviews.length})</h3>${p.reviews.map(r => `<div class="panel">${stars(r.r)} <b>${esc(r.u)}</b><p>${esc(r.t)}</p></div>`).join("")}
  <form class="form panel" data-form="review" style="max-width:500px"><input type="hidden" name="pid" value="${p.id}"><label>Note<select name="r">${[5, 4, 3, 2, 1].map(n => `<option>${n}</option>`).join("")}</select></label><label>Commentaire<textarea name="t" required minlength="3"></textarea></label><button class="btn sm">Publier l'avis</button></form></div></section>`;
};
F.review = d => { if (!user()) return loginModal("Connectez-vous pour laisser un avis."); const p = byId(S.products, d.pid); p.reviews.push({ u: user().name, r: +d.r, t: d.t }); save(); toast("Avis publié"); rerender(); };
A.wish = id => { id = +id; const i = S.wishlist.indexOf(id); i >= 0 ? S.wishlist.splice(i, 1) : S.wishlist.push(id); save(); rerender(); };
F.addcart = d => { const p = byId(S.products, d.pid), qty = Math.min(+d.qty, p.stock); if (qty < 1) return toast("Stock insuffisant", "err");
  const custom = d.cname || d.cnum ? { n: d.cname || "", u: d.cnum || "" } : null;
  const ex = S.cart.find(c => c.pid === p.id && c.size === d.size && c.color === d.color && JSON.stringify(c.custom || null) === JSON.stringify(custom));
  ex ? ex.qty += qty : S.cart.push({ pid: p.id, size: d.size, color: d.color, qty, custom }); save(); toast("Ajouté au panier"); chrome("product"); };
const lineTotal = c => { const p = byId(S.products, c.pid); return (p.price + (c.custom ? 50 : 0)) * c.qty; };
function totals() { const sub = S.cart.reduce((a, c) => a + lineTotal(c), 0), pc = S.settings.coupons[CK.coupon] || 0, disc = Math.round(sub * pc / 100), ship = S.cart.length ? SHIP[CK.ship][1] : 0; return { sub, disc, ship, total: sub - disc + ship }; }
ROUTES.cart = () => { const T = totals();
  return `<section class="s"><div class="wrap"><h2>Panier</h2>${S.cart.length ? `<div class="two"><div>${S.cart.map((c, i) => { const p = byId(S.products, c.pid); return `<div class="fix" style="grid-template-columns:1fr auto auto"><div><b>${esc(p.name)}</b><br><small>${esc(c.size)} · ${esc(c.color)}${c.custom ? " · flocage " + esc(c.custom.n) + " " + esc(c.custom.u) : ""}</small></div><div class="row"><button class="btn ghost sm" data-act="qty" data-arg="${i}:-1">−</button><b>${c.qty}</b><button class="btn ghost sm" data-act="qty" data-arg="${i}:1">+</button></div><div><b>${money(lineTotal(c))}</b> <button class="btn danger sm" data-act="rmcart" data-arg="${i}" aria-label="Supprimer">${ico("x")}</button></div></div>`; }).join("")}</div>
  <div class="panel"><h3>Résumé</h3><label>Livraison<select data-chg="ship">${Object.entries(SHIP).map(([k, v]) => `<option value="${k}" ${CK.ship === k ? "selected" : ""}>${v[0]} (${money(v[1])})</option>`).join("")}</select></label>
  <form class="tb" style="margin-top:10px" data-form="coupon"><input name="code" placeholder="Code promo (ex. KACM10)" value="${esc(CK.coupon)}"><button class="btn ghost sm">OK</button></form>
  <p>Sous-total : ${money(T.sub)}<br>Remise : −${money(T.disc)}<br>Livraison : ${money(T.ship)}</p><div class="price">${money(T.total)}</div><a class="btn block" style="margin-top:12px" href="#/checkout">Passer la commande</a></div></div>` : `<p>Votre panier est vide. <a href="#/store" style="color:var(--red)">Voir la boutique</a></p>`}</div></section>`; };
A.qty = arg => { const [i, d] = arg.split(":").map(Number), c = S.cart[i], p = byId(S.products, c.pid); c.qty = Math.max(1, Math.min(p.stock, c.qty + d)); save(); rerender(); };
A.rmcart = i => { S.cart.splice(+i, 1); save(); rerender(); };
A.ship = v => { CK.ship = v; rerender(); };
F.coupon = d => { const c = d.code.trim().toUpperCase(); if (c && !S.settings.coupons[c]) { CK.coupon = ""; toast("Code invalide", "err"); } else { CK.coupon = c; toast(c ? "Code appliqué" : "Code retiré"); } rerender(); };
ROUTES.checkout = () => { if (!S.cart.length) return ROUTES.cart(); const T = totals(), u = user() || {};
  return `<section class="s"><div class="wrap"><h2>Commande</h2><div class="two"><form class="form panel" data-form="checkout"><div class="two-c"><label>Nom complet<input name="name" required value="${esc(u.name || "")}"></label><label>Téléphone<input name="phone" required pattern="[0-9+ ]{9,15}" title="9 à 15 chiffres" value="${esc(u.phone || "")}"></label></div><label>E-mail<input name="email" type="email" required value="${esc(u.email || "")}"></label><label>Adresse<input name="addr" required minlength="5"></label><label>Ville<input name="city" required></label>
  <label>Paiement<select name="pay"><option value="card">Carte bancaire (sandbox)</option>${S.settings.cod ? '<option value="cod">Paiement à la livraison</option>' : ""}</select></label><div class="note">Aucune donnée de carte n'est collectée ici. En production : passerelle de paiement agréée.</div><button class="btn">Confirmer la commande — ${money(T.total)}</button></form>
  <div class="panel"><h3>Résumé</h3>${S.cart.map(c => `<p>${c.qty} × ${esc(byId(S.products, c.pid).name)}</p>`).join("")}<p>${SHIP[CK.ship][0]} : ${money(T.ship)}</p><div class="price">${money(T.total)}</div></div></div></div></section>`; };
F.checkout = d => {
  if (!user()) return loginModal("Connectez-vous pour finaliser la commande.");
  for (const c of S.cart) { const p = byId(S.products, c.pid); if (p.stock < c.qty) return toast("Stock insuffisant : " + p.name, "err"); }
  const T = totals(), id = nextId(S.orders), paid = d.pay === "card";
  S.cart.forEach(c => { byId(S.products, c.pid).stock -= c.qty; });
  S.orders.push({ id, no: "CMD-" + String(1000 + id), uid: S.ui.uid, items: S.cart.map(c => ({ name: byId(S.products, c.pid).name, size: c.size, color: c.color, qty: c.qty, unit: byId(S.products, c.pid).price + (c.custom ? 50 : 0), custom: c.custom })), ...T, ship: T.ship, shipName: SHIP[CK.ship][0], pay: d.pay, paid, status: paid ? "paid" : "pending", name: d.name, phone: d.phone, addr: d.addr + ", " + d.city, at: new Date().toISOString(), tracking: "" });
  notify(`Commande CMD-${1000 + id} confirmée (e-mail simulé)`); S.cart = []; CK.coupon = ""; save(); toast("Commande confirmée"); go("account/orders");
};
const OSTEPS = ["pending", "paid", "shipped", "delivered"];
A.invoice = id => { const o = byId(S.orders, id), w = window.open("", "_blank"); if (!w) return toast("Autorisez les pop-ups", "err");
  w.document.write(`<title>Facture ${o.no}</title><body style="font-family:sans-serif;padding:30px"><h1>Facture ${o.no}</h1><p>KACM — ${fdate(o.at)}<br>Client : ${esc(o.name)}, ${esc(o.addr)}</p><table border=1 cellpadding=6 style="border-collapse:collapse"><tr><th>Article</th><th>Qté</th><th>PU</th></tr>${o.items.map(i => `<tr><td>${esc(i.name)} ${esc(i.size)}</td><td>${i.qty}</td><td>${money(i.unit)}</td></tr>`).join("")}</table><p>Remise : ${money(o.disc)} · Livraison : ${money(o.ship)}</p><h2>Total : ${money(o.total)} (${o.paid ? "payé" : "à régler"})</h2><p><i>Facture de démonstration.</i></p><script>setTimeout(()=>print(),400)<\/script>`); w.document.close(); };

/* 08 — Stade */
ROUTES.stadium = () => { const st = S.settings.stadium, venues = [...new Set(S.matches.filter(m => m.status === "scheduled").map(m => m.venue))];
  return `<section class="s"><div class="wrap"><div class="eyebrow">Localisation</div><h2>${t("stadium")}</h2><div class="two"><div><iframe title="Google Maps" loading="lazy" style="width:100%;height:380px;border:0" src="https://maps.google.com/maps?q=${esc(st.lat)},${esc(st.lng)}&z=15&output=embed"></iframe><p style="margin-top:10px"><a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${esc(st.lat)},${esc(st.lng)}">Itinéraire</a></p></div>
  <div class="panel"><h3>${esc(st.name)}</h3><table><tbody>${[["Adresse", st.address], ["GPS", st.lat + ", " + st.lng], ["Capacité", st.capacity], ["Entrées public", st.gates], ["Entrée VIP", st.vip], ["Parking", st.parking], ["Accessibilité", st.access], ["Ouverture des portes", st.doors], ["Règlement", st.rules]].map(([k, v]) => `<tr><th>${k}</th><td>${esc(v)}</td></tr>`).join("")}</tbody></table></div></div>
  <h3 style="margin:24px 0 10px">Prochains matchs par stade</h3>${venues.map(v => `<div class="panel"><b>${esc(v)}</b>${S.matches.filter(m => m.status === "scheduled" && m.venue === v).map(m => `<p><a href="#/match/${m.id}">${matchTitle(m)}</a> — ${fdate(m.date)}</p>`).join("")}</div>`).join("")}
  <h2 style="margin-top:40px">Contact</h2>${contactBlock()}</div></section>`; };
const TOPICS = ["Contact général", "Service supporters", "Service billetterie", "Service boutique", "Demande de partenariat", "Presse & médias", "Recrutement"];
function contactBlock() { return `<div class="two"><form class="form panel" data-form="contact"><input class="hp" name="website" tabindex="-1" autocomplete="off"><label>Sujet<select name="topic">${TOPICS.map(x => `<option>${x}</option>`).join("")}</select></label><div class="two-c"><label>Nom<input name="name" required minlength="2"></label><label>E-mail<input name="email" type="email" required></label></div><label>Message<textarea name="msg" rows="5" required minlength="10"></textarea></label><button class="btn">Envoyer</button></form>
  <div><div class="panel"><h3>WhatsApp Business</h3>${S.settings.whatsapp ? `<a class="btn" target="_blank" rel="noopener" href="https://wa.me/${esc(S.settings.whatsapp)}">Écrire sur WhatsApp</a>` : "<p class='mut'>À activer après accord du club (numéro à renseigner dans l'admin).</p>"}</div><h3 style="margin:16px 0 8px">FAQ</h3>${S.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div></div>`; }
ROUTES.contact = () => `<section class="s"><div class="wrap"><div class="eyebrow">Services</div><h2>Contact & FAQ</h2>${contactBlock()}</div></section>`;
F.contact = d => { if (d.website) return; S.contacts.unshift({ id: nextId(S.contacts), topic: d.topic, name: d.name, email: d.email, msg: d.msg, status: "new", at: new Date().toISOString() }); save(); toast("Message envoyé — nous vous répondrons rapidement"); rerender(); };

/* Mes achats (billets + commandes, sans compte : liés à cet appareil) */
ROUTES.account = ([tab = "tickets"]) => {
  const tks = mine(S.tickets), ords = mine(S.orders);
  const tabs = [["tickets", "Mes billets (" + tks.length + ")"], ["orders", "Mes commandes (" + ords.length + ")"]];
  let b = "";
  if (tab === "tickets") b = tks.map(tkHtml).join('<div style="height:14px"></div>') || "<p>Aucun billet pour le moment. <a href='#/tickets' style='color:var(--red)'>Acheter un billet</a></p>";
  if (tab === "orders") b = ords.map(o => `<div class="panel"><div class="head" style="margin:0"><h3>${o.no} · ${money(o.total)}</h3><span class="badge ${o.paid ? "ok" : "wn"}">${o.paid ? "payée" : "à régler"}</span></div><p>${fdate(o.at)} · ${o.items.map(i => i.qty + "× " + esc(i.name)).join(", ")}</p><div class="steps">${OSTEPS.map(s => `<span class="${OSTEPS.indexOf(o.status) >= OSTEPS.indexOf(s) ? "on" : ""}">${{ pending: "En attente", paid: "Payée", shipped: "Expédiée", delivered: "Livrée" }[s]}</span>`).join("")}</div><button class="btn ghost sm" data-act="invoice" data-arg="${o.id}">Facture</button></div>`).join("") || "<p>Aucune commande. <a href='#/store' style='color:var(--red)'>Voir la boutique</a></p>";
  return `<section class="s"><div class="wrap"><div class="eyebrow">Sur cet appareil</div><h2>Mes achats</h2><div class="tabs">${tabs.map(([k, l]) => `<a href="#/account/${k}" class="${tab === k ? "on" : ""}">${l}</a>`).join("")}</div>${b}</div></section>`;
};
function loginModal() { }
ROUTES.notfound = () => `<section class="s"><div class="wrap"><h2>Page introuvable</h2><a class="btn" href="#/home">Retour à l'accueil</a></div></section>`;
