window.GameApp = window.GameApp || {};

(function(App) {
  // Linear Icons (2px stroke)
  const ICONS = {
    drag: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>`,
    correct: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    wrong: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
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
      body.innerHTML = `<tr><td colspan="5" class="lb-empty">暂无记录 · 开始游戏创造历史！</td></tr>`;
      return;
    }

    body.innerHTML = lb.map((entry, i) => `
      <tr>
        <td><span class="lb-rank">${['🥇','🥈','🥉'][i] || (i+1)}</span></td>
        <td class="lb-score">${entry.score}</td>
        <td>${entry.accuracy}%</td>
        <td class="lb-mono">${App.formatTime(entry.seconds)}</td>
        <td class="lb-date">${entry.date}</td>
      </tr>
    `).join('');
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
  App.setCardStatusUI = function(cardEl, isCorrect) {
    const statusIcon = cardEl.querySelector('.card-status-icon');
    cardEl.classList.remove('correct', 'wrong');
    if (isCorrect) {
      cardEl.classList.add('correct');
      statusIcon.innerHTML = ICONS.correct;
    } else {
      cardEl.classList.add('wrong');
      statusIcon.innerHTML = ICONS.wrong;
      cardEl.querySelector('.card-date-hint').classList.add('show');
    }
  };

})(window.GameApp);
