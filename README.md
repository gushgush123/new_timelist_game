# 【Trae&AI项目】时间轴挑战 · 新闻排序游戏（不喜轻喷QAQ）

纯原生 HTML/CSS/JavaScript 实现的时间线排序小游戏：从新闻库抽题 → 拖拽排序 → 提交校验 → 评分与排行榜记录。项目不依赖任何第三方库，采用 `window.GameApp` 命名空间进行模块化组织，适合快速部署与二次开发。

## 快速上手

### 本地运行（推荐）

使用任意静态服务器即可：

```bash
python -m http.server 8000
```

浏览器访问 `http://127.0.0.1:8000/`。

### 直接打开

也可以直接双击打开 [index.html](file:///e:/new_timelist_game/index.html)，无需构建流程（部分浏览器对本地文件的资源加载限制可能导致图片/字体行为略有差异）。

## 系统架构总览

### 设计原则

- 单一全局命名空间：所有模块向 `window.GameApp` 挂载公共 API，避免全局污染
- 职责分离：数据（data）/状态（core/state）/业务流程（core/game）/渲染与交互（ui）/工具与持久化（utils）分层清晰
- DOM 即视图：排序结果以 DOM 顺序为准；提交时读取 DOM 顺序与答案对比

### 模块依赖与加载顺序

本项目用脚本标签顺序保证依赖关系（关键点：数据与工具必须先于 UI/业务加载）：

```html
<script src="src/core/state.js"></script>
<script src="src/data/news_db.js"></script>
<script src="src/data/strings.js"></script>
<script src="src/utils/helpers.js"></script>
<script src="src/utils/storage.js"></script>
<script src="src/ui/category-selector.js"></script>
<script src="src/ui/renderer.js"></script>
<script src="src/ui/drag-drop.js"></script>
<script src="src/core/game.js"></script>
<script src="src/main.js"></script>
```

可在 [index.html](file:///e:/new_timelist_game/index.html) 底部看到当前顺序。

### 关键交互流程（从主菜单到一局游戏）

1. 启动初始化：`main.js` 调用 `initScrollBackground/initOptionHoverEffects/initCategorySelector/initHeadlineTicker`，并挂载全局函数供页面触发
2. 选择难度：点击 `.diff-card` → `GameApp.selectDifficulty(el, diff)` 更新 `GameApp.state.difficulty`
3. 选择类别：点击类别 chip → `GameApp.state.selectedCategories` 更新并持久化
4. 开始游戏：点击“开始游戏”→ `GameApp.startGame()`：
   - 按 `selectedCategories` 过滤题库
   - 抽取 N 条（由 `difficulty` 决定）
   - 生成 `correctOrder`（时间排序）与 `currentCards`（打乱展示）
   - `renderCards()` 渲染卡片并绑定拖拽事件
5. 提交答案：`submitAnswer()` 读取 DOM 顺序对比 `correctOrder`，为每张卡打上 correct/wrong，并计算得分与写入排行榜

### 公共 API 速查（常用入口）

所有 API 均挂载在 `window.GameApp`（简称 `GameApp`）上：

- **导航**
  - `showHome()`：回主菜单（会退出彩蛋并复位主页 UI），见 [game.js](file:///e:/new_timelist_game/src/core/game.js)
  - `showLeaderboard()`：打开排行榜，见 [game.js](file:///e:/new_timelist_game/src/core/game.js)
  - `showScreen(screenId)`：切换屏幕容器，见 [renderer.js](file:///e:/new_timelist_game/src/ui/renderer.js)
- **游戏流程**
  - `startGame()`：按难度+类别开局（不足会提示），见 [game.js](file:///e:/new_timelist_game/src/core/game.js)
  - `submitAnswer()`：提交并评分，见 [game.js](file:///e:/new_timelist_game/src/core/game.js)
  - `resetOrder()` / `revealAll()`：重置顺序/显示答案，见 [game.js](file:///e:/new_timelist_game/src/core/game.js)
- **主页能力**
  - `initScrollBackground()`：初始化滚动背景与交互，见 [renderer.js](file:///e:/new_timelist_game/src/ui/renderer.js)
  - `initCategorySelector()`：初始化类别筛选 UI，见 [category-selector.js](file:///e:/new_timelist_game/src/ui/category-selector.js)
- **彩蛋模式**
  - `setEasterEggMode(enabled, source)` / `toggleEasterEgg(source)`：进入/退出彩蛋，见 [main.js](file:///e:/new_timelist_game/src/main.js)

## 目录结构与文件职责（逐文件）

```text
/
├── index.html
├── README.md
├── src/
│   ├── main.js
│   ├── core/
│   │   ├── state.js
│   │   └── game.js
│   ├── data/
│   │   ├── news_db.js
│   │   └── strings.js
│   ├── ui/
│   │   ├── style.css
│   │   ├── renderer.js
│   │   ├── drag-drop.js
│   │   └── category-selector.js
│   └── utils/
│       ├── helpers.js
│       └── storage.js
├── scripts/
│   ├── ci.js
│   ├── verify-news-db.js
│   └── test-helpers.js
├── docs/
│   └── performance.md
├── .github/workflows/ci.yml
└── vercel.json
```

### index.html（页面结构与入口）

- 职责：定义 Home/Game/Leaderboard 等屏幕结构与容器 id；通过脚本顺序加载整个系统
- 输入：用户交互（点击、键盘、滚动、触摸）
- 输出：无（纯 UI 容器）

重点 DOM：
- `#home-screen / #game-screen / #leaderboard-screen`：屏幕容器（由 `GameApp.showScreen()` 控制 `active` 类）
- `#timelineList`：游戏卡片列表容器
- `#homeActions / #headerActions`：按钮容器（彩蛋模式会物理清空并重建）
- `#categoryPanel/#categoryChips/#categoryStatus`：类别筛选 UI

### src/core/state.js（全局状态）

- 职责：初始化 `GameApp.state`（难度、当前局数据、计时器等）与拖拽临时状态 `GameApp.dragDropState`
- 输出：`GameApp.state`、`GameApp.dragDropState`

主要字段（节选）：
- `state.difficulty`：`easy|medium|hard`
- `state.selectedCategories`：所选类别（数组；首次进入默认全选）
- `state.currentCards / state.correctOrder`：当前展示与答案
- `state.seconds / state.timerInterval / state.attempts / state.submitted`

### src/data/news_db.js（新闻数据源）

- 职责：提供统一新闻库 `GameApp.NEWS_DB`，供主界面背景与游戏抽题共同使用
- 输出：`GameApp.NEWS_DB`（数组；字段：`id/title/desc/date/sortDate/category/catLabel/image`）

### src/data/strings.js（文案资源）

- 职责：集中管理 UI 文案（目前主要是顶部 ticker 文案）
- 输出：`GameApp.TEXT.headlineTickerLines`

### src/utils/helpers.js（纯函数工具集）

- 职责（节选）：
  - `formatTime(seconds)`：秒数转 `MM:SS`
  - `shuffleArray(array)`：Fisher-Yates 洗牌（不会修改入参）
  - `calcScore(accuracy, seconds, diff)`：评分函数
- 输入/输出：纯函数式输入输出（无 DOM、副作用）

示例：

```js
GameApp.formatTime(70);      // "01:10"
GameApp.shuffleArray([1,2]); // 新数组
```

### src/utils/storage.js（本地存储与排行榜）

- 职责：排行榜读写与用户 id 管理；包含一个模拟的“云同步”接口
- 输出：写入 `localStorage`（如 `lb_easy/lb_medium/lb_hard`）

关键 API（节选）：
- `saveScore(difficulty, accuracy, seconds, score)`：写入 Top10
- `getLeaderboard(difficulty)`：读取排行榜（彩蛋模式会拒绝访问）
- `clearAllLeaderboards()`：清空排行榜（彩蛋模式会拒绝操作）

### src/ui/style.css（样式）

- 职责：全站视觉样式（布局、动画、彩蛋模式全屏覆盖、难度卡/类别 chips、拖拽态等）

### src/ui/category-selector.js（类别选择 UI 模块）

- 职责：从 `NEWS_DB` 动态提取类别，渲染 chips，并维护 `state.selectedCategories` 与持久化
- 输入：
  - `GameApp.NEWS_DB`
  - 当前难度 `GameApp.state.difficulty`（用于计算“所选类别是否足够抽题”）
- 输出：
  - 更新 `GameApp.state.selectedCategories`
  - 写入 `localStorage.category_selection`（数组）
  - 更新 `#categoryStatus` 文案，必要时禁用“开始游戏”按钮

核心入口：
- `GameApp.initCategorySelector()`：幂等初始化（可多次调用；彩蛋往返/难度变化时会再次调用以刷新状态）

### src/ui/renderer.js（UI 渲染与动画/彩蛋核心）

主要能力：
- **屏幕切换**：`showScreen(id)`
- **游戏 UI 渲染**：`renderCards()`、`renderLeaderboardUI()`、`updateTimerUI()` 等
- **动画系统**：`animateListReorder()`、`setAnimationSpeed()` 等
- **主页背景与交互**：`initScrollBackground()`（rAF 驱动）、背景卡弹窗
- **彩蛋模式**：`renderDynamicButtons()`（进入清空/退出重建 + 竞态取消）、`onEasterEggEnter/Exit`

### src/ui/drag-drop.js（拖拽排序交互）

- 职责：为 `.news-card` 提供桌面 Drag&Drop 与移动端 Touch 拖拽排序，并在 drop 后触发重排动画与序号更新
- 输出：修改 `#timelineList` 内 DOM 顺序

### src/core/game.js（业务流程：开局/提交/重置/导航）

- 职责：控制一局游戏的生命周期与规则（抽题、答案、验证、得分、排行榜、导航）
- 关键函数（节选）：
  - `startGame()`：按类别过滤题库→抽题→渲染→计时开始
  - `submitAnswer()`：校验/评分/保存成绩/弹窗
  - `resetOrder()`：重新打乱当前卡片
  - `selectDifficulty(el, diff)`：切换难度（并刷新类别选择器状态）
  - `showHome()/showLeaderboard()`：导航（同时处理彩蛋模式退出与 UI 复位）

### src/main.js（系统启动与全局入口挂载）

- 职责：
  - 将核心函数挂到 `window.*`（供页面触发）
  - 彩蛋模式开关 `setEasterEggMode/toggleEasterEgg`
  - 性能采样与调试入口（perf/longtask、回归测试、基准）
  - 启动初始化（调用各 init 函数）

控制台入口示例：

```js
GameApp.setEasterEggMode(true, 'debug');
GameApp.runEasterEggRoundTripTest(10);
GameApp.runGameStartBenchmark(50);
```

## 本地存储键（localStorage）

- `lb_easy / lb_medium / lb_hard`：排行榜 Top10
- `game_user_id`：本地用户 id
- `category_selection`：所选类别数组
- `perf_debug / security_debug`：调试开关（值为 `'1'`）
- `e2e_difficulty / e2e_category / bench_start`：自动回归/基准开关（值为 `'1'`）

## 自动化检查与 CI

### 本地运行

```bash
node scripts/ci.js
```

### CI 内容

- [scripts/verify-news-db.js](file:///e:/new_timelist_game/scripts/verify-news-db.js)：检查 `NEWS_DB` 字段/唯一性/格式
- [scripts/test-helpers.js](file:///e:/new_timelist_game/scripts/test-helpers.js)：检查 helpers 的基本行为
- [scripts/ci.js](file:///e:/new_timelist_game/scripts/ci.js)：统一入口
- GitHub Actions：[.github/workflows/ci.yml](file:///e:/new_timelist_game/.github/workflows/ci.yml)

## 部署相关（Vercel）

- [vercel.json](file:///e:/new_timelist_game/vercel.json)：将所有路径重写到 `/index.html`，便于“单页”式访问与刷新不 404
- `.vercel/project.json`：Vercel 项目绑定信息（本地/CLI 用）

## 延伸阅读

- [docs/performance.md](file:///e:/new_timelist_game/docs/performance.md)：稳定性、性能与可维护性改进说明（含彩蛋往返、类别筛选、自动化检查）
