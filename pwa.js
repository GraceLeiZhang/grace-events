/* Makes the site installable as a phone app (雅实 Grace Rock).
   1) registers the service worker;
   2) on the two homepages only, on phones only, shows a small one-line
      "add to home screen" hint once. Closing it hides it for good. */
(function () {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').catch(function () {}); });
  }

  var KEY = 'gracerock-install-hint';
  var standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone;
  var home = /^\/preview\/(index\.html|en\.html)?$/.test(location.pathname);
  var ua = navigator.userAgent;
  var ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  var android = /Android/.test(ua);
  var en = /^en/i.test(document.documentElement.lang);
  function seen() { try { return localStorage.getItem(KEY); } catch (e) { return '1'; } }
  function done() { try { localStorage.setItem(KEY, '1'); } catch (e) {} }
  var wechat = /MicroMessenger/i.test(ua); // WeChat's own browser cannot add to home screen
  if (standalone || !home || !(ios || android) || wechat || seen()) return;

  var deferred = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; show(); });
  if (ios) window.addEventListener('load', function () { setTimeout(show, 1500); });

  var SHARE = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style="vertical-align:-3px"><path d="M12 3v12M7 8l5-5 5 5M5 12v8h14v-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function show() {
    if (document.getElementById('gr-install')) return;
    var css = document.createElement('style');
    css.textContent =
      '#gr-install{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:2147482000;' +
      'display:flex;align-items:center;gap:10px;max-width:460px;margin:0 auto;padding:10px 10px 10px 12px;border-radius:14px;' +
      'background:#fff;color:#2a2233;box-shadow:0 4px 18px rgba(79,52,120,.22);font:14px/1.4 "Noto Sans SC","PingFang SC",system-ui,sans-serif}' +
      '#gr-install img{width:36px;height:36px;border-radius:9px;flex:none}' +
      '#gr-install .t{flex:1}' +
      '#gr-install button{appearance:none;border:0;font:inherit;cursor:pointer;border-radius:999px}' +
      '#gr-install .go{background:#7a5ba8;color:#fff;padding:8px 14px;font-weight:500}' +
      '#gr-install .x{background:none;color:#665b72;width:32px;height:32px;font-size:20px;line-height:1}';
    document.head.appendChild(css);
    var box = document.createElement('div');
    box.id = 'gr-install';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', en ? 'Install the app' : '安装雅实 App');
    var text = deferred
      ? (en ? 'Add Grace Rock to your home screen' : '把「雅实」加到手机桌面')
      : (en ? 'Tap ' + SHARE + ' then “Add to Home Screen”' : '点 ' + SHARE + ' 再点「添加到主屏幕」');
    box.innerHTML = '<img src="/icons/icon-192.png" alt=""><span class="t">' + text + '</span>' +
      (deferred ? '<button type="button" class="go">' + (en ? 'Install' : '安装') + '</button>' : '') +
      '<button type="button" class="x" aria-label="' + (en ? 'Close' : '关闭') + '">×</button>';
    document.body.appendChild(box);
    box.querySelector('.x').onclick = function () { done(); box.remove(); };
    var go = box.querySelector('.go');
    if (go) go.onclick = function () { done(); box.remove(); deferred.prompt(); };
  }
})();
