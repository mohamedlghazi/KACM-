/** Module 07 — Supporter profile, membership and fan participation.
 * Demo identity is device-local: no passwords, authentication or remote requests.
 * Persisted collections reuse the dashboard schema in data.js.
 */
function requireProfile() {
  if (user()?.name && user()?.email) return true;
  loginModal();
  return false;
}

function loginModal(message = "Créez votre profil supporter de démonstration.") {
  const u = user() || {};
  openModal(`<h3>Mon profil supporter</h3><p>${esc(message)}</p>
    <form class="form" data-form="profile"><label>Nom complet<input name="name" required minlength="2" maxlength="80" value="${esc(u.name)}"></label>
    <label>E-mail de démonstration<input name="email" type="email" required value="${esc(u.email)}" placeholder="supporter@example.com"></label>
    <p class="note">Profil enregistré sur cet appareil. Aucune connexion réelle ni aucun e-mail envoyé.</p>
    <button class="btn">Enregistrer mon profil</button></form>`);
}

F.profile = d => {
  ensureGuest();
  Object.assign(user(), { name: d.name.trim(), email: d.email.trim() });
  save(); closeModal(); rerender(); toast("Profil enregistré sur cet appareil");
};
A.editProfile = () => loginModal();

ROUTES.fans = () => {
  const u = user(), membership = mine(S.memberships).find(m => ["active", "pending"].includes(m.status));
  const active = S.players.filter(p => p.status === "active");
  const m = lastMatch(), upcoming = nextMatch();
  const voteKey = m ? `match-${m.id}` : "match-demo";
  const votes = S.votes[voteKey] || {}, selected = votes[S.ui.uid];
  const prediction = upcoming && S.predictions.find(p => p.uid === S.ui.uid && p.mid === upcoming.id);
  const poll = S.votes["fan-poll"] || {};
  const options = ["Coulisses des entraînements", "Interviews des joueurs", "Archives du club"];
  const gallery = S.fanPhotos.filter(p => p.status === "approved" || p.uid === S.ui.uid);
  return `<section class="s community"><div class="wrap">
    <div class="head"><div><p class="eyebrow">La ville rouge, une seule famille</p><h2>Espace supporters</h2></div>
    <a class="btn ghost sm" href="#/account/tickets">Mes billets & commandes</a></div>
    <div class="note">Fan Zone de démonstration · profils, votes et demandes enregistrés uniquement dans ce navigateur.</div>
    <div class="two"><div class="member-pass"><img src="${esc(S.settings.logo)}" alt="KACM"><small>KACM · CARTE SUPPORTER DÉMO</small>
    <h3>${esc(u?.name || "Votre nom, vos couleurs.")}</h3><p>${membership ? esc(membership.plan) + " · " + esc(membership.status) : "Rejoignez la famille du Kawkab"}</p>
    <strong>KACM-${String(u?.id || 0).padStart(6, "0")}</strong><p>Carte de présentation · aucun droit d'accès au stade</p>
    <button class="btn ghost sm" data-act="editProfile">${u?.name ? "Modifier mon profil" : "Créer mon profil"}</button></div>
    <form class="panel form" data-form="fanPrefs"><h3>Mon Kawkab</h3><label>Mon joueur préféré<select name="favorite"><option value="">Choisir un joueur</option>${active.map(p => `<option value="${p.id}" ${+u?.prefs?.favorite === p.id ? "selected" : ""}>${esc(p.name)}</option>`).join("")}</select></label>
    <label>Mes centres d'intérêt<select name="interest">${["Équipe première", "Académie", "Histoire du club", "Boutique"].map(v => `<option ${u?.prefs?.interest === v ? "selected" : ""}>${v}</option>`).join("")}</select></label>
    <label class="check"><input type="checkbox" name="follow" ${u?.prefs?.follow ? "checked" : ""}> Suivre le club dans mon espace</label><button class="btn sm">Enregistrer mes préférences</button></form></div>
    <div class="head module-heading"><div><p class="eyebrow">Adhésions supporters</p><h2>Choisissez votre tribune</h2></div></div>
    <div class="grid g3">${!S.settings.plans.length ? `<div class="panel"><p>Les offres et conditions d’adhésion seront communiquées après validation du club.</p></div>` : ""}${S.settings.plans.map(plan => `<article class="panel plan"><small>${esc(plan.code.toUpperCase())}</small><h3>${esc(plan.name)}</h3><div class="price">${money(plan.price)}<small> / saison</small></div><ul>${plan.perks.map(p => `<li>${esc(p)}</li>`).join("")}</ul><button class="btn block" data-act="membership" data-arg="${esc(plan.code)}" ${membership ? "disabled" : ""}>${membership ? "Demande déjà enregistrée" : "Demander ma carte"}</button></article>`).join("")}</div>
    <div class="two module-heading"><div class="panel"><p class="eyebrow">Homme du match</p><h3>${m ? matchTitle(m) : "À vous de jouer"}</h3><p>Un vote par profil pour cette rencontre.</p>
    <form class="form" data-form="fanVote"><input type="hidden" name="key" value="${voteKey}"><label>Votre joueur<select name="pid">${active.map(p => `<option value="${p.id}" ${+selected === p.id ? "selected" : ""}>${esc(p.name)}</option>`).join("")}</select></label><button class="btn sm" ${selected ? "disabled" : ""}>${selected ? "Vote enregistré" : "Voter"}</button></form>
    <p class="mut">${Object.keys(votes).length} vote(s) sur cet appareil</p></div>
    <div class="panel"><p class="eyebrow">Le sondage des supporters</p><h3>Que voulez-vous voir sur KACM TV ?</h3><form class="form" data-form="fanPoll"><label>Votre choix<select name="choice">${options.map((v, i) => `<option value="${i}" ${+poll[S.ui.uid] === i ? "selected" : ""}>${v}</option>`).join("")}</select></label><button class="btn sm" ${poll[S.ui.uid] != null ? "disabled" : ""}>${poll[S.ui.uid] != null ? "Réponse enregistrée" : "Participer"}</button></form></div></div>
    <div class="two"><div class="panel"><p class="eyebrow">Pronostic amical · sans mise ni récompense</p><h3>${upcoming ? matchTitle(upcoming) : "Aucun match à venir"}</h3>${upcoming ? `<form class="form" data-form="fanPrediction"><input type="hidden" name="mid" value="${upcoming.id}"><div class="two-c"><label>Buts KACM<input type="number" min="0" max="20" name="us" required value="${prediction?.us ?? 1}"></label><label>Buts adversaire<input type="number" min="0" max="20" name="them" required value="${prediction?.them ?? 0}"></label></div><button class="btn sm">${prediction ? "Modifier mon pronostic" : "Enregistrer mon pronostic"}</button></form>` : "<p>Revenez après la programmation d'une rencontre.</p>"}</div>
    <div class="panel"><p class="eyebrow">Fan du mois</p><h3>${esc(S.settings.fanOfMonth || "À désigner")}</h3><p>Le club pourra mettre un supporter à l'honneur chaque mois.</p><h3 class="module-heading">Contenu exclusif</h3><p>${membership?.status === "active" ? "Bienvenue dans les coulisses : votre adhésion de démonstration est active." : "Les coulisses et contenus réservés apparaîtront ici après activation de votre adhésion par l'administration."}</p></div></div>
    <div class="head module-heading"><div><p class="eyebrow">Nos couleurs, vos souvenirs</p><h2>La galerie des supporters</h2></div></div>
    <div class="grid g3">${gallery.map(p => `<figure class="card fan-photo">${img(p.url, "img", p.caption)}<figcaption class="b">${esc(p.caption)}<br><small>${p.status === "approved" ? "Publiée" : "En attente de modération"}</small></figcaption></figure>`).join("") || `<div class="panel"><p>La première photo pourrait être la vôtre.</p></div>`}</div>
    <form class="form panel module-heading" data-form="fanPhoto"><h3>Proposer une photo</h3><label>Photo (JPEG, PNG ou WebP · 300 Ko maximum)<input type="file" name="photo" accept="image/jpeg,image/png,image/webp" required></label><label>Légende<input name="caption" maxlength="120" required minlength="3"></label><label class="check"><input type="checkbox" required> J'ai l'autorisation de proposer cette photo.</label><button class="btn sm">Proposer à la modération</button></form>
    <h3 class="module-heading">Mes nouvelles du club</h3>${mine(S.notifications).slice(0, 8).map(n => `<div class="panel"><p>${esc(n.text)}</p><small>${fdate(n.at)}</small></div>`).join("") || '<p class="mut">Vos confirmations apparaîtront ici.</p>'}
    </div></section>`;
};

F.fanPrefs = d => { if (!requireProfile()) return; user().prefs = { favorite: +d.favorite || null, interest: d.interest, follow: !!d.follow }; save(); toast("Préférences enregistrées"); };
A.membership = code => {
  if (!requireProfile()) return;
  const p = S.settings.plans.find(p => p.code === code);
  if (!p || mine(S.memberships).some(m => ["pending", "active"].includes(m.status))) return;
  S.memberships.push({ id: nextId(S.memberships), uid: S.ui.uid, plan: p.name, code, price: p.price, status: "pending", at: new Date().toISOString() });
  notify("Demande d'adhésion enregistrée. Validation depuis le dashboard (démo)."); save(); rerender(); toast("Demande envoyée à l'administration de démonstration");
};
F.fanVote = d => {
  if (!requireProfile() || !S.players.some(p => p.id === +d.pid && p.status === "active")) return;
  const key = lastMatch() ? `match-${lastMatch().id}` : "match-demo";
  if (d.key !== key) return;
  S.votes[key] ||= {};
  if (S.votes[key][S.ui.uid] != null) return toast("Vous avez déjà voté");
  S.votes[key][S.ui.uid] = +d.pid; save(); rerender(); toast("Merci pour votre vote");
};
F.fanPoll = d => {
  if (!requireProfile() || !["0", "1", "2"].includes(d.choice)) return;
  S.votes["fan-poll"] ||= {};
  if (S.votes["fan-poll"][S.ui.uid] != null) return;
  S.votes["fan-poll"][S.ui.uid] = +d.choice; save(); rerender(); toast("Réponse enregistrée");
};
F.fanPrediction = d => {
  if (!requireProfile()) return;
  const m = byId(S.matches, d.mid), us = +d.us, them = +d.them;
  if (!m || m.status !== "scheduled" || (m.date && new Date(m.date) <= new Date())) return toast("Pronostics fermés", "err");
  if (![us, them].every(n => Number.isInteger(n) && n >= 0 && n <= 20)) return;
  const existing = S.predictions.find(p => p.uid === S.ui.uid && p.mid === m.id);
  if (existing) Object.assign(existing, { us, them });
  else S.predictions.push({ id: nextId(S.predictions), uid: S.ui.uid, mid: m.id, us, them });
  save(); rerender(); toast("Pronostic enregistré");
};
F.fanPhoto = async (d, form) => {
  if (!requireProfile()) return;
  const file = form.elements.photo.files[0];
  if (!file || !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 300000) return toast("Choisissez une image JPEG, PNG ou WebP de moins de 300 Ko", "err");
  const url = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); });
  S.fanPhotos.push({ id: nextId(S.fanPhotos), uid: S.ui.uid, url, caption: d.caption.trim(), status: "pending", at: new Date().toISOString() });
  if (save()) { rerender(); toast("Photo proposée, en attente de modération"); }
};

// Extend the existing purchases page with profile and wishlist navigation.
const purchasesPage = ROUTES.account;
ROUTES.account = (parts, query) => {
  if (parts[0] === "profile") return ROUTES.fans();
  if (parts[0] === "wishlist") return `<section class="s"><div class="wrap"><p class="eyebrow">Mon compte</p><h2>Ma wishlist</h2><div class="grid g4">${S.products.filter(p => p.active && S.wishlist.includes(p.id)).map(productCard).join("") || '<p>Aucun favori. <a href="#/store">Découvrir la boutique</a></p>'}</div></div></section>`;
  return purchasesPage(parts, query).replace('<h2>Mes achats</h2>', '<h2>Mes achats</h2><p class="account-shortcuts"><a href="#/fans">Mon profil & adhésion</a> · <a href="#/account/wishlist">Ma wishlist</a></p>');
};
