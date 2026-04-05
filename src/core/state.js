/**
 * 初始化全局命名空间
 */
window.GameApp = window.GameApp || {};

/**
 * 全局游戏状态对象
 */
GameApp.state = {
  difficulty: 'easy',
  diffConfig: { easy: 5, medium: 8, hard: 12 },
  diffLabels: { easy: '简单', medium: '中等', hard: '困难' },
  selectedCategories: [],
  currentCards: [],
  correctOrder: [],
  timerInterval: null,
  seconds: 0,
  attempts: 0,
  submitted: false,
  lbTab: 'easy',
  easterEggMode: false,
  animationSpeed: 1
};

/**
 * 拖拽相关临时状态
 */
GameApp.dragDropState = {
  dragSrc: null,
  dragGhost: null,
  touchDragItem: null,
  touchStartY: 0
};
