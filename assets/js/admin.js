/* 新奇美診所 專欄管理後台 */
(function () {
  var LS_KEY = 'scm_posts_custom';

  var $ = function (id) { return document.getElementById(id); };
  var listEl = $('admin-list');
  var editor = $('editor');
  var source = $('html-source');
  var currentId = null; // 正在編輯的文章 id；null = 新文章
  var sourceMode = false;

  function seedPosts() { return Array.isArray(window.SCM_POSTS) ? window.SCM_POSTS : []; }
  function customPosts() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch (e) { return []; }
  }
  function saveCustom(arr) { localStorage.setItem(LS_KEY, JSON.stringify(arr)); }

  // 合併視圖：custom 覆蓋 seed
  function mergedPosts() {
    var map = {}, order = [];
    seedPosts().forEach(function (p) { map[p.id] = { post: p, origin: 'seed' }; order.push(p.id); });
    customPosts().forEach(function (p) {
      if (!map[p.id]) order.push(p.id);
      map[p.id] = { post: p, origin: 'local' };
    });
    return order.map(function (id) { return map[id]; })
      .sort(function (a, b) { return (b.post.date || '').localeCompare(a.post.date || ''); });
  }

  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.classList.add('is-show');
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove('is-show'); }, 2600);
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderList() {
    var items = mergedPosts();
    listEl.innerHTML = items.map(function (it) {
      var p = it.post;
      var badges = it.origin === 'local'
        ? (p.published === false
            ? '<span class="badge badge--hidden">已隱藏</span>'
            : '<span class="badge badge--local">本機修改・待匯出</span>')
        : '<span class="badge badge--seed">已發佈</span>';
      return '<li data-id="' + esc(p.id) + '" class="' + (p.id === currentId ? 'is-active' : '') + '">' +
        '<span class="t">' + esc(p.title || '（未命名）') + '</span>' +
        '<span class="m"><span>' + esc(p.category || '') + '</span><span>' + esc(p.date || '') + '</span>' + badges + '</span>' +
        '</li>';
    }).join('') || '<li style="cursor:default; color:var(--ink-soft);">尚無文章，點「＋ 新文章」開始。</li>';
  }

  function getEditorHTML() {
    if (sourceMode) syncFromSource();
    return editor.innerHTML;
  }
  function syncFromSource() { editor.innerHTML = source.value; }
  function syncToSource() { source.value = editor.innerHTML; }

  function loadPost(id) {
    var found = mergedPosts().filter(function (it) { return it.post.id === id; })[0];
    if (!found) return;
    var p = found.post;
    currentId = id;
    $('editor-title').textContent = '編輯：' + (p.title || id);
    $('editor-status').textContent = found.origin === 'local' ? '本機修改版（尚未匯出發佈）' : '正式發佈版';
    $('f-title').value = p.title || '';
    $('f-date').value = p.date || '';
    $('f-cover').value = p.cover || '';
    $('f-excerpt').value = p.excerpt || '';
    var sel = $('f-category');
    if (p.category && ![].slice.call(sel.options).some(function (o) { return o.value === p.category; })) {
      var opt = document.createElement('option');
      opt.textContent = p.category;
      sel.appendChild(opt);
    }
    sel.value = p.category || sel.options[0].value;
    editor.innerHTML = p.html || '';
    if (sourceMode) syncToSource();
    renderList();
  }

  function newPost() {
    currentId = null;
    $('editor-title').textContent = '新增文章';
    $('editor-status').textContent = '';
    $('f-title').value = '';
    $('f-date').value = new Date().toISOString().slice(0, 10);
    $('f-cover').value = '';
    $('f-excerpt').value = '';
    $('f-category').selectedIndex = 0;
    editor.innerHTML = '';
    if (sourceMode) syncToSource();
    renderList();
  }

  function slugify(title) {
    var base = 'post-' + Date.now().toString(36);
    var ascii = String(title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return ascii ? ascii.slice(0, 40) : base;
  }

  function savePost() {
    var title = $('f-title').value.trim();
    if (!title) { toast('請先輸入文章標題'); $('f-title').focus(); return; }
    var html = getEditorHTML().trim();
    if (!html) { toast('內文還是空的喔'); return; }

    var id = currentId || slugify(title);
    var custom = customPosts();
    var post = {
      id: id,
      title: title,
      category: $('f-category').value,
      date: $('f-date').value || new Date().toISOString().slice(0, 10),
      cover: $('f-cover').value.trim(),
      excerpt: $('f-excerpt').value.trim(),
      html: html
    };
    var idx = custom.findIndex(function (p) { return p.id === id; });
    if (idx >= 0) custom[idx] = post; else custom.push(post);
    saveCustom(custom);
    currentId = id;
    $('editor-title').textContent = '編輯：' + title;
    $('editor-status').textContent = '本機修改版（尚未匯出發佈）';
    renderList();
    toast('已儲存！可點「前台預覽」查看效果');
  }

  function deletePost() {
    if (!currentId) { newPost(); return; }
    if (!confirm('確定要刪除／隱藏這篇文章嗎？\n（正式發佈的文章會標記為隱藏，匯出後才會真正移除）')) return;
    var custom = customPosts();
    var idx = custom.findIndex(function (p) { return p.id === currentId; });
    var isSeed = seedPosts().some(function (p) { return p.id === currentId; });
    if (idx >= 0 && !isSeed) {
      custom.splice(idx, 1); // 純本機文章：直接移除
    } else {
      // 種子文章：以 published:false 標記隱藏
      var marker = { id: currentId, published: false };
      if (idx >= 0) custom[idx] = Object.assign(custom[idx], { published: false });
      else custom.push(marker);
    }
    saveCustom(custom);
    toast('已刪除／隱藏');
    newPost();
  }

  function exportFile() {
    // 匯出 = 合併後的正式清單（排除 published:false）
    var finalPosts = [];
    var map = {};
    seedPosts().forEach(function (p) { map[p.id] = p; });
    customPosts().forEach(function (p) {
      if (p.published === false) { delete map[p.id]; return; }
      map[p.id] = p;
    });
    Object.keys(map).forEach(function (k) { finalPosts.push(map[k]); });
    finalPosts.sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });

    var banner = '/* ============================================================\n' +
      '   新奇美診所 醫美專欄 — 文章資料\n' +
      '   此檔案由後台編輯器（/admin/）匯出產生。\n' +
      '   發佈流程：將本檔案覆蓋網站的 assets/js/posts-data.js 即可更新。\n' +
      '   匯出時間：' + new Date().toLocaleString('zh-TW') + '\n' +
      '   ============================================================ */\n';
    var body = 'window.SCM_POSTS = ' + JSON.stringify(finalPosts, null, 2) + ';\n';
    var blob = new Blob([banner + body], { type: 'text/javascript;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'posts-data.js';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 100);
    toast('已下載 posts-data.js，覆蓋網站檔案即完成發佈');
  }

  // ---------- Toolbar ----------
  $('toolbar').addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn || sourceMode && btn.id !== 'btn-source') return;
    var cmd = btn.getAttribute('data-cmd');
    if (cmd) {
      editor.focus();
      var val = btn.getAttribute('data-val') || null;
      document.execCommand(cmd, false, val);
      return;
    }
    if (btn.id === 'btn-link') {
      editor.focus();
      var url = prompt('請輸入連結網址：', 'https://');
      if (url && url !== 'https://') document.execCommand('createLink', false, url);
    }
    if (btn.id === 'btn-image') {
      editor.focus();
      var img = prompt('請輸入圖片網址（建議先將圖片上傳至圖床或網站空間）：', 'https://');
      if (img && img !== 'https://') document.execCommand('insertImage', false, img);
    }
    if (btn.id === 'btn-source') {
      sourceMode = !sourceMode;
      if (sourceMode) { syncToSource(); editor.style.display = 'none'; source.style.display = 'block'; }
      else { syncFromSource(); source.style.display = 'none'; editor.style.display = 'block'; }
      btn.style.background = sourceMode ? 'var(--ink)' : '';
      btn.style.color = sourceMode ? '#fff' : '';
    }
  });

  // ---------- Events ----------
  listEl.addEventListener('click', function (e) {
    var li = e.target.closest('li[data-id]');
    if (li) loadPost(li.getAttribute('data-id'));
  });
  $('btn-new').addEventListener('click', newPost);
  $('btn-save').addEventListener('click', savePost);
  $('btn-delete').addEventListener('click', deletePost);
  $('btn-export').addEventListener('click', exportFile);
  $('btn-preview').addEventListener('click', function () {
    if (currentId) window.open('../blog/post.html?id=' + encodeURIComponent(currentId), '_blank');
    else window.open('../blog/index.html', '_blank');
  });

  // Ctrl/Cmd+S 儲存
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); savePost(); }
  });

  // init
  newPost();
  renderList();
})();
