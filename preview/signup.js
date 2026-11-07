/* Email signup ("加入社区 / Join Our Community").
   Subscribers are stored by MailerLite, which also adds the unsubscribe link
   to every email. Paste the form's action URL from MailerLite below
   (Forms > Embedded form > HTML code, the <form action="..."> value).
   Until it is set, the form shows a "coming soon" note instead of sending. */
(function () {
  var ACTION = '';

  var form = document.getElementById('signup-form');
  if (!form) return;
  var en = /^en/i.test(document.documentElement.lang);
  var msg = document.getElementById('signup-msg');
  var btn = form.querySelector('button');
  var T = en ? {
    soon: 'Signup opens soon. For now, message Grace on WeChat or WhatsApp.',
    ok: 'Almost done! Please check your inbox and click the confirmation link.',
    err: 'Something went wrong. Please try again, or message Grace directly.',
    sending: 'Sending…'
  } : {
    soon: '订阅功能即将开放，现在可以先通过微信或 WhatsApp 联系 Grace。',
    ok: '还差一步！请打开邮箱，点击确认链接完成订阅。',
    err: '提交没有成功，请稍后再试，或直接联系 Grace。',
    sending: '提交中…'
  };

  function show(text, bad) {
    msg.textContent = text;
    msg.className = 'signup-msg' + (bad ? ' bad' : '');
    msg.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    if (form.querySelector('[name="website"]').value) return;
    if (!ACTION) { show(T.soon); return; }
    var data = new FormData();
    data.append('fields[email]', form.querySelector('[type="email"]').value.trim());
    data.append('ml-submit', '1');
    data.append('anticsrf', 'true');
    var label = btn.textContent;
    btn.disabled = true; btn.textContent = T.sending;
    fetch(ACTION, { method: 'POST', body: data })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (j && j.success === false) throw 0;
        form.reset(); show(T.ok);
      })
      .catch(function () { show(T.err, true); })
      .then(function () { btn.disabled = false; btn.textContent = label; });
  });
})();
