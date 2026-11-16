/** One-time migration: replace synthetic seed content without losing local user work.
 * Old sports/cart data are archived in previousDemoSnapshot for reversible recovery.
 */
function applyVerifiedSnapshot(state) {
  if (state.verifiedRevision >= VERIFIED_DATA.revision) return;
  if (state.players?.length && !state.previousDemoSnapshot) {
    state.previousDemoSnapshot = {players:state.players,matches:state.matches,standings:state.standings,news:state.news,products:state.products,sponsors:state.sponsors,cart:state.cart,wishlist:state.wishlist,votes:state.votes,predictions:state.predictions};
  }
  const copy = value => JSON.parse(JSON.stringify(value));
  ['players','matches','standings','news','staff'].forEach(key => state[key] = copy(VERIFIED_DATA[key]));
  state.teams = copy(VERIFIED_DATA.teams);
  state.products=[]; state.sponsors=[]; state.cart=[]; state.wishlist=[]; state.votes={}; state.predictions=[];
  state.orders=(state.orders||[]).filter(order=>order.uid!==0);
  state.settings.coach='Youssef Safri';state.settings.fanOfMonth='';state.settings.plans=[];state.settings.coupons={};
  state.settings.clubEmail='clubkacmfoot@gmail.com';state.settings.clubAddress='Rue Moulay El Hassan, Stade El Arbi Ben Mbarek, BP 891, Guéliz — Marrakech';
  state.settings.stadium={name:'Stade El Harti',address:'Guéliz, Marrakech — lieu du match KACM–Wydad du 7 novembre 2026',lat:'',lng:'',capacity:'Non confirmée',gates:'À communiquer par l’organisateur',vip:'À communiquer par l’organisateur',parking:'À confirmer',access:'À confirmer auprès de l’organisateur',doors:'Selon les consignes de chaque rencontre',rules:'Consulter les consignes de la billetterie et de l’organisateur.'};
  state.videos=[{id:1,title:'KACM TV — la chaîne du club',url:'https://www.youtube.com/@kacmtv7253'}];
  (state.users||[]).forEach(u=>{if(u.prefs)u.prefs.favorite=null;});
  state.verifiedRevision=VERIFIED_DATA.revision;state.verifiedAt=VERIFIED_DATA.verifiedAt;
}
// Kept as the previous initialization hook to preserve script order.
function enhanceDemoData(state) {
  const previousRevision=state.verifiedRevision;
  applyVerifiedSnapshot(state);
  if(previousRevision!==state.verifiedRevision) {
    try { localStorage.setItem(KEY,JSON.stringify(state)); }
    catch { /* The current snapshot still renders if local storage is unavailable. */ }
  }
}
