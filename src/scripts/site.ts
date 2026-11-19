export {};
const menu = document.querySelector<HTMLButtonElement>('.menu-toggle');
const nav = document.querySelector<HTMLElement>('#main-nav');
const header = document.querySelector<HTMLElement>('.site-header');
header?.classList.add('menu-ready');
function closeMenu(restore=false){nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');if(restore)menu?.focus();}
menu?.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(expanded));nav?.classList.toggle('open',expanded);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true')closeMenu(true);});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu()));
document.addEventListener('click',e=>{if(!header?.contains(e.target as Node))closeMenu();});
matchMedia('(min-width:1152px)').addEventListener('change',()=>closeMenu());

const hero=document.querySelector<HTMLVideoElement>('#hero-video');
const toggle=document.querySelector<HTMLButtonElement>('#video-toggle');
type Connection = EventTarget & {saveData?:boolean;effectiveType?:string};
const connection=(navigator as Navigator & {connection?:Connection}).connection;
const motion=matchMedia('(prefers-reduced-motion: reduce)');
let userPaused=false,explicitPlay=false,inView=true,filmPlaying=false,failed=false,playPending=false;
const restricted=()=>motion.matches||connection?.saveData||['slow-2g','2g'].includes(connection?.effectiveType||'');
const updateVideoButton=()=>{if(!toggle||!hero)return;const playing=!hero.paused&&!hero.ended;toggle.innerHTML=`<span aria-hidden="true">${playing?'Ⅱ':'▷'}</span> ${playing?'Pause video':failed?'Retry video':'Play video'}`;toggle.setAttribute('aria-label',playing?'Pause background video':failed?'Retry background video':'Play background video');toggle.setAttribute('aria-pressed',String(playing));};
async function playHero(manual=false){
 if(!hero||playPending)return;
 if(!manual&&(failed||userPaused||restricted()&&!explicitPlay||!inView||document.hidden||filmPlaying))return;
 if(manual){userPaused=false;explicitPlay=true;failed=false;}
 if(!hero.getAttribute('src')){hero.src=(innerWidth<761?hero.dataset.mobile:hero.dataset.desktop)||'';hero.load();}
 playPending=true;hero.muted=true;
 try{await hero.play();if(userPaused||!inView||document.hidden||filmPlaying)hero.pause();}catch{failed=true;hero.autoplay=false;hero.pause();updateVideoButton();}finally{playPending=false;}
}
if(hero&&toggle){
 toggle.addEventListener('click',()=>{if(!hero.paused){userPaused=true;explicitPlay=false;hero.pause();}else{if(failed){hero.removeAttribute('src');hero.load();}void playHero(true);}});
 hero.addEventListener('play',updateVideoButton);hero.addEventListener('pause',updateVideoButton);hero.addEventListener('error',()=>{failed=true;hero.pause();updateVideoButton();});
 const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(!inView)hero.pause();else void playHero();},{threshold:.12});observer.observe(hero);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)hero.pause();else void playHero();});
 const preferenceChanged=()=>{explicitPlay=false;if(restricted())hero.pause();else void playHero();};
 motion.addEventListener('change',preferenceChanged);connection?.addEventListener('change',preferenceChanged);
 window.addEventListener('pagehide',()=>{observer.disconnect();hero.pause();motion.removeEventListener('change',preferenceChanged);connection?.removeEventListener('change',preferenceChanged);},{once:true});
 void playHero();
}
const film=document.querySelector<HTMLVideoElement>('#full-film');
const filmButton=document.querySelector<HTMLButtonElement>('#film-play');
filmButton?.addEventListener('click',async()=>{if(!film)return;filmPlaying=true;hero?.pause();if(!film.src)film.src=film.dataset.source||'';try{await film.play();filmButton.hidden=true;}catch{filmButton.textContent='Unable to play — retry';}});
film?.addEventListener('play',()=>{filmPlaying=true;hero?.pause();if(filmButton)filmButton.hidden=true;});
film?.addEventListener('pause',()=>{filmPlaying=false;});
film?.addEventListener('ended',()=>{filmPlaying=false;});
film?.addEventListener('error',()=>{filmPlaying=false;if(filmButton){filmButton.hidden=false;filmButton.textContent='Unable to play — retry';}});

const floating=document.querySelector('#floating-join');
let ctaVisible=false,footerVisible=false,joinVisible=false;
const updateFloating=()=>floating?.classList.toggle('visible',!ctaVisible&&!footerVisible&&!joinVisible);
const cta=document.querySelector('#hero-join')||document.querySelector('.page-intro');
if(cta){const ob=new IntersectionObserver(entries=>{ctaVisible=entries[0].isIntersecting;updateFloating();});ob.observe(cta);}
const footer=document.querySelector('.site-footer');if(footer)new IntersectionObserver(e=>{footerVisible=e[0].isIntersecting;updateFloating();}).observe(footer);
const join=document.querySelector('.join-section');if(join)new IntersectionObserver(e=>{joinVisible=e[0].isIntersecting;updateFloating();}).observe(join);

const filters=document.querySelector<HTMLElement>('.gallery-filters');
const items=[...document.querySelectorAll<HTMLElement>('.gallery-item')];
const count=document.querySelector('#gallery-count');
function filterGallery(tag:string){
 items.forEach(el=>el.hidden=tag!=='All'&&el.dataset.tag!==tag);
 document.querySelectorAll<HTMLButtonElement>('.filter').forEach(b=>{const selected=b.dataset.filter===tag;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});
 const n=items.filter(el=>!el.hidden).length;if(count)count.textContent=`${n} photograph${n===1?'':'s'}`;
 const empty=document.querySelector<HTMLElement>('#gallery-empty');if(empty)empty.hidden=n>0;
}
if(filters){filters.hidden=false;filters.querySelectorAll<HTMLButtonElement>('button').forEach(b=>b.addEventListener('click',()=>{filterGallery(b.dataset.filter||'All');const u=new URL(location.href);if(b.dataset.filter==='All')u.searchParams.delete('filter');else u.searchParams.set('filter',b.dataset.filter||'All');history.replaceState(null,'',u);}));const selected=new URLSearchParams(location.search).get('filter');if(['Daylight','After dark','Details'].includes(selected||''))filterGallery(selected!);}
const dialog=document.querySelector<HTMLDialogElement>('#lightbox');
const lbImage=document.querySelector<HTMLImageElement>('#lightbox-image');
let current=0,opener:HTMLElement|null=null;
const visibleLinks=()=>items.filter(el=>!el.hidden).map(el=>el.querySelector<HTMLAnchorElement>('a')!);
function showImage(index:number){const links=visibleLinks();current=(index+links.length)%links.length;const a=links[current];if(!a||!lbImage)return;lbImage.src=a.href;lbImage.alt=a.dataset.alt||'';document.querySelector('#lightbox-title')!.textContent=a.dataset.title||'';document.querySelector('#lightbox-position')!.textContent=`${current+1} / ${links.length}`;}
items.forEach(el=>el.querySelector('a')?.addEventListener('click',e=>{if(!dialog?.showModal)return;e.preventDefault();opener=e.currentTarget as HTMLElement;showImage(visibleLinks().indexOf(opener as HTMLAnchorElement));dialog.showModal();document.body.classList.add('modal-open');document.querySelector<HTMLButtonElement>('#lightbox-close')?.focus();}));
document.querySelector('#lightbox-close')?.addEventListener('click',()=>dialog?.close());
document.querySelector('#lightbox-prev')?.addEventListener('click',()=>showImage(current-1));document.querySelector('#lightbox-next')?.addEventListener('click',()=>showImage(current+1));
dialog?.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(lbImage){lbImage.removeAttribute('src');lbImage.alt='';}opener?.focus();});
dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog?.addEventListener('keydown',e=>{if(e.key==='ArrowRight')showImage(current+1);if(e.key==='ArrowLeft')showImage(current-1);});
