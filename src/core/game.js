window.GameApp = window.GameApp || {};

(function(App) {
  const denyInEasterEggMode = (action) => {
    if (App.state && App.state.easterEggMode) {
      console.error(`[Security] 拒绝操作：彩蛋模式下无法执行 ${action}。`);
      return true;
    }
    return false;
  };

  /**
   * 停止计时器
   */
  App.stopTimer = function() {
    if (App.state.timerInterval) {
      clearInterval(App.state.timerInterval);
      App.state.timerInterval = null;
    }
  };

  /**
   * 启动计时器
   */
  App.startTimer = function() {
    App.stopTimer();
    App.state.seconds = 0;
    App.updateTimerUI(App.state.seconds);
    App.state.timerInterval = setInterval(() => {
      App.state.seconds++;
      App.updateTimerUI(App.state.seconds);
    }, 1000);
  };

  /**
   * 按最古老排序 (辅助功能)
   */
  App.sortOldestFirst = function() {
    if (denyInEasterEggMode('排序')) return;
    const order = new Map(App.currentCards.map((it, i) => [it, i]));
    App.currentCards.sort((a, b) => {
      if (a.sortDate !== b.sortDate) return a.sortDate - b.sortDate;
      const t = String(a.title || '').localeCompare(String(b.title || ''), 'zh-CN');
      if (t !== 0) return t;
      if (a.id !== b.id) return a.id - b.id;
      return (order.get(a) || 0) - (order.get(b) || 0);
    });
    App.renderCards(App.currentCards, App.getEventHandlers());
    App.updateActiveIndicator('up');
  };

  /**
   * 按最新鲜排序 (辅助功能)
   */
  App.sortNewestFirst = function() {
    if (denyInEasterEggMode('排序')) return;
    const order = new Map(App.currentCards.map((it, i) => [it, i]));
    App.currentCards.sort((a, b) => {
      if (a.sortDate !== b.sortDate) return b.sortDate - a.sortDate;
      const t = String(a.title || '').localeCompare(String(b.title || ''), 'zh-CN');
      if (t !== 0) return t;
      if (a.id !== b.id) return a.id - b.id;
      return (order.get(a) || 0) - (order.get(b) || 0);
    });
    App.renderCards(App.currentCards, App.getEventHandlers());
    App.updateActiveIndicator('down');
  };

  /**
   * 更新指示器高亮状态
   */
  App.updateActiveIndicator = function(dir) {
    document.querySelectorAll('.indicator-arrow').forEach(btn => {
      btn.classList.toggle('active', btn.classList.contains(dir));
    });
  };

  /**
   * 获取拖拽事件处理器
   */
  App.getEventHandlers = function() {
    return {
      onDragStart: App.onDragStart, 
      onDragEnd: App.onDragEnd, 
      onDragOver: App.onDragOver, 
      onDragLeave: App.onDragLeave, 
      onDrop: App.onDrop,
      onTouchStart: App.onTouchStart, 
      onTouchMove: App.onTouchMove, 
      onTouchEnd: App.onTouchEnd
    };
  };

  /**
   * 开始游戏
   */
  App.startGame = function() {
    const perfStart = (typeof performance !== 'undefined' && typeof performance.now === 'function') ? performance.now() : null;
    // 安全校验：彩蛋模式禁止开始游戏
    if (denyInEasterEggMode('开始游戏')) return;
    App.closeVictoryModal();
    
    // 强制重置所有计时器和状态 (Bug 4)
    App.stopTimer();
    App.state.seconds = 0;
    App.state.submitted = false;
    App.state.attempts = 0;
    App.state.lastSubmitTime = 0; // 防作弊冷却
    App.clearValidationUI();
    App.updateActiveIndicator(null);

    const count = App.state.diffConfig[App.state.difficulty];

    const selectedCats = Array.isArray(App.state.selectedCategories) ? App.state.selectedCategories.map(s => String(s)) : [];
    const basePool = Array.isArray(App.NEWS_DB) ? App.NEWS_DB : [];
    const pool = selectedCats.length ? basePool.filter(it => it && selectedCats.includes(String(it.category))) : basePool;
    if (selectedCats.length === 0) {
      alert('请先选择至少一个新闻类别。');
      return;
    }
    if (pool.length < count) {
      alert(`所选类别新闻数量不足：当前 ${pool.length} 条，难度需要 ${count} 条。请调整类别选择或降低难度。`);
      return;
    }

    App.state.gameSelectedCategories = [...selectedCats];

    // 使用 Fisher-Yates 洗牌算法 (Bug 1)
    const shuffledDb = App.shuffleArray([...pool]);
    const picked = shuffledDb.slice(0, count);
    const pickOrder = new Map(picked.map((it, i) => [it, i]));
    
    // 多级排序逻辑：先按 sortDate，再按 ID (Bug 2)
    App.correctOrder = [...picked].sort((a, b) => {
      if (a.sortDate !== b.sortDate) return a.sortDate - b.sortDate;
      const t = String(a.title || '').localeCompare(String(b.title || ''), 'zh-CN');
      if (t !== 0) return t;
      if (a.id !== b.id) return a.id - b.id;
      return (pickOrder.get(a) || 0) - (pickOrder.get(b) || 0);
    });

    // 再次洗牌用于展示
    App.currentCards = App.shuffleArray([...picked]);

    App.renderCards(App.currentCards, App.getEventHandlers());

    document.getElementById('diffLabel').textContent = App.state.diffLabels[App.state.difficulty];
    document.getElementById('cardCount').textContent = count;
    document.getElementById('attemptCount').textContent = '0';
    document.getElementById('resultBar').classList.remove('show');

    App.startTimer();
    App.showScreen('game-screen');

    if (perfStart !== null) {
      const perfEnd = performance.now();
      App.perf = App.perf || {};
      App.perf.gameStart = Array.isArray(App.perf.gameStart) ? App.perf.gameStart : [];
      App.perf.gameStart.push({ ts: Date.now(), ms: Math.round(perfEnd - perfStart), difficulty: App.state.difficulty });
      if (App.perf.gameStart.length > 80) App.perf.gameStart.splice(0, App.perf.gameStart.length - 80);
    }
  };

  /**
   * 提交答案并验证
   */
  App.submitAnswer = function() {
    if (denyInEasterEggMode('提交答案')) return;
    if (App.state.submitted) return;
    
    // 防作弊机制 (Bug 5)
    const now = Date.now();
    if (now - (App.state.lastSubmitTime || 0) < 1000) {
      console.warn("提交过于频繁，请稍候");
      return;
    }
    App.state.lastSubmitTime = now;

    const maxAttempts = 3; // 每个题目最多允许 3 次提交
    if (App.state.attempts >= maxAttempts) {
      alert("作答次数已达上限，请重新开始新游戏。");
      return;
    }

    App.state.attempts++;
    document.getElementById('attemptCount').textContent = App.state.attempts;

    const correctIds = App.correctOrder.map(c => c.id);
    let correctCount = 0;
    const cardElements = document.querySelectorAll('.news-card');

    cardElements.forEach((card, i) => {
      const id = parseInt(card.dataset.id);
      const isCorrect = (id === correctIds[i]);

      App.setCardStatusUI(card, isCorrect, { showHint: false, animate: true, source: 'submit' });
      if (isCorrect) correctCount++;
    });

    const accuracy = Math.round((correctCount / correctIds.length) * 100);
    const timeStr = App.formatTime(App.state.seconds);
    const catCount = Array.isArray(App.state.gameSelectedCategories) ? App.state.gameSelectedCategories.length : (Array.isArray(App.state.selectedCategories) ? App.state.selectedCategories.length : 1);
    const score = App.calcScore(accuracy, App.state.seconds, App.state.difficulty, catCount, App.state.attempts);

    const resultBar = document.getElementById('resultBar');
    document.getElementById('resultScore').textContent = `${accuracy}% 准确率 · ${score}分`;
    
    if (correctCount === correctIds.length) {
      App.state.submitted = true;
      App.stopTimer();
      document.getElementById('resultMsg').textContent = `🎉 完美！全部 ${correctIds.length} 条新闻均排列正确！用时 ${timeStr}`;
      App.saveScore(App.state.difficulty, accuracy, App.state.seconds, score, { categories: App.state.gameSelectedCategories });
      setTimeout(() => App.showVictoryModal(accuracy, timeStr, score, App.state.difficulty), 600);
    } else {
      document.getElementById('resultMsg').textContent = `${correctCount}/${correctIds.length} 正确 · 还可以再试 ${maxAttempts - App.state.attempts} 次`;
      if (App.state.attempts >= maxAttempts) {
        document.getElementById('resultMsg').textContent = `❌ 作答结束 · 正确率 ${accuracy}% · 点击"再来一局"重新挑战`;
      }
    }

    resultBar.classList.add('show');
  };

  /**
   * 显示全部正确答案
   */
  App.revealAll = function() {
    if (denyInEasterEggMode('显示答案')) return;
    if (!App.state.submitted && App.state.attempts < 3) {
      if (!confirm("游戏尚未结束，查看答案将导致本次成绩无效。确定要查看吗？")) {
        return;
      }
      App.state.submitted = true;
      App.stopTimer();
    }
    document.querySelectorAll('.card-date-hint').forEach(h => h.classList.add('show'));
  };

  /**
   * 重置当前排列顺序（打乱）
   */
  App.resetOrder = function() {
    if (denyInEasterEggMode('重置顺序')) return;
    App.currentCards = [...App.currentCards].sort(() => Math.random() - 0.5);
    App.renderCards(App.currentCards, {
      onDragStart: App.onDragStart, 
      onDragEnd: App.onDragEnd, 
      onDragOver: App.onDragOver, 
      onDragLeave: App.onDragLeave, 
      onDrop: App.onDrop,
      onTouchStart: App.onTouchStart, 
      onTouchMove: App.onTouchMove, 
      onTouchEnd: App.onTouchEnd
    });
    document.getElementById('resultBar').classList.remove('show');
  };

  /**
   * 切换难度
   */
  App.selectDifficulty = function(el, diff) {
    document.querySelectorAll('.diff-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    App.state.difficulty = diff;
    if (typeof App.initCategorySelector === 'function') App.initCategorySelector();
  };

  /**
   * 排行榜标签切换
   */
  App.switchLbTab = function(el, diff) {
    document.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    App.renderLeaderboardUI(diff);
  };

  /**
   * 清除排行榜
   */
  App.clearLeaderboard = function() {
    if (denyInEasterEggMode('清除排行榜')) return;
    if (confirm('确定要清除所有排行榜记录吗？')) {
      App.clearAllLeaderboards();
      App.renderLeaderboardUI(App.state.lbTab);
    }
  };

  /**
   * 返回主页
   */
  App.showHome = function() {
    App.stopTimer();
    if (App.state && App.state.easterEggMode) {
      if (typeof App.setEasterEggMode === 'function') App.setEasterEggMode(false, 'show-home');
      else App.state.easterEggMode = false;
    }
    App._homeUiScrollReset = true;
    App.showScreen('home-screen');
    if (typeof App.renderDynamicButtons === 'function') App.renderDynamicButtons();
  };

  /**
   * 显示排行榜屏幕
   */
  App.showLeaderboard = function() {
    App.showScreen('leaderboard-screen');
    App.renderLeaderboardUI(App.state.lbTab);
  };

  /**
   * 切换更多菜单显示
   */
  App.toggleMenu = function() {
    const menu = document.getElementById('moreMenu');
    menu.classList.toggle('show');
  };

  // 点击外部关闭菜单
  window.addEventListener('click', (e) => {
    if (!e.target.matches('.btn-outline')) {
      const menus = document.querySelectorAll('.dropdown-content');
      menus.forEach(m => m.classList.remove('show'));
    }
  });

  /**
   * 关闭结算弹窗
   */
  App.closeVictoryModal = function() {
    document.getElementById('victoryModal').classList.remove('show');
  };
})(window.GameApp);
