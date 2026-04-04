window.GameApp = window.GameApp || {};

/**
 * 格式化日期字符串为中文显示格式
 */
GameApp.formatDate = function(dateStr) {
  const [y, m] = dateStr.split('-');
  const months = ['一月','二月','三月','四月','五月','六月',
                   '七月','八月','九月','十月','十一月','十二月'];
  return `${y}年${months[parseInt(m) - 1]}`;
};

/**
 * 将秒数格式化为 MM:SS 格式
 */
GameApp.formatTime = function(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

/**
 * 计算游戏得分
 */
GameApp.calcScore = function(accuracy, seconds, diff) {
  const diffBonus = { easy: 1, medium: 1.5, hard: 2 }[diff];
  const timeBonus = Math.max(0, 300 - seconds);
  return Math.round((accuracy * diffBonus * 10) + (timeBonus * 0.5));
};
