window.GameApp = window.GameApp || {};

(function(App) {
  // Linear Icons (2px stroke)
  const ICONS = {
    drag: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>`,
    correct: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    wrong: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
  };
  App.ICONS = ICONS;

  App.anim = App.anim || {
    speed: (App.state && typeof App.state.animationSpeed === 'number') ? App.state.animationSpeed : 1
  };

  App.setAnimationSpeed = function(multiplier) {
    const v = Number(multiplier);
    if (!Number.isFinite(v)) return App.anim.speed;
    const next = Math.max(0, Math.min(3, v));
    App.anim.speed = next;
    if (App.state) App.state.animationSpeed = next;
    window.dispatchEvent(new CustomEvent('animation-speed-change', { detail: { speed: next } }));
    return next;
  };

  const prefersReducedMotion = () => {
    try {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (_) {
      return false;
    }
  };

  const animMs = (base) => {
    const sp = (App.anim && typeof App.anim.speed === 'number') ? App.anim.speed : 1;
    if (prefersReducedMotion() || sp === 0) return 0;
    return Math.max(0, Math.round(base / Math.max(0.01, sp)));
  };

  const animateElement = (el, keyframes, options) => {
    const duration = options && typeof options.duration === 'number' ? options.duration : 0;
    if (!el || duration === 0) return Promise.resolve();
    if (typeof el.animate === 'function') {
      const anim = el.animate(keyframes, options);
      return anim.finished.catch(() => {});
    }
    return new Promise((resolve) => {
      const cleanup = () => {
        el.removeEventListener('transitionend', cleanup);
        resolve();
      };
      el.addEventListener('transitionend', cleanup, { once: true });
      resolve();
    });
  };

  App.animateListReorder = function(listEl, mutator, opts) {
    if (!listEl || typeof mutator !== 'function') return Promise.resolve();
    if (prefersReducedMotion() || (App.anim && App.anim.speed === 0)) {
      mutator();
      return Promise.resolve();
    }

    const selector = opts && opts.selector ? opts.selector : '.news-card';
    const key = opts && opts.key ? opts.key : 'id';
    const getKey = (el) => {
      if (!el) return null;
      if (typeof key === 'function') return key(el);
      if (typeof key === 'string') return el.dataset ? el.dataset[key] : null;
      return el.dataset ? el.dataset.id : null;
    };

    const before = new Map();
    listEl.querySelectorAll(selector).forEach(el => {
      const k = getKey(el);
      if (k != null) before.set(k, el.getBoundingClientRect());
    });

    mutator();

    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        const after = new Map();
        listEl.querySelectorAll(selector).forEach(el => {
          const k = getKey(el);
          if (k != null) after.set(k, el.getBoundingClientRect());
        });

        const duration = animMs(280);
        const easing = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
        const animations = [];

        listEl.querySelectorAll(selector).forEach(el => {
          const k = getKey(el);
          const b = before.get(k);
          const a = after.get(k);
          if (!b || !a) return;
          const dx = b.left - a.left;
          const dy = b.top - a.top;
          if (dx === 0 && dy === 0) return;
          el.style.willChange = 'transform';
          animations.push(
            animateElement(
              el,
              [
                { transform: `translate3d(${dx}px, ${dy}px, 0)` },
                { transform: 'translate3d(0, 0, 0)' }
              ],
              { duration, easing, fill: 'both' }
            ).finally(() => {
              el.style.willChange = '';
            })
          );
        });

        Promise.allSettled(animations).then(() => {
          const detail = { type: 'reorder', source: opts && opts.source ? opts.source : 'unknown', count: animations.length };
          window.dispatchEvent(new CustomEvent('card-animation-batch-end', { detail }));
          if (opts && typeof opts.onComplete === 'function') opts.onComplete(detail);
          resolve(detail);
        });
      });
    });
  };

  App.animateCardEnter = function(cardEls, opts) {
    const cards = Array.from(cardEls || []).filter(Boolean);
    const duration = animMs(360);
    if (duration === 0 || cards.length === 0) return Promise.resolve();
    const easing = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
    const stagger = Math.max(0, Math.round(18 / Math.max(0.01, (App.anim && App.anim.speed) ? App.anim.speed : 1)));

    const animations = cards.map((el, i) => {
      el.style.willChange = 'transform, opacity';
      return animateElement(
        el,
        [
          { opacity: 0, transform: 'translate3d(0, 12px, 0) scale(0.98)' },
          { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' }
        ],
        { duration, easing, fill: 'both', delay: i * stagger }
      ).finally(() => {
        el.style.willChange = '';
      });
    });

    return Promise.allSettled(animations).then(() => {
      const detail = { type: 'enter', source: opts && opts.source ? opts.source : 'unknown', count: cards.length };
      window.dispatchEvent(new CustomEvent('card-animation-batch-end', { detail }));
      if (opts && typeof opts.onComplete === 'function') opts.onComplete(detail);
      return detail;
    });
  };

  App.animateCardStatus = function(cardEl, kind, opts) {
    const duration = animMs(320);
    if (!cardEl || duration === 0) return Promise.resolve();
    const easing = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
    cardEl.style.willChange = 'transform, filter';

    let frames;
    if (kind === 'correct') {
      frames = [
        { transform: 'translate3d(0,0,0) scale(1)', filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))' },
        { transform: 'translate3d(0,0,0) scale(1.03)', filter: 'drop-shadow(0 10px 18px rgba(168, 213, 186, 0.65))' },
        { transform: 'translate3d(0,0,0) scale(1)', filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))' }
      ];
    } else {
      frames = [
        { transform: 'translate3d(0,0,0) translateX(0)', filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))' },
        { transform: 'translate3d(0,0,0) translateX(-6px)', filter: 'drop-shadow(0 10px 18px rgba(233, 150, 122, 0.55))' },
        { transform: 'translate3d(0,0,0) translateX(6px)', filter: 'drop-shadow(0 10px 18px rgba(233, 150, 122, 0.55))' },
        { transform: 'translate3d(0,0,0) translateX(0)', filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))' }
      ];
    }

    return animateElement(cardEl, frames, { duration, easing, fill: 'both' }).finally(() => {
      cardEl.style.willChange = '';
      const detail = { type: 'status', kind, id: cardEl.dataset && cardEl.dataset.id ? Number(cardEl.dataset.id) : null };
      window.dispatchEvent(new CustomEvent('card-animation-end', { detail }));
      if (opts && typeof opts.onComplete === 'function') opts.onComplete(detail);
    });
  };

  /**
   * 切换屏幕显示
   */
  App.showScreen = function(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
  };

  /**
   * 渲染新闻卡片列表
   */
  App.renderCards = function(cards, eventHandlers) {
    const list = document.getElementById('timelineList');
    list.innerHTML = '';

    cards.forEach((card, i) => {
      const li = document.createElement('li');
      li.className = 'news-card';
      li.draggable = true;
      li.dataset.id = card.id;

      li.innerHTML = `
        <div class="card-number" aria-hidden="true">${i + 1}</div>
        <span class="card-drag-handle" title="拖动排序" aria-label="拖动排序">${ICONS.drag}</span>
        <div class="card-status-icon" id="status-${card.id}" aria-live="polite"></div>
        <div class="card-category cat-${card.category}">${card.catLabel}</div>
        <div class="card-title">${card.title}</div>
        <div class="card-desc">${card.desc}</div>
        <div class="card-date-hint" id="hint-${card.id}">📅 正确时间：${App.formatDate(card.date)}</div>
        <div class="card-hover-preview" style="background-image: url(${card.image || ''})"></div>
      `;

      // 绑定事件
      if (eventHandlers) {
        li.addEventListener('dragstart', eventHandlers.onDragStart);
        li.addEventListener('dragend', eventHandlers.onDragEnd);
        li.addEventListener('dragover', eventHandlers.onDragOver);
        li.addEventListener('dragleave', eventHandlers.onDragLeave);
        li.addEventListener('drop', eventHandlers.onDrop);
        li.addEventListener('touchstart', eventHandlers.onTouchStart, { passive: true });
        li.addEventListener('touchmove', eventHandlers.onTouchMove, { passive: false });
        li.addEventListener('touchend', eventHandlers.onTouchEnd);
      }

      list.appendChild(li);
    });

    App.animateCardEnter(list.querySelectorAll('.news-card'), { source: 'render' });
  };

  /**
   * 更新所有卡片的序号显示
   */
  App.updateCardNumbers = function() {
    document.querySelectorAll('.news-card').forEach((card, i) => {
      card.querySelector('.card-number').textContent = i + 1;
    });
  };

  /**
   * 更新计时器显示
   */
  App.updateTimerUI = function(seconds) {
    const str = App.formatTime(seconds);
    document.getElementById('timerDisplay').textContent = str;
    document.getElementById('gameTimer').textContent = str;
  };

  /**
   * 渲染排行榜
   */
  App.renderLeaderboardUI = function(diff) {
    App.state.lbTab = diff;
    const lb = App.getLeaderboard(diff);
    const body = document.getElementById('lbBody');

    if (lb.length === 0) {
      body.innerHTML = `<tr><td colspan="6" class="lb-empty">暂无记录 · 开始游戏创造历史！</td></tr>`;
      return;
    }

    const catLabelMap = new Map();
    if (Array.isArray(App.NEWS_DB)) {
      for (const it of App.NEWS_DB) {
        if (!it || !it.category) continue;
        const k = String(it.category);
        if (!catLabelMap.has(k)) catLabelMap.set(k, String(it.catLabel || it.category));
      }
    }

    body.innerHTML = lb.map((entry, i) => {
      const cats = Array.isArray(entry.categories) ? entry.categories.map(s => String(s)) : [];
      const labels = Array.isArray(entry.catLabels) && entry.catLabels.length
        ? entry.catLabels.map(s => String(s))
        : cats.map(k => catLabelMap.get(k) || k);
      const short = labels.length ? (labels.slice(0, 2).join('、') + (labels.length > 2 ? ` 等${labels.length}类` : '')) : '—';
      const payload = encodeURIComponent(JSON.stringify(labels));
      return `
      <tr>
        <td><span class="lb-rank">${['🥇','🥈','🥉'][i] || (i+1)}</span></td>
        <td class="lb-score">${entry.score}</td>
        <td>${entry.accuracy}%</td>
        <td class="lb-mono">${App.formatTime(entry.seconds)}</td>
        <td><button class="lb-cat-btn" type="button" data-cats="${payload}" title="${short}">${short}</button></td>
        <td class="lb-date">${entry.date}</td>
      </tr>
    `;
    }).join('');

    if (body.dataset.catBound !== '1') {
      body.dataset.catBound = '1';
      body.addEventListener('click', (e) => {
        const btn = e.target && e.target.closest ? e.target.closest('.lb-cat-btn') : null;
        if (!btn) return;
        const raw = btn.dataset ? btn.dataset.cats : null;
        if (!raw) return;
        try {
          const labels = JSON.parse(decodeURIComponent(raw));
          const text = Array.isArray(labels) && labels.length ? labels.join('、') : '无';
          alert(`该玩家本局选择的类别：\n${text}`);
        } catch (_) {}
      }, true);
    }
  };

  /**
   * 显示结算弹窗
   */
  App.showVictoryModal = function(accuracy, timeStr, score, difficulty) {
    const icon = accuracy === 100 ? '🏆' : accuracy >= 80 ? '🥇' : accuracy >= 60 ? '🥈' : '🥉';
    const title = accuracy === 100 ? '完美排列！' : accuracy >= 80 ? '优秀！' : accuracy >= 60 ? '还不错！' : '继续加油！';

    document.getElementById('modalIcon').textContent = icon;
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalSubtitle').textContent =
      `你对历史新闻的掌握程度${accuracy === 100 ? '无懈可击' : '颇有了解'}！` +
      `成绩已保存至排行榜。`;
    document.getElementById('modalAccuracy').textContent = accuracy + '%';
    document.getElementById('modalTime').textContent = timeStr;
    document.getElementById('modalScore').textContent = score;
    document.getElementById('modalDiff').textContent = App.state.diffLabels[difficulty];

    document.getElementById('victoryModal').classList.add('show');
  };

  /**
   * 清除所有卡片的验证状态样式
   */
  App.clearValidationUI = function() {
    document.querySelectorAll('.news-card').forEach(c => {
      c.classList.remove('correct', 'wrong');
      c.querySelector('.card-status-icon').innerHTML = '';
      c.querySelector('.card-date-hint').classList.remove('show');
    });
  };

  /**
   * 设置卡片验证状态
   */
  App.setCardStatusUI = function(cardEl, isCorrect, options) {
    const opts = options || {};
    const statusIcon = cardEl.querySelector('.card-status-icon');
    cardEl.classList.remove('correct', 'wrong');
    if (isCorrect) {
      cardEl.classList.add('correct');
      statusIcon.innerHTML = ICONS.correct;
      if (opts.animate !== false) App.animateCardStatus(cardEl, 'correct', opts);
    } else {
      cardEl.classList.add('wrong');
      statusIcon.innerHTML = ICONS.wrong;
      if (opts.showHint !== false) cardEl.querySelector('.card-date-hint').classList.add('show');
      if (opts.animate !== false) App.animateCardStatus(cardEl, 'wrong', opts);
    }
  };

  /**
   * 渲染主页滚动背景
   */
  App.initScrollBackground = function() {
    const container = document.getElementById('scrollBgContainer');
    if (!container) return;
    
    container.innerHTML = '';
    const db = App.NEWS_DB;
    const itemById = new Map(db.map(n => [n.id, n]));
    const rowCount = 5;
    const itemsPerRow = Math.ceil(db.length / rowCount);

    // 初始配置：纯自动无限交错滚动 + UI 状态控制
    let autoScrollOffset = 0;
    let uiScrollY = 0;
    const maxUiScroll = 1200; // 稍大的滚动距离以平滑过渡
    let currentSpeed = 1.2;
    const targetBaseSpeed = 0.85; // 约 70% 速度
    let isFrozen = false;
    let lastClickTime = 0;

    for (let i = 0; i < rowCount; i++) {
      const row = document.createElement('div');
      row.className = 'scroll-row';
      row.dataset.direction = (i % 2 === 0) ? 1 : -1;
      
      const slice = db.slice(i * itemsPerRow, (i + 1) * itemsPerRow);

      for (let rep = 0; rep < 3; rep++) {
        for (let j = 0; j < slice.length; j++) {
          const item = slice[j];
          const card = document.createElement('div');
          card.className = 'bg-photo-card';
          card.dataset.id = item.id;
          card.setAttribute('role', 'button');
          card.setAttribute('aria-label', `查看详情: ${item.title}`);
          card.tabIndex = 0;

          const imgUrl = item.image || `https://picsum.photos/seed/${item.id}/300/400`;
          card.style.backgroundImage = `url(${imgUrl})`;

          card.innerHTML = `
            <div class="bg-photo-details">
              <div class="bg-title">${item.title}</div>
              <div class="bg-desc">${item.desc}</div>
              <div class="bg-meta">📅 ${item.date}</div>
            </div>
          `;

          row.appendChild(card);
        }
      }
      container.appendChild(row);
    }

    // 核心组件引用与性能预存
    const rows = container.querySelectorAll('.scroll-row');
    const rowScrollHeights = Array.from(rows).map(row => row.scrollHeight / 3);
    const rowDirections = Array.from(rows).map(row => parseInt(row.dataset.direction));
    const header = document.querySelector('header');
    const scrollHint = document.getElementById('scrollHint');
    const homeScreen = document.getElementById('home-screen');
    const homeInner = document.querySelector('.home-inner');
    const uiEps = 0.005;
    let lastUiOpacity = -1;
    let lastHeaderPE = '';
    let lastHeaderVis = '';
    let lastInnerPE = '';
    let lastInnerVis = '';
    let lastHintVis = '';
    let lastHintOpacity = -1;
    let lastAtBottom = null;
    let lastBgBlurVal = null;
    let lastInteractable = null;

    /**
     * 统一事件委托处理器
     */
    const handleAction = (e) => {
      const card = e.target.closest('.bg-photo-card');
      if (!card) return;

      const now = Date.now();
      if (now - lastClickTime < 300) return; // 全局防抖

      const id = parseInt(card.dataset.id);
      const item = itemById.get(id);
      if (!item) return;

      e.stopPropagation();
      lastClickTime = now;
      App.showNewsPopup(item);
      card.classList.add('focused-card');
      isFrozen = true;
    };

    // 使用捕获阶段进行委托，确保在复杂层级下也能稳定触发
    container.addEventListener('click', handleAction, true);
    
    // 键盘支持
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleAction(e);
      }
    });

    // 每一帧更新自动滚动和 UI 状态
    const update = () => {
      if (!homeScreen.classList.contains('active')) return;
      
      const isEasterEgg = App.state.easterEggMode;
      if (!isEasterEgg && App._homeUiScrollReset) {
        App._homeUiScrollReset = false;
        uiScrollY = 0;
        isFrozen = false;
        lastUiOpacity = -1;
        lastHeaderPE = '';
        lastHeaderVis = '';
        lastInnerPE = '';
        lastInnerVis = '';
        lastHintVis = '';
        lastHintOpacity = -1;
        lastAtBottom = null;
        lastBgBlurVal = null;
        lastInteractable = null;
      }

      // 1. 速度平滑过渡 (平滑减速到 70%)
      if (currentSpeed > targetBaseSpeed) {
        currentSpeed -= (1.2 - targetBaseSpeed) / (60 * 0.4); 
        if (currentSpeed < targetBaseSpeed) currentSpeed = targetBaseSpeed;
      }

      // 2. 更新自动滚动偏移 (独立于用户输入)
      if (!isFrozen) {
        autoScrollOffset += currentSpeed;
      }
      
      // 3. 动态视觉层级计算 (透明度与高斯模糊)
      const scrollRatio = isEasterEgg ? 1 : (uiScrollY / maxUiScroll);
      const uiOpacity = isEasterEgg ? 0 : Math.max(0, 1 - scrollRatio);
      if (Math.abs(uiOpacity - lastUiOpacity) > uiEps) {
        if (header) header.style.opacity = uiOpacity;
        if (homeInner) homeInner.style.opacity = uiOpacity;
        if (scrollHint) scrollHint.style.opacity = isEasterEgg ? 0 : uiOpacity;
        lastUiOpacity = uiOpacity;
      } else if (scrollHint && lastHintOpacity !== (isEasterEgg ? 0 : uiOpacity)) {
        scrollHint.style.opacity = isEasterEgg ? 0 : uiOpacity;
        lastHintOpacity = isEasterEgg ? 0 : uiOpacity;
      }

      const headerPE = (uiOpacity < 0.1 || isEasterEgg) ? 'none' : 'auto';
      const headerVis = (uiOpacity < 0.01 || isEasterEgg) ? 'hidden' : 'visible';
      if (header) {
        if (headerPE !== lastHeaderPE) header.style.pointerEvents = headerPE;
        if (headerVis !== lastHeaderVis) header.style.visibility = headerVis;
      }
      lastHeaderPE = headerPE;
      lastHeaderVis = headerVis;

      const innerPE = (uiOpacity < 0.1 || isEasterEgg) ? 'none' : 'auto';
      const innerVis = (uiOpacity < 0.01 || isEasterEgg) ? 'hidden' : 'visible';
      if (homeInner) {
        if (innerPE !== lastInnerPE) homeInner.style.pointerEvents = innerPE;
        if (innerVis !== lastInnerVis) homeInner.style.visibility = innerVis;
      }
      lastInnerPE = innerPE;
      lastInnerVis = innerVis;

      if (scrollHint) {
        const hintVis = (uiOpacity < 0.01 || isEasterEgg) ? 'hidden' : 'visible';
        if (hintVis !== lastHintVis) scrollHint.style.visibility = hintVis;
        lastHintVis = hintVis;
      }

      // 底部交互触发状态
      const atBottom = scrollRatio > 0.95 || isEasterEgg;
      if (atBottom !== lastAtBottom) {
        if (atBottom) container.classList.add('at-bottom');
        else container.classList.remove('at-bottom');
        lastAtBottom = atBottom;
      }

      // 4. 应用背景变换
      const bgBlurVal = isEasterEgg ? 0 : Math.max(0, 10 * (1 - scrollRatio));
      const interactable = isEasterEgg || scrollRatio > 0.8;

      if (lastBgBlurVal === null || Math.abs(bgBlurVal - lastBgBlurVal) >= 0.25) {
        rows.forEach((row) => {
          row.style.filter = `blur(${bgBlurVal}px)`;
        });
        lastBgBlurVal = bgBlurVal;
      }

      if (interactable !== lastInteractable) {
        rows.forEach((row) => {
          if (interactable) row.classList.add('row-interactable');
          else row.classList.remove('row-interactable');
        });
        lastInteractable = interactable;
      }

      rows.forEach((row, rowIndex) => {
        const dir = rowDirections[rowIndex];
        const h = rowScrollHeights[rowIndex];
        const yPos = dir === 1 ? ((autoScrollOffset % h) - h) : (-(autoScrollOffset % h));
        row.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    };

    // 仅监听滚动来控制 UI 显隐，不再触发背景位移
    window.addEventListener('wheel', (e) => {
      uiScrollY = Math.max(0, Math.min(maxUiScroll, uiScrollY + e.deltaY));
      const enterThreshold = maxUiScroll * 0.98;
      if (!App.state.easterEggMode && e.deltaY > 0 && uiScrollY >= enterThreshold) {
        if (typeof App.setEasterEggMode === 'function') App.setEasterEggMode(true, 'scroll-bottom');
        else if (typeof App.toggleEasterEgg === 'function') App.toggleEasterEgg('scroll-bottom');
      }
      if (App.state.easterEggMode && e.deltaY < 0) {
        if (typeof App.setEasterEggMode === 'function') App.setEasterEggMode(false, 'scroll-up');
        else if (typeof App.toggleEasterEgg === 'function') App.toggleEasterEgg('scroll-up');
      }
    }, { passive: true });

    let lastTouchY = null;
    const onTouchStart = (e) => {
      if (!homeScreen.classList.contains('active')) return;
      const t = e.touches && e.touches[0];
      if (!t) return;
      lastTouchY = t.clientY;
    };
    const onTouchMove = (e) => {
      if (!homeScreen.classList.contains('active')) return;
      const t = e.touches && e.touches[0];
      if (!t || lastTouchY === null) return;
      const delta = lastTouchY - t.clientY;
      lastTouchY = t.clientY;

      uiScrollY = Math.max(0, Math.min(maxUiScroll, uiScrollY + delta));

      const enterThreshold = maxUiScroll * 0.98;
      if (!App.state.easterEggMode && delta > 0 && uiScrollY >= enterThreshold) {
        if (typeof App.setEasterEggMode === 'function') App.setEasterEggMode(true, 'touch-bottom');
        else if (typeof App.toggleEasterEgg === 'function') App.toggleEasterEgg('touch-bottom');
      }
      if (App.state.easterEggMode && delta < 0) {
        if (typeof App.setEasterEggMode === 'function') App.setEasterEggMode(false, 'touch-up');
        else if (typeof App.toggleEasterEgg === 'function') App.toggleEasterEgg('touch-up');
      }
    };
    const onTouchEnd = () => {
      lastTouchY = null;
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    // 弹窗关闭监听
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') App.closeNewsPopup();
    });

    // 动画循环
    const animate = () => {
      update();
      if (homeScreen.classList.contains('active')) {
        requestAnimationFrame(animate);
        return;
      }
      setTimeout(() => requestAnimationFrame(animate), 200);
    };
    
    animate();

    // 绑定外部关闭方法
    App.resumeAutoScroll = () => isFrozen = false;

    // 初始渲染动态按钮
    App.renderDynamicButtons();
  };

  App.initHeadlineTicker = function(lines) {
    const ticker = document.getElementById('headlineTicker');
    const homeScreen = document.getElementById('home-screen');
    if (!ticker || !homeScreen) return;

    const line = document.querySelector('#headlineLine');
    const span = document.querySelector('#headlineLine span');
    if (!line || !span) return;

    const strip = (s) => String(s || '').replace(/^\s*\d+\s*[、.．]\s*/, '').trim();
    const src = Array.isArray(lines) ? lines : (App.TEXT && Array.isArray(App.TEXT.headlineTickerLines) ? App.TEXT.headlineTickerLines : []);
    const clean = src.map(strip).filter(Boolean);
    if (clean.length === 0) return;

    let idx = 0;
    span.textContent = clean[idx % clean.length];

    const tick = () => {
      if (!homeScreen.classList.contains('active')) {
        App._headlineTickerTimer = setTimeout(tick, 400);
        return;
      }
      if (App.state && App.state.easterEggMode) {
        App._headlineTickerTimer = setTimeout(tick, 600);
        return;
      }
      if (clean.length === 1) {
        App._headlineTickerTimer = setTimeout(tick, 2000);
        return;
      }

      line.classList.remove('animating-in');
      line.classList.add('animating-out');
      const onOutEnd = () => {
        idx = (idx + 1) % clean.length;
        span.textContent = clean[idx];

        line.classList.remove('animating-out');
        line.style.transition = 'none';
        line.style.transform = 'translateY(44px)';
        line.style.opacity = '0';
        requestAnimationFrame(() => {
          line.style.transition = '';
          line.classList.add('animating-in');
          line.style.transform = '';
          line.style.opacity = '';
        });

        App._headlineTickerTimer = setTimeout(tick, 2600);
      };
      line.addEventListener('transitionend', onOutEnd, { once: true });
    };

    if (App._headlineTickerTimer) clearTimeout(App._headlineTickerTimer);
    App._headlineTickerTimer = setTimeout(tick, 1200);
  };

  /**
   * 动态渲染核心按钮 (安全加固 V2)
   */
  App.renderDynamicButtons = function() {
    const isEasterEgg = App.state.easterEggMode;
    const headerActions = document.getElementById('headerActions');
    const homeActions = document.getElementById('homeActions');
    const diffGrid = document.querySelector('.difficulty-grid');
    const bgContainer = document.getElementById('scrollBgContainer');

    if (!headerActions || !homeActions) return;
    if (diffGrid && !App._diffGridTemplate) {
      // 修复要点：缓存“首次加载”的难度区 DOM 结构，用于彩蛋退出后进行无损恢复
      App._diffGridTemplate = diffGrid.innerHTML;
    }

    if (isEasterEgg) {
      // 检查是否已经处于彩蛋模式，避免重复触发回调
      if (!App._lastEasterEggState) {
        App.onEasterEggEnter();
        App._lastEasterEggState = true;
      }
      
      if (!App._easterEggDomPurged) {
        App._easterEggDomPurged = true;
        App._easterEggPurgeToken = (App._easterEggPurgeToken || 0) + 1;
        const token = App._easterEggPurgeToken;
        const purge = () => {
          if (!App.state.easterEggMode) return;
          if (App._easterEggPurgeToken !== token) return;
          headerActions.replaceChildren();
          homeActions.replaceChildren();
          if (diffGrid) diffGrid.replaceChildren();
        };
        requestAnimationFrame(() => {
          if (typeof requestIdleCallback === 'function') {
            const id = requestIdleCallback(purge, { timeout: 200 });
            App._easterEggPurgeHandle = { type: 'idle', id };
          } else {
            const id = setTimeout(purge, 0);
            App._easterEggPurgeHandle = { type: 'timeout', id };
          }
        });
      }

      // 2. 调整背景尺寸为全屏覆盖
      if (bgContainer) {
        bgContainer.classList.add('easter-egg-active');
      }

      if (!App._easterEggSecurityTestScheduled) {
        App._easterEggSecurityTestScheduled = true;
        const schedule = (fn) => {
          if (typeof requestIdleCallback === 'function') requestIdleCallback(fn, { timeout: 800 });
          else setTimeout(fn, 0);
        };
        schedule(() => {
          App._easterEggSecurityTestScheduled = false;
          App.runEasterEggSecurityTest();
        });
      }
      return;
    }

    // --- 退出彩蛋模式回调 ---
    if (App._lastEasterEggState) {
      // 修复要点：退出时取消潜在的“延迟 purge”，避免出现退出后又把主菜单 DOM 清空的竞态
      App._easterEggPurgeToken = (App._easterEggPurgeToken || 0) + 1;
      if (App._easterEggPurgeHandle) {
        const h = App._easterEggPurgeHandle;
        App._easterEggPurgeHandle = null;
        try {
          if (h.type === 'idle' && typeof cancelIdleCallback === 'function') cancelIdleCallback(h.id);
          if (h.type === 'timeout') clearTimeout(h.id);
        } catch (_) {}
      }
      App.onEasterEggExit();
      App._lastEasterEggState = false;
      App._easterEggDomPurged = false;
      if (bgContainer) {
        bgContainer.classList.remove('easter-egg-active');
      }
    }

    // 2. 正常模式：动态注入按钮
    // (此处保持原有的注入逻辑，确保布局还原)
    // --- Header ---
    // 修复要点：彩蛋模式会物理清空 headerActions（包含 timerDisplay）。
    // 这里统一“先恢复 timerDisplay，再注入按钮”，并避免重复注入导致 DOM/样式异常。
    let timer = document.getElementById('timerDisplay');
    if (!timer) {
      timer = document.createElement('div');
      timer.className = 'timer-display';
      timer.id = 'timerDisplay';
      timer.textContent = '00:00';
    }
    headerActions.replaceChildren(timer);

    const lbBtnHeader = document.createElement('button');
    lbBtnHeader.className = 'btn btn-outline';
    lbBtnHeader.textContent = '排行榜';
    lbBtnHeader.onclick = () => window.showLeaderboard();
    
    const homeBtnHeader = document.createElement('button');
    homeBtnHeader.className = 'btn btn-outline';
    homeBtnHeader.textContent = '主菜单';
    homeBtnHeader.onclick = () => window.showHome();

    headerActions.appendChild(lbBtnHeader);
    headerActions.appendChild(homeBtnHeader);

    // --- Home ---
    homeActions.replaceChildren();
    const startBtn = document.createElement('button');
    startBtn.className = 'btn btn-gold btn-lg';
    startBtn.innerHTML = '开始游戏 →';
    startBtn.onclick = () => window.startGame();

    const lbBtnHome = document.createElement('button');
    lbBtnHome.className = 'btn btn-outline';
    lbBtnHome.textContent = '查看排行榜';
    lbBtnHome.onclick = () => window.showLeaderboard();

    homeActions.appendChild(startBtn);
    homeActions.appendChild(lbBtnHome);

    // 3. 恢复难度选择器 (如果之前被移除)
    if (diffGrid && diffGrid.children.length === 0) {
      // 修复要点：使用“首次加载时的模板”恢复完整结构，确保样式与功能与初始一致（含 diff-desc/diff-badge）
      if (App._diffGridTemplate) {
        diffGrid.innerHTML = App._diffGridTemplate;
      } else {
        diffGrid.innerHTML = `
          <div class="diff-card" data-diff="easy">
            <div class="diff-label">Level 01</div>
            <div class="diff-name">简单</div>
            <div class="diff-desc">5条新闻<br>适合初次体验</div>
            <div class="diff-badge">5 EVENTS</div>
          </div>
          <div class="diff-card" data-diff="medium">
            <div class="diff-label">Level 02</div>
            <div class="diff-name">中等</div>
            <div class="diff-desc">8条新闻<br>需要一定历史知识</div>
            <div class="diff-badge">8 EVENTS</div>
          </div>
          <div class="diff-card" data-diff="hard">
            <div class="diff-label">Level 03</div>
            <div class="diff-name">困难</div>
            <div class="diff-desc">12条新闻<br>历史达人的考验</div>
            <div class="diff-badge">12 EVENTS</div>
          </div>
        `;
      }
      const diffNow = App.state && App.state.difficulty ? App.state.difficulty : 'easy';
      diffGrid.querySelectorAll('.diff-card').forEach((card) => {
        if (!card.dataset.diff) {
          const name = card.querySelector('.diff-name') ? card.querySelector('.diff-name').textContent : '';
          card.dataset.diff = name === '中等' ? 'medium' : (name === '困难' ? 'hard' : 'easy');
        }
        card.classList.toggle('selected', card.dataset.diff === diffNow);
      });
      // 重新绑定悬停预览
      App.initOptionHoverEffects();
    }

    if (typeof App.initCategorySelector === 'function') App.initCategorySelector();

    // 4. 启动 DOM 防篡改监控
    if (!App._observer) {
      App._observer = new MutationObserver((mutations) => {
        if (!App.state.easterEggMode) return;
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType !== 1) continue;
            const el = node;
            if (el.tagName === 'BUTTON' || el.classList.contains('btn') || el.classList.contains('diff-card')) {
              el.remove();
            }
          }
        }
      });
    }
  };

  /**
   * 彩蛋模式安全性自检测试 (自动化校验)
   */
  App.runEasterEggSecurityTest = function() {
    const headerActions = document.getElementById('headerActions');
    const homeActions = document.getElementById('homeActions');
    const diffGrid = document.querySelector('.difficulty-grid');
    const homeInner = document.querySelector('.home-inner');

    const results = {
      headerCleared: !headerActions || headerActions.querySelectorAll('button, .btn').length === 0,
      homeCleared: !homeActions || homeActions.querySelectorAll('button, .btn').length === 0,
      diffCleared: !diffGrid || diffGrid.querySelectorAll('.diff-card').length === 0,
      pointerEventsLocked: homeInner ? getComputedStyle(homeInner).pointerEvents === 'none' : true,
      keyboardFocusSafe: document.activeElement === document.body || document.activeElement === null
    };

    let debug = false;
    try {
      debug = localStorage.getItem('security_debug') === '1';
    } catch (_) {}
    if (debug) {
      console.group('🛡️ 彩蛋模式安全自检报告');
      console.log(`Header 清理: ${results.headerCleared ? '✅ 通过' : '❌ 失败'}`);
      console.log(`Home 清理: ${results.homeCleared ? '✅ 通过' : '❌ 失败'}`);
      console.log(`难度卡清理: ${results.diffCleared ? '✅ 通过' : '❌ 失败'}`);
      console.log(`UI 层事件锁定: ${results.pointerEventsLocked ? '✅ 通过' : '❌ 失败'}`);
      console.log(`键盘焦点安全: ${results.keyboardFocusSafe ? '✅ 通过' : '❌ 失败'}`);
      console.groupEnd();
    }
    window.dispatchEvent(new CustomEvent('easter-egg-security-test', { detail: results }));

    return results;
  };

  /**
   * 彩蛋模式进入事件回调
   */
  App.onEasterEggEnter = function() {
    try {
      if (localStorage.getItem('security_debug') === '1') {
        console.log(`[%cEvent%c] OnEasterEggEnter triggered - UI 已物理销毁，背景已沉浸。`, "color: #6B8EAD; font-weight: bold", "color: inherit");
      }
    } catch (_) {}
    document.body.style.overflow = 'hidden';
    if (!App._observer) {
      App._observer = new MutationObserver((mutations) => {
        if (!App.state.easterEggMode) return;
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType !== 1) continue;
            const el = node;
            if (el.tagName === 'BUTTON' || el.classList.contains('btn') || el.classList.contains('diff-card')) {
              el.remove();
            }
          }
        }
      });
    }
    App._observer.observe(document.body, { childList: true, subtree: true });
    
    // 发出自定义事件，方便测试
    window.dispatchEvent(new CustomEvent('easter-egg-enter', { detail: { timestamp: Date.now() } }));
  };

  /**
   * 彩蛋模式退出事件回调
   */
  App.onEasterEggExit = function() {
    try {
      if (localStorage.getItem('security_debug') === '1') {
        console.log(`[%cEvent%c] OnEasterEggExit triggered - UI 已重新渲染，恢复原有布局。`, "color: #E9967A; font-weight: bold", "color: inherit");
      }
    } catch (_) {}
    document.body.style.overflow = '';
    App._homeUiScrollReset = true;
    if (App._observer) App._observer.disconnect();
    
    // 发出自定义事件，方便测试
    window.dispatchEvent(new CustomEvent('easter-egg-exit', { detail: { timestamp: Date.now() } }));
  };

  /**
    * 显示新闻详情弹窗
    */
   App.showNewsPopup = function(news) {
     let popup = document.getElementById('newsPopup');
     if (!popup) {
       popup = document.createElement('div');
       popup.id = 'newsPopup';
       popup.className = 'news-popup-overlay';
       popup.innerHTML = `
         <div class="news-popup-content">
           <button class="news-popup-close" onclick="GameApp.closeNewsPopup()">×</button>
           <div class="news-popup-image skeleton" id="popupImage"></div>
           <div class="news-popup-body">
             <div class="news-popup-category skeleton" id="popupCat" style="min-width:60px; min-height:20px;"></div>
             <h2 class="news-popup-title skeleton" id="popupTitle" style="min-height:30px;"></h2>
             <div class="news-popup-date skeleton" id="popupDate" style="min-width:100px; min-height:18px; margin-bottom:16px;"></div>
             <p class="news-popup-desc skeleton" id="popupDesc" style="min-height:80px;"></p>
           </div>
         </div>
       `;
       document.body.appendChild(popup);
       
       popup.addEventListener('click', (e) => {
         if (e.target === popup) App.closeNewsPopup();
       });
     }

     // 显示弹窗并开启骨架屏
     popup.classList.add('active');
     const elements = ['popupImage', 'popupCat', 'popupTitle', 'popupDate', 'popupDesc'];
     elements.forEach(id => document.getElementById(id).classList.add('skeleton'));
     document.body.style.overflow = 'hidden';

     // 模拟异步加载
     setTimeout(() => {
       const img = document.getElementById('popupImage');
       img.style.backgroundImage = `url(${news.image})`;
       img.classList.remove('skeleton');

       const cat = document.getElementById('popupCat');
       cat.textContent = news.catLabel;
       cat.classList.remove('skeleton');

       const title = document.getElementById('popupTitle');
       title.textContent = news.title;
       title.classList.remove('skeleton');

       const date = document.getElementById('popupDate');
       date.textContent = news.date;
       date.classList.remove('skeleton');

       const desc = document.getElementById('popupDesc');
       desc.textContent = news.desc;
       desc.classList.remove('skeleton');
     }, 400); // 400ms 模拟加载
   };

  /**
   * 关闭新闻详情弹窗
   */
  App.closeNewsPopup = function() {
    const popup = document.getElementById('newsPopup');
    if (popup) {
      popup.classList.remove('active');
      document.body.style.overflow = '';
      
      // 移除卡片焦点
      document.querySelectorAll('.focused-card').forEach(c => c.classList.remove('focused-card'));
      
      // 恢复滚动
      if (App.resumeAutoScroll) App.resumeAutoScroll();
    }
  };

  /**
   * 初始化交互选项的悬停预览
   */
  App.initOptionHoverEffects = function() {
    const grid = document.querySelector('.difficulty-grid');
    if (!grid) return;

    document.querySelectorAll('.diff-card').forEach((card, idx) => {
      // 修复要点：为难度卡提供稳定标识（data-diff），并统一移除 inline onclick，改由事件委托接管
      // 这样在彩蛋模式“物理清空/恢复 DOM”后，按钮结构与交互都能一致恢复。
      if (card.hasAttribute('onclick')) card.removeAttribute('onclick');
      if (!card.dataset.diff) {
        const name = card.querySelector('.diff-name') ? card.querySelector('.diff-name').textContent : '';
        card.dataset.diff = name === '中等' ? 'medium' : (name === '困难' ? 'hard' : 'easy');
      }
      card.dataset.dragKey = card.dataset.diff || String(idx);
      card.setAttribute('role', 'button');
      if (!card.hasAttribute('tabindex')) card.tabIndex = 0;

      if (!card.querySelector('.option-preview-icon')) {
        const diff = card.querySelector('.diff-name') ? card.querySelector('.diff-name').textContent : '';
        let icon = '🌱';
        if (diff === '中等') icon = '🚀';
        if (diff === '困难') icon = '🔥';

        const preview = document.createElement('div');
        preview.className = 'option-preview-icon';
        preview.textContent = icon;
        card.appendChild(preview);
      }
    });

    if (grid.dataset.diffClickBound !== '1') {
      grid.dataset.diffClickBound = '1';

      const activate = (card) => {
        if (!card) return;
        if (App.state && App.state.easterEggMode) return;
        const diff = card.dataset ? card.dataset.diff : null;
        if (!diff) return;
        if (typeof window.selectDifficulty === 'function') window.selectDifficulty(card, diff);
      };

      grid.addEventListener('click', (e) => {
        const card = e.target && e.target.closest ? e.target.closest('.diff-card') : null;
        if (!card) return;
        activate(card);
      }, true);

      grid.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const card = e.target && e.target.closest ? e.target.closest('.diff-card') : null;
        if (!card) return;
        e.preventDefault();
        activate(card);
      }, true);
    }

    // 修复要点：彻底禁止难度卡的拖拽与拖放（桌面端/移动端）
    if (grid.dataset.dragDisabledBound !== '1') {
      grid.dataset.dragDisabledBound = '1';
      grid.addEventListener('dragstart', (e) => {
        if (e.target && e.target.closest && e.target.closest('.diff-card')) e.preventDefault();
      }, true);
      grid.addEventListener('drop', (e) => {
        if (e.target && e.target.closest && e.target.closest('.diff-card')) e.preventDefault();
      }, true);
    }
  };

  App.initDifficultyDragSort = function() {
    const grid = document.querySelector('.difficulty-grid');
    if (!grid) return;
    if (grid.dataset.dragSortBound === '1') return;
    grid.dataset.dragSortBound = '1';

    let dragging = null;
    let placeholder = null;
    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let offsetX = 0;
    let offsetY = 0;
    let raf = 0;
    let moved = false;
    let lastTargetKey = null;

    const cleanupMoveListeners = () => {
      window.removeEventListener('pointermove', onPointerMove, { capture: true });
      window.removeEventListener('pointerup', onPointerUp, { capture: true });
      window.removeEventListener('pointercancel', onPointerUp, { capture: true });
    };

    const moveDragged = (x, y) => {
      if (!dragging) return;
      dragging.style.transform = `translate3d(${x - offsetX}px, ${y - offsetY}px, 0)`;
    };

    const computeInsertRef = (x, y) => {
      const cards = Array.from(grid.querySelectorAll('.diff-card')).filter(el => el !== dragging && el !== placeholder);
      if (cards.length === 0) return null;

      const scored = cards.map(el => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = x - cx;
        const dy = y - cy;
        return { el, r, cx, cy, d: dx * dx + dy * dy };
      });
      scored.sort((a, b) => a.d - b.d);
      const pick = scored[0];
      const rowNear = Math.abs(y - pick.cy) < pick.r.height * 0.35;
      const after = rowNear ? (x > pick.cx) : (y > pick.cy);
      return after ? pick.el.nextSibling : pick.el;
    };

    const updatePlaceholder = (x, y) => {
      if (!dragging || !placeholder) return;
      const ref = computeInsertRef(x, y);
      const key = ref && ref.dataset ? ref.dataset.dragKey : '__end__';
      if (key === lastTargetKey) return;

      lastTargetKey = key;
      App.animateListReorder(
        grid,
        () => {
          if (ref) grid.insertBefore(placeholder, ref);
          else grid.appendChild(placeholder);
        },
        { source: 'diff-drag-over', selector: '.diff-card:not(.dragging-sort)', key: 'dragKey' }
      );
    };

    const onPointerMove = (e) => {
      if (!dragging) return;
      if (pointerId !== null && e.pointerId !== pointerId) return;
      e.preventDefault();

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!moved && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) moved = true;

      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        moveDragged(e.clientX, e.clientY);
        updatePlaceholder(e.clientX, e.clientY);
      });
    };

    const onPointerUp = (e) => {
      if (!dragging) return;
      if (pointerId !== null && e.pointerId !== pointerId) return;
      e.preventDefault();

      cleanupMoveListeners();
      grid.classList.remove('drag-sorting');

      const dragEl = dragging;
      const ph = placeholder;
      const landingRect = ph && ph.parentNode === grid ? ph.getBoundingClientRect() : null;
      dragging = null;
      placeholder = null;
      pointerId = null;
      lastTargetKey = null;

      if (ph && ph.parentNode === grid) {
        App.animateListReorder(
          grid,
          () => {
            grid.insertBefore(dragEl, ph);
            ph.remove();
          },
          {
            source: 'diff-drop',
            selector: '.diff-card:not(.dragging-sort):not(.diff-placeholder)',
            key: 'dragKey',
            onComplete: () => {
              const order = Array.from(grid.querySelectorAll('.diff-card')).map(el => el.dataset.dragKey);
              window.dispatchEvent(new CustomEvent('difficulty-order-change', { detail: { order } }));
            }
          }
        );
      }

      const finalizeDragEl = () => {
        dragEl.classList.remove('dragging-sort');
        dragEl.style.transition = '';
        dragEl.style.position = '';
        dragEl.style.left = '';
        dragEl.style.top = '';
        dragEl.style.width = '';
        dragEl.style.height = '';
        dragEl.style.margin = '';
        dragEl.style.zIndex = '';
        dragEl.style.pointerEvents = '';
        dragEl.style.transform = '';
      };

      if (landingRect && moved) {
        const duration = animMs(220);
        if (duration === 0) {
          finalizeDragEl();
        } else {
          dragEl.style.transition = `transform ${duration}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
          dragEl.style.transform = `translate3d(${landingRect.left}px, ${landingRect.top}px, 0)`;
          dragEl.addEventListener('transitionend', finalizeDragEl, { once: true });
        }
      } else {
        finalizeDragEl();
      }

      if (!moved) {
        const clickTarget = document.elementFromPoint(e.clientX, e.clientY);
        const card = clickTarget ? clickTarget.closest('.diff-card') : null;
        if (card && typeof window.selectDifficulty === 'function') {
          const diffName = card.querySelector('.diff-name') ? card.querySelector('.diff-name').textContent : '';
          const diffId = diffName === '中等' ? 'medium' : (diffName === '困难' ? 'hard' : 'easy');
          window.selectDifficulty(card, diffId);
        }
      }

      moved = false;
    };

    grid.addEventListener('click', (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    grid.addEventListener('pointerdown', (e) => {
      const card = e.target.closest('.diff-card');
      if (!card) return;
      if (App.state && App.state.easterEggMode) return;
      if (e.button === 2) return;

      e.preventDefault();
      moved = false;
      pointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;

      const r = card.getBoundingClientRect();
      offsetX = startX - r.left;
      offsetY = startY - r.top;

      dragging = card;
      grid.classList.add('drag-sorting');

      placeholder = document.createElement('div');
      placeholder.className = 'diff-card diff-placeholder';
      placeholder.dataset.dragKey = '__placeholder__';
      placeholder.style.width = `${r.width}px`;
      placeholder.style.height = `${r.height}px`;

      grid.insertBefore(placeholder, card.nextSibling);

      card.classList.add('dragging-sort');
      card.style.position = 'fixed';
      card.style.left = '0';
      card.style.top = '0';
      card.style.width = `${r.width}px`;
      card.style.height = `${r.height}px`;
      card.style.margin = '0';
      card.style.zIndex = '4000';
      card.style.pointerEvents = 'none';

      moveDragged(startX, startY);

      window.addEventListener('pointermove', onPointerMove, { passive: false, capture: true });
      window.addEventListener('pointerup', onPointerUp, { passive: false, capture: true });
      window.addEventListener('pointercancel', onPointerUp, { passive: false, capture: true });
    }, { passive: false, capture: true });
  };

})(window.GameApp);
