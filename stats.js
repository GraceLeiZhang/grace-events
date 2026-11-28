/* Site statistics for 雅实 Grace Rock (GoatCounter: free, no cookies).
   1) counts each page view;
   2) counts every click from our pages to a merchant site, WhatsApp, phone,
      email or map (shown in the dashboard as "→ host  ·  from page");
   3) shows a small eye with the page's total views at the bottom right.
   Only runs on the real domain, so previews and local tests are not counted.
   Dashboard: https://gracerock.goatcounter.com */
(function () {
  var CODE = 'gracerock';
  var BASE = 'https://' + CODE + '.goatcounter.com';
  var live = /(^|\.)gracerock\.com\.au$/.test(location.hostname);
  var demo = /[?&]statsdemo=(\d+)/.exec(location.search); // preview only: ?statsdemo=1234
  if (!live && !demo) return;

  if (live) {
    var s = document.createElement('script');
    s.async = true;
    s.src = '//gc.zgo.at/count.js';
    s.setAttribute('data-goatcounter', BASE + '/count');
    document.head.appendChild(s);
  }

  /* Outbound clicks. One event per click, grouped by destination. */
  function dest(a) {
    var h = a.getAttribute('href') || '';
    if (/^tel:/i.test(h)) return 'tel';
    if (/^mailto:/i.test(h)) return 'email';
    if (!/^https?:/i.test(h) || a.host === location.host) return null;
    var host = a.hostname.replace(/^www\./, '');
    if (host === 'wa.me' || host === 'api.whatsapp.com') return 'WhatsApp';
    if (/(^|\.)google\.[a-z.]+$/.test(host) && /maps|\/maps/.test(a.href)) return 'map';
    if (host === 'maps.google.com' || host === 'maps.app.goo.gl') return 'map';
    return host;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var d = dest(a);
    if (!d || !live) return;
    var page = location.pathname.replace(/\.html$/, '').replace(/\/index$/, '/');
    var send = function () {
      if (window.goatcounter && window.goatcounter.count) {
        window.goatcounter.count({ path: '→ ' + d + '  ·  ' + page, title: (a.textContent || '').trim().slice(0, 60), event: true });
      }
    };
    send();
  }, true);

  /* The eye: total views of this page so far. Hidden if there is no number yet. */
  function badge(n) {
    var en = /^en/i.test(document.documentElement.lang);
    var css = document.createElement('style');
    css.textContent =
      '.gr-views{display:flex;justify-content:flex-end;align-items:center;gap:5px;max-width:960px;margin:4px auto 0;' +
      'padding:6px 16px calc(6px + var(--gr-views-pad,0px));font:12px/1.4 system-ui,sans-serif;color:#8a7f96;opacity:.85}' +
      '.gr-views svg{width:15px;height:15px;flex:none}' +
      '@media (max-width:719px){body:has(.mbar) .gr-views{--gr-views-pad:78px}}';
    document.head.appendChild(css);
    var el = document.createElement('div');
    el.className = 'gr-views';
    el.title = en ? 'Page views' : '浏览量';
    el.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>' +
      '<span>' + n + '</span><span class="gr-sr" style="position:absolute;left:-9999px">' + (en ? ' views' : ' 次浏览') + '</span>';
    document.body.appendChild(el);
  }
  function show() {
    if (demo) { badge(Number(demo[1]).toLocaleString('en-AU')); return; }
    fetch(BASE + '/counter/' + encodeURIComponent(location.pathname) + '.json')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { if (j && j.count && j.count !== '0') badge(j.count); })
      .catch(function () {});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show); else show();
})();
