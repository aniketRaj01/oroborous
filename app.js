(function () {
  var root = document.documentElement;
  root.classList.add('js');

  // theme toggle (choice remembered locally on this device only)
  var btn = document.getElementById('theme-toggle');
  function current() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  function paint() {
    var t = current();
    if (btn) {
      btn.textContent = t === 'dark' ? '☀' : '☾';
      btn.setAttribute('aria-label', 'Switch to ' + (t === 'dark' ? 'light' : 'dark') + ' theme');
    }
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', t === 'dark' ? '#080c0e' : '#f6faf9');
  }
  if (btn) btn.addEventListener('click', function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('oroborous-theme', next); } catch (e) {}
    paint();
  });
  paint();

  // loop diagram
  var stepBtns = [].slice.call(document.querySelectorAll('.step-btn'));
  var nodes = [].slice.call(document.querySelectorAll('.loop-svg .node'));
  function setStep(i) {
    stepBtns.forEach(function (b, k) { b.setAttribute('aria-expanded', k === i ? 'true' : 'false'); });
    nodes.forEach(function (n, k) { n.classList.toggle('on', k === i); });
  }
  stepBtns.forEach(function (b, i) {
    b.addEventListener('click', function () { setStep(i); });
    b.addEventListener('mouseenter', function () { setStep(i); });
    b.addEventListener('focus', function () { setStep(i); });
  });
  nodes.forEach(function (n, i) {
    n.addEventListener('mouseenter', function () { setStep(i); });
    n.addEventListener('click', function () { setStep(i); });
  });
  if (stepBtns.length) setStep(0);

  // platform tabs
  var tabs = [].slice.call(document.querySelectorAll('.tab'));
  function selectTab(t, focus) {
    tabs.forEach(function (x) {
      var on = x === t;
      x.setAttribute('aria-selected', on ? 'true' : 'false');
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) t.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(t); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      else if (k === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (k === 'Home') n = tabs[0];
      else if (k === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); selectTab(n, true); }
    });
  });

  // persona flip cards
  [].forEach.call(document.querySelectorAll('.flip'), function (c) {
    c.addEventListener('click', function () {
      c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
    });
  });

  // optional embeds: nothing third-party loads until the visitor clicks
  [].forEach.call(document.querySelectorAll('.acct'), function (card) {
    var b = card.querySelector('.load-embed');
    if (!b) return;
    b.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = card.getAttribute('data-embed');
      f.title = 'Live preview: ' + card.getAttribute('data-title');
      f.loading = 'lazy';
      f.referrerPolicy = 'strict-origin-when-cross-origin';
      f.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
      f.setAttribute('allow', 'encrypted-media; picture-in-picture');
      var slot = card.querySelector('.embed-slot');
      slot.textContent = '';
      slot.style.border = '0';
      slot.appendChild(f);
    });
  });

  // reveal on scroll
  var items = [].slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    items.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 80 + 'ms'; io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }
})();
