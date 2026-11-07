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

/* 跳转目标：mod=第几个板块（页面上的 #m1–#m5），card=商家卡片标题，url=链接（partners/ 开头的按本脚本所在目录算） */
const MOD={1:['健康','Health'],2:['人与自然','Nature'],3:['人与人','Connection'],4:['人与科技','Tech & AI'],5:['人与 Soul · Art','Soul & Art']};
const go=(zh,en,t)=>({l:EN?en:zh,...t});
const M=n=>go('看「'+MOD[n][0]+'」板块','See '+MOD[n][1],{mod:n});
const ev=(zh,en,page)=>go(zh,en,{href:SITE+page.replace(/\.html$/,EN?'-en.html':'.html')});

const KB=[
 {k:['健身','减肥','减重','瘦','运动','教练','体测','burwood','s fitness','sfitness','gym','fitness','weight','trainer'],
  zh:'推荐 S Fitness（Burwood）。Grace 亲测 2 个月减了 3 公斤，不靠饿。首节体验课 $40，使用专属优惠码 GraceRock 买课加送 1 节。微信 sjs6477，电话 0410 837 664。',
  en:'Try S Fitness in Burwood. Grace lost 3 kg in 2 months without starving. First trial class is $40, and with the code GraceRock you get 1 extra class when you buy a package. WeChat sjs6477, phone 0410 837 664.',
  a:[go('S Fitness 详情','S Fitness details',{url:'partners/s-fitness.html'}),go('看 S Fitness 卡片','See the card',{card:'S Fitness'})]},
 {k:['养生','中医','熏蒸','百草','herbmax','刘大夫','ivy','epping','亚健康','调理','chinese medicine','wellness','herbal','steam'],
  zh:'推荐百草养生馆 Herbmax（Epping），做中药熏蒸和中医检测。到店出示专属优惠码 GraceRock，免费中医检测一次。扫卡片上的二维码加微信预约。',
  en:'Try Herbmax Healthcare in Epping for herbal steam therapy and health checks. Show the code GraceRock in store for a free Chinese medicine health check. Scan the QR code on the card to book on WeChat.',
  a:[go('百草养生馆详情','Herbmax details',{url:'partners/herbmax.html'}),go('看百草养生馆卡片','See the card',{card:'Herbmax'})]},
 {k:['瑜伽','yoga','meet yoga','baulkham','拉伸','何老师'],
  zh:'推荐 Meet Yoga（Baulkham Hills），何老师小班教学，会逐一纠正动作。使用专属优惠码 GraceRock 买课加送 1 节。微信 MeetYoga6。',
  en:'Try Meet Yoga in Baulkham Hills. Grace He teaches small groups and corrects each person\'s form. With the code GraceRock you get 1 extra class when you buy a package. WeChat MeetYoga6.',
  a:[go('Meet Yoga 详情','Meet Yoga details',{url:'partners/meet-yoga.html'}),M(1)]},
 {k:['会计','报税','税','bas','注册公司','开公司','成立公司','公司注册','保险','财务','ips','hurstville','accountant','tax','company','insurance','bookkeeping','xero'],
  zh:'推荐 IPS Partners（Hurstville），Grace 2013 年起合作至今，做会计、报税、BAS、公司注册、财务规划和保险，中文服务。手机 0407 818 788，热线 1300 047 772。联系时提供推荐码 GraceRock。',
  en:'Try IPS Partners in Hurstville. Grace has worked with them since 2013. They do accounting, tax, BAS, company registration, financial planning and insurance. Mobile 0407 818 788, hotline 1300 047 772. Mention the code GraceRock when you contact them.',
  a:[go('IPS Partners 详情','IPS Partners details',{url:'partners/ips-partners.html'}),M(3)]},
 {k:['狗','狗狗','宠物','洗狗','wooof','dog','grooming','pet','surry hills'],
  zh:'推荐 WOOOF Dog Grooming（Surry Hills），各种犬种都能洗澡修剪，每只狗狗单独打理。优惠码 REF-QKSR5Q，首次美容享折扣，可在 wooof.com.au 预约。（利益公开：Grace 是 WOOOF 推荐伙伴。）',
  en:'Try WOOOF Dog Grooming in Surry Hills. All breeds, each dog groomed individually. Code REF-QKSR5Q gives a discount on your first groom; book at wooof.com.au. (Disclosure: Grace is a WOOOF referral partner.)',
  a:[go('WOOOF 详情','WOOOF details',{url:'partners/wooof.html'}),go('复制优惠码','Copy the code',{copy:'REF-QKSR5Q'})]},
 {k:['补习','辅导','写作','作文','精英','oc','选校','胡老师','chatswood','tj academy','tutor','tutoring','selective','writing'],
  zh:'推荐 TJ Academy（Chatswood），胡老师 2014 年创办，写作、OC、精英中学辅导，一对一和小组课，线上线下都有，课时可按孩子调整。微信 TJAcademy。',
  en:'Try TJ Academy in Chatswood, founded by Ms Hu in 2014: writing, OC and selective school tutoring, one-on-one or small groups, online or in person, with flexible lesson length. WeChat TJAcademy.',
  a:[go('TJ Academy 详情','TJ Academy details',{url:'partners/tj-academy.html'}),M(4)]},
 {k:['静心','蓝花楹','团建','parramatta','11月8','jacaranda'],
  zh:'11 月 8 日（周日）静心学堂春日户外团建「蓝花楹下 · 心聚同行」，Parramatta Park，10:30–15:30，正在报名。',
  en:'Under the Jacarandas: the 静心学堂 spring outdoor day on Sunday 8 November at Parramatta Park, 10:30am–3:30pm. Registration is open.',
  a:[ev('看活动详情','See the event','preview/events/jingxin-spring.html'),M(2)]},
 {k:['水云间','sussex','度假','捞虾','划船','烤全羊','老傅','一月','shuiyunjian','getaway','january','候补'],
  zh:'水云间家庭体验之旅：2027 年 1 月 12 日出发，三天两晚，在 Sussex Inlet 捞虾、划船、烤全羊。已经成团，现在开放候补登记。',
  en:'Shuiyunjian family getaway: from 12 January 2027, 3 days and 2 nights at Sussex Inlet with prawning, boating and a lamb roast. The group is full; the waitlist is open.',
  a:[ev('看水云间活动','See the getaway','shuiyunjian.html'),M(2)]},
 {k:['云南','墨江','北回归线','彩云','四月','版纳','yunnan','mojiang','china trip','april'],
  zh:'2027 年 4 月学校假期的亲子之旅：从上海到云南，穿越北回归线，现在是意向登记阶段。',
  en:'A family trip in the April 2027 school holidays, from Shanghai to Yunnan across the Tropic of Cancer. Register your interest now.',
  a:[ev('看云南之旅','See the Yunnan trip','yunnan-april.html'),M(2)]},
 {k:['彩弹','paintball','die hard','turrella'],
  zh:'10 月 7 日的 Paintball 彩弹对战已经结束了，可以看精彩回顾。',
  en:'The Paintball day on 7 October is over. You can see the recap.',
  a:[ev('看彩弹回顾','See the recap','paintball.html'),M(2)]},
 {k:['活动','亲子','孩子','小孩','旅行','旅游','报名','event','events','kids','children','family','trip','travel','sign up'],
  zh:'近期活动：11 月 8 日静心学堂春日户外团建（报名中）、2027 年 1 月水云间家庭之旅（候补登记）、4 月云南亲子游（意向登记）。',
  en:'Coming up: the spring outdoor day on 8 November (open), the Shuiyunjian getaway in January 2027 (waitlist), and a Yunnan family trip in April (register interest).',
  a:[M(2),ev('静心学堂活动','Spring outdoor day','preview/events/jingxin-spring.html')]},
 {k:['gracerock','暗号','优惠','折扣','代码','优惠码','推荐码','discount','code','offer','deal'],
  zh:'联系推荐商家时提供推荐码 GraceRock，很多商家有专属优惠，每家的优惠写在商家卡片上。Grace 如果因推荐获得好处，卡片上也会写明。',
  en:'Mention the code GraceRock when you contact a recommended business. Many offer a special deal, shown on each card. If Grace gets anything from a referral, the card says so.',
  a:[M(1),M(3)]},
 {k:['加入','合作','商家','推荐伙伴','入驻','partner','join','business','list my'],
  zh:'欢迎加入！这里只推荐 Grace 亲身体验过、真心认可的商家。创业期加入免费，还有「创始伙伴」标识。请加 Grace 微信 '+WX+'。',
  en:'You are welcome to join. Grace only recommends businesses she has tried and trusts. Joining is free during the startup period, with a "Founding partner" badge. Add Grace on WeChat: '+WX+'.',
  a:[go('复制 Grace 微信','Copy Grace\'s WeChat',{copy:WX})]},
 {k:['ai','claude','人工智能','科技','科学','量子','教育','tech','science','education'],
  zh:'「人与科技」板块分 AI、科学、教育三部分，有 Grace 每天在用的 AI 助手，也有 TJ Academy 等教育推荐。',
  en:'The Tech section covers AI, science and education, including the AI assistant Grace uses daily and education picks like TJ Academy.',
  a:[M(4)]},
 {k:['艺术','人物志','小说','写小说','纪念','soul','art','story','stories','novel','memorial'],
  zh:'「人与 Soul · Art」板块有艺术、人物志、纪念和全民写小说，用文字留住一个个故事。',
  en:'The Soul & Art section has art, life stories, memorials and a community novel project.',
  a:[M(5)]},
 {k:['雅实','grace rock','宗旨','是什么','介绍','关于','about','what is grace rock'],
  zh:'雅实 Grace Rock Group：携手同行，共见美好。这里推荐的商家，都是 Grace 亲身体验过的，分成健康、人与自然、人与人、人与科技、人与 Soul · Art 五个板块。',
  en:'Grace Rock Group: everyone deserves to keep getting better. Every business here is one Grace has tried herself, in five sections: Health, Nature, Connection, Tech & AI, and Soul & Art.',
  a:[M(1),M(2),M(3)]},
 {k:['联系','微信','电话','找grace','grace','contact','wechat','phone','email'],
  zh:'可以直接加 Grace 微信：'+WX+'。',
  en:'You can add Grace on WeChat: '+WX+'.',
  a:[go('复制 Grace 微信','Copy Grace\'s WeChat',{copy:WX})]}
];
const T=EN?{
 title:'Grace Rock helper',hi:'Hi! Ask me anything, or tap a topic below.',ph:'Type a question…',send:'Send',open:'Ask a question',close:'Close',
 miss:'Sorry, I am not sure about that yet. Add Grace on WeChat ('+WX+') and she will reply, or look through the sections:',copied:'Copied: ',
 chips:['Fitness','Wellness','Yoga','Accounting & tax','Tutoring','Dog grooming','Events','GraceRock code']
}:{
 title:'雅实小助手',hi:'你好！有什么想问的？可以直接打字，或者点下面的话题。',ph:'输入你的问题…',send:'发送',open:'问问小助手',close:'关闭',
 miss:'这个我还答不上来。可以加 Grace 微信（'+WX+'）直接问她，或者先看看这几个板块：',copied:'已复制：',
 chips:['健身减肥','中医养生','瑜伽','会计报税','补习辅导','狗狗美容','近期活动','GraceRock 优惠码']
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
 if(x.mod)return document.getElementById('m'+x.mod);
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
