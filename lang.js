/* Site-wide 中文 / EN switch.
   Each page declares its own language on <html lang> and its counterpart with
   <link rel="alternate" hreflang="zh|en" href="...">. The visitor's choice is
   remembered, so any shared link opens in the language they picked last time.
   ?lang=en or ?lang=zh on a link sets the choice for the person opening it. */
(function () {
  var KEY = 'gracerock-lang';
  var cur = /^en/i.test(document.documentElement.lang) ? 'en' : 'zh';

  function alt(l) {
    var a = document.querySelector('link[rel="alternate"][hreflang="' + l + '"]');
    return a ? a.href : null;
  }
  function load() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(l) { try { localStorage.setItem(KEY, l); } catch (e) {} }

  var q = (location.search.match(/[?&]lang=(en|zh)\b/) || [])[1];
  if (q) save(q);
  var want = q || load();
  if (want && want !== cur) {
    var u = alt(want);
    if (u) { location.replace(u + location.hash); return; }
  }

  function go(l) {
    save(l);
    if (l === cur) return;
    var u = alt(l);
    if (u) location.href = u + location.hash;
  }

  function build() {
    if (document.getElementById('gr-lang')) return;
    var css = document.createElement('style');
    css.textContent =
      '#gr-lang{position:fixed;top:calc(10px + env(safe-area-inset-top,0px));right:12px;z-index:2147483000;' +
      'display:flex;gap:2px;background:#efe9e1;border-radius:999px;padding:4px;box-shadow:0 1px 6px rgba(0,0,0,.10);' +
      'font:500 16px/1 "Noto Serif SC","Songti SC","STSong",Georgia,serif}' +
      '#gr-lang.slot{position:static;box-shadow:none}' +
      'html.gr-lang-fixed body{padding-top:52px}' +
      '#gr-lang button{appearance:none;-webkit-appearance:none;border:0;background:none;color:#5d5850;min-width:52px;min-height:36px;' +
      'padding:0 14px;border-radius:999px;cursor:pointer;font:inherit;transition:background .15s,box-shadow .15s}' +
      '#gr-lang button[aria-pressed="true"]{background:#fff;color:#1e1d1b;box-shadow:0 1px 4px rgba(0,0,0,.18)}' +
      '#gr-lang button:disabled{opacity:.4;cursor:default}' +
      '#gr-lang button:focus-visible{outline:2px solid #a8865a;outline-offset:2px}';
    document.head.appendChild(css);

    var box = document.createElement('div');
    box.id = 'gr-lang';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', 'Language / 语言');
    [['zh', '中文'], ['en', 'EN']].forEach(function (p) {
      var b = document.createElement('button');
      b.type = 'button';
      b.lang = p[0] === 'zh' ? 'zh-CN' : 'en';
      b.textContent = p[1];
      b.setAttribute('aria-pressed', p[0] === cur ? 'true' : 'false');
      if (p[0] !== cur && !alt(p[0])) { b.disabled = true; b.title = p[0] === 'en' ? 'English coming soon' : '中文版即将推出'; }
      b.addEventListener('click', function () { go(p[0]); });
      box.appendChild(b);
    });
    var slot = document.querySelector('[data-lang-slot]');
    if (slot) { box.className = 'slot'; slot.replaceChildren(box); } else { document.documentElement.classList.add('gr-lang-fixed'); document.body.appendChild(box); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
