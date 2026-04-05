window.GameApp = window.GameApp || {};

(function(App) {
  /**
   * 桌面端拖拽开始
   */
  App.onDragStart = function(e) {
    App.dragDropState.dragSrc = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.dataset.id);

    const ghost = document.getElementById('drag-ghost');
    ghost.innerHTML = `<div class="ghost-cat">${
      this.querySelector('.card-category').textContent
    }</div><div class="ghost-title">${
      this.querySelector('.card-title').textContent
    }</div>`;
    ghost.style.display = 'block';
    e.dataTransfer.setDragImage(ghost, 0, 0);
  };

  /**
   * 桌面端拖拽结束
   */
  App.onDragEnd = function(e) {
    this.classList.remove('dragging');
    document.getElementById('drag-ghost').style.display = 'none';
    document.querySelectorAll('.news-card').forEach(c => c.classList.remove('drag-over'));
    App.updateCardNumbers();
  };

  /**
   * 桌面端拖拽悬停
   */
  App.onDragOver = function(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (this !== App.dragDropState.dragSrc) {
      document.querySelectorAll('.news-card').forEach(c => c.classList.remove('drag-over'));
      this.classList.add('drag-over');
    }
  };

  /**
   * 桌面端离开放置目标
   */
  App.onDragLeave = function(e) {
    this.classList.remove('drag-over');
  };

  /**
   * 桌面端放置
   */
  App.onDrop = function(e) {
    e.stopPropagation();
    if (this === App.dragDropState.dragSrc) return;

    const list = document.getElementById('timelineList');
    const items = [...list.children];
    const srcIdx = items.indexOf(App.dragDropState.dragSrc);
    const dstIdx = items.indexOf(this);

    this.classList.remove('drag-over');
    App.dragDropState.dragSrc.classList.remove('dragging');

    App.animateListReorder(list, () => {
      if (srcIdx < dstIdx) {
        list.insertBefore(App.dragDropState.dragSrc, this.nextSibling);
      } else {
        list.insertBefore(App.dragDropState.dragSrc, this);
      }
    }, { source: 'drag-drop' });

    App.updateCardNumbers();
    App.clearValidationUI();
  };

  /**
   * 移动端触摸开始
   */
  App.onTouchStart = function(e) {
    App.dragDropState.touchDragItem = this;
    App.dragDropState.touchStartY = e.touches[0].clientY;
    this.style.transition = 'none';
  };

  /**
   * 移动端触摸移动
   */
  App.onTouchMove = function(e) {
    if (!App.dragDropState.touchDragItem) return;
    e.preventDefault();

    const touch = e.touches[0];
    const list = document.getElementById('timelineList');
    const items = [...list.children];

    App.dragDropState.touchDragItem.style.visibility = 'hidden';
    const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    App.dragDropState.touchDragItem.style.visibility = 'visible';

    items.forEach(i => i.classList.remove('drag-over'));

    const target = elemBelow ? elemBelow.closest('.news-card') : null;
    if (target && target !== App.dragDropState.touchDragItem) {
      target.classList.add('drag-over');
    }
  };

  /**
   * 移动端触摸结束
   */
  App.onTouchEnd = function(e) {
    if (!App.dragDropState.touchDragItem) return;

    const touch = e.changedTouches[0];
    const list = document.getElementById('timelineList');
    const items = [...list.children];

    App.dragDropState.touchDragItem.style.visibility = 'hidden';
    const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    App.dragDropState.touchDragItem.style.visibility = 'visible';

    const target = elemBelow ? elemBelow.closest('.news-card') : null;

    if (target && target !== App.dragDropState.touchDragItem) {
      const srcIdx = items.indexOf(App.dragDropState.touchDragItem);
      const dstIdx = items.indexOf(target);

      App.animateListReorder(list, () => {
        if (srcIdx < dstIdx) {
          list.insertBefore(App.dragDropState.touchDragItem, target.nextSibling);
        } else {
          list.insertBefore(App.dragDropState.touchDragItem, target);
        }
      }, { source: 'touch-drop' });
    }

    items.forEach(i => i.classList.remove('drag-over'));
    App.dragDropState.touchDragItem.style.transition = '';
    App.dragDropState.touchDragItem = null;
    App.updateCardNumbers();
    App.clearValidationUI();
  };
})(window.GameApp);
