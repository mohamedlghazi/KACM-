/* 02 — Match Center (calendrier · résultats · direct · classement) */
const m2Team = (n, big) => `<span class="m2-team${big ? " big" : ""}">${crest(n)}<strong>${n === "KACM" ? "Kawkab Marrakech" : esc(n)}</strong></span>`;
const m2Sides = m => (m.home ? ["KACM", m.opp] : [m.opp, "KACM"]);
const m2Badge = m => `<span class="m2-badge ${m.home ? "home" : "away"}">${m.home ? "Domicile" : "Extérieur"}</span>`;
const m2Who = (m, e) => (e.team === "us" ? "KACM" : esc(m.opp));
const m2Ev = (m, ty) => [...m.events].filter(e => e.type === ty).sort((a, b) => a.min - b.min);
function m2Calendar() {
  const l = S.matches.filter(x => x.status === "scheduled").sort((a, b) => new Date(a.date) - new Date(b.date));
  const MON = ["JAN", "FÉV", "MAR", "AVR", "MAI", "JUN", "JUL", "AOÛ", "SEP", "OCT", "NOV", "DÉC"];
  return l.map(m => { const d = new Date(m.date), [h, a] = m2Sides(m);
    return `<article class="m2-row"><time datetime="${m.date ? m.date.slice(0, 10) : ""}"><strong>${m.date ? String(d.getDate()).padStart(2, "0") : "—"}</strong><span>${m.date ? MON[d.getMonth()] : "À CONFIRMER"}</span><small>${ftime(m.date)}</small></time>
    <div class="m2-vs">${m2Team(h)}<em>VS</em>${m2Team(a)}</div>
    <div class="m2-info"><b>${esc(m.comp)}</b><span>${ico("pin")} ${esc(m.venue)}</span>${m2Badge(m)}</div>
    <div class="m2-act"><button class="m2-btn" type="button" data-act="dl" data-arg="${m.id}" title="Ajouter à mon calendrier (.ics)">${ico("cal")} Agenda</button>${m.onSale ? `<a class="m2-btn solid" href="#/tickets?m=${m.id}">${ico("ticket")} Billets</a>` : ""}<a class="m2-btn" href="#/match/${m.id}">Détails</a></div></article>`; }).join("") || `<p class="m2-empty">Aucun match programmé pour le moment.</p>`;
}
function m2Results() {
  const l = S.matches.filter(x => x.status === "finished").sort((a, b) => new Date(b.date) - new Date(a.date));
  return `<div class="m2-grid">${l.map(m => { const [h, a] = m2Sides(m), g = m2Ev(m, "goal"), y = m2Ev(m, "yellow"), r = m2Ev(m, "red"), s = m2Ev(m, "sub"), st = m.stats && m.stats.poss;
    const gl = g.map(e => `<li>${ico("ball")} <b>${e.min}'</b> ${esc(e.label || "But")} <small>${m2Who(m, e)}</small></li>`).join("");
    const cards = [...y.map(e => `<li>${ico("card", "f cy")} <b>${e.min}'</b> ${esc(e.label || "")} <small>${m2Who(m, e)}</small></li>`), ...r.map(e => `<li>${ico("card", "f cr")} <b>${e.min}'</b> ${esc(e.label || "")} <small>${m2Who(m, e)}</small></li>`)].join("");
    const sb = s.map(e => `<li>${ico("sub")} <b>${e.min}'</b> ${esc(e.label || "Remplacement")} <small>${m2Who(m, e)}</small></li>`).join("");
    return `<article class="m2-res"><header><span>${fdate(m.date, { day: "numeric", month: "short", year: "numeric" })} · ${esc(m.comp)}</span>${m2Badge(m)}</header>
    <a class="m2-score" href="#/match/${m.id}">${m2Team(h)}<strong>${m.home ? m.hs : m.as}<i>–</i>${m.home ? m.as : m.hs}</strong>${m2Team(a)}</a>
    <div class="m2-evs"><div><h4>Buteurs</h4><ul>${gl || "<li class='mut'>—</li>"}</ul></div><div><h4>Cartons</h4><ul>${cards || "<li class='mut'>—</li>"}</ul></div><div><h4>Changements</h4><ul>${sb || "<li class='mut'>—</li>"}</ul></div></div>
    ${st ? `<div class="m2-poss"><b>${st[m.home ? 0 : 1]}%</b><i><u style="width:${st[m.home ? 0 : 1]}%"></u></i><b>${st[m.home ? 1 : 0]}%</b><small>Possession</small></div>` : ""}
    <footer><span>${ico("pin")} ${esc(m.venue)}</span><a href="#/match/${m.id}">Rapport &amp; statistiques ${ico("arrow")}</a></footer></article>`; }).join("") || `<p class="m2-empty">Aucun résultat.</p>`}</div>`;
}
function m2Live() {
  const lv = liveMatch(), nm = nextMatch();
  if (!lv) return `<div class="m2-live-empty"><span class="m2-dot off"></span><h3>Aucun match en direct</h3><p>Aucune connexion à un flux de résultats en direct. Consultez le suivi du fournisseur sportif via les sources.</p>${nm ? `<a class="m2-btn solid" href="#/match/${nm.id}">Prochain match : ${esc(nm.home ? nm.opp : nm.opp)} · ${fdate(nm.date, { day: "numeric", month: "short" })} ${ico("arrow")}</a>` : ""}</div>`;
  const [h, a] = m2Sides(lv);
  return `<div class="m2-live"><header><span class="m2-dot"></span> EN DIRECT · ${esc(lv.comp)} · <b>${lv.minute}'</b></header><div class="m2-score big">${m2Team(h, 1)}<strong>${lv.home ? lv.hs : lv.as}<i>–</i>${lv.home ? lv.as : lv.hs}</strong>${m2Team(a, 1)}</div>
  <div class="m2-two"><div class="m2-panel"><h3>Événements importants</h3>${eventsList(lv)}</div><div class="m2-panel"><h3>Statistiques en direct</h3>${statsBars(lv)}</div></div><p class="m2-note"><a href="#/match/${lv.id}">Ouvrir la fiche du match ${ico("arrow")}</a></p></div>`;
}
function m2Table() {
  const tb = table(), ri = tb.findIndex(r => r.n === "KACM"), me = tb[ri];
  const kp = me ? [["Classement", ri + 1 + (ri === 0 ? "er" : "e")], ["Points", me.pts], ["Victoires", me.w], ["Nuls", me.d], ["Défaites", me.l], ["Buts pour", me.gf], ["Buts contre", me.ga]] : [];
  return `<div class="m2-kpis">${kp.map(([l, v]) => `<div><b>${v}</b><span>${l}</span></div>`).join("")}</div>
  <div class="m2-table"><table><thead><tr><th>#</th><th class="l">Équipe</th><th title="Matchs joués">J</th><th title="Victoires">G</th><th title="Nuls">N</th><th title="Défaites">P</th><th title="Buts pour">BP</th><th title="Buts contre">BC</th><th title="Différence">Diff</th><th>Pts</th></tr></thead><tbody>${tb.map((r, i) => `<tr class="${r.n === "KACM" ? "me" : ""}"><td>${i + 1}</td><th class="l" scope="row">${crest(r.n)} ${r.n === "KACM" ? "Kawkab Marrakech" : esc(r.n)}</th><td>${r.p}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${r.gf}</td><td>${r.ga}</td><td>${r.gf - r.ga > 0 ? "+" : ""}${r.gf - r.ga}</td><td><b>${r.pts}</b></td></tr>`).join("")}</tbody></table></div><p class="m2-note">Classement consulté le 16 novembre 2026 — source Kooralink / SofaScore. Non actualisé en direct. <a href="#/sources">Voir les sources</a></p>`;
}
ROUTES.matches = (a, q) => {
  const tab = q.tab || "cal", lv = liveMatch(), tabs = [["cal", "Calendrier"], ["res", "Résultats"], ["live", "Live"], ["table", "Classement"]];
  const body = { cal: m2Calendar, res: m2Results, live: m2Live, table: m2Table }[tab] || m2Calendar;
  return `<div class="rx"><section class="m2"><div class="wrap"><nav class="m2-tabs" aria-label="Match Center">${tabs.map(([k, l]) => `<a href="#/matches?tab=${k}" ${tab === k ? 'aria-current="page"' : ""}>${k === "live" && lv ? '<span class="m2-dot"></span>' : ""}${l}</a>`).join("")}</nav>${body()}</div></section></div>`;
};
function eventsList(m) { return m.events.length ? [...m.events].sort((a, b) => b.min - a.min).map(e => `<div class="ev"><b>${e.min}'</b><span>${{ goal: ico("ball") + " But", yellow: ico("card", "f cy") + " Carton jaune", red: ico("card", "f cr") + " Carton rouge", sub: ico("sub") + " Remplacement", note: ico("note") }[e.type] || ""} — ${e.team === "us" ? "KACM" : esc(m.opp)} · ${esc(e.label || "")}</span></div>`).join("") : "<p class='mut'>Aucun événement saisi.</p>"; }
function statsBars(m) { if (!m.stats) return "<p class='mut'>Statistiques non saisies.</p>"; const L = { poss: "Possession %", shots: "Tirs", target: "Tirs cadrés", corners: "Corners", fouls: "Fautes" };
  return Object.entries(L).map(([k, l]) => { const [a, b] = m.stats[k] || [0, 0], tot = (a + b) || 1; return `<div class="bar2"><b>${a}</b><div><small>${l}</small><i><u style="width:${a / tot * 100}%"></u></i></div><b>${b}</b></div>`; }).join(""); }
function liveView(m) { return `<div class="panel"><div class="res" style="box-shadow:none"><span>KACM</span><span class="sc">${m.hs} - ${m.as}</span><span>${esc(m.opp)}</span></div><p><span class="badge live">Direct</span> Minute ${m.minute}'</p></div><div class="two"><div class="panel"><h3>Événements</h3>${eventsList(m)}</div><div class="panel"><h3>Statistiques</h3>${statsBars(m)}</div></div>`; }
function pitch(m) {
  const lines = [1, ...m.formation.split("-").map(Number)], pl = []; let i = 0;
  lines.forEach((n, li) => { for (let j = 0; j < n; j++) { const p = byId(S.players, m.lineup[i++]); if (p) pl.push(`<div class="pl" style="left:${(j + 1) / (n + 1) * 100}%;top:${92 - li * (84 / (lines.length - 1))}%">${p.photo ? `<img class="formation-avatar" src="${esc(p.photo)}" alt="">` : ""}<b>${p.num}</b>${esc(p.name)}</div>`); } });
  return `<div class="pitch" role="img" aria-label="Formation ${m.formation}">${pl.join("")}</div><p style="text-align:center" class="mut">Formation ${m.formation}</p>`;
}
ROUTES.match = ([id]) => {
  const m = byId(S.matches, id); if (!m) return ROUTES.notfound();
  const st = m.location || (m.venue === S.settings.stadium.name ? S.settings.stadium : {address:"Adresse du stade à confirmer",lat:"",lng:""}), [h, a] = m2Sides(m), fin = m.status === "finished", sch = m.status === "scheduled", live = m.status === "live";
  const state = live ? `<span class="m2-dot"></span> EN DIRECT · ${m.minute}'` : fin ? "Terminé" : "À venir";
  const centre = sch ? `<strong class="vs">VS</strong>` : `<strong>${m.home ? m.hs : m.as}<i>–</i>${m.home ? m.as : m.hs}</strong>`;
  const prev = sch ? `<p>${esc(m.preview || "")}</p><p>${m.home ? "Le Kawkab reçoit" : "Le Kawkab se déplace chez"} <b>${esc(m.opp)}</b> pour le compte de la ${esc(m.comp)}. Coup d'envoi ${fdate(m.date, { weekday: "long", day: "numeric", month: "long" })} à ${ftime(m.date)}, ${esc(m.venue)}.</p>` : `<p>${esc(m.preview || "")}${m.preview ? "" : `${esc(m.comp)} · ${esc(m.venue)} · ${fdate(m.date)}.`}</p>`;
  const lastH2H = S.matches.filter(x => x.id !== m.id && x.opp === m.opp && x.status === "finished").sort((x, y) => new Date(y.date) - new Date(x.date))[0];
  const tl = m.events.length ? [...m.events].sort((x, y) => y.min - x.min).map(e => `<li class="${e.type}"><b>${e.min}'</b><span>${{ goal: ico("ball") + " But", yellow: ico("card", "f cy") + " Carton jaune", red: ico("card", "f cr") + " Carton rouge", sub: ico("sub") + " Changement", note: ico("note") + " Info" }[e.type] || ""} — <strong>${m2Who(m, e)}</strong>${e.label ? " · " + esc(e.label) : ""}</span></li>`).join("") : `<li class="mut">${sch ? "Les mises à jour du match apparaîtront ici pendant la rencontre." : "Aucun événement saisi."}</li>`;
  return `<div class="rx"><section class="m2 m2d"><div class="wrap"><a class="m2-back" href="#/matches">← Match Center</a><p class="source-note"><a href="${esc(m.source || "https://kacmfoot.com/")}" target="_blank" rel="noopener">Source de la rencontre ↗</a> · consultée le 16 novembre 2026</p>
  <header class="m2d-head"><p class="m2d-state">${esc(m.comp)} · ${state} · ${m2Badge(m)}</p><div class="m2-score big">${m2Team(h, 1)}${centre}${m2Team(a, 1)}</div><p class="m2d-meta">${fdate(m.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · ${ftime(m.date)} · ${esc(m.venue)}</p>
   ${sch && m.date && m.dateConfirmed !== false && m.timeConfirmed !== false ? `<div class="next-cd m2d-cd" data-cd="${m.date}">${[["d", "j"], ["h", "h"], ["m", "min"], ["s", "s"]].map(u => `<div><b data-u="${u[0]}">00</b><span>${u[1]}</span></div>`).join("")}</div>` : ""}
   <div class="m2d-act"><button class="m2-btn" type="button" data-act="dl" data-arg="${m.id}">${ico("cal")} Ajouter à mon calendrier</button>${m.onSale ? `<a class="m2-btn solid" href="#/tickets?m=${m.id}">${ico("ticket")} Acheter un billet</a>` : ""}</div></header>
  <div class="m2-two"><div>
   <div class="m2-panel"><h3>Avant-match</h3>${prev}${lastH2H ? `<p class="mut">Dernière confrontation : KACM ${lastH2H.home ? lastH2H.hs + " – " + lastH2H.as : lastH2H.as + " – " + lastH2H.hs} ${esc(lastH2H.opp)} (${fdate(lastH2H.date, { day: "numeric", month: "short", year: "numeric" })})</p>` : ""}</div>
   <div class="m2-panel"><h3>${live ? "Live updates" : "Fil du match"}</h3><ul class="m2-tl">${tl}</ul></div>
   <div class="m2-panel"><h3>Rapport d'après-match</h3><p>${fin ? esc(m.report || "Le rapport du match sera publié prochainement.") : "Disponible après le coup de sifflet final."}</p></div>
   <div class="m2-panel"><h3>Statistiques</h3>${statsBars(m)}</div>
   <div class="m2-panel"><h3>Photos &amp; vidéos</h3><p class="mut">Les médias de cette rencontre seront ajoutés après validation du club.</p><p><a class="m2-btn" href="#/news?mode=photos">Galerie du club</a> <a class="m2-btn" href="#/news?mode=videos">KACM TV</a></p></div></div>
  <div><div class="m2-panel"><h3>Composition de la rencontre</h3>${m.lineup && m.lineup.length ? pitch(m) : "<p class='mut'>Composition annoncée avant le match.</p>"}<p class="m2-coach"><span>Entraîneur</span><b>${esc(S.settings.coach)}</b></p></div>
   <div class="m2-panel"><h3>Stade &amp; accès</h3><p><b>${esc(m.venue)}</b><br><small class="mut">${esc(st.address)}</small></p>${st.lat && st.lng ? `<iframe title="Carte du stade" loading="lazy" src="https://maps.google.com/maps?q=${esc(st.lat)},${esc(st.lng)}&z=14&output=embed"></iframe>` : "<p class=mut>Coordonnées de cette rencontre à confirmer.</p>"}<p><a class="m2-btn" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(st.lat && st.lng ? st.lat+","+st.lng : m.venue)}">Itinéraire ${ico("arrow")}</a></p></div></div></div></div></section></div>`;
};

