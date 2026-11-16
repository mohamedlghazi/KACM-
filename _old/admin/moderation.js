/** Module 07 admin extension. Permissions reuse admin.js; this is a UI demo only. */
const supporterAdminPage = ADM.supporters;
ADM.supporters = () => supporterAdminPage() + `<div class="panel"><h3>Photos des supporters</h3><p>Les propositions restent privées dans la démo jusqu'à validation.</p>${S.fanPhotos.map(p => `<div style="padding:18px 0;border-bottom:1px solid #ddd"><img src="${esc(p.url)}" alt="${esc(p.caption)}" style="width:150px;height:100px;object-fit:cover"><p>${esc(p.caption)}</p><label>Modération<select data-chg="fanPhotoStatus" data-id="${p.id}">${STAT(["pending", "approved", "rejected"], p.status)}</select></label></div>`).join("") || '<p>Aucune photo proposée.</p>'}</div>`;
A.fanPhotoStatus = (value, el) => {
  if (!need("supporters") || !["pending", "approved", "rejected"].includes(value)) return;
  const p = byId(S.fanPhotos, el.dataset.id); if (!p) return;
  p.status = value; audit(`photo supporter #${p.id} → ${value}`); save(); toast("Modération enregistrée");
};
// Editorial filters use explicit season and team fields, editable with the article.
CR.news.fields.push(["season", "Saison (ex. 2026/27)", "text"], ["team", "Équipe", "select", {o:["Équipe première", "Académie"]}]);
CR.players.fields.push(["contract", "Contrat publiable (texte approuvé)", "textarea"], ["showContract", "Autoriser la publication du contrat", "check"]);

// External provider owns actual sales and entry validation.
ADM.tickets = () => `<div class="panel"><h3>Billetterie externe</h3><p>Les ventes, prix, stocks, paiements et billets réels sont gérés sur KACM Ticketing. Les catégories affichées sur le site sont des exemples du catalogue.</p>${ticketLink("Ouvrir la plateforme")}</div>`;
ADM.scan = () => `<div class="panel"><h3>Contrôle des billets</h3><p>La validation des billets et le contrôle des accès relèvent du système du fournisseur de billetterie.</p>${ticketLink("Ouvrir KACM Ticketing")}</div>`;

CR.matches.fields.push(["dateConfirmed", "Date confirmée par l’organisateur", "check"], ["timeConfirmed", "Horaire confirmé par l’organisateur", "check"], ["source", "URL de la source", "url"]);
CR.news.fields.push(["source", "Article source (URL)", "url"], ["sourceName", "Nom de la publication", "text"]);
const newsCategoryField=CR.news.fields.find(f=>f[0]==="cat");
newsCategoryField[3].o.push("Vie du club", "Conférences de presse");
