(function(){
const L=document.documentElement.lang.startsWith('zh')?'zh':'en';
const T={
 zh:{lit:'已点亮',goal:'目标',done:'50 座城已点亮！Grace 会在游船上唱《听我说谢谢你》',me:'你已点亮',thanks:'谢谢你！你的城市已经点亮 ✨',dup:'这台手机已经点亮过一座城啦，谢谢你！',empty:'请先填写城市名',err:'提交没有成功，请稍后再试，或微信告诉 Grace',preview:'预览模式：现在提交的城市只保存在你自己的手机上，正式上线后才会和大家同步。',people:'人',others:'其他城市',none:'还没有城市被点亮，来做第一个吧！',copied:'链接已复制，发到微信群或朋友圈吧',copyfail:'请长按地址栏复制链接'},
 en:{lit:'Lit',goal:'Goal',done:'50 cities lit! Grace will sing “Thank You” live on the launch cruise',me:'You lit',thanks:'Thank you! Your city is now lit ✨',dup:'This phone has already lit a city. Thank you!',empty:'Please enter a city first',err:'That didn’t go through. Please try again, or tell Grace on WhatsApp',preview:'Preview mode: cities you add are saved only on your own phone until the page goes live.',people:'',others:'Other cities',none:'No cities lit yet. Be the first!',copied:'Link copied. Share it with your friends',copyfail:'Copy the link from the address bar'}
}[L];
const GOAL=50, EP=(window.GR_LIGHT_ENDPOINT||'').trim();
const $=s=>document.querySelector(s);
const store={get(k){try{return localStorage.getItem(k)}catch(_){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(_){}}};
let dev=store.get('gr-light-dev');if(!dev){dev=Math.random().toString(36).slice(2)+Date.now().toString(36);store.set('gr-light-dev',dev)}

// city matching
const IDX={};
(window.GR_CITIES||[]).forEach(c=>{const [zh,en,lat,lon,...al]=c;const o={zh,en,lat,lon};[zh,en,...al].forEach(a=>IDX[norm(a)]=o)});
function clean(s){return String(s||'').replace(/[+＋]\s*[0-9１]+/g,'').replace(/(支持你|加油|点亮|support|from)/gi,'').replace(/[，,。.!！~～#\s]+/g,' ').trim().slice(0,30)}
function norm(s){return clean(s).toLowerCase().replace(/\s+/g,'').replace(/(市|city)$/,'')}
function match(s){const k=norm(s);return IDX[k]||IDX[k.replace(/(省|州|區|区)$/,'')]||null}
function keyOf(s){const m=match(s);return m?m.zh:clean(s)}
function label(k){const m=match(k);return m?(L==='zh'?m.zh:m.en):k}

// data: live endpoint (Google Apps Script) or local preview
async function api(params){const u=EP+(EP.includes('?')?'&':'?')+new URLSearchParams(params);const r=await fetch(u,{redirect:'follow'});const j=await r.json();if(!j.ok)throw new Error(j.error||'fail');return j.cities}
const local={list(){try{return JSON.parse(store.get('gr-light-local')||'[]')}catch(_){return[]}},add(k){const a=local.list();const f=a.find(x=>x.k===k);f?f.n++:a.push({k,n:1});store.set('gr-light-local',JSON.stringify(a));return a}};
const load=()=>EP?api({action:'list'}):Promise.resolve(local.list());
const add=k=>EP?api({action:'add',city:k,id:dev}):Promise.resolve(local.add(k));

// map (pre-projected, no external libraries)
const NS='http://www.w3.org/2000/svg',M=window.GR_MAP;let gDots=null;
function el(n,a){const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);return e}
function drawMap(){if(!M)return;const svg=el('svg',{viewBox:'0 0 960 500',role:'img','aria-label':L==='zh'?'点亮城市地图':'Map of lit cities'});
 svg.appendChild(el('path',{class:'sphere',d:M.sphere}));svg.appendChild(el('path',{class:'land',d:M.land}));gDots=el('g',{});svg.appendChild(gDots);$('#map').appendChild(svg)}
const drawn={};
function render(cities){
 cities=cities.filter(c=>c&&c.k).sort((a,b)=>b.n-a.n);
 const n=cities.length;$('#count').textContent=n;$('#bar i').style.width=Math.min(100,n/GOAL*100)+'%';
 $('#goal-done').hidden=n<GOAL;
 if(gDots)cities.forEach(c=>{const m=match(c.k);if(!m||drawn[c.k])return;const p=M.xy[m.zh];if(!p)return;
  const g=el('g',{class:'city new',transform:`translate(${p[0]},${p[1]})`});g.appendChild(el('circle',{class:'halo',r:16}));g.appendChild(el('circle',{class:'dot',r:6}));
  const t=el('text',{dy:-12});t.textContent=label(c.k);g.appendChild(t);gDots.appendChild(g);drawn[c.k]=g;setTimeout(()=>g.classList.remove('new'),1700)});
 const ul=$('#list');ul.innerHTML='';
 if(!n){ul.innerHTML=`<li class="none">${T.none}</li>`}
 cities.forEach(c=>{const li=document.createElement('li');li.textContent=label(c.k);const b=document.createElement('b');b.textContent='+'+c.n;li.appendChild(b);ul.appendChild(li)});
}
async function refresh(){try{render(await load())}catch(_){}}

// form
const mine=store.get('gr-light-mine');
function showMine(k){$('#mine').hidden=false;$('#mine-city').textContent=label(k)}
if(mine)showMine(mine);
$('#f').addEventListener('submit',async e=>{e.preventDefault();const msg=$('#msg');const v=$('#city').value;
 if(!clean(v)){msg.textContent=T.empty;return}
 if(store.get('gr-light-mine')){msg.textContent=T.dup;return}
 const k=keyOf(v);const btn=$('#go');btn.disabled=true;
 try{const list=await add(k);store.set('gr-light-mine',k);showMine(k);msg.textContent=T.thanks;$('#city').value='';render(list);
  const g=drawn[k];if(g){g.classList.remove('new');void g.getBBox();g.classList.add('new');setTimeout(()=>g.classList.remove('new'),1700)}}
 catch(_){msg.textContent=T.err}finally{btn.disabled=false}});

if(!EP)$('#preview').hidden=false;
$('#preview').textContent=T.preview;
drawMap();refresh();
setInterval(()=>{if(EP&&!document.hidden)refresh()},15000);
})();
