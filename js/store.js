/* KACM — Boutique officielle : grille filtrable + fiche produit avec commande directe dans la même fenêtre.
   Prix : renseigner `p` (nombre, en DH). Un produit sans prix ne peut pas être commandé.
   Pour l'instant la commande n'est envoyée nulle part : elle est mémorisée dans le navigateur (localStorage "kacm_orders")
   et un message de confirmation s'affiche. Pour recevoir les commandes, renseigner `endpoint` dans js/store-config.js. */
(function () {
  "use strict";
  const { $, esc } = KACM;
  const CFG = Object.assign({ endpoint: "", email: "", currency: "DH", shipping: 0, shippingNote: "", payment: "" }, window.KACM_STORE || {});
  const IMG = f => `assets/store/${f}.jpg`;
  const SZ = ["Enfant", "XS", "S", "M", "L", "XL", "2XL", "3XL"];
  const CATS = [["all", "Tout"], ["tenues", "Tenues officielles"], ["maillots", "Maillots"], ["survets", "Survêtements"], ["polos", "Polos"], ["casquettes", "Casquettes"], ["jackets", "Jackets"], ["cachkouls", "Cachkouls"], ["drapeaux", "Drapeaux"], ["portecles", "Porte-clés"], ["mugs", "Mugs"]];
  const P = [
    { id: "maillot-domicile", p: 200, cat: "tenues", name: "Tenue Officielle", tag: "Nouveau", color: ["Rouge", "#c91c2a"], season: "Saison 2026/27", imgs: ["maillot-domicile"], desc: "Le maillot rouge du Kawkab : liserés blancs, motif tramé en relief et écusson brodé. À porter au stade comme en ville." },
    { id: "maillot-exterieur", cat: "tenues", name: "Tenue Officielle", tag: "Nouveau", color: ["Blanc", "#ece8e6"], season: "Saison 2026/27", sizes: SZ, sizeTxt: "Enfant · XS au 3XL", p: 200, imgs: ["maillot-exterieur"], desc: "Le maillot blanc aux fines rayures rouges, avec écusson du club et flocage partenaires." },
    { id: "maillot-third", p: 200, cat: "tenues", name: "Tenue Officielle", tag: "Nouveau", color: ["Noir", "#1c1718"], season: "Saison 2026/27", imgs: ["maillot-third"], desc: "Un maillot noir à col en V et liserés blancs, au motif discret tissé dans la matière." },
    { id: "tenue-blanche", p: 350, cat: "maillots", name: "Maillot", tag: "Maillot + short", color: ["Blanc", "#ece8e6"], season: "Maillot + short", imgs: ["tenue-blanche-1", "tenue-blanche-2"], desc: "Maillot blanc aux bandes rouges ondulées et short assorti, écusson du Kawkab brodé." },
    { id: "tenue-glacier", p: 350, cat: "maillots", name: "Maillot", tag: "Maillot + short", color: ["Bleu glacier", "#bfe0ee"], season: "Maillot + short", imgs: ["tenue-glacier-1", "tenue-glacier-2"], desc: "Maillot sans manches à motif glacier et short assorti, pour s’entraîner aux couleurs du club." },
    { id: "survetement-gris", p: 450, cat: "survets", name: "Survêtement", tag: "Veste + pantalon", color: ["Gris", "#b9b4b0"], season: "Veste + pantalon", imgs: ["survetement-1", "survetement-2"], desc: "Veste à capuche zippée et pantalon gris clair, liserés rouges et écusson du Kawkab." },
    { id: "polo-rouge", p: 180, cat: "polos", name: "Polo", tag: "Polo", color: ["Rouge", "#c91c2a"], season: "Polo", imgs: ["polo-rouge"], desc: "Polo rouge à col blanc et empiècements blancs sur les côtés, écusson brodé sur le cœur." },
    { id: "polo-blanc", p: 180, cat: "polos", name: "Polo", tag: "Polo", color: ["Blanc", "#ece8e6"], season: "Polo", imgs: ["polo-blanc"], desc: "Polo blanc à col et empiècements rouges, écusson du Kawkab brodé." },
    { id: "casquette-blanche", p: 80, cat: "casquettes", name: "Casquette", tag: "Accessoire", color: ["Blanc", "#ece8e6"], season: "Accessoire", imgs: ["casquette-blanche"], desc: "Casquette blanche avec écusson brodé rouge du Kawkab." },
    { id: "casquette-rouge", p: 80, cat: "casquettes", name: "Casquette", tag: "Accessoire", color: ["Rouge", "#c91c2a"], season: "Accessoire", imgs: ["casquette-rouge"], desc: "Casquette rouge avec écusson brodé du Kawkab." }
  ];
  P.forEach(p => { if (!p.sizes && p.cat !== "casquettes") p.sizes = SZ; });
  const byId = id => P.find(x => x.id === id);
  const label = c => CATS.find(x => x[0] === c)[1];
  const money = n => `${n.toLocaleString("fr-FR")} ${CFG.currency}`;
  const priceTxt = p => p.p ? money(p.p) : "";
  let cat = "all";

  /* ---------- catalogue ---------- */
  function renderCats() {
    const open = $("#stoFilt").classList.contains("open");
    $("#stoFilt").innerHTML = `<button type="button" class="sto-fbtn" data-fmenu aria-haspopup="listbox" aria-expanded="${open}"><span>${cat === "all" ? "Sélectionner une catégorie" : esc(label(cat))}</span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>
      <ul class="sto-flist" role="listbox">${CATS.map(([k, n]) => `<li><button type="button" role="option" class="sto-fc${cat === k ? " on" : ""}" data-cat="${k}" aria-selected="${cat === k}">${esc(n)}</button></li>`).join("")}</ul>`;
  }
  document.addEventListener("click", e => {
    const f = $("#stoFilt"); if (!f) return;
    const m = e.target.closest("[data-fmenu]");
    if (m) { f.classList.toggle("open"); m.setAttribute("aria-expanded", f.classList.contains("open")); return; }
    if (f.classList.contains("open") && !e.target.closest("[data-cat]")) { f.classList.remove("open"); renderCats(); }
  });
  const pickSize = {};
  function renderGrid() {
    const l = P.filter(p => cat === "all" || p.cat === cat);
    $("#stoTitle").textContent = cat === "all" ? "Toute la boutique" : label(cat);
    renderCats();
    $("#stoGrid").innerHTML = l.length ? "" : '<p class="sto-empty">Bientôt disponible dans cette catégorie.</p>';
    if (l.length) $("#stoGrid").innerHTML = l.map(p => {
      if (p.sizes && !pickSize[p.id]) pickSize[p.id] = p.sizes.includes("M") ? "M" : p.sizes[0];
      const badge = (p.tag || "").toUpperCase();
      return `<button type="button" class="sto-card" data-p="${p.id}" aria-label="${esc(p.name)}"><span class="sto-img"><img src="${IMG(p.imgs[0])}" alt="" loading="lazy">${p.imgs[1] ? `<img class="alt" src="${IMG(p.imgs[1])}" alt="" loading="lazy">` : ""}<span class="sto-exp" data-zoom="${p.id}" role="button" aria-label="Agrandir la photo"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></span></span><span class="sto-body"><small>${esc(p.season || label(p.cat))}</small><strong>${esc(p.name)}</strong><span class="sto-row"><span class="sto-col"><i style="background:${p.color[1]}"></i>${esc(p.color[0])}</span><span class="sto-price">${priceTxt(p)}</span></span><span class="sto-go">Acheter <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></span></button>`;
    }).join("");
  }

  /* ---------- fenêtre produit : détail -> commande -> confirmation ---------- */
  let cur = null, sel = { size: "", q: 1 };
  const panel = html => { $("#stoPanel").innerHTML = html; };
  const lineTxt = () => cur.p ? money(cur.p * sel.q) : "Prix confirmé par le club";
  const total = () => (cur.p || 0) * sel.q + (CFG.shipping || 0);
  function openProduct(id) {
    cur = byId(id); if (!cur) return;
    sel = { size: cur.sizes ? "" : "Unique", q: 1 };
    const d = $("#stoDlg");
    d.classList.remove("is-done");
    d.innerHTML = `<button type="button" class="sto-x" data-close aria-label="Fermer">×</button>
      <div class="sto-d-img" style="--bg:url(../${IMG(cur.imgs[0])})"><img id="stoMain" src="${IMG(cur.imgs[0])}" alt="${esc(cur.name)}">${cur.imgs.length > 1 ? `<div class="sto-th">${cur.imgs.map((f, i) => `<button type="button" data-th="${f}" aria-selected="${i === 0}"><img src="${IMG(f)}" alt=""></button>`).join("")}</div>` : ""}</div>
      <div class="sto-d-txt" id="stoPanel"></div>`;
    viewDetail();
    d.showModal();
  }
  function quickOrder(id) {
    cur = byId(id); if (!cur) return;
    sel = { size: cur.sizes ? (pickSize[id] || "M") : "Unique", q: 1 };
    const d = $("#stoDlg");
    d.innerHTML = `<button type="button" class="sto-x" data-close aria-label="Fermer">×</button>
      <div class="sto-d-img" style="--bg:url(../${IMG(cur.imgs[0])})"><img id="stoMain" src="${IMG(cur.imgs[0])}" alt="${esc(cur.name)}"></div>
      <div class="sto-d-txt" id="stoPanel"></div>`;
    viewConfirm();
    d.showModal();
  }
  function viewDetail() {
    $("#stoDlg").classList.remove("is-done");
    const p = cur;
    const buy = `
      ${p.sizes ? `<div class="sto-opt"><b>Taille</b><div class="sto-sizes" role="radiogroup" aria-label="Taille">${p.sizes.map(s => `<button type="button" role="radio" aria-checked="${s === sel.size}" data-size="${s}">${s}</button>`).join("")}</div></div>` : ""}
      <div class="sto-opt"><b>Quantité</b><div class="sto-qty"><button type="button" data-q="-1" aria-label="Moins">−</button><output id="stoQ">${sel.q}</output><button type="button" data-q="1" aria-label="Plus">+</button></div></div>
      <p class="sto-err" id="stoErr" role="alert" hidden>Choisissez une taille.</p>
      <button type="button" class="btn btn-red sto-add" data-order><span>Commander</span><span aria-hidden="true">→</span></button>
      <p class="sto-hint">${esc(CFG.payment)}</p>`;
    panel(`<p class="eyebrow"><span>${esc(p.season)}</span></p><h3>${esc(p.name)}</h3>
      <p class="sto-meta"><span class="sto-col"><i style="background:${p.color[1]}"></i>${esc(p.color[0])}</span><span class="sto-price big">${priceTxt(p)}</span></p>
      <p>${esc(p.desc)}</p>${buy}`);
  }
  function viewConfirm() {
    $("#stoDlg").classList.add("is-done");
    const p = cur;
    panel(`<button type="button" class="sto-back top" data-view="detail">← Modifier</button>
      <h3>Confirmer la commande</h3>
      <div class="sto-recap"><img src="${IMG(p.imgs[0])}" alt=""><div><strong>${esc(p.name)}</strong><small id="stoRecapSz">${sel.size !== "Unique" ? "Taille " + esc(sel.size) + " · " : ""}Quantité ${sel.q}</small></div><b>${cur.p ? money(p.p * sel.q) : ""}</b></div>
      ${p.sizes ? `<div class="sto-cfsz"><p class="pc2-l">Taille sélectionnée</p><div class="pc2-sz" role="radiogroup" aria-label="Taille">${p.sizes.map(z => `<button type="button" role="radio" aria-checked="${z === sel.size}" data-xsize="${z}">${z}</button>`).join("")}</div></div>` : ""}
      <form class="sto-form" id="stoForm" novalidate>
        <label>Nom complet<input name="name" autocomplete="name" required></label>
        <label>Téléphone<input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="06 12 34 56 78" required></label>
        <fieldset class="sto-mode"><legend>Réception</legend>
          <label><input type="radio" name="mode" value="Livraison" checked> Livraison</label>
          <label><input type="radio" name="mode" value="Paiement en ligne"> Paiement en ligne</label></fieldset>
        <p class="sto-hint" id="stoPayNote" hidden>Le club vous enverra le lien de paiement en ligne après avoir confirmé votre commande.</p>
        <div id="stoAddr"><label>Ville<input name="city" autocomplete="address-level2"></label><label>Adresse<input name="address" autocomplete="street-address"></label></div>
        <input name="website" class="sto-hp" tabindex="-1" autocomplete="off" aria-hidden="true">
        <div class="sto-sum"><div><span>Total</span><b>${cur.p ? money(total()) : "À confirmer"}</b></div><p class="sto-hint">${esc(CFG.payment)}. ${esc(CFG.shippingNote)}</p></div>
        <p class="sto-err" id="stoFErr" role="alert" hidden></p>
        <button type="submit" class="btn btn-red sto-wide" id="stoSend"><span>Confirmer la commande</span><span aria-hidden="true">✓</span></button></form>`);
  }
  function viewDone(o) {
    $("#stoDlg").classList.add("is-done");
    panel(`<div class="sto-done"><div class="sto-ok" aria-hidden="true">✓</div><h4>Merci ${esc(o.customer.name.split(" ")[0])} !</h4>
      <p>Votre commande <b>${esc(o.id)}</b> a bien été enregistrée : ${esc(o.item.name)}${o.item.size !== "Unique" ? ", taille " + esc(o.item.size) : ""}, quantité ${o.item.qty}.</p>
      <p>Le club vous contactera au <b>${esc(o.customer.phone)}</b> pour la confirmer${o.customer.mode === "Paiement en ligne" ? " et vous envoyer le lien de paiement en ligne" : ""}.</p>
      <p class="sto-hint">${o.item.price ? "Total : " + money(o.total) + " · " : ""}${esc(CFG.payment)}</p>
      <button type="button" class="btn btn-red" data-close><span>Continuer mes achats</span></button></div>`);
  }
  function orderId() { const d = new Date(), z = n => String(n).padStart(2, "0"); return `KACM-${String(d.getFullYear()).slice(2)}${z(d.getMonth() + 1)}${z(d.getDate())}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`; }
  const phoneOk = v => /^(?:\+212|00212|0)[5-7]\d{8}$/.test(v.replace(/[\s.\-()]/g, ""));

  function submit(form) {
    const f = Object.fromEntries(new FormData(form).entries()), err = $("#stoFErr");
    const fail = m => { err.textContent = m; err.hidden = false; };
    if (f.website) return;
    if (f.name.trim().length < 3) return fail("Indiquez votre nom complet.");
    if (!phoneOk(f.phone)) return fail("Indiquez un numéro de téléphone marocain valide (ex. 06 12 34 56 78).");
    if (!f.city.trim() || !f.address.trim()) return fail("Indiquez la ville et l’adresse de livraison.");
    err.hidden = true;
    const o = { id: orderId(), date: new Date().toISOString(), customer: { name: f.name.trim(), phone: f.phone.trim(), mode: f.mode, city: (f.city || "").trim(), address: (f.address || "").trim() },
      item: { id: cur.id, name: cur.name, size: sel.size, qty: sel.q, price: cur.p }, shipping: CFG.shipping || 0, total: total(), payment: CFG.payment };
    try { const all = JSON.parse(localStorage.getItem("kacm_orders") || "[]"); all.push(o); localStorage.setItem("kacm_orders", JSON.stringify(all)); } catch (e) { /* stockage indisponible */ }
    if (CFG.endpoint) { try { fetch(CFG.endpoint, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(o) }); } catch (e) { /* envoi ignoré */ } }
    badge(); viewDone(o);
  }

  /* ---------- mes commandes (panier) ---------- */
  const orders = () => { try { return JSON.parse(localStorage.getItem("kacm_orders") || "[]"); } catch (e) { return []; } };
  const fdt = iso => new Date(iso).toLocaleString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
  function badge() { const n = orders().length; $("#stoCount").textContent = n; $("#stoCartBtn").classList.toggle("has", n > 0); }
  function openOrders() {
    const l = orders().slice().reverse(), d = $("#stoOrders");
    d.innerHTML = `<header class="sto-ch"><h3>Mes commandes</h3><button type="button" class="sto-x in" data-closeo aria-label="Fermer">×</button></header>
      ${l.length ? `<ul class="sto-olist">${l.map(o => { const p = byId(o.item.id); return `<li class="sto-o"><img src="${IMG(p ? p.imgs[0] : "maillot-domicile")}" alt=""><div><b>${esc(o.id)}</b><strong>${esc(o.item.name)}</strong><small>${o.item.size !== "Unique" ? "Taille " + esc(o.item.size) + " · " : ""}Quantité ${o.item.qty}</small><small>${esc(o.customer.mode)} · ${esc(fdt(o.date))}</small><span class="sto-st">En attente de confirmation</span></div><div class="sto-ot">${o.item.price ? money(o.total) : "À confirmer"}</div></li>`; }).join("")}</ul>` : `<div class="sto-empty"><p>Vous n’avez pas encore passé de commande.</p><button type="button" class="btn btn-red" data-closeo><span>Voir la collection</span></button></div>`}`;
    d.showModal();
  }

  /* ---------- événements ---------- */
  document.addEventListener("click", e => {
    const t = e.target;
    const xs = t.closest("[data-xsize]");
    if (xs) { sel.size = xs.dataset.xsize; if (pickSize) pickSize[cur.id] = sel.size; xs.parentElement.querySelectorAll("button").forEach(x => x.setAttribute("aria-checked", x === xs)); const rs = $("#stoRecapSz"); if (rs) rs.textContent = "Taille " + sel.size + " · Quantité " + sel.q; return; }
    const cs = t.closest("[data-csize]");
    if (cs) { const [pid, z] = cs.dataset.csize.split("|"); pickSize[pid] = z; cs.parentElement.querySelectorAll("button").forEach(x => x.setAttribute("aria-checked", x === cs)); return; }
    const zm = t.closest("[data-zoom]");
    if (zm) {
      const pr = P.find(x => x.id === zm.dataset.zoom); let d = $("#stoZoom");
      if (!d) { d = document.createElement("dialog"); d.id = "stoZoom"; d.className = "sto-zoom"; d.addEventListener("click", () => d.close()); document.body.appendChild(d); }
      d.innerHTML = `<button type="button" class="sto-zoom-x" aria-label="Fermer">×</button>${pr.imgs.map(f => `<img src="${IMG(f)}" alt="${esc(pr.name)}">`).join("")}`;
      d.showModal(); return;
    }
    const co = t.closest("[data-corder]"); if (co) { quickOrder(co.dataset.corder); return; }
    const c = t.closest("[data-cat]");
    if (c) { cat = c.dataset.cat; $("#stoFilt").classList.remove("open"); renderGrid(); if (c.classList.contains("sto-cat")) $("#collection").scrollIntoView({ behavior: "smooth" }); return; }
    const p = t.closest("[data-p]"); if (p) { openProduct(p.dataset.p); return; }
    const th = t.closest("[data-th]");
    if (th) { $("#stoMain").src = IMG(th.dataset.th); th.closest(".sto-d-img").style.setProperty("--bg", `url(../${IMG(th.dataset.th)})`); th.parentElement.querySelectorAll("button").forEach(b => b.setAttribute("aria-selected", b === th)); return; }
    const sz = t.closest("[data-size]");
    if (sz) { sel.size = sz.dataset.size; sz.parentElement.querySelectorAll("button").forEach(b => b.setAttribute("aria-checked", b === sz)); $("#stoErr").hidden = true; return; }
    const q = t.closest("[data-q]");
    if (q) { sel.q = Math.max(1, Math.min(10, sel.q + +q.dataset.q)); $("#stoQ").textContent = sel.q; return; }
    if (t.closest("[data-order]")) { if (!sel.size) { $("#stoErr").hidden = false; return; } viewConfirm(); return; }
    if (t.closest("[data-view]")) { viewDetail(); return; }
    if (t.closest("#stoCartBtn")) { openOrders(); return; }
    if (t.closest("[data-closeo]") || t === $("#stoOrders")) { $("#stoOrders").close(); return; }
    if (t.closest("[data-close]") || t === $("#stoDlg")) $("#stoDlg").close();
  });
  document.addEventListener("change", e => { if (e.target.name === "mode") { const n = $("#stoPayNote"); if (n) n.hidden = e.target.value !== "Paiement en ligne"; } });
  document.addEventListener("submit", e => { if (e.target.id === "stoForm") { e.preventDefault(); submit(e.target); } });
  renderCats(); renderGrid(); badge();
  KACM.applyLang();
})();
