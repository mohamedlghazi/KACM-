/* KACM — accueil : rendu des sections à partir de js/data.js */
(function () {
  "use strict";
  const D = VERIFIED_DATA;
  let tab = "une";
  const { $, esc, t, fdate, toast } = KACM;
  const lang_ = () => KACM.lang;

  /* ---------- Logos d'équipes ---------- */
  const norm = s => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’`]/g, "'").replace(/[^a-z0-9' ]/g, " ").replace(/\s+/g, " ").trim();
  const ALIAS = { "wydad ac": "Wydad Casablanca", "wydad temara": "Widad Temara", "difaa el jadida": "Difaâ Hassani El-Jadidi", "union touarga": "Union Touarga Sport" };
  const ABBR = { "Wydad AC": "WAC", "Hassania d’Agadir": "HUSA", "CODM Meknès": "CODM", "Ittihad Tanger": "IRT", "Wydad Témara": "WAT", "Difaâ El Jadida": "DHJ", "Amal Tiznit": "AST", "Union Touarga": "UTS" };
  const TEAMS = D.teams || {};
  function logoOf(name) {
    if (name === "KACM") return "assets/logo.png?v=4";
    const n = norm(name), a = ALIAS[n] && TEAMS[ALIAS[n]];
    if (a) return a.logo;
    const k = Object.keys(TEAMS).find(x => norm(x) === n || norm(x).startsWith(n) || n.startsWith(norm(x)) || norm(x).includes(n));
    return k ? TEAMS[k].logo : "";
  }
  function crest(name) {
    const src = logoOf(name);
    const ini = esc(name.replace(/[^A-Za-zÀ-ÿ ]/g, "").split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase());
    return src ? `<img class="crest" src="${esc(src)}" alt="" loading="lazy" onerror="this.outerHTML='<span class=&quot;crest ph&quot;>${ini}</span>'">` : `<span class="crest ph" aria-hidden="true">${ini}</span>`;
  }
  const full = n => (n === "KACM" ? "Kawkab Marrakech" : n);
  const teamBox = n => `<div class="team">${crest(n)}<b>${esc(full(n))}</b></div>`;
  const sides = m => (m.home ? ["KACM", m.opp] : [m.opp, "KACM"]);
  const abbr = n => n === "KACM" ? "KACM" : (ABBR[n] || n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 4));

  /* ---------- Données dérivées ---------- */
  const finished = D.matches.filter(m => m.status === "finished").sort((a, b) => new Date(b.date) - new Date(a.date));
  const upcoming = D.matches.filter(m => m.status === "scheduled").sort((a, b) => (a.date ? new Date(a.date) : 9e15) - (b.date ? new Date(b.date) : 9e15));
  const std = D.standings.map(r => ({ n: r[0], p: r[1], w: r[2], d: r[3], l: r[4], gf: r[5], ga: r[6], pts: r[7], rk: r[8] }));
  const me = std.find(r => r.n === "KACM");
  const sfx = n => lang_() === "fr" ? (n === 1 ? "er" : "e") : lang_() === "en" ? (n % 100 >= 11 && n % 100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" })[n % 10] || "th") : "";
  const ord = n => (sfx(n) ? `<sup>${sfx(n)}</sup>` : "");
  const ordTxt = n => lang_() === "fr" ? n + (n === 1 ? "re" : "e") : n + sfx(n);

  /* ---------- Hero chip ---------- */
  function renderChip() {
    const m = upcoming[0], el = $("#heroChip"); if (!m) { el.hidden = true; return; }
    const [h, a] = sides(m);
    const side = n => `<span class="chip-team">${crest(n)}<em>${esc(full(n))}</em></span>`;
    el.innerHTML = `<small>${t("next")}</small>
      <div class="chip-row">${side(h)}<span class="chip-vs">VS</span>${side(a)}</div>
      <p class="chip-info">${[esc(m.comp), t("round") + m.round, m.home ? t("home") : t("away"), m.date && m.dateConfirmed ? fdate(m.date, { day: "numeric", month: "long" }) : t("tbcShort")].map(x => `<span>${x}</span>`).join("")}</p>`;
  }

  /* ---------- Centre des matchs ---------- */
  function cardLast() {
    const m = finished[0]; if (!m) return "";
    const [h, a] = sides(m);
    return `<article class="mcard"><div class="mcard-top"><span class="badge">${t("last")}</span><span>${fdate(m.date)} · ${t("round")}${m.round}</span></div>
      <div class="versus">${teamBox(h)}<div class="score"><strong>${m.hs}<i>–</i>${m.as}</strong><small>${t("fin")}</small></div>${teamBox(a)}</div>
      <div class="mcard-foot"><span>${esc(m.comp)} · ${t("round")}${m.round}</span><a href="#" data-soon>${t("sum")}</a></div></article>`;
  }
  function cardNext() {
    const m = upcoming[0]; if (!m) return `<article class="mcard"><div class="mcard-top"><span class="badge">${t("next")}</span></div><p class="empty">${t("none")}</p></article>`;
    const [h, a] = sides(m), has = !!m.date && m.dateConfirmed;
    return `<article class="mcard"><div class="mcard-top"><span class="badge">${t("next")}</span><span>${has ? fdate(m.date) + " · " : ""}${t("round")}${m.round}</span></div>
      <div class="versus">${teamBox(h)}<div class="vs"><strong>VS</strong><small>${m.home ? t("home") : t("away")}</small></div>${teamBox(a)}</div>
      ${has ? `<div class="cd" id="cd" data-date="${esc(m.date)}">${["d", "h", "m", "s"].map(u => `<div><b data-u="${u}">00</b><span>${u}</span></div>`).join("")}</div>` : `<p class="tbc">${t("tbc")}</p>`}
      <div class="mcard-foot"><span>${esc(m.comp)}</span><a href="#" data-soon>${t("cal")}</a></div></article>`;
  }
  function cardRank() {
    if (!me) return "";
    return `<article class="rank"><small>${t("rankT")} · ${t("round")}${me.p}</small><strong>${me.rk}${ord(me.rk)}</strong><b>Kawkab Marrakech</b><hr><span>${me.pts} ${t("pts")}</span><a href="#" data-tabgo="table">${t("all")}<span aria-hidden="true">→</span></a></article>`;
  }
  const rowFor = m => { const [h, a] = sides(m), fin = m.status === "finished";
    return `<div class="row"><span class="d">${m.date ? fdate(m.date) : t("tbc")} · ${t("round")}${m.round}</span><span class="t">${crest(h)}${esc(full(h))}</span>
      <span class="sc ${fin ? "" : "vs"}">${fin ? m.hs + " – " + m.as : "VS"}</span><span class="t r">${esc(full(a))}${crest(a)}</span><span class="c">${esc(m.comp)}</span></div>`; };
  function tableHtml() {
    return `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>#</th><th class="l">${t("team")}</th>${t("cols").map(c => `<th>${c}</th>`).join("")}</tr></thead><tbody>${std.map(r => `<tr class="${r.n === "KACM" ? "me" : ""}"><td>${r.rk}</td><td class="l">${crest(r.n)}${esc(full(r.n))}</td><td>${r.p}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td><td>${r.gf}</td><td>${r.ga}</td><td>${r.gf - r.ga > 0 ? "+" : ""}${r.gf - r.ga}</td><td><b>${r.pts}</b></td></tr>`).join("")}</tbody></table></div>`;
  }
  function renderCenter() {
    const b = $("#mcBody");
    b.innerHTML = tab === "une" ? `<div class="mc">${cardLast()}${cardNext()}${cardRank()}</div>`
      : tab === "res" ? `<div class="rows">${finished.map(rowFor).join("") || `<p class="empty">${t("none")}</p>`}</div>`
      : tab === "cal" ? `<div class="rows">${upcoming.map(rowFor).join("") || `<p class="empty">${t("none")}</p>`}</div>`
      : tableHtml();
    document.querySelectorAll(".tabs [data-tab]").forEach(x => x.setAttribute("aria-selected", x.dataset.tab === tab));
    tick();
  }
  function tick() {
    const el = $("#cd"); if (!el) return;
    const s = Math.max(0, Math.floor((new Date(el.dataset.date) - Date.now()) / 1000));
    const v = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
    for (const k in v) { const n = el.querySelector(`[data-u=${k}]`); if (n) n.textContent = String(v[k]).padStart(2, "0"); }
  }
  setInterval(tick, 1000);

  /* ---------- Actualités ---------- */
  function renderNews() {
    const l = KACM_NEWS.slice(0, 3);
    $("#newsGrid").innerHTML = l.map(n => `<a class="post" href="news.html#a=${encodeURIComponent(n.id)}"><div class="post-img" style="--pos:${esc(n.pos || "center")};--fit:${n.fit || "cover"};--bgc:${n.bgc || "#161112"}"><img src="${esc(n.img)}" alt="" loading="lazy"></div>
      <div class="post-body"><div class="post-meta"><span>${esc(n.cat)}</span><time datetime="${esc(n.date)}">${fdate(n.date)}</time></div><h3>${esc(n.title)}</h3><p>${esc(n.excerpt)}</p></div><span class="go" aria-hidden="true">↗</span></a>`).join("");
  }

  /* ---------- Équipe + joueurs ---------- */
  function renderTeam() {
    const coach = (D.staff.find(s => s.role === "coach") || {}).name || "";
    if (me) {
      $("#teamP").textContent = t("teamP").replace("{coach}", coach).replace("{n}", me.p).replace("{r}", ordTxt(me.rk)).replace("{pts}", me.pts);
      $("#teamStats").innerHTML = [[t("w"), me.w], [t("ndr"), me.d], [t("nl2"), me.l], [t("gf"), me.gf]].map(([l, v]) => `<div><dt>${l}</dt><dd>${v}</dd></div>`).join("");
    }
    const ids = [88078, 88305, 90356, 86773];
    $("#playersGrid").innerHTML = ids.map(id => D.players.find(p => p.id === id)).filter(Boolean).map(p => `<article class="pl"><div class="pl-photo" aria-hidden="true"><span class="pl-num">${esc(p.num)}</span></div>
      <div class="pl-info"><small>${esc(I18N[lang_()].pos[p.pos] || p.pos)}</small><b>${esc(p.name)}</b></div></article>`).join("");
  }
  function renderHistory() {
    $("#hisLine").innerHTML = t("tl").map(r => `<li><b>${r[0]}</b><div><strong>${esc(r[1])}</strong><span>${esc(r[2])}</span></div></li>`).join("");
  }

  /* ---------- Langue ---------- */
  function renderAll() { renderChip(); renderCenter(); renderNews(); renderTeam(); renderHistory(); }
  KACM.onLang(renderAll);

  /* ---------- Interactions ---------- */
  document.addEventListener("click", e => {
    const go = e.target.closest("[data-tabgo]");
    if (go) { e.preventDefault(); tab = go.dataset.tabgo; renderCenter(); return; }
    const tb = e.target.closest(".tabs [data-tab]");
    if (tb) { tab = tb.dataset.tab; renderCenter(); }
  });
  $("#nlForm").addEventListener("submit", e => { e.preventDefault(); const v = $("#nlMail").value.trim(); toast(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? t("nl.ok") : t("nl.bad")); });

  /* ---------- Diaporama supporters ---------- */
  (function fansSlider() {
    const box = $("#fansSlides"), slides = [...box.children], dots = $("#fansDots"), sec = $("#fans");
    let cur = 0, timer = null;
    const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    dots.innerHTML = slides.map((_, i) => `<button type="button" role="tab" aria-label="${i + 1}" aria-selected="${i === 0}" data-i="${i}"></button>`).join("");
    function show(n) {
      cur = (n + slides.length) % slides.length;
      slides.forEach((s, i) => { s.classList.toggle("on", i === cur); if (i === cur) s.loading = "eager"; });
      dots.querySelectorAll("button").forEach((b, i) => b.setAttribute("aria-selected", i === cur));
    }
    const play = () => { stop(); if (!reduce) timer = setInterval(() => show(cur + 1), 5000); };
    const stop = () => { clearInterval(timer); timer = null; };
    $("#fansPrev").addEventListener("click", () => { show(cur - 1); play(); });
    $("#fansNext").addEventListener("click", () => { show(cur + 1); play(); });
    dots.addEventListener("click", e => { const b = e.target.closest("button[data-i]"); if (b) { show(+b.dataset.i); play(); } });
    sec.addEventListener("mouseenter", stop); sec.addEventListener("mouseleave", play);
    sec.addEventListener("focusin", stop); sec.addEventListener("focusout", play);
    sec.addEventListener("keydown", e => { if (e.key === "ArrowLeft") { show(cur - (document.dir === "rtl" ? -1 : 1) * 1); play(); } if (e.key === "ArrowRight") { show(cur + (document.dir === "rtl" ? -1 : 1)); play(); } });
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : play()));
    play();
  })();

  KACM.applyLang();
})();
