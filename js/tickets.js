/** Module 05 — Ticket catalogue + external booking provider.
 * No local reservation, payment, ticket issuance or confirmation is fabricated.
 * Match inventory and prices below are demo seed data until a provider API exists.
 */
const TICKETING_URL = "https://kacm.ticketing.ma/";
const ticketLink = (label = "Acheter un billet", className = "btn") =>
  `<a class="${className}" href="${TICKETING_URL}" target="_blank" rel="noopener">${esc(label)} ${ico("external")}</a>`;

ROUTES.tickets = () => {
  const matches = S.matches.filter(m => m.status === "scheduled").sort((a,b) => new Date(a.date)-new Date(b.date));
  return `<section class="s"><div class="wrap"><p class="eyebrow">KACM Ticketing</p><h2>Votre place, vos couleurs.</h2>
  <p class="note">Rencontres issues des sources sportives. Les dates non confirmées sont signalées. Catégories, tarifs et disponibilités : consulter la plateforme de billetterie.</p>
  <div class="steps"><span class="on">1. Découvrir le match</span><span>2. Réserver sur KACM Ticketing ↗</span><span>3. Recevoir la confirmation du fournisseur</span></div>
  ${matches.map(m => `<article class="panel"><div class="head"><div><p class="eyebrow">${esc(m.comp)} · ${m.home ? "Domicile" : "Extérieur"}</p><h3>${matchTitle(m)}</h3><p>${fdate(m.date)} · ${ftime(m.date)} · ${esc(m.venue)}</p></div><a class="btn ghost sm" href="#/match/${m.id}">Détails du match</a></div>
  ${m.onSale ? `<div class="pills">${m.sale.cats.map(c => `<span class="ticket-category">${esc(c.name)}<strong>${money(c.price)}</strong><small>Tarif publié par le club</small></span>`).join("")}</div><p style="margin-top:20px">${ticketLink("Réserver sur la billetterie")}</p>` : `<p class="mut">Catégories, prix et ouverture des ventes à consulter directement sur la plateforme du fournisseur.</p><p style="margin-top:15px">${ticketLink("Consulter les ventes", "btn ghost sm")}</p>`}</article>`).join("") || '<div class="panel"><p>Aucun prochain match renseigné.</p></div>'}
  <div class="two module-heading"><div class="panel"><h3>Historique de mes billets</h3><p>Retrouvez vos réservations et billets depuis votre compte sur la plateforme de billetterie.</p><p style="margin-top:20px">${ticketLink("Retrouver mes réservations")}</p></div>
  <div class="panel"><h3>Confirmation & billet QR</h3><p>Le fournisseur confirme votre réservation et délivre le billet selon ses modalités. Le QR Code est fourni si son système le prend en charge.</p><p class="mut">Le statut de réservation et le QR ne sont pas synchronisés dans ce prototype. Aucun billet n'est émis ici.</p></div></div>
  </div></section>`;
};

function connectTicketButtons() {
  $$('a[href^="#/tickets"]:not([data-ticket-info])').forEach(a => {
    a.href = TICKETING_URL; a.target = "_blank"; a.rel = "noopener";
    a.title = "Ouvrir KACM Ticketing dans un nouvel onglet";
  });
}
const ticketObserver = new MutationObserver(connectTicketButtons);
ticketObserver.observe(document.body, { childList: true, subtree: true });
const tkHtml = () => `<div class="panel"><p>Vos billets sont disponibles auprès du fournisseur de billetterie.</p>${ticketLink("Retrouver mes billets")}</div>`;
