/** Initial state. Sports content comes from verified-data.js; interactions remain local. */
function buildSeed() {
  const state = {
    version:5, ui:{lang:'fr',uid:null,role:null},
    settings:{heroTitle:'Kawkab Marrakech.',heroText:'Le club de la Ville Rouge, depuis 1947.',
      heroImage:'assets/hero2.jpg',teamImage:'assets/team.webp',logo:'assets/logo.png',coach:'Youssef Safri',
      whatsapp:'',cod:false,fanOfMonth:'',plans:[],coupons:{},
      clubEmail:'clubkacmfoot@gmail.com',clubAddress:'Rue Moulay El Hassan, Stade El Arbi Ben Mbarek, BP 891, Guéliz — Marrakech',
      social:{facebook:'https://www.facebook.com/KACMOfficiiel/',instagram:'https://www.instagram.com/kacmofficiel/',youtube:'https://www.youtube.com/@kacmtv7253'},
      tiles:{team:'assets/team.webp',history:'',palmares:'',shop:'',tickets:'assets/hero2.jpg',fans:'assets/hero2.jpg',academy:'assets/team.webp',media:'assets/team.webp'},
      stadium:{name:'Stade El Harti',address:'Guéliz, Marrakech — lieu du match KACM–Wydad du 7 novembre 2026',lat:'',lng:'',capacity:'Non confirmée',gates:'À communiquer par l’organisateur',vip:'À communiquer par l’organisateur',parking:'À confirmer',access:'À confirmer auprès de l’organisateur',doors:'Selon les consignes de chaque rencontre',rules:'Consulter les consignes de la billetterie et de l’organisateur.'}},
    players:[],staff:[],matches:[],standings:[],news:[],products:[],sponsors:[],
    videos:[{id:1,title:'KACM TV — la chaîne du club',url:'https://www.youtube.com/@kacmtv7253'}],
    timeline:[
      {y:1947,t:'Fondation du club',d:'Le Kawkab Athletic Club voit le jour à Marrakech.',type:'founding'},
      {y:1958,t:'Premier championnat du Maroc',d:'Premier titre national du Kawkab.',type:'league'},
      ...[1963,1964,1965,1987,1991,1993].map(y=>({y,t:'Coupe du Trône',d:'Le Kawkab remporte la Coupe du Trône.',type:'throne'})),
      {y:1992,t:'Deuxième championnat du Maroc',d:'Le club retrouve le sommet du championnat national.',type:'league'},
      {y:1996,t:'Coupe de la CAF',d:'Le Kawkab remporte la Coupe de la CAF.',type:'caf'}],
    notifications:[],users:[],ticketOrders:[],tickets:[],scans:[],memberships:[],registrations:[],contacts:[],newsletter:[],votes:{},predictions:[],fanPhotos:[],audit:[],cart:[],wishlist:[],orders:[],
    academy:{cats:[],schedule:'Programme à communiquer par le club'},analytics:{visits:[]},
    faq:[['Où acheter mon billet ?','La réservation, le paiement, la confirmation et les billets sont gérés sur kacm.ticketing.ma.'],['Où retrouver mes réservations ?','Connectez-vous à votre compte sur la plateforme de billetterie.'],['Les données sportives sont-elles en direct ?','Non. Ce site affiche un relevé sourcé, consulté le 16 novembre 2026.'],['Comment contacter le club ?','Le site du club indique clubkacmfoot@gmail.com.']]
  };
  applyVerifiedSnapshot(state);
  return state;
}
