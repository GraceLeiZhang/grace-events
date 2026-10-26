/* 雅实 Grace Rock 小助手：免费问答版，不连 AI，不需要服务器。
   在页面 </body> 前加一行：<script src="chatbot.js" defer></script>
   中文/英文按 <html lang> 自动切换。改问答只需要改下面的 KB。
   以后升级 AI 版：把 ENDPOINT 设为自己的中转地址（密钥放在中转里，绝不放在网页里），
   ask() 会先问 AI，失败时退回本地问答。 */
(()=>{
const ENDPOINT=null;
const EN=(document.documentElement.lang||'').toLowerCase().startsWith('en');
const BASE=(document.currentScript&&document.currentScript.src||location.href).replace(/[^/]*$/,'');
const SITE='https://graceleizhang.github.io/grace-events/';
const WX='leigracezhang';

/* 跳转目标：mod=第几个板块，card=商家卡片标题，url=链接（partners/ 开头的按本脚本所在目录算） */
const MOD={1:['健康','Health'],2:['人与自然','Nature'],3:['人与人','Connection'],4:['人与 AI','AI'],5:['人与灵魂','Soul']};
const go=(zh,en,t)=>({l:EN?en:zh,...t});
const M=n=>go('看「'+MOD[n][0]+'」板块','See '+MOD[n][1],{mod:n});

const KB=[
 {k:['健身','减肥','减重','瘦','运动','教练','体测','burwood','s fitness','sfitness','gym','fitness','weight','trainer'],
  zh:'推荐 S Fitness（Burwood）。Grace 亲测 2 个月减了 3 公斤。首节体验课 $40，报暗号「GraceRock」买课后加送 1 节。微信 sjs6477，电话 0410 837 664。',
  en:'Try S Fitness in Burwood. Grace lost 3 kg in 2 months there. First trial class is $40, and mention "GraceRock" when you buy a package to get 1 extra class. WeChat sjs6477, phone 0410 837 664.',
  a:[go('S Fitness 详情','S Fitness details',{url:'partners/s-fitness.html'}),go('看 S Fitness 卡片','See the card',{card:'S Fitness'})]},
 {k:['养生','中医','熏蒸','百草','herbmax','刘大夫','ivy','epping','亚健康','调理','chinese medicine','wellness','herbal','steam'],
  zh:'推荐百草养生馆 Herbmax（Epping），主理人刘大夫 Ivy 有 30 多年行医经验，做中药熏蒸和经络检测。报「GraceRock」免费送一次中医检测，扫页面上的二维码加微信预约。',
  en:'Try Herbmax Healthcare in Epping. Dr Liu (Ivy) has over 30 years of practice in herbal steam therapy and health checks. Mention "GraceRock" for a free Chinese medicine health check. Scan the QR code on the page to book on WeChat.',
  a:[go('百草养生馆详情','Herbmax details',{url:'partners/herbmax.html'}),go('看百草养生馆卡片','See the card',{card:'Herbmax'})]},
 {k:['瑜伽','yoga','meet yoga','baulkham','拉伸'],
  zh:'推荐 Meet Yoga，Grace 老师在 Baulkham Hills 上课，周一到周六。10 节课 $300，报「GraceRock」加送 1 节。微信 MeetYoga6。',
  en:'Try Meet Yoga with teacher Grace in Baulkham Hills, Monday to Saturday. 10 classes for $300, and mention "GraceRock" to get 1 extra class. WeChat MeetYoga6.',
  a:[go('Meet Yoga 详情','Meet Yoga details',{url:'partners/meet-yoga.html'}),M(1)]},
 {k:['会计','报税','税','bas','注册公司','开公司','成立公司','公司注册','保险','财务','ips','hurstville','accountant','tax','company','insurance','bookkeeping','xero'],
  zh:'推荐 IPS Partners（Hurstville），Grace 合作了 13 年，做会计、报税、BAS、公司注册、财务规划和保险，中文服务。手机 0407 818 788，热线 1300 047 772。报「GraceRock」首次咨询免费（待 IPS 确认）。',
  en:'Try IPS Partners in Hurstville. Grace has worked with them for 13 years. They do accounting, tax, BAS, company registration, financial planning and insurance. Mobile 0407 818 788, hotline 1300 047 772. Mention "GraceRock" for a free first consultation (to be confirmed by IPS).',
  a:[go('IPS Partners 详情','IPS Partners details',{url:'partners/ips-partners.html'}),M(3)]},
 {k:['水云间','sussex','度假','捞虾','划船','烤全羊','老傅','一月','shuiyunjian','getaway','holiday','camping','january'],
  zh:'水云间家庭体验之旅：2027 年 1 月 12 日出发，三天两晚，在 Sussex Inlet 捞虾、划船、烤全羊，正在报名中。',
  en:'Shuiyunjian family getaway: from 12 January 2027, 3 days and 2 nights at Sussex Inlet with prawning, boating and a lamb roast. Registration is open.',
  a:[go('看水云间活动','See the getaway',{href:SITE+(EN?'shuiyunjian-en.html':'shuiyunjian.html')}),M(2)]},
 {k:['云南','墨江','北回归线','彩云','四月','版纳','yunnan','mojiang','china trip','april'],
  zh:'2027 年 4 月学校假期的亲子之旅：从上海到云南，穿越北回归线，目前在筹备中。',
  en:'A family trip in the April 2027 school holidays, from Shanghai to Yunnan across the Tropic of Cancer. It is being planned now.',
  a:[go('看云南之旅','See the Yunnan trip',{href:SITE+(EN?'yunnan-april-en.html':'yunnan-april.html')}),M(2)]},
 {k:['彩弹','paintball','die hard','turrella'],
  zh:'10 月 7 日的 Paintball 彩弹对战已经结束了，可以看精彩回顾。下次活动请关注「人与自然」板块。',
  en:'The Paintball day on 7 October is over. You can see the recap, and watch the Nature section for the next event.',
  a:[go('看彩弹回顾','See the recap',{href:SITE+(EN?'paintball-en.html':'paintball.html')}),M(2)]},
 {k:['活动','亲子','孩子','小孩','旅行','旅游','报名','event','events','kids','children','family','trip','travel','sign up'],
  zh:'Grace 带大家一起去体验：现在报名中的是 2027 年 1 月的水云间家庭之旅，4 月还有云南亲子游在筹备。',
  en:'Grace runs family experiences. The Shuiyunjian getaway in January 2027 is open for sign-up, and a Yunnan family trip in April is being planned.',
  a:[go('看水云间活动','See the getaway',{href:SITE+(EN?'shuiyunjian-en.html':'shuiyunjian.html')}),M(2)]},
 {k:['gracerock','暗号','优惠','折扣','代码','discount','code','offer','deal'],
  zh:'在推荐商家那里报暗号「GraceRock」，就能享受专属优惠，每家的优惠写在商家卡片上。Grace 如果因推荐获得好处，也会在卡片上写明。',
  en:'Mention "GraceRock" at any recommended business to get a special offer. Each card shows its offer. If Grace gets anything from a referral, the card says so.',
  a:[M(1),M(3)]},
 {k:['加入','合作','商家','推荐伙伴','入驻','partner','join','business','list my'],
  zh:'欢迎加入！这里只推荐 Grace 亲身体验过、真心认可的商家。创业期加入免费，还有「创始伙伴」标识。请加 Grace 微信 '+WX+'。',
  en:'You are welcome to join. Grace only recommends businesses she has tried and trusts. Joining is free during the startup period, with a "Founding partner" badge. Add Grace on WeChat: '+WX+'.',
  a:[go('复制 Grace 微信','Copy Grace\'s WeChat',{copy:WX})]},
 {k:['ai','claude','power bi','报告','人工智能','科技','科学','量子','tech','science','report'],
  zh:'「人与 AI」板块有 Grace 每天在用的 AI 助手，还有 Power BI 和 AI 报告咨询，帮小企业自动做报表。',
  en:'The AI section has the AI assistant Grace uses every day, plus Power BI and AI reporting help for small businesses.',
  a:[M(4)]},
 {k:['人物志','小说','悼念','艺术','遗嘱','灵魂','story','stories','art','memorial'],
  zh:'「人与灵魂 · 人物志」记录一个个人物的故事，Grace 的文字即将开放阅读。',
  en:'The Soul section collects life stories. Grace\'s writing will open for reading soon.',
  a:[M(5)]},
 {k:['教育','补习','辅导','数学','演讲','口才','tutor','education','math','speech'],
  zh:'「人与人」板块里有演讲与口才、教育和课程辅导的推荐，目前还在洽谈中。',
  en:'The Connection section lists public speaking, education and tutoring. These are still being confirmed.',
  a:[M(3)]},
 {k:['雅实','grace rock','宗旨','是什么','介绍','关于','about','what is grace rock'],
  zh:'雅实 Grace Rock：每一个人，都值得越来越好。这里推荐的每一家，都是 Grace 亲身体验过的，分成健康、人与自然、人与人、人与 AI、人与灵魂五个板块。',
  en:'Grace Rock: everyone deserves to keep getting better. Every recommendation here is one Grace has tried herself, in five sections: Health, Nature, Connection, AI and Soul.',
  a:[M(1),M(2),M(3)]},
 {k:['联系','微信','电话','找grace','grace','contact','wechat','phone','email'],
  zh:'可以直接加 Grace 微信：'+WX+'。',
  en:'You can add Grace on WeChat: '+WX+'.',
  a:[go('复制 Grace 微信','Copy Grace\'s WeChat',{copy:WX})]}
];
const T=EN?{
 title:'Grace Rock helper',hi:'Hi! Ask me anything, or tap a topic below.',ph:'Type a question…',send:'Send',open:'Ask a question',close:'Close',
 miss:'Sorry, I am not sure about that yet. Add Grace on WeChat ('+WX+') and she will reply, or look through the sections:',copied:'Copied: ',
 chips:['Fitness','Wellness','Yoga','Accounting & tax','Family trips','GraceRock code','Join as a partner']
}:{
 title:'雅实小助手',hi:'你好！有什么想问的？可以直接打字，或者点下面的话题。',ph:'输入你的问题…',send:'发送',open:'问问小助手',close:'关闭',
 miss:'这个我还答不上来。可以加 Grace 微信（'+WX+'）直接问她，或者先看看这几个板块：',copied:'已复制：',
 chips:['健身减肥','中医养生','瑜伽','会计报税','亲子活动','GraceRock 暗号','商家加入']
};

const norm=s=>s.toLowerCase().replace(/\s+/g,' ').trim();
const hit=(q,k)=>/^[a-z ]+$/.test(k)?new RegExp('\\b'+k+'\\b').test(q):q.includes(k);
function local(q){q=norm(q);let best=null,top=0;
 KB.forEach(e=>{let s=0;e.k.forEach(k=>{if(hit(q,k))s+=k.length});if(s>top){top=s;best=e}});
 return best?{t:EN?best.en:best.zh,a:best.a}:{t:T.miss,a:[M(1),M(2),M(3),go('复制 Grace 微信','Copy Grace\'s WeChat',{copy:WX})]}}
async function ask(q){
 if(ENDPOINT){try{const r=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({q,lang:EN?'en':'zh'})});
  if(r.ok){const j=await r.json();if(j&&j.t)return j}}catch(_){}}
 return local(q)}

const css=`
#gr-bot{--gb-ac:var(--jac,#7a5ba8);--gb-bg:var(--bg,#fff);--gb-on:#fff;--gb-ink:var(--ink,#2a2233);--gb-line:var(--line,#cfc6da);--gb-soft:var(--gb-line);--gb-soft:color-mix(in srgb,var(--gb-ac) 12%,var(--gb-bg));font-family:var(--body,system-ui,sans-serif);position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:9999}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) #gr-bot{--gb-on:var(--bg,#18141f)}}
[data-theme="dark"] #gr-bot{--gb-on:var(--bg,#18141f)}
#gr-bot .gb-fab{border:0;border-radius:999px;background:var(--gb-ac);color:var(--gb-on);padding:12px 18px;font:inherit;font-size:15px;box-shadow:0 6px 20px rgba(0,0,0,.25);cursor:pointer;display:flex;align-items:center;gap:8px}
#gr-bot .gb-fab svg{width:20px;height:20px}
#gr-bot .gb-box{position:absolute;right:0;bottom:0;width:min(360px,calc(100vw - 32px));height:min(520px,calc(100vh - 100px));background:var(--gb-bg);color:var(--gb-ink);border:1px solid var(--gb-line);border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.3);display:flex;flex-direction:column;overflow:hidden}
#gr-bot .gb-box[hidden]{display:none}
#gr-bot .gb-hd{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:var(--gb-ac);color:var(--gb-on);font-weight:500}
#gr-bot .gb-hd button{background:none;border:0;color:var(--gb-on);font-size:22px;line-height:1;cursor:pointer;padding:0 4px}
#gr-bot .gb-log{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;font-size:14px;line-height:1.55}
#gr-bot .gb-m{max-width:88%;padding:8px 11px;border-radius:12px;white-space:pre-wrap;word-break:break-word}
#gr-bot .gb-b{background:var(--gb-soft);align-self:flex-start;border-bottom-left-radius:4px}
#gr-bot .gb-u{background:var(--gb-ac);color:var(--gb-on);align-self:flex-end;border-bottom-right-radius:4px}
#gr-bot .gb-acts{display:flex;flex-wrap:wrap;gap:6px;align-self:flex-start}
#gr-bot .gb-acts a,#gr-bot .gb-acts button{font:inherit;font-size:13px;padding:5px 10px;border-radius:999px;border:1px solid var(--gb-ac);background:transparent;color:var(--gb-ac);text-decoration:none;cursor:pointer}
#gr-bot form{display:flex;gap:6px;padding:10px;border-top:1px solid var(--gb-line)}
#gr-bot input{flex:1;min-width:0;font:inherit;font-size:16px;padding:8px 10px;border:1px solid var(--gb-line);border-radius:10px;background:transparent;color:inherit}
#gr-bot form button{font:inherit;border:0;border-radius:10px;background:var(--gb-ac);color:var(--gb-on);padding:0 14px;cursor:pointer}
.gb-flash{outline:3px solid var(--jac,#7a5ba8);outline-offset:6px;border-radius:12px;transition:outline-color 1.5s}`;

const root=document.createElement('div');root.id='gr-bot';
root.innerHTML=`<style>${css}</style>
<button class="gb-fab" type="button" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>${T.open}</button>
<div class="gb-box" role="dialog" aria-label="${T.title}" hidden><div class="gb-hd"><span>${T.title}</span><button type="button" aria-label="${T.close}">×</button></div>
<div class="gb-log" aria-live="polite"></div>
<form><input type="text" placeholder="${T.ph}" aria-label="${T.ph}" maxlength="200"><button type="submit">${T.send}</button></form></div>`;
const fab=root.querySelector('.gb-fab'),box=root.querySelector('.gb-box'),log=root.querySelector('.gb-log'),inp=root.querySelector('input');

function bubble(text,cls){const d=document.createElement('div');d.className='gb-m '+cls;d.textContent=text;log.appendChild(d);log.scrollTop=log.scrollHeight;return d}
function acts(list){if(!list||!list.length)return;const w=document.createElement('div');w.className='gb-acts';
 list.forEach(x=>{let el;
  if(x.href||x.url){el=document.createElement('a');el.href=x.href||BASE+(EN?x.url.replace(/\.html$/,'-en.html'):x.url);if(x.href){el.target='_blank';el.rel='noopener'}}
  else{el=document.createElement('button');el.type='button';el.onclick=()=>act(x)}
  el.textContent=x.l;w.appendChild(el)});
 log.appendChild(w);log.scrollTop=log.scrollHeight}
function find(x){
 if(x.mod){for(const h of document.querySelectorAll('h3.group')){const n=h.querySelector('.no');if(n&&n.textContent.trim()==String(x.mod))return h.parentElement}}
 if(x.card){for(const h of document.querySelectorAll('article.rich h4'))if(h.textContent.includes(x.card))return h.closest('article')}
 return null}
function act(x){
 if(x.copy){const done=()=>bubble(T.copied+x.copy,'gb-b');try{navigator.clipboard.writeText(x.copy).then(done,done)}catch(_){done()}return}
 const el=find(x);
 if(!el){location.href=BASE+(EN?'en.html':'./');return}
 if(window.matchMedia('(max-width:600px)').matches)toggle(false);
 el.scrollIntoView({behavior:'smooth',block:'start'});el.classList.add('gb-flash');setTimeout(()=>el.classList.remove('gb-flash'),2200)}
async function send(q){q=q.trim();if(!q)return;bubble(q,'gb-u');const r=await ask(q);bubble(r.t,'gb-b');acts(r.a)}
let started=false;
function toggle(open){box.hidden=!open;fab.hidden=open;fab.setAttribute('aria-expanded',open);
 if(open){if(!started){started=true;bubble(T.hi,'gb-b');
   const w=document.createElement('div');w.className='gb-acts';
   T.chips.forEach(c=>{const b=document.createElement('button');b.type='button';b.textContent=c;b.onclick=()=>send(c);w.appendChild(b)});log.appendChild(w)}
  inp.focus()}else fab.focus()}
fab.onclick=()=>toggle(true);
root.querySelector(".gb-hd button").onclick=()=>toggle(false);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!box.hidden)toggle(false)});
root.querySelector('form').onsubmit=e=>{e.preventDefault();send(inp.value);inp.value=''};
document.body.appendChild(root);
})();
