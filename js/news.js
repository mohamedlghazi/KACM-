/* KACM — page Actualités : liste filtrable + fiche article (news.html#a=ID) */
(function () {
  "use strict";
  const { $, esc, t, fdate } = KACM;
  const CATS = [["all", "nt.all", null], ["report", "nt.report", "Match Reports"], ["club", "nt.club", "Vie du club"], ["train", "nt.train", "Entraînement"], ["ann", "nt.ann", "Annonces officielles"]];
  let cat = "all";
  const byId = id => KACM_NEWS.find(n => n.id === id);
  const link = n => `news.html#a=${encodeURIComponent(n.id)}`;
  const pos = n => `style="--pos:${esc(n.pos || "center")};--fit:${n.fit || "cover"};--bgc:${n.bgc || "#161112"}"`;
  const card = n => `<a class="post" href="${link(n)}"><div class="post-img" ${pos(n)}><img src="${esc(n.img)}" alt="" loading="lazy"></div>
    <div class="post-body"><div class="post-meta"><span>${esc(n.cat)}</span><time datetime="${esc(n.date)}">${fdate(n.date)}</time></div><h3>${esc(n.title)}</h3><p>${esc(n.excerpt)}</p></div><span class="go" aria-hidden="true">↗</span></a>`;

  const ecard = n => `<a class="post ed-card" href="${link(n)}"><div class="post-img" ${pos(n)}><img src="${esc(n.img)}" alt="" loading="lazy"></div>
    <div class="post-body"><div class="post-meta"><span>${esc(n.cat)}</span><time datetime="${esc(n.date)}">${fdate(n.date)}</time></div><h3>${esc(n.title)}</h3><p>${esc(n.excerpt)}</p><span class="ed-more">${t("nw.read")}</span></div></a>`;

  function renderList() {
    $("#ntabs").innerHTML = CATS.map(([k, key]) => `<button type="button" role="tab" aria-selected="${k === cat}" data-cat="${k}">${t(key)}</button>`).join("");
    const cur = CATS.find(c => c[0] === cat), f = cur[2];
    const l = KACM_NEWS.filter(n => !f || n.cat === f);
    $("#edTitle").textContent = f ? t(cur[1]) : t("nw.all");
    $("#newsEmpty").hidden = l.length > 0;
    $("#newsList").innerHTML = l.map(ecard).join("");
  }

  function renderArticle(n) {
    const rel = (n.related || []).map(byId).filter(x => x && x.id !== n.id).slice(0, 3);
    const url = encodeURIComponent(location.href), ttl = encodeURIComponent(n.title);
    $("#articleView").innerHTML = `<section class="art-hero" style="--pos:${esc(n.pos || "center")}"><div class="art-hero-bg"><img src="${esc(n.img)}" alt=""></div><div class="wrap art-hero-in">
      <p class="art-hero-meta">${esc(n.cat)} · <time datetime="${esc(n.date)}">${fdate(n.date)}</time></p>
      <h1>${esc(n.title)}</h1>
      <p class="lead">${esc(n.excerpt)}</p></div></section>
    <section class="sec sec-beige art"><div class="wrap art-wrap">
      <a class="back" href="news.html">${t("nw.back")}</a>
      <div class="art-body">${n.body.map(p => `<p>${esc(p)}</p>`).join("")}</div>
      ${n.gallery ? `<h3 class="sub-h2">${t("nw.gal")}</h3><div class="gal-s" style="--r:${n.ratio || "1/1"}"><button type="button" class="gal-b prev" data-gal="-1" aria-label="‹">‹</button><ul class="gal-t">${n.gallery.filter(g => g !== n.img).map(g => `<li><img src="${esc(g)}" alt="" loading="lazy"></li>`).join("")}</ul><button type="button" class="gal-b next" data-gal="1" aria-label="›">›</button></div>` : ""}
      <div class="share"><b>${t("nw.share")}</b>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${url}" target="_blank" rel="noopener">Facebook</a>
        <a href="https://twitter.com/intent/tweet?url=${url}&text=${ttl}" target="_blank" rel="noopener">X</a>
        <a href="https://wa.me/?text=${ttl}%20${url}" target="_blank" rel="noopener">WhatsApp</a>
        <button type="button" data-copy>${t("nw.copyb")}</button></div>
      <a class="btn btn-dark back-btn" href="news.html">${t("nw.back")}</a>
    </div>
    ${rel.length ? `<div class="wrap"><h3 class="sub-h2">${t("nw.rel")}</h3><div class="news">${rel.map(card).join("")}</div></div>` : ""}</section>`;
  }

  function route() {
    const m = location.hash.match(/^#a=(.+)$/), n = m && byId(decodeURIComponent(m[1]));
    $("#listView").hidden = !!n; $("#articleView").hidden = !n;
    if (n) { renderArticle(n); document.title = n.title + " — KACM"; window.scrollTo(0, 0); }
    else { renderList(); document.title = "Actualités — KACM"; }
  }

  document.addEventListener("click", e => {
    const b = e.target.closest("[data-cat]");
    if (b) { cat = b.dataset.cat; renderList(); return; }
    const gb = e.target.closest("[data-gal]");
    if (gb) { const t0 = gb.parentElement.querySelector(".gal-t"); t0.scrollBy({ left: +gb.dataset.gal * t0.clientWidth * 0.9, behavior: "smooth" }); return; }
    if (e.target.closest("[data-copy]")) {
      const done = () => KACM.toast(t("nw.copied"));
      (navigator.clipboard ? navigator.clipboard.writeText(location.href) : Promise.reject()).then(done, done);
    }
  });
  window.addEventListener("hashchange", route);
  KACM.onLang(route);
  KACM.applyLang();
})();
