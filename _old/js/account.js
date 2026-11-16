/* Mes achats (billets + commandes, sans compte : liés à cet appareil) */
ROUTES.account = ([tab = "tickets"]) => {
  const ords = mine(S.orders);
  const tabs = [["tickets", "Billetterie externe"], ["orders", "Mes commandes (" + ords.length + ")"]];
  let b = "";
  if (tab === "tickets") b = `<div class="panel"><h3>Vos billets sur KACM Ticketing</h3><p>La réservation, le paiement, l’historique et les billets sont gérés par la plateforme de billetterie.</p><p style="margin-top:20px">${ticketLink("Accéder à mes billets")}</p></div>`;
  if (tab === "orders") b = ords.map(o => `<div class="panel"><div class="head" style="margin:0"><h3>${o.no} · ${money(o.total)}</h3><span class="badge ${o.paid ? "ok" : "wn"}">${o.paid ? "payée" : "à régler"}</span></div><p>${fdate(o.at)} · ${o.items.map(i => i.qty + "× " + esc(i.name)).join(", ")}</p><div class="steps">${OSTEPS.map(s => `<span class="${OSTEPS.indexOf(o.status) >= OSTEPS.indexOf(s) ? "on" : ""}">${{ pending: "En attente", paid: "Payée", shipped: "Expédiée", delivered: "Livrée" }[s]}</span>`).join("")}</div><button class="btn ghost sm" data-act="invoice" data-arg="${o.id}">Facture</button></div>`).join("") || "<p>Aucune commande. <a href='#/store' style='color:var(--red)'>Voir la boutique</a></p>";
  return `<section class="s"><div class="wrap"><div class="eyebrow">Sur cet appareil</div><h2>Mes achats</h2><div class="tabs">${tabs.map(([k, l]) => `<a href="#/account/${k}" class="${tab === k ? "on" : ""}">${l}</a>`).join("")}</div>${b}</div></section>`;
};

ROUTES.notfound = () => `<section class="s"><div class="wrap"><h2>Page introuvable</h2><a class="btn" href="#/home">Retour à l'accueil</a></div></section>`;
