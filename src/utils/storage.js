window.GameApp = window.GameApp || {};

/**
 * 保存游戏成绩到本地存储
 */
GameApp.saveScore = function(difficulty, accuracy, seconds, score) {
  const key = `lb_${difficulty}`;
  const lb = JSON.parse(localStorage.getItem(key) || '[]');
  lb.push({
    score, accuracy, seconds,
    date: new Date().toLocaleDateString('zh-CN')
  });
  lb.sort((a, b) => b.score - a.score);
  lb.splice(10); // 只保留前 10 名
  localStorage.setItem(key, JSON.stringify(lb));
};

/**
 * 从本地存储获取排行榜记录
 */
GameApp.getLeaderboard = function(difficulty) {
  const key = `lb_${difficulty}`;
  return JSON.parse(localStorage.getItem(key) || '[]');
};

/**
 * 清除所有排行榜记录
 */
GameApp.clearAllLeaderboards = function() {
  ['easy', 'medium', 'hard'].forEach(d => localStorage.removeItem(`lb_${d}`));
};
