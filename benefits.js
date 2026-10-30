/* Community Benefits / 社区福利.
   Every program is one entry in PROGRAMS; adding a merchant or referral
   program needs no design change. A page shows the section by including
   <section id="gr-benefits"></section> and this script. Outbound clicks are counted
   by name only (see track); nothing a visitor types is collected here. */
(function () {
  var en = /^en/i.test(document.documentElement.lang);
  var L = function (o) { return o && typeof o === 'object' && 'zh' in o ? (en ? o.en : o.zh) : o; };

  var CATEGORIES = [
    { id: 'cashback', zh: '返现与奖励', en: 'Cashback & Rewards' },
    { id: 'local', zh: '本地优惠', en: 'Local Deals' },
    { id: 'partner', zh: '合作伙伴专享', en: 'Partner Offers' }
  ];

  var PROGRAMS = [
    {
      id: 'pyng',
      cat: 'cashback',
      kind: 'referral',
      name: 'Pyng',
      mark: 'P',
      color: '#1f8a70',
      tagline: { zh: '扫码付款，免刷卡附加费，还能赚 Pops', en: 'Pay by QR with no card surcharge, and earn Pops' },
      about: {
        zh: 'Pyng 是澳洲的手机付款 App，由 Pyng Payments Pty Ltd（ABN 29 675 190 888）运营。在参与的商家扫二维码或碰一下手机付款，钱通过银行的 PayTo 直接从你的账户付给商家，Pyng 不经手资金。Pyng 不向顾客收费，商家也不能向你加收刷卡附加费。',
        en: 'Pyng is an Australian mobile payment app run by Pyng Payments Pty Ltd (ABN 29 675 190 888). At participating merchants you scan a QR code or tap your phone, and the payment goes straight from your bank account to the merchant through PayTo; Pyng never holds the funds. Pyng charges customers no fees, and merchants may not add a card surcharge.'
      },
      rewards: {
        zh: ['用推荐链接注册并完成首笔付款：你和推荐人各得 100 Pops', '之后你赚到的 Pops，推荐人可获得同等数量的奖励，最多 1,000 Pops', '100 Pops = A$1，满 200 Pops 可在参与商家抵扣付款'],
        en: ['Sign up through the referral link and make your first payment: you and the referrer each get 100 Pops', 'The referrer then earns matching Pops on the Pops you earn, up to 1,000', '100 Pops = A$1; from 200 Pops you can use them towards payments at participating merchants']
      },
      eligibility: {
        zh: ['仅限新注册的 Pyng 账户', '需要支持 PayTo 的澳洲银行账户（请先向你的银行确认）', '必须通过本页的推荐链接注册，推荐奖励才有效'],
        en: ['New Pyng accounts only', 'You need an Australian bank account that supports PayTo (check with your bank first)', 'The referral bonus only applies if you sign up through this referral link']
      },
      terms: {
        zh: ['Pops 不能兑换现金，也不能转给他人', '每个季度至少要用 Pyng 付款一次，否则 Pops 余额会在季度末全部过期', '余额不足时，你的银行可能收取费用或利息', '以上内容摘自 Pyng 官方条款（2026 年 10 月），以 Pyng 最新条款为准'],
        en: ['Pops have no cash value and cannot be transferred', 'Make at least one Pyng payment each calendar quarter, or your whole Pops balance expires at the end of that quarter', 'If your account lacks funds, your bank may charge a fee or interest', 'Summarised from Pyng’s official terms (October 2026); Pyng’s current terms apply']
      },
      links: [
        { zh: 'Pops 使用条款', en: 'Pop Terms of Use', u: 'https://www.pyng.com.au/pop-terms-of-use' },
        { zh: '顾客使用条款', en: 'Customer Terms of Use', u: 'https://www.pyng.com.au/customer-terms-of-use' },
        { zh: '总条款', en: 'Terms & Conditions', u: 'https://www.pyng.com.au/terms' }
      ],
      cta: { zh: '通过推荐链接注册 Pyng', en: 'Sign up to Pyng with this referral link' },
      url: 'https://pyng.com.au/customer-referral?referralCode=X9A66J',
      disclosure: {
        zh: '利益公开：这是推荐链接。你通过它注册并付款后，推荐人（Grace Lei Zhang）会获得 Pyng 的 Pops 奖励。Pyng Pops 是 Pyng 自己的积分，和 Grace Rock Good Points 完全无关，两者不能互换或合并。雅实不经手你的付款，也不会收集你的银行或付款信息。',
        en: 'Disclosure: this is a referral link. If you sign up and pay through it, the referrer (Grace Lei Zhang) receives Pops rewards from Pyng. Pyng Pops are Pyng’s own points and are entirely separate from Grace Rock Good Points; the two cannot be exchanged or combined. Grace Rock never handles your payments and does not collect your bank or payment details.'
      }
    }
  ];

  var T = en
    ? { h: 'Community Benefits', lede: 'Savings and rewards for our community. Every referral is disclosed.', badge: 'Referral', soon: 'Coming soon', rewards: 'Rewards', elig: 'Who can join', terms: 'Key terms', more: 'Details and terms', ext: 'Opens the Pyng website' }
    : { h: '社区福利', lede: '给社区朋友的省钱和奖励。所有推荐都会公开说明。', badge: '推荐链接', soon: '即将推出', rewards: '奖励', elig: '适合谁', terms: '主要条款', more: '详情和条款', ext: '将打开 Pyng 官网' };

  // Outbound clicks are counted by program name. Uses GoatCounter when the
  // page loads it (no cookies, no personal data); otherwise does nothing.
  function track(id) {
    try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: 'out/' + id, title: 'Outbound: ' + id, event: true }); } catch (e) {}
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function list(a) { return '<ul>' + L(a).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'; }

  function card(p) {
    var el = document.createElement('article');
    el.className = 'bf-card';
    el.id = 'benefit-' + p.id;
    el.innerHTML =
      '<div class="bf-head"><span class="bf-mark" style="background:' + p.color + '">' + esc(p.mark) + '</span>' +
      '<div><h4>' + esc(p.name) + '</h4><div class="bf-tag">' + esc(L(p.tagline)) + '</div></div>' +
      (p.kind === 'referral' ? '<span class="bf-badge">' + T.badge + '</span>' : '') + '</div>' +
      '<p>' + esc(L(p.about)) + '</p>' +
      '<div class="bf-k">' + T.rewards + '</div>' + list(p.rewards) +
      '<details><summary>' + T.more + '</summary>' +
      '<div class="bf-k">' + T.elig + '</div>' + list(p.eligibility) +
      '<div class="bf-k">' + T.terms + '</div>' + list(p.terms) +
      '<p class="bf-links">' + p.links.map(function (l) { return '<a href="' + l.u + '" target="_blank" rel="noopener">' + esc(L(l)) + '</a>'; }).join(' · ') + '</p>' +
      '</details>' +
      '<p class="bf-disc">' + esc(L(p.disclosure)) + '</p>' +
      '<a class="bf-cta" href="' + p.url + '" target="_blank" rel="sponsored noopener" data-benefit="' + p.id + '">' + esc(L(p.cta)) + ' ›</a>' +
      '<small class="bf-ext">' + T.ext + '</small>';
    return el;
  }

  function build() {
    var host = document.getElementById('gr-benefits');
    if (!host || host.dataset.built) return;
    host.dataset.built = '1';
    var css = document.createElement('style');
    css.textContent =
      '#gr-benefits .bf-cat{margin:18px 0 8px;font-size:14px;font-weight:600;color:var(--jac-deep,#4f3478);letter-spacing:.04em;display:flex;align-items:center;gap:8px}' +
      '#gr-benefits .bf-cat small{font-weight:400;color:var(--muted,#665b72);border:1px solid var(--line,#cfc6da);border-radius:99px;padding:0 10px;font-size:12px}' +
      '#gr-benefits .bf-card{background:var(--surface,#f6f3f9);border-radius:12px;border-top:4px solid #1f8a70;padding:18px;display:flex;flex-direction:column;gap:10px;min-width:0}' +
      '#gr-benefits .bf-head{display:flex;align-items:center;gap:12px}' +
      '#gr-benefits .bf-head>div{flex:1;min-width:0}' +
      '#gr-benefits .bf-mark{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;color:#fff;font:700 20px var(--body,sans-serif);flex:none}' +
      '#gr-benefits h4{margin:0;font-family:var(--display,serif);font-size:20px}' +
      '#gr-benefits .bf-tag{font-size:13.5px;color:var(--muted,#665b72)}' +
      '#gr-benefits .bf-badge{flex:none;font-size:11.5px;color:#1f6f5a;border:1px solid #1f8a70;border-radius:99px;padding:1px 9px}' +
      '#gr-benefits p{margin:0}' +
      '#gr-benefits ul{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:3px;font-size:14px}' +
      '#gr-benefits .bf-k{font-size:13px;font-weight:600;color:var(--ink,#2a2233);margin-top:4px}' +
      '#gr-benefits details{border-top:1px dashed var(--line,#cfc6da);padding-top:8px;display:flex;flex-direction:column;gap:6px}' +
      '#gr-benefits summary{cursor:pointer;font-size:14px;color:var(--jac-deep,#4f3478);min-height:32px;display:flex;align-items:center}' +
      '#gr-benefits .bf-links{font-size:13px;margin-top:6px}#gr-benefits .bf-links a{color:var(--jac-deep,#4f3478)}' +
      '#gr-benefits .bf-disc{font-size:12.5px;color:var(--muted,#665b72);background:var(--mist,#ddd3ea);border-radius:8px;padding:10px 12px;line-height:1.6}' +
      '#gr-benefits .bf-cta{display:flex;align-items:center;justify-content:center;min-height:48px;border-radius:10px;background:#1f8a70;color:#fff;text-decoration:none;font-weight:600;text-align:center;padding:0 14px}' +
      '#gr-benefits .bf-ext{text-align:center;font-size:12px;color:var(--muted,#665b72);margin-top:-4px}' +
      '#gr-benefits .bf-empty{font-size:13.5px;color:var(--muted,#665b72);margin:0}';
    document.head.appendChild(css);

    var html = '<h2>' + T.h + '</h2><p class="lede">' + T.lede + '</p>';
    host.innerHTML = html;
    CATEGORIES.forEach(function (c) {
      var items = PROGRAMS.filter(function (p) { return p.cat === c.id; });
      var h = document.createElement('div');
      h.className = 'bf-cat';
      h.id = 'benefits-' + c.id;
      h.innerHTML = esc(L(c)) + (items.length ? '' : '<small>' + T.soon + '</small>');
      host.appendChild(h);
      items.forEach(function (p) { host.appendChild(card(p)); });
    });
    host.addEventListener('click', function (e) {
      var a = e.target.closest('[data-benefit]');
      if (a) track(a.dataset.benefit);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
