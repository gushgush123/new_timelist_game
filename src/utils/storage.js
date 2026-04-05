window.GameApp = window.GameApp || {};

/**
 * 获取或生成唯一用户 ID (用于云端同步绑定)
 */
GameApp.getUserId = function() {
  let userId = localStorage.getItem('game_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('game_user_id', userId);
  }
  return userId;
};

/**
 * 保存游戏成绩
 */
GameApp.saveScore = async function(difficulty, accuracy, seconds, score) {
  const key = `lb_${difficulty}`;
  const lb = JSON.parse(localStorage.getItem(key) || '[]');
  const meta = arguments[4] && typeof arguments[4] === 'object' ? arguments[4] : null;
  const categories = meta && Array.isArray(meta.categories) ? meta.categories.map(s => String(s)) : [];
  const catLabelMap = new Map();
  if (Array.isArray(GameApp.NEWS_DB)) {
    for (const it of GameApp.NEWS_DB) {
      if (!it || !it.category) continue;
      const k = String(it.category);
      if (!catLabelMap.has(k)) catLabelMap.set(k, String(it.catLabel || it.category));
    }
  }
  const catLabels = categories.map(k => catLabelMap.get(k) || k);
  const entry = {
    id: Date.now(),
    userId: GameApp.getUserId(),
    score, accuracy, seconds,
    categories,
    catLabels,
    date: new Date().toLocaleDateString('zh-CN')
  };
  
  lb.push(entry);
  lb.sort((a, b) => b.score - a.score);
  lb.splice(10);
  localStorage.setItem(key, JSON.stringify(lb));

  // 触发云端同步 (Bug 3)
  try {
    await GameApp.syncToCloud(difficulty, lb);
  } catch (e) {
    console.warn("云端同步失败，数据已保存在本地:", e);
  }
};

/**
 * 模拟云端同步接口 (Bug 3)
 * 实际开发中此处应调用 fetch API 指向后端服务器
 */
GameApp.syncToCloud = async function(difficulty, data) {
  console.log(`[Cloud Sync] 正在同步 ${difficulty} 排行榜...`);
  
  // 数据加密模拟 (简单 Base64，实际应使用 Web Crypto API)
  const encryptedData = btoa(JSON.stringify({
    userId: GameApp.getUserId(),
    difficulty,
    payload: data,
    timestamp: Date.now()
  }));

  // 模拟网络请求
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟 90% 成功率
      if (Math.random() > 0.1) {
        console.log("[Cloud Sync] 同步成功");
        resolve({ status: 'success' });
      } else {
        reject(new Error("Network Timeout"));
      }
    }, 1000);
  });
};

/**
 * 从本地存储获取排行榜记录
 */
GameApp.getLeaderboard = function(difficulty) {
  // 安全校验：彩蛋模式禁止访问排行榜 API
  if (GameApp.state && GameApp.state.easterEggMode) {
    console.error('[Security] 拒绝访问：彩蛋模式下无权获取排行榜数据。');
    return [];
  }
  const key = `lb_${difficulty}`;
  return JSON.parse(localStorage.getItem(key) || '[]');
};

/**
 * 清除所有排行榜记录
 */
GameApp.clearAllLeaderboards = function() {
  if (GameApp.state && GameApp.state.easterEggMode) {
    console.error('[Security] 拒绝操作：彩蛋模式下无权清除排行榜数据。');
    return;
  }
  ['easy', 'medium', 'hard'].forEach(d => localStorage.removeItem(`lb_${d}`));
};
