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

