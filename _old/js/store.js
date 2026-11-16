/* 06 — Boutique */
const CK = { coupon: "", ship: "std" };
const SHIP = { pickup: ["Retrait au stade", 0], std: ["Livraison standard", 30], exp: ["Express", 60] };
ROUTES.store = (a, q) => {
  const cats = [...new Set(S.products.map(p => p.cat))], term = (q.q || "").toLowerCase(), l = S.products.filter(p => p.active && (!q.cat || p.cat === q.cat) && p.name.toLowerCase().includes(term));
  return `<section class="s"><div class="wrap"><div class="eyebrow">Boutique officielle</div><h2>${t("store")}</h2><div class="pills"><button class="${!q.cat ? "on" : ""}" onclick="go('store')">Tout</button>${cats.map(c => `<button class="${q.cat === c ? "on" : ""}" onclick="go('store?cat='+encodeURIComponent(this.textContent))">${esc(c)}</button>`).join("")}</div>
  <form class="tb" onsubmit="event.preventDefault();go('store?q='+encodeURIComponent(this.q.value))"><input name="q" placeholder="Rechercher un produit" value="${esc(q.q || "")}" aria-label="Recherche"><button class="btn sm">Rechercher</button></form><div class="grid g4">${l.map(productCard).join("") || "<div class='panel'><h3>Catalogue en préparation</h3><p>Les produits, photos, prix et stocks seront publiés après confirmation du club.</p></div>"}</div></div></section>`;
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
F.addcart = d => { const p = byId(S.products, d.pid); if (!p || !p.active) return; const qty = +d.qty; if (!Number.isInteger(qty) || qty < 1 || qty > p.stock) return toast("Stock insuffisant", "err");
  const custom = d.cname || d.cnum ? { n: d.cname || "", u: d.cnum || "" } : null;
  const ex = S.cart.find(c => c.pid === p.id && c.size === d.size && c.color === d.color && JSON.stringify(c.custom || null) === JSON.stringify(custom));
  if (S.cart.filter(c => c.pid === p.id).reduce((sum, c) => sum + c.qty, 0) + qty > p.stock) return toast("Stock insuffisant pour cette quantité", "err");
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
  if (!requireProfile()) return;
  const requested = new Map(); S.cart.forEach(c => requested.set(c.pid, (requested.get(c.pid) || 0) + c.qty));
  for (const [pid, qty] of requested) { const p = byId(S.products, pid); if (!p || !p.active || p.stock < qty) return toast("Stock insuffisant : " + (p?.name || "produit indisponible"), "err"); }
  const T = totals(), id = nextId(S.orders), paid = d.pay === "card";
  S.cart.forEach(c => { byId(S.products, c.pid).stock -= c.qty; });
  S.orders.push({ id, no: "CMD-" + String(1000 + id), uid: S.ui.uid, items: S.cart.map(c => ({ name: byId(S.products, c.pid).name, size: c.size, color: c.color, qty: c.qty, unit: byId(S.products, c.pid).price + (c.custom ? 50 : 0), custom: c.custom })), ...T, ship: T.ship, shipName: SHIP[CK.ship][0], pay: d.pay, paid, status: paid ? "paid" : "pending", name: d.name, phone: d.phone, addr: d.addr + ", " + d.city, at: new Date().toISOString(), tracking: "" });
  notify(`Commande CMD-${1000 + id} confirmée (e-mail simulé)`); S.cart = []; CK.coupon = ""; save(); toast("Commande confirmée"); go("account/orders");
};
const OSTEPS = ["pending", "paid", "shipped", "delivered"];
A.invoice = id => { const o = byId(S.orders, id), w = window.open("", "_blank"); if (!w) return toast("Autorisez les pop-ups", "err");
  w.document.write(`<title>Facture ${o.no}</title><body style="font-family:sans-serif;padding:30px"><h1>Facture ${o.no}</h1><p>KACM — ${fdate(o.at)}<br>Client : ${esc(o.name)}, ${esc(o.addr)}</p><table border=1 cellpadding=6 style="border-collapse:collapse"><tr><th>Article</th><th>Qté</th><th>PU</th></tr>${o.items.map(i => `<tr><td>${esc(i.name)} ${esc(i.size)}</td><td>${i.qty}</td><td>${money(i.unit)}</td></tr>`).join("")}</table><p>Remise : ${money(o.disc)} · Livraison : ${money(o.ship)}</p><h2>Total : ${money(o.total)} (${o.paid ? "payé" : "à régler"})</h2><p><i>Facture de démonstration.</i></p><script>setTimeout(()=>print(),400)<\/script>`); w.document.close(); };


