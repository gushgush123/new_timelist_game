window.GameApp = window.GameApp || {};

(function(App) {
  App.initCategorySelector = function() {
    const panel = document.getElementById('categoryPanel');
    const chips = document.getElementById('categoryChips');
    const status = document.getElementById('categoryStatus');
    if (!panel || !chips || !status) return;

    const derive = () => {
      const db = Array.isArray(App.NEWS_DB) ? App.NEWS_DB : [];
      const map = new Map();
      for (const it of db) {
        if (!it) continue;
        const key = String(it.category || '').trim();
        if (!key) continue;
        const label = String(it.catLabel || it.category || '').trim() || key;
        if (!map.has(key)) map.set(key, label);
      }
      const list = Array.from(map.entries()).map(([key, label]) => ({ key, label }));
      list.sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));
      return list;
    };

    const readPersisted = () => {
      try {
        const raw = localStorage.getItem('category_selection');
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
        if (parsed && typeof parsed === 'object' && Array.isArray(parsed.selected)) return parsed.selected;
        return null;
      } catch (_) {
        return null;
      }
    };

    const persist = () => {
      try {
        const selected = App.state && Array.isArray(App.state.selectedCategories) ? App.state.selectedCategories : [];
        localStorage.setItem('category_selection', JSON.stringify(selected));
      } catch (_) {}
    };

    const categories = derive();
    const allKeys = categories.map(c => c.key);

    if (!Array.isArray(App.state.selectedCategories) || App.state.selectedCategories.length === 0) {
      const persisted = readPersisted();
      if (persisted && Array.isArray(persisted)) {
        const allow = new Set(allKeys);
        App.state.selectedCategories = persisted.map(s => String(s)).filter(k => allow.has(k));
      } else {
        App.state.selectedCategories = [...allKeys];
      }
    }

    const ensureValid = () => {
      const allow = new Set(allKeys);
      let selected = Array.isArray(App.state.selectedCategories) ? App.state.selectedCategories : [];
      selected = selected.map(s => String(s)).filter(k => allow.has(k));
      App.state.selectedCategories = selected;
      persist();
      return { selected };
    };

    const setStatus = () => {
      const { selected } = ensureValid();
      const selectedLabels = new Set(selected);
      const shown = categories.filter(c => selectedLabels.has(c.key)).map(c => c.label);
      const count = App.state.diffConfig ? App.state.diffConfig[App.state.difficulty] : null;
      const poolSize = (Array.isArray(App.NEWS_DB) ? App.NEWS_DB : []).filter(it => it && selectedLabels.has(String(it.category))).length;
      const extra = (selected.length > 0 && typeof count === 'number' && poolSize < count) ? `（当前仅 ${poolSize} 条，难度需 ${count} 条）` : '';
      status.textContent = selected.length
        ? `已选 ${selected.length}/${categories.length} · ${shown.join('、')} ${extra}`.trim()
        : `未选择任何类别`;

      const startBtn = document.querySelector('#homeActions .btn.btn-gold');
      if (startBtn) {
        const enough = selected.length > 0 && (typeof count === 'number' ? poolSize >= count : true);
        startBtn.disabled = !enough;
        startBtn.classList.toggle('disabled', !enough);
        if (!enough && selected.length === 0) {
          startBtn.title = '请先选择至少一个类别';
        } else if (!enough && typeof count === 'number') {
          startBtn.title = `当前类别新闻数量不足（需要 ${count} 条）`;
        } else {
          startBtn.title = '';
        }
      }
    };

    const render = () => {
      chips.replaceChildren();
      const selected = new Set(Array.isArray(App.state.selectedCategories) ? App.state.selectedCategories : []);
      for (const c of categories) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cat-chip';
        btn.textContent = c.label;
        btn.dataset.key = c.key;
        btn.classList.toggle('selected', selected.has(c.key));
        chips.appendChild(btn);
      }
      setStatus();
    };

    if (panel.dataset.bound !== '1') {
      panel.dataset.bound = '1';
      panel.addEventListener('click', (e) => {
        const t = e.target;
        if (!t) return;
        const chip = t.closest ? t.closest('.cat-chip') : null;
        if (!chip) return;
        if (App.state && App.state.easterEggMode) return;
        const key = chip.dataset ? chip.dataset.key : null;
        if (!key) return;

        const selected = new Set(Array.isArray(App.state.selectedCategories) ? App.state.selectedCategories : []);
        if (selected.has(key)) selected.delete(key);
        else selected.add(key);
        App.state.selectedCategories = Array.from(selected);
        persist();
        render();
      }, true);
    }

    render();
  };
})(window.GameApp);

