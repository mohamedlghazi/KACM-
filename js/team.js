/* 03 — Équipe */
ROUTES.team = (a, q) => {
  const pos = q.pos || "", term = (q.s || "").toLowerCase(), pl = S.players.filter(p => p.status === "active" && (!pos || p.pos === pos) && p.name.toLowerCase().includes(term));
  const blocks = (pos ? [pos] : ["GK", "DEF", "MID", "ATT"]).map(k => { const l = pl.filter(p => p.pos === k); return l.length ? `<h3 style="margin:24px 0 12px">${POSL[k]}</h3><div class="grid g4">${l.map(playerCard).join("")}</div>` : ""; }).join("");
  const st = r => S.staff.filter(x => x.role === r).map(x => `<li>${esc(x.name)}</li>`).join("") || "<li>Noms non confirmés</li>";
  const cap = S.players.find(p => p.captain);
  return `<section class="s"><div class="wrap"><div class="eyebrow">Effectif référencé · saison 2026/27</div><h2>${t("team")}</h2><p class="source-note">Source : <a href="https://www.365scores.com/football/team/kawkab-marrakech-8209/squad" target="_blank" rel="noopener">365Scores ↗</a> · consultée le 16 novembre 2026. Les données personnelles non confirmées ne sont pas publiées.</p>
  <form class="tb" onsubmit="event.preventDefault();go('team?pos='+this.pos.value+'&s='+encodeURIComponent(this.s.value))"><input name="s" placeholder="Rechercher un joueur" value="${esc(q.s || "")}" aria-label="Recherche"><select name="pos" aria-label="Poste"><option value="">Tous les postes</option>${Object.entries(POSL).map(([k, v]) => `<option value="${k}" ${pos === k ? "selected" : ""}>${v}</option>`).join("")}</select><button class="btn sm">Filtrer</button></form>
  ${cap ? `<p><span class="badge">Capitaine</span> ${esc(cap.name)}</p>` : ""}${blocks || "<p>Aucun joueur.</p>"}
  <h3 style="margin:40px 0 12px">Staff</h3><div class="grid g3"><div class="panel"><h3>Entraîneur</h3><ul><li>${esc(S.settings.coach)}</li></ul></div><div class="panel"><h3>Staff technique</h3><ul>${st("tech")}</ul></div><div class="panel"><h3>Staff médical</h3><ul>${st("med")}</ul></div></div></div></section>`;
};
ROUTES.player = ([id]) => {
  const p = byId(S.players, id); if (!p) return ROUTES.notfound();
  const priv = p.showPrivate ? `<tr><th>Naissance</th><td>${esc(p.birth || "—")}</td></tr><tr><th>Taille / Poids</th><td>${esc(p.height || "—")} cm / ${esc(p.weight || "—")} kg</td></tr>` : `<tr><th>Données privées</th><td class="mut">Non publiées (accord du joueur/club requis)</td></tr>`;
  return `<section class="s"><div class="wrap"><a href="#/team">← Effectif</a><div class="split" style="margin-top:16px;align-items:start"><div style="max-width:360px">${avatar(p)}</div><div><div class="eyebrow">${POSL[p.pos]}${p.captain ? " · Capitaine" : ""}</div><h2>${esc(p.name)}</h2><p>${esc(p.bio)}</p><p class="source-note"><a href="${esc(p.source)}" target="_blank" rel="noopener">Fiche source du joueur ↗</a></p>
  <table><tbody><tr><th>Numéro</th><td>${p.num}</td></tr><tr><th>Nationalité</th><td>${esc(p.nat)}</td></tr>${priv}<tr><th>Arrivée</th><td>${esc(p.joined || "—")}</td></tr></tbody></table>
  ${p.showContract && p.contract ? `<p class="contract-note">Contrat (publication autorisée) : ${esc(p.contract)}</p>` : ""}<h3 style="margin:20px 0 10px">Statistiques de la saison</h3><div class="kpis">${[["Matchs", p.apps], ["Buts", p.goals], ["Passes déc.", p.assists], ["Minutes", p.min], ["Jaunes", p.yc], ["Rouges", p.rc]].map(([l, v]) => `<div class="kpi"><b>${v}</b><span>${l}</span></div>`).join("")}</div></div></div></div></section>`;
};

