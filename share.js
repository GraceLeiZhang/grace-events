/* "Share with friends" box, placed just before the page's <footer>.
   Builds the message from the page's og:title, og:description and og:url,
   with the link on its own line so WhatsApp and WeChat keep it tappable. */
(function () {
  var en = /^en/i.test(document.documentElement.lang);
  var wechat = /MicroMessenger/i.test(navigator.userAgent);
  function meta(p) { var m = document.querySelector('meta[property="' + p + '"]'); return m ? m.content : ''; }
  var url = meta('og:url') || location.href.split('#')[0];
  var title = meta('og:title') || document.title;
  var desc = meta('og:description');
  var text = '*' + title + '*\n\n' + (desc ? desc + '\n\n' : '') + '👉 ' + url + '\n';

  var T = en
    ? { h: 'Share with friends', wa: 'WhatsApp', copy: 'Copy message', more: 'More…', done: 'Copied. Paste it into WhatsApp or WeChat.', wx: 'In WeChat, tap ··· at the top right to share this page.' }
    : { h: '分享给朋友', wa: 'WhatsApp', copy: '复制分享文字', more: '更多…', done: '已复制，可以直接粘贴到微信或 WhatsApp', wx: '在微信里，点右上角 ··· 就能分享给朋友。' };

  function copy(done) {
    function legacy() {
      var t = document.createElement('textarea');
      t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(t); done();
    }
    try { navigator.clipboard.writeText(text).then(done, legacy); } catch (e) { legacy(); }
  }

  function build() {
    if (document.getElementById('gr-share')) return;
    var css = document.createElement('style');
    css.textContent =
      '#gr-share{width:100%;max-width:560px;margin:28px auto 8px;padding:16px;border-radius:14px;background:rgba(255,255,255,.75);' +
      'border:1px solid rgba(0,0,0,.08);font:15px/1.5 -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;color:#1e1d1b;box-sizing:border-box}' +
      '#gr-share h2{margin:0 0 12px;font-size:16px;font-weight:600;letter-spacing:.04em;text-align:center}' +
      '#gr-share .row{display:flex;flex-wrap:wrap;gap:8px}' +
      '#gr-share a,#gr-share button{flex:1 1 120px;display:flex;align-items:center;justify-content:center;gap:6px;min-height:44px;padding:0 14px;' +
      'border-radius:10px;border:1px solid rgba(0,0,0,.15);background:#fff;color:#1e1d1b;font:inherit;font-weight:600;text-decoration:none;cursor:pointer;box-sizing:border-box}' +
      '#gr-share .wa{background:#25d366;border-color:#25d366;color:#fff}' +
      '#gr-share .msg{margin:10px 0 0;font-size:13px;color:#2e7d4f;text-align:center}' +
      '#gr-share.dark{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.15);color:#ece6f3}' +
      '#gr-share.dark button{background:transparent;color:#ece6f3;border-color:rgba(255,255,255,.25)}';
    document.head.appendChild(css);

    var box = document.createElement('section');
    box.id = 'gr-share';
    var bg = (getComputedStyle(document.body).backgroundColor.match(/\d+/g) || [255, 255, 255]).map(Number);
    if (bg[0] * .3 + bg[1] * .59 + bg[2] * .11 < 90) box.className = 'dark';
    box.innerHTML = '<h2></h2><div class="row"></div><p class="msg" hidden></p>';
    box.querySelector('h2').textContent = T.h;
    var row = box.querySelector('.row'), msg = box.querySelector('.msg');

    var wa = document.createElement('a');
    wa.className = 'wa'; wa.target = '_blank'; wa.rel = 'noopener';
    wa.href = 'https://wa.me/?text=' + encodeURIComponent(text);
    wa.textContent = T.wa;
    // WeChat blocks wa.me links, so offer copy plus its own share menu instead
    if (!wechat) row.appendChild(wa);

    var cp = document.createElement('button');
    cp.type = 'button'; cp.textContent = T.copy;
    cp.addEventListener('click', function () { copy(function () { msg.hidden = false; msg.textContent = T.done; }); });
    row.appendChild(cp);

    if (navigator.share) {
      var more = document.createElement('button');
      more.type = 'button'; more.textContent = T.more;
      more.addEventListener('click', function () { navigator.share({ title: title, text: (desc ? desc + '\n\n' : ''), url: url }).catch(function () {}); });
      row.appendChild(more);
    }

    if (wechat) { msg.hidden = false; msg.textContent = T.wx; }

    var foot = document.querySelector('footer');
    if (foot && foot.parentNode) foot.parentNode.insertBefore(box, foot); else document.body.appendChild(box);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
