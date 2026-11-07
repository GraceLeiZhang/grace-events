/* 每日一读：读取 daily/today.json，按页面语言显示。内容由 scripts/daily_read.py 每天生成。
   所有文字都用 textContent 写入，链接只接受 https 或站内页面。 */
(()=>{
const EN=(document.documentElement.lang||'').toLowerCase().startsWith('en');
const SITE='https://graceleizhang.github.io/grace-events/';
const L=EN?{h1:'Daily Read',days:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
 health:'🌿 Health tip',out:'📍 Out and about in Sydney',gr:'💜 Grace Rock news',ai:'🤖 AI tip',src:'Source',more:'Find out more ›',
 empty:'Today\'s read is not ready yet. Please check back later.',note:'Written each morning with AI web search. Check event details on the official page before you go.'}
:{h1:'每日一读',days:['一','二','三','四','五','六','日'].map(d=>'星期'+d),
 health:'🌿 今日健康小知识',out:'📍 悉尼好去处',gr:'💜 雅实动态',ai:'🤖 AI 小技巧',src:'来源',more:'查看详情 ›',
 empty:'今天的每日一读还在准备中，晚点再来看看。',note:'每天早上由 AI 上网搜索后整理。活动信息出发前请再看一下官方页面。'};
const host=document.getElementById('daily');
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};
const safe=u=>/^https:\/\//.test(u)?u:/^[\w\-\/]+\.html$/.test(u)?SITE+(EN?u.replace(/\.html$/,'-en.html'):u):null;
function link(href,text){const u=safe(href);if(!u)return null;const a=el('a','more',text);a.href=u;if(/^https/.test(href)){a.target='_blank';a.rel='noopener'}return a}
function card(title,...kids){const c=el('section','card');c.appendChild(el('h2',null,title));kids.flat().forEach(k=>k&&c.appendChild(k));return c}
function show(d){
 const p=d[EN?'en':'zh'];host.textContent='';
 host.appendChild(el('h1',null,L.h1));
 const dt=new Date(d.date+'T00:00:00');
 host.appendChild(el('p','date',EN?`${L.days[d.weekday]}, ${dt.toLocaleDateString('en-AU',{day:'numeric',month:'long',year:'numeric'})}`:`${dt.getMonth()+1} 月 ${dt.getDate()} 日 · ${L.days[d.weekday]}`));
 host.appendChild(card(L.health,el('h3',null,p.health.title),el('p',null,p.health.body)));
 host.appendChild(card(L.out,p.outings.map(o=>{const w=el('div');w.appendChild(el('h3',null,o.title));
  w.appendChild(el('p','meta',[o.when,o.where,o.price].filter(Boolean).join(' · ')));
  if(o.note)w.appendChild(el('p',null,o.note));const a=link(o.url,L.src+' ›');if(a)w.appendChild(a);return w})));
 host.appendChild(card(L.gr,el('h3',null,p.grace_rock.title),el('p',null,p.grace_rock.body),link(p.grace_rock.link,L.more)));
 host.appendChild(card(L.ai,el('h3',null,p.ai_tip.title),el('p',null,p.ai_tip.body)));
 host.appendChild(el('p','meta',L.note));
}
fetch('daily/today.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw 0;return r.json()}).then(show)
 .catch(()=>{host.textContent='';host.appendChild(el('p','empty',L.empty))});
})();
