/* Noyau : store (localStorage), routeur, i18n, helpers, actions déléguées */
const KEY = "kacm_demo_v1";
/* Icônes SVG (remplacent les emojis) */
const ICONS = {
  play: '<path d="M8 5v14l11-7z"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>', globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
  cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>', play: '<path d="M7 4l13 8-13 8z"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>', lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  ball: '<circle cx="12" cy="12" r="10"/><path d="M12 7l4 3-1.5 5h-5L8 10z"/>', card: '<rect x="6" y="3" width="12" height="18" rx="2"/>',
  sub: '<path d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3"/>', note: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h8"/>',
  trophy: '<path d="M6 9H4a2 2 0 0 1-2-2V5h4M18 9h2a2 2 0 0 0 2-2V5h-4M6 3h12v7a6 6 0 0 1-12 0zM12 16v4M8 22h8"/>', star: '<path d="M12 2l3 6.9 7.5.7-5.7 5 1.8 7.4L12 18l-6.6 4 1.8-7.4-5.7-5 7.5-.7z"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>', x: '<path d="M18 6L6 18M6 6l12 12"/>',
  check: '<path d="M20 6L9 17l-5-5"/>', arrow: '<path d="M5 12h14M13 5l7 7-7 7"/>', pitch: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M12 5v14"/><circle cx="12" cy="12" r="2.5"/>'
};
Object.assign(ICONS, {
  ticket: '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/><path d="M13 5v2M13 17v2M13 11v2"/>',
  bag: '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/>', pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  cap: '<path d="M22 10L12 5 2 10l10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>', users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>', clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>', up: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>', external: '<path d="M6 18 18 6M8 6h10v10"/>',
  youtube: '<path d="M2.5 17a24.1 24.1 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.4a4 4 0 1 1-7.9 1.2 4 4 0 0 1 7.9-1.2zM17.5 6.5h.01"/>'
});
const ico = (n, c = "") => `<svg class="i ${["play", "star", "card", "heart"].includes(n) && c.includes("f") ? "f" : ""} ${c}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ""}</svg>`;
let S;
const A = {}, F = {}, ROUTES = {};
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
function load() { try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { S = null; } if (!S || S.version !== 5) S = buildSeed();
  enhanceDemoData(S);
  S.settings.tiles = Object.assign({ team: "assets/team.webp", history: "", palmares: "", shop: "", tickets: "assets/hero.png", fans: "assets/hero.png", academy: "assets/team.webp", media: "assets/team.webp" }, S.settings.tiles || {}); }
const accent = (s, n = 1) => { const w = String(s).trim().split(/\s+/), k = Math.min(n, w.length); return esc(w.slice(0, w.length - k).join(" ")) + (w.length > k ? " " : "") + "<em>" + esc(w.slice(-k).join(" ")) + "</em>"; };
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); return true; } catch (e) { toast("Stockage navigateur plein (image trop lourde ?)", "err"); return false; } }
const nextId = arr => arr.reduce((m, x) => Math.max(m, x.id || 0), 0) + 1;
const byId = (arr, id) => arr.find(x => x.id === +id);
const money = n => (Math.round(n * 100) / 100).toLocaleString("fr-FR") + " MAD";
const LOC = { fr: "fr-FR", ar: "ar-MA", en: "en-GB" };
const loc = () => LOC[S.ui.lang] || "fr-FR";
const fdate = (iso, o) => !iso ? "Date à confirmer" : new Date(iso).toLocaleDateString(loc(), o || { weekday: "short", day: "numeric", month: "short", year: "numeric" });
const ftime = iso => !iso || S.matches.some(m=>m.date===iso && m.timeConfirmed===false) ? "Horaire non confirmé" : new Date(iso).toLocaleTimeString(loc(), { hour: "2-digit", minute: "2-digit" });
const user = () => S.users.find(u => u.id === S.ui.uid) || null;
function ensureGuest() { if (!user()) { const id = nextId(S.users); S.users.push({ id, name: "", email: "", phone: "", points: 0, addrs: [], prefs: {} }); S.ui.uid = id; save(); } }
const club = () => "KACM";

/* ── i18n (navigation, héros, boutons communs ; le contenu éditorial est en FR dans la démo) ── */
const I18N = {
  fr: { home: "Accueil", matches: "Matchs", team: "Équipe", history: "Histoire", news: "Actualités", tickets: "Billetterie", store: "Boutique", academy: "Académie", fans: "Supporters", partners: "Partenaires", stadium: "Stade & Contact", login: "Connexion", account: "Mon compte", buy: "Acheter un billet", next: "Prochain Match", last: "Dernier résultat", standings: "Classement", top: "Meilleurs joueurs", videos: "Dernières vidéos", latest: "Dernières actualités", shop: "Nouveautés boutique", sponsors: "Sponsors officiels", nl: "Newsletter", sub: "S'abonner", more: "Voir tout", discover: "Découvrir le club", watch: "Voir les vidéos", d: "Jours", h: "Heures", m: "Min", s: "Sec" },
  ar: { home: "الرئيسية", matches: "المباريات", team: "الفريق", history: "التاريخ", news: "الأخبار", tickets: "التذاكر", store: "المتجر", academy: "الأكاديمية", fans: "الجماهير", partners: "الشركاء", stadium: "الملعب والتواصل", login: "تسجيل الدخول", account: "حسابي", buy: "اشتر تذكرة", next: "المباراة القادمة", last: "آخر نتيجة", standings: "الترتيب", top: "أفضل اللاعبين", videos: "آخر الفيديوهات", latest: "آخر الأخبار", shop: "جديد المتجر", sponsors: "الرعاة الرسميون", nl: "النشرة الإخبارية", sub: "اشترك", more: "عرض الكل", discover: "اكتشف النادي", watch: "شاهد الفيديوهات", d: "أيام", h: "ساعات", m: "دقائق", s: "ثوان" },
  en: { home: "Home", matches: "Matches", team: "Team", history: "History", news: "News", tickets: "Tickets", store: "Store", academy: "Academy", fans: "Supporters", partners: "Partners", stadium: "Stadium & Contact", login: "Sign in", account: "My account", buy: "Buy a ticket", next: "Next match", last: "Last result", standings: "Standings", top: "Top players", videos: "Latest videos", latest: "Latest news", shop: "Store highlights", sponsors: "Official sponsors", nl: "Newsletter", sub: "Subscribe", more: "See all", discover: "Discover the club", watch: "Watch videos", d: "Days", h: "Hours", m: "Min", s: "Sec" }
};
const t = k => (I18N[S.ui.lang] && I18N[S.ui.lang][k]) || I18N.fr[k] || k;
const HERO = { fr: null, ar: ["أكثر من نادٍ... عائلة.", "معاً، لنكتب صفحة جديدة من تاريخ الكوكب المراكشي."], en: ["More than a club... a family.", "Together, let's write a new page in the history of Kawkab Marrakech."] };

/* ── UI helpers ── */
function toast(msg, type) { const d = document.createElement("div"); d.className = "toast " + (type || "ok"); d.textContent = msg; $("#toasts").appendChild(d); setTimeout(() => d.remove(), 3500); }
function openModal(html) { const m = $("#modal"); m.innerHTML = '<div class="box" role="dialog" aria-modal="true"><button class="x" data-act="closeModal" aria-label="Fermer">×</button>' + html + "</div>"; m.hidden = false; }
function closeModal() { const m = $("#modal"); m.hidden = true; m.innerHTML = ""; }
function img(url, cls, label) { return url ? `<div class="${cls || "img"}" role="img" aria-label="${esc(label || "")}" style="background-image:url('${esc(url)}')"></div>` : `<div class="${cls || "img"} ph"><span>${esc(label || "Image")}</span></div>`; }
function avatar(p) { return p.photo ? `<div class="avatar" style="background-image:url('${esc(p.photo)}')"></div>` : `<div class="avatar ph"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="34" r="16"/><path d="M18 96c2-26 16-38 32-38s30 12 32 38z"/></svg><b>${p.num}</b></div>`; }
function qr(text) { try { const q = qrcode(0, "M"); q.addData(text); q.make(); return q.createSvgTag(4, 0); } catch (e) { return `<div class="qrfb">${esc(text)}</div>`; } }
function download(name, content, type) { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([content], { type: type || "text/plain" })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 500); }
function csv(rows) { return rows.map(r => r.map(c => '"' + String(c ?? "").replace(/"/g, '""') + '"').join(",")).join("\n"); }
function notify(text, uid) { S.notifications.unshift({ id: nextId(S.notifications), uid: uid ?? S.ui.uid, text, at: new Date().toISOString(), read: false }); }
function audit(action) { S.audit.unshift({ at: new Date().toISOString(), role: S.ui.role || "—", action }); S.audit = S.audit.slice(0, 200); }
const mine = arr => arr.filter(x => x.uid === S.ui.uid);
function matchTitle(m) { return m.home ? `KACM vs ${esc(m.opp)}` : `${esc(m.opp)} vs KACM`; }
function score(m) { return m.home ? `${m.hs} - ${m.as}` : `${m.as} - ${m.hs}`; }
function result(m) { return m.hs > m.as ? "V" : m.hs < m.as ? "D" : "N"; }  // hs = buts KACM, as = buts adversaire
function nextMatch() { return S.matches.filter(m => m.status === "scheduled" && (!m.date || new Date(m.date) > new Date())).sort((a, b) => (a.date ? new Date(a.date) : Infinity) - (b.date ? new Date(b.date) : Infinity))[0]; }
function lastMatch() { return S.matches.filter(m => m.status === "finished").sort((a, b) => new Date(b.date) - new Date(a.date))[0]; }
function liveMatch() { return S.matches.find(m => m.status === "live"); }
function ics(m) { const f = d => new Date(d).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"; const e = new Date(new Date(m.date).getTime() + 7200000);
  return `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nUID:kacm-${m.id}@demo\nDTSTAMP:${f(new Date())}\nDTSTART:${f(m.date)}\nDTEND:${f(e)}\nSUMMARY:${m.home ? "KACM vs " + m.opp : m.opp + " vs KACM"}\nLOCATION:${m.venue}\nEND:VEVENT\nEND:VCALENDAR`; }
function table() { // classement trié (points, diff)
  return S.standings.map(r => ({ n: r[0], p: r[1], w: r[2], d: r[3], l: r[4], gf: r[5], ga: r[6], pts: r[7] ?? (r[2] * 3 + r[3]), rank:r[8] })).sort((a, b) => a.rank && b.rank ? a.rank - b.rank : b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));
}

/* ── Routeur ── */
function parse() { const h = location.hash.replace(/^#\/?/, ""); const [path, q] = h.split("?"); return { parts: path.split("/").filter(Boolean), q: Object.fromEntries(new URLSearchParams(q || "")) }; }
function go(p) { location.hash = "#/" + p; }
function route() {
  const r = parse(); const name = r.parts[0] || "home";
  document.body.classList.toggle("is-admin", name === "admin");
  const fn = ROUTES[name] || ROUTES.notfound;
  clearInterval(route.timer);
  try { $("#app").innerHTML = fn(r.parts.slice(1), r.q); } catch (e) { console.error(e); $("#app").innerHTML = `<div class="wrap pad"><h2>Erreur</h2><p>${esc(e.message)}</p></div>`; }
  const BT = { matches: "Match Center", team: "Équipe première", history: "Histoire & palmarès", tickets: "Billetterie", store: "Boutique officielle", stadium: "Stade & contact", cart: "Panier", checkout: "Commande", account: "Mes achats" };
  if (BT[name]) $("#app").dataset.title = BT[name]; else delete $("#app").dataset.title;
  chrome(name); document.title = "KACM — " + ({home:"Accueil", matches:"Match Center", team:"Équipe", history:"Histoire & palmarès", news:"Actualités & médias", fans:"Supporters", store:"Boutique", stadium:"Stade & contact", tickets:"Billetterie", cart:"Panier", checkout:"Commande", account:"Mon compte", player:"Profil joueur", product:"Produit", match:"Fiche match"}[name] || "Plateforme digitale"); window.scrollTo(0, 0); reveal();
  if ($$("[data-cd]").length || $$("[data-live]").length) { tick(); route.timer = setInterval(tick, 1000); }
  $("#app").focus({preventScroll:true});
  if (ROUTES[name] && ROUTES[name].after) ROUTES[name].after(r.parts.slice(1), r.q);
}
function reveal() {  // apparition douce au scroll
  const els = $$("#app section.s .card, #app section.s .panel, #app section.s .head, #app .res, #app .fix, #app .bento figure, #app .tn");
  if (typeof IntersectionObserver === "undefined") return;
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .08 });
  els.forEach(e => { e.classList.add("rv"); io.observe(e); });
}
window.addEventListener("scroll", () => { const h = $("#hdr"); if (h) h.classList.toggle("solid", window.scrollY > 40); }, { passive: true });
function tick() {
  $$("[data-cd]").forEach(e => { let d = Math.max(0, new Date(e.dataset.cd) - Date.now()); const p = n => String(n).padStart(2, "0");
    e.querySelector("[data-u=d]").textContent = p(d / 864e5 | 0); e.querySelector("[data-u=h]").textContent = p(d / 36e5 % 24 | 0); e.querySelector("[data-u=m]").textContent = p(d / 6e4 % 60 | 0); e.querySelector("[data-u=s]").textContent = p(d / 1e3 % 60 | 0); });
}
function cd(iso) { return `<div class="cd" data-cd="${iso}">${["d", "h", "m", "s"].map(u => `<div><b data-u="${u}">00</b><span>${t(u)}</span></div>`).join("")}</div>`; }
function rerender() { const y = window.scrollY; route(); window.scrollTo(0, y); }

/* ── En-tête / pied de page ── */
const NAV = [["matches", "matches"], ["team", "team"], ["history", "history"], ["news", "news"], ["tickets", "tickets"], ["store", "store"], ["academy", "academy"], ["fans", "fans"], ["sponsors", "partners"], ["stadium", "stadium"]];
function chrome(name) {
  document.documentElement.lang = S.ui.lang; document.documentElement.dir = S.ui.lang === "ar" ? "rtl" : "ltr";
  const s = S.settings.social, logo = S.settings.logo ? `<img src="${esc(S.settings.logo)}" width="52" height="51" alt="">` : "";
  const NAVR = [["home", "Accueil"], ["matches", "Matchs"], ["team", "Équipe"], ["history", "Le club"], ["news", "Actualités"], ["store", "Boutique"]];
  const cart = S.cart.reduce((a, c) => a + c.qty, 0);
  $("#top").innerHTML = name === "admin" ? "" : `<div class="rx"><div class="topline"><div class="wrap topline-inner"><span>MARRAKECH · DEPUIS 1947</span><span class="utility-links"><a href="#/fans">Supporters</a><a href="#/stadium">Stade & contact</a><a href="#/account/tickets">Mon compte</a></span></div></div><div class="site-header"><div class="wrap navigation"><a class="brand" href="#/home" aria-label="Kawkab Marrakech, accueil">${logo}<span><strong>KAWKAB</strong><small>MARRAKECH</small></span></a>
    <nav id="main-navigation" aria-label="Navigation principale">${NAVR.map(([r, l]) => `<a href="#/${r}" ${name === r ? 'aria-current="location"' : ""}>${l}</a>`).join("")}</nav>
    <div class="hx"><a class="hx-ic" href="#/cart" aria-label="Panier">${ico("cart")}<i>${cart || ""}</i></a><a class="hx-ic" href="#/account/tickets" aria-label="Mes achats" title="Mes achats">${ico("bag")}</a>
     <div class="langdd"><button class="hx-ic" type="button" data-act="langmenu" aria-label="Langue" aria-haspopup="true" aria-expanded="false">${ico("globe")}</button><ul class="langlist" hidden>${[["fr", "Français"], ["ar", "العربية"], ["en", "English"]].map(([l, n]) => `<li><button type="button" data-act="lang" data-arg="${l}" class="${S.ui.lang === l ? "on" : ""}">${n}${S.ui.lang === l ? ico("check") : ""}</button></li>`).join("")}</ul></div></div>
    <a class="button header-ticket" href="#/tickets" aria-label="Billetterie" title="Billetterie">${ico("ticket")}<span>Billetterie</span></a>
    <button class="menu-toggle" type="button" data-act="menu" aria-controls="main-navigation" aria-expanded="false" aria-label="Ouvrir le menu">${ico("menu")}</button></div></div></div>`;
  $("#bot").innerHTML = name === "admin" ? "" : `<div class="demo-ribbon">Données sportives consultées le 16 novembre 2026 · <a href="#/sources">Sources & mise à jour</a> · services interactifs en prototype</div><div class="rx"><footer class="footer"><div class="wrap footer-inner"><a class="brand footer-brand" href="#/home" aria-label="Retour à l'accueil">${logo.replace('width="52" height="51"', 'width="56" height="55"')}<span><strong>KAWKAB</strong><small>MARRAKECH</small></span></a>
   <div class="footer-links"><a href="#/tickets" data-ticket-info>Infos billetterie</a><a href="#/news">Actualités & médias</a><a href="#/fans">Supporters</a><a href="#/matches">Matchs</a><a href="#/team">Équipe</a><a href="#/history">Le club</a><a href="#/tickets">Billetterie</a><a href="#/store">Boutique</a><a href="#/stadium">Stade &amp; contact</a><a href="#/cart">Panier</a><a href="#/account/tickets">Mes achats</a>
    <a href="${esc(s.facebook)}" target="_blank" rel="noopener">Facebook</a><a href="${esc(s.instagram)}" target="_blank" rel="noopener">${ico("instagram")} Instagram</a><a href="${esc(s.youtube)}" target="_blank" rel="noopener">YouTube</a>
    <span class="langs"><button type="button" data-act="lang" data-arg="fr">FR</button><button type="button" data-act="lang" data-arg="ar">AR</button><button type="button" data-act="lang" data-arg="en">EN</button></span></div>
   <p>Prototype indépendant · données sportives sourcées, sans actualisation en direct · <a href="admin/index.html">Administration</a> · <a href="#" data-act="resetDemo">Réinitialiser</a></p></div></footer></div>`;
}

/* ── Actions & formulaires délégués ── */
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]"); if (!el) return;
  const f = A[el.dataset.act]; if (!f) return;
  if (el.tagName === "A" && el.getAttribute("href") === "#") e.preventDefault();
  f(el.dataset.arg, el, e);
});
document.addEventListener("submit", e => {
  const f = e.target.dataset.form; if (!f || !F[f]) return; e.preventDefault();
  if (!e.target.checkValidity()) { e.target.reportValidity(); return; }
  F[f](Object.fromEntries(new FormData(e.target)), e.target);
});
document.addEventListener("change", e => {
  const el = e.target;
  if (el.matches("input[type=file][data-fill]")) { const fl = el.files[0]; if (!fl) return; if (fl.size > 400000) { toast("Image > 400 Ko : utilisez une URL ou une image plus légère", "err"); return; }
    const r = new FileReader(); r.onload = () => { const t = $(`[name="${el.dataset.fill}"]`, el.form); if (t) t.value = r.result; toast("Image chargée"); }; r.readAsDataURL(fl); }
  if (el.dataset.chg && A[el.dataset.chg]) A[el.dataset.chg](el.value, el);
});
window.addEventListener("hashchange", route);
window.addEventListener("storage", e => { if (e.key === KEY) { load(); if (!$("#modal").innerHTML) rerender(); } });  // démo multi-onglets (live)
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

A.closeModal = closeModal;
A.totop = () => window.scrollTo({ top: 0, behavior: "smooth" });
A.langmenu = (_, el) => { const l = $(".langlist"), o = l.hidden; l.hidden = !o; el.setAttribute("aria-expanded", o); };
document.addEventListener("click", e => { if (!e.target.closest(".langdd")) { const l = $(".langlist"); if (l) l.hidden = true; } });
A.menu = (_, el) => { const n = $("#main-navigation"); if (!n) return; const o = n.classList.toggle("is-open"); el.setAttribute("aria-expanded", String(o)); el.setAttribute("aria-label", o ? "Fermer le menu" : "Ouvrir le menu"); };
document.addEventListener("click", e => { if (e.target.closest("#main-navigation a")) { const n = $("#main-navigation"), m = $(".menu-toggle"); n && n.classList.remove("is-open"); m && m.setAttribute("aria-expanded", "false"); } });
A.lang = l => { S.ui.lang = l; save(); rerender(); };
A.resetDemo = () => { if (confirm("Réinitialiser toutes les données de démonstration ?")) { localStorage.removeItem(KEY); load(); go("home"); route(); toast("Démo réinitialisée"); } };
A.dl = (id) => { const m = byId(S.matches, id); if (!m?.date || m.dateConfirmed===false || m.timeConfirmed===false) return toast("Date ou horaire à confirmer avant l’ajout au calendrier", "err"); download(`match-${id}.ics`, ics(m), "text/calendar"); };

function boot() { load(); ensureGuest(); if (!location.hash) location.hash = "#/home"; route(); }
