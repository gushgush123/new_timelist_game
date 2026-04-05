window.GameApp = window.GameApp || {};

/**
 * 格式化日期字符串为中文显示格式
 * @param {string} dateStr - 格式为 "YYYY-MM-DD" 的字符串
 */
GameApp.formatDate = function(dateStr) {
  const parts = dateStr.split('-');
  const y = parts[0];
  const m = parts[1];
  const d = parts[2];
  const months = ['一月','二月','三月','四月','五月','六月',
                   '七月','八月','九月','十月','十一月','十二月'];
  let res = `${y}年${months[parseInt(m) - 1]}`;
  if (d && d !== '01') res += `${parseInt(d)}日`;
  return res;
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
  const diffMult = { easy: 1, medium: 1.55, hard: 2.2 }[diff] || 1;
  const cards = { easy: 5, medium: 8, hard: 12 }[diff] || 5;

  const catCount = Math.max(1, Number(arguments[3] || 1));
  const catMult = 1 + Math.min(0.45, Math.log2(catCount) * 0.12);

  const attempts = Math.max(1, Number(arguments[4] || 1));
  const attemptMult = Math.max(0.6, 1 / (1 + 0.22 * (attempts - 1)));

  const acc = Math.max(0, Math.min(1, (Number(accuracy) || 0) / 100));
  const t = Math.max(0, Number(seconds) || 0);
  const timeTarget = cards * 36;
  const timeRatio = Math.max(0, Math.min(1, (timeTarget - t) / timeTarget));

  const accuracyPart = Math.pow(acc, 1.4) * 1000 * diffMult * catMult;
  const timePart = timeRatio * 240 * diffMult;
  return Math.round((accuracyPart + timePart) * attemptMult);
};

/**
 * Fisher-Yates 洗牌算法 (均匀随机排列)
 * @param {Array} array - 待打乱的数组
 * @returns {Array} - 打乱后的新数组
 */
GameApp.shuffleArray = function(array) {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};
