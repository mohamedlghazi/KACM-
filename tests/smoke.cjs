/* Run: node tests/smoke.cjs. No dependencies or browser state required. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const element = {innerHTML:'',hidden:true,appendChild(){},focus(){},classList:{toggle(){}}};
const context = vm.createContext({console,setTimeout(){},clearInterval(){},setInterval(){},URL,URLSearchParams,
  MutationObserver:class{observe(){}},
  document:{body:{},addEventListener(){},querySelector:()=>element,querySelectorAll:()=>[],createElement:()=>({remove(){}})},
  window:{addEventListener(){},scrollTo(){}},location:{hash:''},localStorage:{getItem:()=>null,setItem(){}},navigator:{}});
for(const name of ['verified-data','data','demo-content','core','shared','home','matches','team','history','tickets','store','stadium','account','fans','media'])
  vm.runInContext(fs.readFileSync(path.join(root,'js',name+'.js'),'utf8'),context,{filename:name+'.js'});
const run = code => vm.runInContext(code,context);
run('load(); ensureGuest(); toast=()=>{}; rerender=()=>{}; chrome=()=>{};');
let passed=0;
function test(name,code){assert.equal(run(code),true,name);console.log('PASS',name);passed++;}
test('Initial snapshot contains verified sports records',`(()=>{const seed=buildSeed();return seed.players.length===35 && seed.matches.filter(m=>m.status==='finished').length===7 && seed.standings.length===16 && seed.players.every(p=>p.source && !p.name.includes('Démo'))})()`);
test('Unverified commercial products and statistics are absent',`(()=>{const seed=buildSeed();return seed.products.length===0 && seed.sponsors.length===0 && seed.players.every(p=>p.goals==='—')})()`);
test('Unconfirmed fixture does not produce a countdown',`!ROUTES.home().includes('data-cd=') && nextMatch().date===null`);
test('Published standings points are preserved',`table().find(row=>row.n==='Widad Temara').pts===6`);
const portraits=run('buildSeed().players.filter(p=>p.photo).map(p=>p.photo)');
assert.equal(portraits.length,33);assert.ok(portraits.every(file=>fs.existsSync(path.join(root,file))));
console.log('PASS All 33 verified portrait assets exist');passed++;
test('Migration preserves user profiles and archives prior seed content',`(()=>{const state=buildSeed();state.verifiedRevision=0;state.users=[{id:1,name:'Local User',prefs:{}}];state.players=[{id:1,name:'Previous seed'}];applyVerifiedSnapshot(state);return state.users[0].name==='Local User' && state.previousDemoSnapshot.players[0].name==='Previous seed' && state.players.length===35})()`);
test('Nine modules and detail pages render',`[['home',[],{}],['matches',[],{}],['matches',[],{tab:'res'}],['matches',[],{tab:'live'}],['matches',[],{tab:'table'}],['match',[1],{}],['match',[4],{}],['team',[],{}],['player',[88794],{}],['history',[],{}],['tickets',[],{}],['store',[],{}],['product',[99999],{}],['cart',[],{}],['checkout',[],{}],['account',['tickets'],{}],['account',['orders'],{}],['account',['wishlist'],{}],['fans',[],{}],['stadium',[],{}],['news',[],{}],['news',[1],{}],['news',[],{mode:'photos'}],['news',[],{mode:'videos'}]].every(([name,args,q])=>typeof ROUTES[name](args,q)==='string')`);
test('Draft article stays private',`ROUTES.news([7],{}).includes('Page introuvable')`);
test('Ticket checkout is external only',`typeof A.tkpaid==='undefined' && ROUTES.tickets().includes(TICKETING_URL) && !ROUTES.tickets().includes('data-act="tkbuy"')`);
test('Article search empty state',`ROUTES.news([],{search:'no-such-article-abcdef'}).includes('Aucun article')`);
run(`Object.assign(user(),{name:'Supporter Test',email:'test@example.com'});`);
test('One vote per profile and match',`(()=>{const key='match-'+lastMatch().id;const pid=S.players[0].id;F.fanVote({key,pid});F.fanVote({key,pid:S.players[1].id});return S.votes[key][S.ui.uid]===pid})()`);
test('Duplicate membership prevented',`(()=>{S.settings.plans=[{code:'basic',name:'Test Basic',price:0},{code:'plus',name:'Test Plus',price:100}];A.membership('basic');A.membership('plus');return mine(S.memberships).length===1 && mine(S.memberships)[0].status==='pending'})()`);
test('Completed matches reject predictions',`(()=>{F.fanPrediction({mid:1,us:2,them:0});return S.predictions.length===0})()`);
test('Prediction can be edited without duplicates',`(()=>{const mid=nextMatch().id;F.fanPrediction({mid,us:2,them:0});F.fanPrediction({mid,us:3,them:1});return S.predictions.length===1 && S.predictions[0].us===3})()`);
test('Cart stock aggregated across variants',`(()=>{S.cart=[];S.products=[{id:1,name:'Test fixture',price:100,active:true,stock:3}];const p=S.products[0];p.stock=3;F.addcart({pid:p.id,qty:'2',size:'S',color:'Rouge'});F.addcart({pid:p.id,qty:'2',size:'M',color:'Rouge'});return S.cart.reduce((n,c)=>n+c.qty,0)===2})()`);
test('Insufficient stock cannot cause partial sale',`(()=>{const p=S.products[0];p.stock=3;S.cart=[{pid:p.id,qty:2,size:'S',color:'Rouge'},{pid:p.id,qty:2,size:'M',color:'Rouge'}];const count=S.orders.length;F.checkout({pay:'card'});return p.stock===3 && S.orders.length===count && S.cart.length===2})()`);
test('Checkout records owned order and decrements stock',`(()=>{const p=S.products[0];S.cart=[{pid:p.id,qty:2,size:'S',color:'Rouge'}];F.checkout({pay:'card',name:'Supporter Test',phone:'0600000000',addr:'Adresse démo',city:'Marrakech'});return p.stock===1 && S.cart.length===0 && S.orders.at(-1).uid===S.ui.uid && S.orders.at(-1).paid})()`);
test('User HTML is escaped',`esc('<script>alert(1)</script>').includes('&lt;script&gt;')`);
test('Away result follows home team score order',`(()=>{const m=S.matches.find(m=>!m.home&&m.status==='finished');m.hs=2;m.as=4;return ROUTES.match([m.id],{}).includes('<strong>4<i>–</i>2</strong>')})()`);
test('Venue-specific map does not reuse club coordinates',`(()=>{const m=S.matches[0];m.venue='Stade visiteur';return ROUTES.match([m.id],{}).includes('Coordonnées de cette rencontre à confirmer.')})()`);
console.log('\n'+passed+' checks passed.');
