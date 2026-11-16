/* Pages publiques — modules 01 à 12 */
const pubNews = () => S.news.filter(n => n.status === "published" || (n.status === "scheduled" && new Date(n.date) <= new Date())).sort((a, b) => new Date(b.date) - new Date(a.date));
const stars = n => `<span class="stars" aria-label="${Math.round(n)} sur 5">${[1, 2, 3, 4, 5].map(i => ico("star", i <= Math.round(n) ? "f" : "")).join("")}</span>`;
const head = (eb, title, link) => `<div class="head"><div><div class="eyebrow">${esc(eb)}</div><h2>${accent(title)}</h2></div>${link ? `<a class="btn ghost sm" href="${link}">${t("more")} →</a>` : ""}</div>`;
const newsCard = n => `<a class="card" href="#/news/${n.id}">${img(n.img, "img", n.cat)}<div class="b"><small>${esc(n.cat)} · ${fdate(n.date, { day: "numeric", month: "short", year: "numeric" })}</small><h3>${esc(n.title)}</h3><p>${esc(n.excerpt)}</p></div></a>`;
const resCard = m => `<a class="res" href="#/match/${m.id}"><span>${m.home ? "KACM" : esc(m.opp)}</span><span class="sc">${score(m)}</span><span>${m.home ? esc(m.opp) : "KACM"}</span></a>`;
const fixCard = m => `<div class="fix"><div><b>${fdate(m.date, { day: "numeric", month: "short" })}</b><br><small>${ftime(m.date)}</small></div><div><a href="#/match/${m.id}"><b>${matchTitle(m)}</b></a><br><small>${esc(m.comp)} · ${m.home ? "Domicile" : "Extérieur"} · ${esc(m.venue)}</small></div><div class="row"><button class="btn ghost sm" data-act="dl" data-arg="${m.id}">${ico("cal")} Agenda</button>${m.onSale ? `<a class="btn sm" href="#/tickets?m=${m.id}">Billets</a>` : ""}</div></div>`;
const productCard = p => `<a class="card" href="#/product/${p.id}">${img(p.img, "img", p.name)}<div class="b"><small>${esc(p.cat)}</small><h3>${esc(p.name)}</h3><div class="price">${money(p.price)}</div></div></a>`;
const playerCard = p => `<a class="card" href="#/player/${p.id}">${avatar(p)}<div class="b"><small>${p.pos}${p.captain ? " · Capitaine" : ""}</small><h3>${esc(p.name)}</h3></div></a>`;
const POSL = { GK: "Gardiens", DEF: "Défenseurs", MID: "Milieux", ATT: "Attaquants" };

