/* KACM — socle commun à toutes les pages : langue, menu, notifications, utilitaires */
window.KACM = (function () {
  "use strict";
  let lang = "fr";
  try { lang = localStorage.getItem("kacm_lang") || "fr"; } catch (e) {}
  if (!I18N[lang]) lang = "fr";
  const listeners = [];
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const LOC = { fr: "fr-FR", en: "en-GB", ar: "ar-MA" };
  const api = {
    $, esc,
    get lang() { return lang; },
    t(k) { const v = I18N[lang][k]; return v != null ? v : I18N.fr[k]; },
    fdate(iso, o) { return new Date(iso).toLocaleDateString(LOC[lang], o || { day: "numeric", month: "short", year: "numeric" }); },
    onLang(fn) { listeners.push(fn); },
    toast(msg) { const n = $("#toast"); if (!n) return; n.textContent = msg; n.classList.add("show"); clearTimeout(api._tt); api._tt = setTimeout(() => n.classList.remove("show"), 2800); },
    applyLang() {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      document.querySelectorAll("[data-i18n]").forEach(n => { const v = api.t(n.dataset.i18n); if (/<br>/.test(v)) n.innerHTML = v; else n.textContent = v; });
      const cur = $("#langCur"); if (cur) cur.textContent = lang.toUpperCase();
      document.querySelectorAll(".lang-menu li").forEach(li => li.setAttribute("aria-selected", li.dataset.lang === lang));
      listeners.forEach(fn => fn());
    }
  };
  function closeLang() { const m = $(".lang-menu"); if (m) { m.hidden = true; $(".lang-btn").setAttribute("aria-expanded", "false"); } }
  document.addEventListener("click", e => {
    const soon = e.target.closest("[data-soon]");
    if (soon) { e.preventDefault(); api.toast(api.t("soon")); return; }
    const li = e.target.closest(".lang-menu li");
    if (li) { lang = li.dataset.lang; try { localStorage.setItem("kacm_lang", lang); } catch (x) {} closeLang(); api.applyLang(); return; }
    if (e.target.closest(".lang-btn")) { const m = $(".lang-menu"), open = m.hidden; m.hidden = !open; $(".lang-btn").setAttribute("aria-expanded", open); return; }
    if (!e.target.closest(".lang")) closeLang();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLang(); });
  const burger = $("#burger");
  if (burger) burger.addEventListener("click", () => { const o = burger.getAttribute("aria-expanded") !== "true"; burger.setAttribute("aria-expanded", o); $("#nav").classList.toggle("open", o); });
  return api;
})();

/* ---------- Recherche sur le site (bouton loupe de l'en-tête) ---------- */
(function () {
  "use strict";
  const btn = document.getElementById("srchBtn");
  if (!btn) return;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const norm = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const PAGES = [["Accueil", "index.html"], ["News · actualités", "news.html"], ["Équipe · joueurs", "team.html"], ["Club · mot du président · mission", "club.html"], ["Histoire et palmarès", "histoire.html"], ["Stade · Grand Stade · El Harti", "stade.html"], ["Boutique · maillots", "store.html"], ["Média · vidéos · photos", "media.html"], ["Billetterie", "https://kacm.ticketing.ma/"]];
  let idx = null, dlg = null, newsLoaded = false;
  function build() {
    const items = PAGES.map(([t, u]) => ({ t, u, k: "Page", n: norm(t) }));
    const D = typeof VERIFIED_DATA !== "undefined" ? VERIFIED_DATA : null;
    if (D && D.players) D.players.forEach(p => items.push({ t: p.name, u: "team.html#p=" + p.id, k: "Joueur", n: norm(p.name + " " + (p.pos || "")) }));
    if (typeof KACM_NEWS !== "undefined") KACM_NEWS.forEach(a => items.push({ t: a.title, u: "news.html#a=" + encodeURIComponent(a.id), k: "News", n: norm(a.title + " " + (a.excerpt || "")) }));
    idx = items;
  }
  function open() {
    if (!dlg) {
      dlg = document.createElement("dialog");
      dlg.className = "srch-dlg";
      dlg.setAttribute("aria-label", "Recherche");
      dlg.innerHTML = '<form class="srch-f" role="search"><input id="srchIn" type="search" placeholder="Rechercher un joueur, une actualité, une page…" autocomplete="off" aria-label="Rechercher"><button type="button" class="srch-x" data-sx aria-label="Fermer">×</button></form><ul class="srch-r" id="srchOut"></ul>';
      document.body.appendChild(dlg);
      dlg.addEventListener("click", e => { if (e.target === dlg || e.target.closest("[data-sx]")) dlg.close(); });
      dlg.querySelector("form").addEventListener("submit", e => { e.preventDefault(); const a = dlg.querySelector(".srch-r a"); if (a) location.href = a.href; });
      dlg.querySelector("#srchIn").addEventListener("input", render);
    }
    if (!newsLoaded && typeof KACM_NEWS === "undefined") {
      newsLoaded = true;
      const s = document.createElement("script");
      s.src = "js/news-data.js";
      s.onload = () => { idx = null; render(); };
      document.head.appendChild(s);
    }
    dlg.showModal();
    dlg.querySelector("#srchIn").value = "";
    render();
    dlg.querySelector("#srchIn").focus();
  }
  function render() {
    if (!idx) build();
    const q = norm(dlg.querySelector("#srchIn").value.trim()), out = dlg.querySelector("#srchOut");
    const l = (q ? idx.filter(i => q.split(/\s+/).every(w => i.n.includes(w))) : idx.filter(i => i.k === "Page")).slice(0, 12);
    out.innerHTML = l.length ? l.map(i => '<li><a href="' + esc(i.u) + '"' + (i.u.startsWith("http") ? ' target="_blank" rel="noopener"' : "") + "><span>" + esc(i.t) + "</span><small>" + i.k + "</small></a></li>").join("") : '<li class="srch-none">Aucun résultat.</li>';
  }
  btn.addEventListener("click", open);
  document.addEventListener("keydown", e => {
    if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !(dlg && dlg.open)) { e.preventDefault(); open(); }
  });
})();
