/* ── NAV ── */
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>nav.classList.toggle('solid',scrollY>60),{passive:true});
const burger=document.getElementById('burger'),mobMenu=document.getElementById('mobMenu');
burger.addEventListener('click',()=>{
  burger.classList.toggle('on');mobMenu.classList.toggle('on');
  document.body.style.overflow=mobMenu.classList.contains('on')?'hidden':'';
});
document.querySelectorAll('.ml').forEach(a=>a.addEventListener('click',()=>{
  burger.classList.remove('on');mobMenu.classList.remove('on');document.body.style.overflow='';
}));

/* ── PARTICLE NETWORK ── */
const cnv=document.getElementById('cnv'),ctx=cnv.getContext('2d');
let W,H;
function resize(){W=cnv.width=innerWidth;H=cnv.height=innerHeight}
resize();window.addEventListener('resize',resize,{passive:true});
const mobile=innerWidth<768;
const N=mobile?38:85,DIST=mobile?95:145;
const PCOLS=['232,201,109','201,168,76','158,117,48','245,215,142','200,160,55'];
class Node{
  constructor(){this.reset(true)}
  reset(s){
    this.x=Math.random()*W;this.y=s?Math.random()*H:Math.random()*H;
    this.vx=(Math.random()-.5)*.38;this.vy=(Math.random()-.5)*.38;
    this.r=Math.random()*1.8+.5;
    this.col=PCOLS[Math.floor(Math.random()*PCOLS.length)];
  }
  step(){
    this.x+=this.vx;this.y+=this.vy;
    if(this.x<0||this.x>W)this.vx*=-1;
    if(this.y<0||this.y>H)this.vy*=-1;
  }
}
const nodes=Array.from({length:N},()=>new Node());
let rafId=null,heroPaused=false,tabPaused=false;
function frame(){
  ctx.clearRect(0,0,W,H);
  for(let i=0;i<N;i++){
    nodes[i].step();
    ctx.beginPath();ctx.arc(nodes[i].x,nodes[i].y,nodes[i].r,0,Math.PI*2);
    ctx.fillStyle=`rgba(${nodes[i].col},.65)`;ctx.fill();
    for(let j=i+1;j<N;j++){
      const dx=nodes[i].x-nodes[j].x,dy=nodes[i].y-nodes[j].y;
      const d=Math.hypot(dx,dy);
      if(d<DIST){
        const a=(1-d/DIST)*.16;
        ctx.beginPath();ctx.moveTo(nodes[i].x,nodes[i].y);ctx.lineTo(nodes[j].x,nodes[j].y);
        ctx.strokeStyle=`rgba(201,168,76,${a})`;ctx.lineWidth=.65;ctx.stroke();
      }
    }
  }
  rafId=requestAnimationFrame(frame);
}
function startAnim(){if(!heroPaused&&!tabPaused&&!rafId){rafId=requestAnimationFrame(frame);}}
function stopAnim(){if(rafId){cancelAnimationFrame(rafId);rafId=null;}}
startAnim();
/* Pausa quando aba está em segundo plano */
document.addEventListener('visibilitychange',()=>{
  tabPaused=document.hidden;
  tabPaused?stopAnim():startAnim();
});
/* Pausa quando hero sai da tela */
new IntersectionObserver(e=>{
  heroPaused=!e[0].isIntersecting;
  heroPaused?stopAnim():startAnim();
},{threshold:0}).observe(cnv);

/* ── SCROLL REVEAL ── */
const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting)x.target.classList.add('vis')}),
  {threshold:.08,rootMargin:'0px 0px -32px 0px'});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ── CASES CAROUSEL ── */
const casesTrack=document.getElementById('casesTrack');
const casesDots=document.getElementById('casesDots');
const totalCases=casesTrack.children.length;
let ci=0;
for(let i=0;i<totalCases;i++){
  const d=document.createElement('button');
  d.className='case-dot'+(i===0?' on':'');
  d.addEventListener('click',()=>goCase(i));
  casesDots.appendChild(d);
}
function goCase(i){
  ci=(i+totalCases)%totalCases;
  casesTrack.style.transform=`translateX(-${ci*100}%)`;
  document.querySelectorAll('.case-dot').forEach((d,j)=>d.classList.toggle('on',j===ci));
}
setInterval(()=>goCase(ci+1),6500);

/* ── SERVICES SCROLL ── */
const st=document.getElementById('servTrack');
const CW=312;let so=0;
const maxSo=()=>Math.max(0,st.scrollWidth-st.parentElement.offsetWidth);
document.getElementById('servNext').addEventListener('click',()=>{so=Math.min(so+CW,maxSo());st.style.transform=`translateX(-${so}px)`});
document.getElementById('servPrev').addEventListener('click',()=>{so=Math.max(0,so-CW);st.style.transform=`translateX(-${so}px)`});

/* ── TESTIMONIALS ── */
const depoSlides=document.getElementById('depoSlides');
const depoDots=document.getElementById('depoDots');
const totalDepo=depoSlides.children.length;
let di=0;
for(let i=0;i<totalDepo;i++){
  const d=document.createElement('button');
  d.className='depo-dot'+(i===0?' on':'');
  d.addEventListener('click',()=>goDepo(i));
  depoDots.appendChild(d);
}
function goDepo(i){
  di=(i+totalDepo)%totalDepo;
  depoSlides.style.transform=`translateX(-${di*100}%)`;
  document.querySelectorAll('.depo-dot').forEach((d,j)=>d.classList.toggle('on',j===di));
}
document.getElementById('depoNext').addEventListener('click',()=>goDepo(di+1));
document.getElementById('depoPrev').addEventListener('click',()=>goDepo(di-1));
setInterval(()=>goDepo(di+1),7000);

/* ── FORM ── */
function submitForm(e){
  e.preventDefault();
  const btn=document.getElementById('footBtn');
  btn.textContent='Enviado ✓';btn.style.background='var(--gold-lo)';
  setTimeout(()=>{btn.textContent='Enviar';btn.style.background='';},3500);
}
