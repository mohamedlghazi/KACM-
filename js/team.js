/* KACM — page Équipe : effectif (barre collante + cartes premium), composition 3D à formations, fiche joueur */
(function () {
  "use strict";
  const { $, esc, t } = KACM;
  const D = VERIFIED_DATA, P = D.players;
  const POS = [["GK", "tp.gk"], ["DEF", "tp.def"], ["MID", "tp.mid"], ["ATT", "tp.att"]];
  const byId = id => P.find(p => String(p.id) === String(id));
  const COACH = (D.staff.find(s => s.role === "coach") || {}).name || "Youssef Safri";
  const COACH_PHOTO = "assets/reference/season-safri.webp";

  /* formations : ids joueurs et position [x %, y %] sur le terrain (0 = but adverse, 100 = notre but) */
  const DEF = { y: 78, x: [13, 38, 62, 87], ids: [219487, 101847, 219490, 240993] };
  const FORMS = {
    "4-3-3": [{ y: 96, x: [50], ids: [86773] }, DEF, { y: 56, x: [24, 50, 76], ids: [88078, 106847, 219492] }, { y: 31, x: [20, 50, 80], ids: [90356, 88305, 81818] }],
    "4-4-2": [{ y: 96, x: [50], ids: [86773] }, DEF, { y: 55, x: [12, 37, 63, 88], ids: [88078, 106847, 219492, 133256] }, { y: 30, x: [37, 63], ids: [88305, 90356] }],
    "4-2-3-1": [{ y: 96, x: [50], ids: [86773] }, DEF, { y: 60, x: [26, 74], ids: [106847, 219492] }, { y: 44, x: [16, 50, 84], ids: [90356, 133256, 81818] }, { y: 26, x: [50], ids: [88305] }]
  };
  /* 6 remplaçants du match (gardien, 2 défenseurs, 2 milieux, 1 attaquant) */
  const SUBS = [62001, 219484, 206574, 121731, 221462, 219500];
  const XI_IDS = [...new Set(Object.values(FORMS).flat().flatMap(r => r.ids))];
  let view = "list", q = "", fpos = "all", form = "4-3-3";

  const hasNum = p => p.num !== "—" && p.num !== "" && p.num != null;
  const posOne = p => t("tp1." + p.pos.toLowerCase());
  const initials = n => n.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const split = n => { const w = n.trim().split(/\s+/); return w.length > 1 ? [w.slice(0, -1).join(" "), w[w.length - 1]] : ["", w[0]]; };
  const lastName = n => split(n)[1];
  const ava = (p, cls = "") => `<span class="ava ${cls}">${p.photo ? `<img src="${esc(p.photo)}" alt="" loading="lazy">` : `<b>${esc(initials(p.name))}</b>`}</span>`;
  const cutSrc = p => (/(portrait|player)-\d+\.png$/.test(p.photo || "") ? p.photo.replace("/real/", "/real/cut/") : p.photo);
  const avaCut = p => `<span class="ava cut">${p.photo ? `<img src="${esc(cutSrc(p))}" alt="" loading="lazy">` : `<b>${esc(initials(p.name))}</b>`}</span>`;
  const link = p => `team.html#p=${p.id}`;
  const sorted = l => l.slice().sort((a, b) => (+a.num || 999) - (+b.num || 999));

  /* ---------- carte joueur (style « fiche club » : photo détourée, numéro, nom, poste, drapeau) ---------- */
  const FLAGS = {
    "Maroc": '<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#c1272d"/><path d="M15 4.6l1.5 4.5h4.7l-3.8 2.8 1.5 4.5L15 13.6l-3.9 2.8 1.5-4.5-3.8-2.8h4.7z" fill="none" stroke="#006233" stroke-width="1"/></svg>',
    "France": '<svg viewBox="0 0 30 20"><rect width="10" height="20" fill="#0055a4"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#ef4135"/></svg>',
    "Guinée": '<svg viewBox="0 0 30 20"><rect width="10" height="20" fill="#ce1126"/><rect x="10" width="10" height="20" fill="#fcd116"/><rect x="20" width="10" height="20" fill="#009460"/></svg>',
    "Sénégal": '<svg viewBox="0 0 30 20"><rect width="10" height="20" fill="#00853f"/><rect x="10" width="10" height="20" fill="#fdef42"/><rect x="20" width="10" height="20" fill="#e31b23"/><path d="M15 6.4l1 3h3.1l-2.5 1.8 1 3L15 12.4l-2.6 1.8 1-3-2.5-1.8H14z" fill="#00853f"/></svg>'
  };
  const flag = n => (FLAGS[n] ? `<span class="px-flag">${FLAGS[n]}</span>` : "");
  function pcard(p) {
    const [fn, ln] = split(p.name);
    const photo = p.photo ? `<img src="${esc(cutSrc(p))}" alt="" loading="lazy">` : `<b class="px-ini">${esc(initials(p.name))}</b>`;
    return `<a class="pcx" href="${link(p)}" aria-label="${esc(p.name)}"><span class="px-ph">${photo}</span>
      <span class="px-box"><span class="px-top"><b class="px-n">${hasNum(p) ? esc(p.num) : "–"}</b><span class="px-name">${fn ? `<i>${esc(fn)}</i>` : ""}<strong>${esc(ln)}</strong></span></span>
      <span class="px-bot"><em>${esc(posOne(p))}</em><span class="px-nat">${flag(p.nat)}${esc(p.nat || "")}</span></span></span></a>`;
  }

  /* ---------- effectif ---------- */
  const SEARCH_ICON = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`;
  function renderList() {
    $("#teamBody").innerHTML = `<div class="tbar" role="search">
      <div class="tsearch">${SEARCH_ICON}<input type="search" id="tq" value="${esc(q)}" placeholder="${t("tp.search")}" aria-label="${t("tp.search")}" autocomplete="off"><button type="button" id="tclear" aria-label="×" ${q ? "" : "hidden"}>×</button></div>
      <div class="chips" role="group" aria-label="${t("tp.pos")}">${[["all", "tp.all"], ...POS].map(([k, key]) => `<button type="button" class="chip-f" data-pos="${k}" aria-pressed="${fpos === k}">${t(key === "tp.all" ? "tp.allshort" : key)}<em>${k === "all" ? P.length : P.filter(p => p.pos === k).length}</em></button>`).join("")}</div>
      <span class="tcount" id="tcount"></span></div><div id="tcontent"></div>`;
    fill();
  }
  function fill() {
    const f = P.filter(p => (fpos === "all" || p.pos === fpos) && (!q || p.name.toLowerCase().includes(q)));
    const staff = fpos === "all" && !q ? `<section class="tsec"><h2>${t("tp.staff")}</h2><div class="staff"><div class="scard"><div class="sc-img"><img src="${COACH_PHOTO}" alt="${esc(COACH)}" style="object-position:62% 25%"></div><div class="sc-info"><small>${t("tp.coach")}</small><b>${esc(COACH)}</b></div></div></div></section>` : "";
    const groups = POS.map(([k, key]) => { const l = sorted(f.filter(p => p.pos === k)); return l.length ? `<section class="tsec"><h2>${t(key)}<span class="cnt">${l.length}</span></h2><div class="pgrid">${l.map(pcard).join("")}</div></section>` : ""; }).join("");
    $("#tcontent").innerHTML = staff + (groups || `<p class="empty">${t("tp.none")}</p>`);
    $("#tcount").textContent = f.length + " / " + P.length;
    $("#tclear").hidden = !q;
    document.querySelectorAll(".chip-f").forEach(b => b.setAttribute("aria-pressed", b.dataset.pos === fpos));
  }

  /* ---------- composition : poster « onze type » ---------- */
  function posterSvg() {
    return `<svg class="poster-svg" viewBox="0 0 1200 1650" preserveAspectRatio="none" aria-hidden="true">
      <polygon points="170,440 1030,440 1200,1540 0,1540" fill="#ffffff66" stroke="#c4506a" stroke-width="3.5"/>
      <g fill="none" stroke="#c4506a" stroke-width="3.5">
        <line x1="86" y1="985" x2="1114" y2="985"/><ellipse cx="600" cy="985" rx="126" ry="96"/><circle cx="600" cy="985" r="4" fill="#c4506a"/>
        <rect x="428" y="440" width="344" height="105"/><path d="M 530 545 Q 600 585 670 545"/>
        <polygon points="368,1260 832,1260 850,1540 350,1540"/><rect x="500" y="1470" width="200" height="70"/><path d="M 520 1260 Q 600 1220 680 1260"/>
      </g></svg>`;
  }
  function renderXI() {
    const players = XI_IDS.map(byId).filter(Boolean).map(p => `<a class="pp off" data-id="${p.id}" href="${link(p)}" aria-label="${esc(p.name)}">${hasNum(p) ? `<span class="pp-n">${esc(p.num)}</span>` : ""}<span class="pp-ph">${ava(p)}</span><span class="pp-rib">${hasNum(p) ? `<em>${esc(p.num)}</em>` : ""}<b>${esc(lastName(p.name))}</b></span></a>`).join("");
    $("#teamBody").innerHTML = `<div class="xi">
      <aside class="xi-side"><p class="xi-lbl">${t("tp.formation")}</p>
        <div class="xi-sw" role="group" aria-label="${t("tp.formation")}">${Object.keys(FORMS).map(k => `<button type="button" data-form="${k}" aria-pressed="${k === form}">${k}</button>`).join("")}</div>
        <p class="xi-note">${t("tp.xinote")}</p></aside>
      <div class="poster">${posterSvg()}
        <div class="po-coach"><img src="${COACH_PHOTO}" alt="${esc(COACH)}"><span><small>${t("tp.coach")}</small><b>${esc(COACH)}</b></span></div>
        <div class="po-title"><small>${t("tp.compo")}</small><b>${t("tp.xi")}</b><i id="poForm">${form}</i></div>
        <img class="po-logo" src="assets/logo.png?v=4" alt="">
        ${players}<span class="po-j">${esc(D.season)}</span></div></div>
      <section class="tsec"><h2>${t("tp.bench")}<span class="cnt">${SUBS.length}</span></h2><div class="bench" id="bench"></div></section>`;
    applyForm();
  }
  function applyForm() {
    const rows = FORMS[form], pos = {};
    rows.forEach(r => r.ids.forEach((id, i) => { pos[id] = [r.x[i], 40 + (r.y - 31) * 0.8]; }));
    document.querySelectorAll(".pp").forEach(el => {
      const c = pos[el.dataset.id];
      el.classList.toggle("off", !c);
      if (c) { el.style.left = c[0] + "%"; el.style.top = c[1] + "%"; el.style.zIndex = Math.round(c[1]); }
    });
    const on = new Set(Object.keys(pos));
    $("#bench").innerHTML = SUBS.map(byId).filter(p => p && !on.has(String(p.id))).map(p => `<a class="bchip" href="${link(p)}">${avaCut(p)}<span><b>${esc(p.name)}</b><small>${esc(posOne(p))}</small></span>${hasNum(p) ? `<i class="bn">${esc(p.num)}</i>` : ""}</a>`).join("");
    document.querySelectorAll("[data-form]").forEach(b => b.setAttribute("aria-pressed", b.dataset.form === form));
    const pf = $("#poForm"); if (pf) pf.textContent = form;
  }

  /* ---------- fiche joueur ---------- */
  function renderPlayer(p) {
    const list = sorted(P), i = list.indexOf(p);
    const prev = list[(i - 1 + list.length) % list.length], next = list[(i + 1) % list.length];
    const same = P.filter(x => x.pos === p.pos && x.id !== p.id).slice(0, 4);
    const info = [[t("tp.num"), hasNum(p) ? "N° " + p.num : null], [t("tp.pos"), posOne(p)], [t("tp.nat"), p.nat], [t("tp.born"), p.birth], [t("tp.height"), p.height && p.height + " cm"], [t("tp.weight"), p.weight && p.weight + " kg"], [t("tp.joined"), p.joined], [t("tp.status"), p.status === "active" ? t("tp.active") : null], [t("tp.season"), D.season]].filter(r => r[1]);
    const stats = [[t("tp.apps"), p.apps], [t("tp.goals"), p.goals], [t("tp.assists"), p.assists], [t("tp.min"), p.min], [t("tp.yc"), p.yc], [t("tp.rc"), p.rc]];
    const hasStats = stats.some(s => s[1] && s[1] !== "—");
    const inXI = XI_IDS.includes(p.id);
    return `<section class="pf"><div class="wrap"><a class="back" href="team.html">${t("tp.back")}</a>
      <div class="pf-card">
        <div class="pf-photo">${p.photo ? `<img src="${esc(cutSrc(p))}" alt="${esc(p.name)}">` : ava(p, "xl")}</div>
        <div class="pf-box">
          ${inXI ? `<span class="pf-tag">${t("tp.inxi")}</span>` : ""}
          <div class="pf-top"><b class="pf-n">${hasNum(p) ? esc(p.num) : "–"}</b><h1 class="pf-name">${split(p.name)[0] ? `<i>${esc(split(p.name)[0])}</i>` : ""}<strong>${esc(split(p.name)[1])}</strong></h1></div>
          <div class="pf-bot"><em>${esc(posOne(p))}${p.captain ? " · " + t("tp.captain") : ""}</em><span class="pf-nat">${flag(p.nat).replace("px-flag", "pf-flag")}${esc(p.nat || "")}</span></div>
        </div></div></div></section>
      <section class="sec"><div class="wrap pl-body"><div><h2 class="sub-h2">${t("tp.infos")}</h2><dl class="pl-info">${info.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        <h2 class="sub-h2">${t("tp.stats")}</h2>${hasStats ? `<dl class="pl-stats">${stats.map(([k, v]) => `<div><dd>${esc(v || "—")}</dd><dt>${esc(k)}</dt></div>`).join("")}</dl>` : `<p class="note">${t("tp.nostats")}</p>`}
        ${p.bio && !/Informations consultées/.test(p.bio) ? `<h2 class="sub-h2">${t("tp.bio")}</h2><p>${esc(p.bio)}</p>` : ""}
        <div class="pl-nav"><a class="btn btn-line" href="${link(prev)}">← ${esc(prev.name)}</a><a class="btn btn-line" href="${link(next)}">${esc(next.name)} →</a></div></div>
        <aside><h2 class="sub-h2">${t("tp.same")}</h2><div class="same">${same.map(pcard).join("")}</div></aside></div></section>`;
  }

  /* ---------- routage ---------- */
  function route() {
    const m = location.hash.match(/^#p=(.+)$/), p = m && byId(decodeURIComponent(m[1]));
    $("#listView").hidden = !!p; $("#playerView").hidden = !p;
    if (p) { $("#playerView").innerHTML = renderPlayer(p); document.title = p.name + " — KACM"; window.scrollTo(0, 0); return; }
    document.title = t("tp.t") + " — KACM";
    $("#tabsT").innerHTML = [["list", "tp.tab1"], ["xi", "tp.tab2"]].map(([k, key]) => `<button type="button" role="tab" aria-selected="${view === k}" data-view="${k}">${t(key)}</button>`).join("");
    view === "list" ? renderList() : renderXI();
  }
  document.addEventListener("click", e => {
    const v = e.target.closest("[data-view]"); if (v) { view = v.dataset.view; route(); return; }
    const c = e.target.closest("[data-pos]"); if (c) { fpos = c.dataset.pos; fill(); return; }
    const f = e.target.closest("[data-form]"); if (f) { form = f.dataset.form; applyForm(); return; }
    if (e.target.closest("#tclear")) { q = ""; $("#tq").value = ""; fill(); $("#tq").focus(); }
  });
  document.addEventListener("input", e => { if (e.target.id === "tq") { q = e.target.value.trim().toLowerCase(); fill(); } });
  window.addEventListener("hashchange", route);
  KACM.onLang(route);
  KACM.applyLang();
})();
