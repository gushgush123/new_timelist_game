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

  // 初始化
  console.log('游戏初始化完成 (Portable Mode)');
})(window.GameApp);
