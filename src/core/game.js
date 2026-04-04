window.GameApp = window.GameApp || {};

(function(App) {
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
   * 开始游戏
   */
  App.startGame = function() {
    App.closeVictoryModal();
    App.state.submitted = false;
    App.state.attempts = 0;

    const count = App.state.diffConfig[App.state.difficulty];

    // 选取随机子集并排序作为正确答案
    const shuffledDb = [...App.NEWS_DB].sort(() => Math.random() - 0.5);
    const picked = shuffledDb.slice(0, count);
    App.correctOrder = [...picked].sort((a, b) => a.sortDate - b.sortDate);

    // 再次打乱用于展示
    App.currentCards = [...picked].sort(() => Math.random() - 0.5);

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

    document.getElementById('diffLabel').textContent = App.state.diffLabels[App.state.difficulty];
    document.getElementById('cardCount').textContent = count;
    document.getElementById('attemptCount').textContent = '0';
    document.getElementById('resultBar').classList.remove('show');

    App.startTimer();
    App.showScreen('game-screen');
  };

  /**
   * 提交答案并验证
   */
  App.submitAnswer = function() {
    if (App.state.submitted) return;
    App.state.attempts++;
    document.getElementById('attemptCount').textContent = App.state.attempts;

    const userIds = Array.from(document.querySelectorAll('.news-card'))
      .map(el => parseInt(el.dataset.id));
    const correctIds = App.correctOrder.map(c => c.id);

    let correctCount = 0;
    const cardElements = document.querySelectorAll('.news-card');

    cardElements.forEach((card, i) => {
      const id = parseInt(card.dataset.id);
      const isCorrect = (id === correctIds[i]);
      App.setCardStatusUI(card, isCorrect);
      if (isCorrect) correctCount++;
    });

    const accuracy = Math.round((correctCount / correctIds.length) * 100);
    const timeStr = App.formatTime(App.state.seconds);
    const score = App.calcScore(accuracy, App.state.seconds, App.state.difficulty);

    const resultBar = document.getElementById('resultBar');
    document.getElementById('resultScore').textContent = `${accuracy}% 准确率 · ${score}分`;
    document.getElementById('resultMsg').textContent =
      correctCount === correctIds.length
        ? `🎉 完美！全部 ${correctIds.length} 条新闻均排列正确！用时 ${timeStr}`
        : `${correctCount}/${correctIds.length} 正确 · 橙色边框为错误卡片，已显示正确时间`;

    resultBar.classList.add('show');

    if (correctCount === correctIds.length) {
      App.state.submitted = true;
      App.stopTimer();
      App.saveScore(App.state.difficulty, accuracy, App.state.seconds, score);
      setTimeout(() => App.showVictoryModal(accuracy, timeStr, score, App.state.difficulty), 600);
    }
  };

  /**
   * 显示全部正确答案
   */
  App.revealAll = function() {
    document.querySelectorAll('.card-date-hint').forEach(h => h.classList.add('show'));
  };

  /**
   * 重置当前排列顺序（打乱）
   */
  App.resetOrder = function() {
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
    App.showScreen('home-screen');
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
