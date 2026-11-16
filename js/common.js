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
