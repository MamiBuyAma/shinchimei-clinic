/* 新奇美診所 醫美專欄 — 前台渲染
   資料來源：posts-data.js（正式發佈）+ localStorage（編輯器草稿預覽） */
(function () {
  var LS_KEY = 'scm_posts_custom';

  function loadPosts() {
    var seed = Array.isArray(window.SCM_POSTS) ? window.SCM_POSTS.slice() : [];
    var custom = [];
    try { custom = JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch (e) {}
    // 編輯器內的文章：id 相同者覆蓋種子文章；published !== false 才顯示
    var map = {};
    seed.forEach(function (p) { map[p.id] = p; });
    custom.forEach(function (p) {
      if (p.published === false) { delete map[p.id]; return; }
      map[p.id] = p;
    });
    return Object.keys(map).map(function (k) { return map[k]; })
      .sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function cardHTML(p, base) {
    return '<a class="post-card" href="' + base + 'post.html?id=' + encodeURIComponent(p.id) + '">' +
      '<div class="post-card__media"><img src="' + esc(p.cover) + '" alt="' + esc(p.title) + '｜新奇美診所醫美專欄" loading="lazy"></div>' +
      '<div class="post-card__meta"><span>' + esc(p.category) + '</span><span>' + esc(p.date) + '</span></div>' +
      '<h3 class="post-card__title">' + esc(p.title) + '</h3>' +
      '<p class="post-card__excerpt">' + esc(p.excerpt) + '</p>' +
      '</a>';
  }

  var posts = loadPosts();

  // 首頁最新三篇
  var home = document.getElementById('home-posts');
  if (home) {
    home.innerHTML = posts.slice(0, 3).map(function (p) { return cardHTML(p, 'blog/'); }).join('') ||
      '<p style="color:var(--ink-soft);">專欄文章即將上線，敬請期待。</p>';
  }

  // 專欄列表頁
  var list = document.getElementById('post-list');
  if (list) {
    var cats = ['全部'];
    posts.forEach(function (p) { if (p.category && cats.indexOf(p.category) < 0) cats.push(p.category); });
    var filterBar = document.getElementById('post-filter');
    var current = '全部';

    function renderList() {
      var shown = current === '全部' ? posts : posts.filter(function (p) { return p.category === current; });
      list.innerHTML = shown.map(function (p) { return cardHTML(p, ''); }).join('') ||
        '<p style="color:var(--ink-soft);">此分類尚無文章。</p>';
    }
    if (filterBar) {
      filterBar.innerHTML = cats.map(function (c) {
        return '<button type="button" class="filter-btn' + (c === current ? ' is-active' : '') + '" data-cat="' + esc(c) + '">' + esc(c) + '</button>';
      }).join('');
      filterBar.addEventListener('click', function (e) {
        var btn = e.target.closest('.filter-btn');
        if (!btn) return;
        current = btn.getAttribute('data-cat');
        filterBar.querySelectorAll('.filter-btn').forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
        });
        renderList();
      });
    }
    renderList();
  }

  // 文章內頁
  var articleEl = document.getElementById('article-root');
  if (articleEl) {
    var id = new URLSearchParams(location.search).get('id');
    var post = posts.filter(function (p) { return p.id === id; })[0];
    if (!post) {
      articleEl.innerHTML = '<div class="wrap wrap--narrow article"><p>找不到這篇文章，它可能已被移除。</p><p style="margin-top:2rem;"><a class="btn" href="index.html">回到專欄列表</a></p></div>';
      return;
    }
    document.title = post.title + '｜新奇美診所 醫美專欄';
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', post.excerpt || post.title);

    articleEl.innerHTML =
      '<div class="wrap wrap--narrow article">' +
      '<nav class="breadcrumb" aria-label="breadcrumb"><a href="../index.html">首頁</a><span>／</span><a href="index.html">醫美專欄</a><span>／</span><span>' + esc(post.category) + '</span></nav>' +
      '<header class="article__head">' +
      '<p class="article__meta">' + esc(post.category) + '　·　' + esc(post.date) + '</p>' +
      '<h1 class="article__title">' + esc(post.title) + '</h1>' +
      '</header>' +
      (post.cover ? '<img class="article__cover" src="' + esc(post.cover) + '" alt="' + esc(post.title) + '｜新奇美診所醫美專欄">' : '') +
      '<div class="article__body">' + post.html + '</div>' +
      '<footer style="margin-top:4rem; padding-top:2rem; border-top:1px solid var(--hairline); display:flex; gap:1rem; flex-wrap:wrap;">' +
      '<a class="btn" href="index.html">回到專欄列表</a>' +
      '<a class="btn btn--line" href="../contact.html"><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 3C6.5 3 2 6.6 2 11.1c0 4 3.5 7.4 8.3 8 .3.1.8.2.9.5.1.2.1.6 0 .9l-.1.9c0 .3-.2 1 .9.6 1.1-.5 5.8-3.4 7.9-5.9 1.4-1.6 2.1-3.2 2.1-5C22 6.6 17.5 3 12 3z"/></svg>LINE@ 諮詢本療程</a>' +
      '</footer>' +
      '</div>';

    // Article JSON-LD for SEO
    var ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': post.title,
      'datePublished': post.date,
      'image': post.cover,
      'author': { '@type': 'Organization', 'name': '新奇美診所' },
      'publisher': { '@type': 'Organization', 'name': '新奇美診所' }
    });
    document.head.appendChild(ld);
  }
})();
