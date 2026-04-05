(function(App) {
  // 将全局函数挂载到 window 对象，以便 HTML 中的 onclick 事件调用
  window.startGame = App.startGame;
  window.submitAnswer = App.submitAnswer;
  window.revealAll = App.revealAll;
  window.resetOrder = App.resetOrder;
  window.selectDifficulty = (el, diff) => App.selectDifficulty(el, diff);
  window.switchLbTab = (el, diff) => App.switchLbTab(el, diff);
  window.clearLeaderboard = App.clearLeaderboard;
  window.showHome = App.showHome;
  window.showLeaderboard = App.showLeaderboard;
  window.closeModal = App.closeVictoryModal;
  window.toggleMenu = App.toggleMenu;
  window.sortOldestFirst = App.sortOldestFirst;
  window.sortNewestFirst = App.sortNewestFirst;
  window.setAnimationSpeed = App.setAnimationSpeed;
  App.perf = App.perf || { metrics: [], longTasks: [] };
  if (!App.perf._observerInit) {
    App.perf._observerInit = true;
    try {
      if (typeof PerformanceObserver === 'function') {
        const obs = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          for (const e of entries) {
            App.perf.longTasks.push({ ts: Date.now(), duration: e.duration });
          }
          if (App.perf.longTasks.length > 50) App.perf.longTasks.splice(0, App.perf.longTasks.length - 50);
        });
        obs.observe({ entryTypes: ['longtask'] });
        App.perf._longTaskObserver = obs;
      }
    } catch (_) {}
  }

  App.setEasterEggMode = function(enabled, source) {
    const next = !!enabled;
    if (App.state.easterEggMode === next) return;

    const perfStart = (typeof performance !== 'undefined' && typeof performance.now === 'function') ? performance.now() : Date.now();
    App.state.easterEggMode = next;
    if (next) {
      document.body.classList.add('easter-egg-mode');
      console.log(
        `[%cEasterEgg%c] 彩蛋模式激活 (${source || 'unknown'}) - ${new Date().toLocaleTimeString()}`,
        "color: #6B8EAD; font-weight: bold",
        "color: inherit"
      );
    } else {
      document.body.classList.remove('easter-egg-mode');
      console.log(
        `[%cEasterEgg%c] 彩蛋模式退出 (${source || 'unknown'}) - ${new Date().toLocaleTimeString()}`,
        "color: #E9967A; font-weight: bold",
        "color: inherit"
      );
    }

    App.renderDynamicButtons();

    const sample = (label) => {
      let debug = false;
      try {
        debug = localStorage.getItem('perf_debug') === '1';
      } catch (_) {}
      const targetFrames = debug ? 32 : 12;
      let frames = 0;
      let last = 0;
      let worst = 0;
      let sum = 0;
      let msToPaint = null;
      const step = (t) => {
        if (frames === 0) {
          msToPaint = Math.max(0, t - perfStart);
          last = t;
          frames++;
          requestAnimationFrame(step);
          return;
        }
        const dt = t - last;
        last = t;
        sum += dt;
        if (dt > worst) worst = dt;
        frames++;
        if (frames < targetFrames) {
          requestAnimationFrame(step);
          return;
        }
        const avgFps = sum > 0 ? Math.round(((frames - 1) / (sum / 1000)) * 10) / 10 : 60;
        const worstFps = worst > 0 ? Math.round((1000 / worst) * 10) / 10 : 60;
        const metric = { ts: Date.now(), label, ms: msToPaint, msToPaint, avgFps, worstFps, frames: targetFrames };
        App.perf.metrics.push(metric);
        if (App.perf.metrics.length > 50) App.perf.metrics.splice(0, App.perf.metrics.length - 50);
        window.dispatchEvent(new CustomEvent('perf-metrics', { detail: metric }));
        try {
          if (localStorage.getItem('perf_debug') === '1') {
            console.log(`[Perf] ${label}: paint=${Math.round(msToPaint)}ms, avgFPS=${avgFps}, worstFPS=${worstFps}`);
          }
        } catch (_) {}
      };
      requestAnimationFrame(() => requestAnimationFrame(step));
    };

    sample(next ? 'easter-egg-enter' : 'easter-egg-exit');
  };

  App.toggleEasterEgg = function(source) {
    App.setEasterEggMode(!App.state.easterEggMode, source || 'toggle');
  };

  App.runEasterEggRoundTripTest = function(times) {
    const n = Math.max(1, Math.min(50, Number(times) || 10));
    const results = [];
    const readMem = () => {
      try {
        if (performance && performance.memory && typeof performance.memory.usedJSHeapSize === 'number') {
          return performance.memory.usedJSHeapSize;
        }
      } catch (_) {}
      return null;
    };
    const waitPaint = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    const runOne = async (i) => {
      const mem0 = readMem();
      const t0 = (typeof performance !== 'undefined' && typeof performance.now === 'function') ? performance.now() : Date.now();
      try {
        if (typeof App.showHome === 'function') App.showHome();
        if (typeof App.setEasterEggMode === 'function') App.setEasterEggMode(true, `rt-${i}-enter`);
        await waitPaint();
        if (typeof App.setEasterEggMode === 'function') App.setEasterEggMode(false, `rt-${i}-exit`);
        await waitPaint();
        if (typeof App.startGame === 'function') App.startGame();
        await waitPaint();
        if (typeof App.showHome === 'function') App.showHome();
      } catch (e) {
        console.error('[RoundTripTest] crash', e && e.stack ? e.stack : e);
        return { ok: false, i, err: String(e && e.message ? e.message : e) };
      }
      const t1 = (typeof performance !== 'undefined' && typeof performance.now === 'function') ? performance.now() : Date.now();
      const mem1 = readMem();
      const ok = !(App.state && App.state.easterEggMode);
      return { ok, i, ms: Math.round(t1 - t0), mem0, mem1 };
    };

    (async () => {
      for (let i = 1; i <= n; i++) {
        const r = await runOne(i);
        results.push(r);
        console.log('[RoundTripTest]', r);
      }
      App.perf = App.perf || {};
      App.perf.roundTrip = results;
      const okCount = results.filter(r => r && r.ok).length;
      console.log(`[RoundTripTest] done: ${okCount}/${results.length} ok`);
    })();
  };

  App.runDifficultyButtonE2ETest = function(times) {
    // 自动化回归：验证“主菜单难度按钮”在首次加载 & 彩蛋往返后，结构/样式/交互一致且无重复绑定痕迹。
    const n = Math.max(1, Math.min(50, Number(times) || 10));
    const waitPaint = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    const snap = () => {
      const grid = document.querySelector('.difficulty-grid');
      const cards = grid ? Array.from(grid.querySelectorAll('.diff-card')) : [];
      return {
        ok: !!grid && cards.length === 3,
        cards: cards.map((c) => ({
          diff: c.dataset ? c.dataset.diff : null,
          selected: c.classList.contains('selected'),
          label: (c.querySelector('.diff-label') ? c.querySelector('.diff-label').textContent : '').trim(),
          name: (c.querySelector('.diff-name') ? c.querySelector('.diff-name').textContent : '').trim(),
          desc: (c.querySelector('.diff-desc') ? c.querySelector('.diff-desc').textContent : '').trim(),
          badge: (c.querySelector('.diff-badge') ? c.querySelector('.diff-badge').textContent : '').trim()
        })),
        previewIcons: grid ? grid.querySelectorAll('.option-preview-icon').length : 0
      };
    };

    const sameShape = (a, b) => {
      if (!a || !b) return false;
      if (!a.ok || !b.ok) return false;
      if (a.cards.length !== b.cards.length) return false;
      if (a.previewIcons !== 3 || b.previewIcons !== 3) return false;
      for (let i = 0; i < a.cards.length; i++) {
        const x = a.cards[i];
        const y = b.cards[i];
        if (x.diff !== y.diff) return false;
        if (x.label !== y.label) return false;
        if (x.name !== y.name) return false;
        if (x.desc !== y.desc) return false;
        if (x.badge !== y.badge) return false;
      }
      return true;
    };

    const clickDiff = async (diff) => {
      const grid = document.querySelector('.difficulty-grid');
      if (!grid) return false;
      const card = grid.querySelector(`.diff-card[data-diff="${diff}"]`);
      if (!card) return false;
      card.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      await waitPaint();
      return !!(window.GameApp && window.GameApp.state && window.GameApp.state.difficulty === diff && card.classList.contains('selected'));
    };

    (async () => {
      const baseline = snap();
      console.log('[DiffE2E] baseline', baseline);
      if (!baseline.ok) {
        console.error('[DiffE2E] baseline invalid');
        return;
      }

      const results = [];
      for (let i = 1; i <= n; i++) {
        try {
          if (typeof App.showHome === 'function') App.showHome();
          if (typeof App.setEasterEggMode === 'function') App.setEasterEggMode(true, `diff-${i}-enter`);
          await waitPaint();
          if (typeof App.setEasterEggMode === 'function') App.setEasterEggMode(false, `diff-${i}-exit`);
          if (typeof App.showHome === 'function') App.showHome();
          await waitPaint();

          const after = snap();
          const shapeOk = sameShape(baseline, after);
          const clickOk = (await clickDiff('medium')) && (await clickDiff('hard')) && (await clickDiff('easy'));
          const ok = shapeOk && clickOk && !(App.state && App.state.easterEggMode);
          const r = { i, ok, shapeOk, clickOk };
          results.push(r);
          console.log('[DiffE2E]', r);
        } catch (e) {
          console.error('[DiffE2E] crash', e && e.stack ? e.stack : e);
          results.push({ i, ok: false, err: String(e && e.message ? e.message : e) });
        }
      }
      App.perf = App.perf || {};
      App.perf.diffE2E = results;
      const okCount = results.filter(r => r && r.ok).length;
      console.log(`[DiffE2E] done: ${okCount}/${results.length} ok`);
    })();
  };

  App.runCategoryFilterE2ETest = function(times) {
    const n = Math.max(1, Math.min(30, Number(times) || 10));
    const waitPaint = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const uniqCategories = () => {
      const db = Array.isArray(App.NEWS_DB) ? App.NEWS_DB : [];
      const set = new Set();
      for (const it of db) {
        if (it && it.category) set.add(String(it.category));
      }
      return Array.from(set);
    };
    const pickOneCatWithEnough = () => {
      const cats = uniqCategories();
      const db = Array.isArray(App.NEWS_DB) ? App.NEWS_DB : [];
      const need = App.state && App.state.diffConfig ? App.state.diffConfig[App.state.difficulty] : 5;
      for (const c of cats) {
        const cnt = db.filter(it => it && String(it.category) === c).length;
        if (cnt >= need) return c;
      }
      return cats[0] || null;
    };

    (async () => {
      const results = [];
      for (let i = 1; i <= n; i++) {
        try {
          if (typeof App.showHome === 'function') App.showHome();
          await waitPaint();
          const cat = pickOneCatWithEnough();
          if (!cat) throw new Error('no category available');
          App.state.selectedCategories = [cat];
          if (typeof App.initCategorySelector === 'function') App.initCategorySelector();
          await waitPaint();

          if (typeof App.startGame === 'function') App.startGame();
          await waitPaint();
          const cards = Array.isArray(App.currentCards) ? App.currentCards : [];
          const okFilter = cards.length > 0 && cards.every(it => it && String(it.category) === cat);

          if (typeof App.setEasterEggMode === 'function') App.setEasterEggMode(true, `cat-${i}-enter`);
          await waitPaint();
          if (typeof App.setEasterEggMode === 'function') App.setEasterEggMode(false, `cat-${i}-exit`);
          if (typeof App.showHome === 'function') App.showHome();
          await waitPaint();

          if (typeof App.startGame === 'function') App.startGame();
          await waitPaint();
          const cards2 = Array.isArray(App.currentCards) ? App.currentCards : [];
          const okFilter2 = cards2.length > 0 && cards2.every(it => it && String(it.category) === cat);

          const ok = okFilter && okFilter2 && !(App.state && App.state.easterEggMode);
          const r = { i, ok, cat, okFilter, okFilter2 };
          results.push(r);
          console.log('[CatE2E]', r);
        } catch (e) {
          console.error('[CatE2E] crash', e && e.stack ? e.stack : e);
          results.push({ i, ok: false, err: String(e && e.message ? e.message : e) });
        }
      }
      App.perf = App.perf || {};
      App.perf.catE2E = results;
      const okCount = results.filter(r => r && r.ok).length;
      console.log(`[CatE2E] done: ${okCount}/${results.length} ok`);
    })();
  };

  App.runGameStartBenchmark = function(times) {
    const n = Math.max(1, Math.min(200, Number(times) || 30));
    const waitPaint = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const results = [];

    const summarize = (arr) => {
      const s = [...arr].sort((a, b) => a - b);
      const pick = (p) => s[Math.min(s.length - 1, Math.max(0, Math.floor(p * (s.length - 1))))];
      const sum = s.reduce((acc, x) => acc + x, 0);
      return {
        n: s.length,
        min: s[0],
        p50: pick(0.5),
        p90: pick(0.9),
        p95: pick(0.95),
        max: s[s.length - 1],
        avg: Math.round(sum / s.length)
      };
    };

    (async () => {
      for (let i = 0; i < n; i++) {
        try {
          if (typeof App.showHome === 'function') App.showHome();
          await waitPaint();
          if (typeof App.startGame === 'function') App.startGame();
          await waitPaint();
          const last = App.perf && Array.isArray(App.perf.gameStart) ? App.perf.gameStart[App.perf.gameStart.length - 1] : null;
          if (last && typeof last.ms === 'number') results.push(last.ms);
        } catch (_) {}
      }
      const summary = results.length ? summarize(results) : null;
      App.perf = App.perf || {};
      App.perf.gameStartBench = { ts: Date.now(), summary, samples: results.slice(-200) };
      console.log('[GameStartBench]', App.perf.gameStartBench);
    })();
  };

  // 安全加固：屏蔽开发者工具相关操作
  window.addEventListener('contextmenu', (e) => {
    if (App.state.easterEggMode) {
      e.preventDefault();
      console.warn('[Security] 彩蛋模式下右键菜单已禁用');
    }
  });

  window.addEventListener('keydown', (e) => {
    // 屏蔽 F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
    if (App.state.easterEggMode) {
      const forbiddenCodes = ['F12', 'KeyI', 'KeyJ', 'KeyC', 'KeyU'];
      if (forbiddenCodes.includes(e.code) && (e.ctrlKey && e.shiftKey || e.code === 'F12' || e.ctrlKey)) {
        e.preventDefault();
        console.error('[Security] 彩蛋模式下开发者工具快捷键已禁用');
      }
    }
  });

  // 移动端触发机制：长按 Logo 2秒
  const logo = document.querySelector('.logo');
  if (logo) {
    let pressTimer;
    const startPress = () => {
      pressTimer = setTimeout(() => {
        App.toggleEasterEgg();
      }, 2000);
    };
    const endPress = () => clearTimeout(pressTimer);
    
    logo.addEventListener('mousedown', startPress);
    logo.addEventListener('mouseup', endPress);
    logo.addEventListener('touchstart', (e) => {
      startPress();
    }, { passive: true });
    logo.addEventListener('touchend', endPress, { passive: true });
  }

  const bg = document.getElementById('scrollBgContainer');
  if (bg) {
    let pressTimer;
    const startPress = () => {
      if (!App.state.easterEggMode) return;
      pressTimer = setTimeout(() => {
        App.toggleEasterEgg();
      }, 2000);
    };
    const endPress = () => clearTimeout(pressTimer);

    bg.addEventListener('mousedown', startPress, true);
    bg.addEventListener('mouseup', endPress, true);
    bg.addEventListener('mouseleave', endPress, true);
    bg.addEventListener('touchstart', startPress, { passive: true, capture: true });
    bg.addEventListener('touchend', endPress, { passive: true, capture: true });
    bg.addEventListener('touchmove', endPress, { passive: true, capture: true });
  }

  // 初始化
  App.initScrollBackground();
  App.initOptionHoverEffects();
  App.initCategorySelector();
  App.initHeadlineTicker();
  try {
    if (localStorage.getItem('e2e_difficulty') === '1') {
      App.runDifficultyButtonE2ETest(10);
    }
    if (localStorage.getItem('e2e_category') === '1') {
      App.runCategoryFilterE2ETest(10);
    }
    if (localStorage.getItem('bench_start') === '1') {
      App.runGameStartBenchmark(30);
    }
  } catch (_) {}
  console.log('游戏初始化完成 (Portable Mode)');
})(window.GameApp);
