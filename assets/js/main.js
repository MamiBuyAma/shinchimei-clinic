/* 新奇美診所 — shared behaviors */
document.documentElement.classList.add('js');

(function () {
  // Mobile nav
  var toggle = document.querySelector('.nav-toggle');
  var close = document.querySelector('.nav-close');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    });
  }
  if (close && nav) {
    close.addEventListener('click', function () {
      nav.classList.remove('is-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }
  if (nav) {
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') nav.classList.remove('is-open');
    });
  }

  // Scroll reveal (content is visible without JS; .js class gates the hidden state)
  var reveals = document.querySelectorAll('.reveal');
  function showAll() {
    // 分頁隱藏時（動畫時間軸暫停），直接停用過渡以免內容卡在透明狀態
    if (document.hidden) document.documentElement.classList.add('no-anim');
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }
  if ('IntersectionObserver' in window && reveals.length && !document.hidden) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
    // 保底：分頁被隱藏（動畫暫停）或任何原因未觸發時，直接顯示全部內容
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) showAll();
    });
    setTimeout(showAll, 3000);
  } else {
    showAll();
  }
})();
