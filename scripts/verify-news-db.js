const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadGameApp(files) {
  const context = vm.createContext({
    window: {},
    console,
    Date,
    Math,
    setTimeout,
    clearTimeout
  });
  context.window.GameApp = {};
  context.GameApp = context.window.GameApp;
  for (const f of files) {
    const code = fs.readFileSync(f, 'utf8');
    vm.runInContext(code, context, { filename: f });
  }
  return context.window.GameApp;
}

const root = path.resolve(__dirname, '..');
const newsDbPath = path.join(root, 'src', 'data', 'news_db.js');

const App = loadGameApp([newsDbPath]);
const db = App.NEWS_DB;

if (!Array.isArray(db)) {
  throw new Error('NEWS_DB is not an array');
}

const required = ['id', 'title', 'desc', 'date', 'sortDate', 'category', 'catLabel', 'image'];
const ids = new Set();
const categories = new Set();

for (let i = 0; i < db.length; i++) {
  const it = db[i];
  if (!it || typeof it !== 'object') throw new Error(`NEWS_DB[${i}] is not an object`);
  for (const k of required) {
    if (!(k in it)) throw new Error(`NEWS_DB[${i}] missing field: ${k}`);
  }
  if (!Number.isInteger(it.id)) throw new Error(`NEWS_DB[${i}].id must be integer`);
  if (ids.has(it.id)) throw new Error(`Duplicate id: ${it.id}`);
  ids.add(it.id);

  if (typeof it.title !== 'string' || !it.title.trim()) throw new Error(`NEWS_DB[${i}].title invalid`);
  if (typeof it.desc !== 'string' || !it.desc.trim()) throw new Error(`NEWS_DB[${i}].desc invalid`);
  if (typeof it.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(it.date)) throw new Error(`NEWS_DB[${i}].date invalid`);
  if (!Number.isInteger(it.sortDate)) throw new Error(`NEWS_DB[${i}].sortDate must be integer`);
  if (typeof it.category !== 'string' || !it.category.trim()) throw new Error(`NEWS_DB[${i}].category invalid`);
  if (typeof it.catLabel !== 'string' || !it.catLabel.trim()) throw new Error(`NEWS_DB[${i}].catLabel invalid`);
  if (typeof it.image !== 'string') throw new Error(`NEWS_DB[${i}].image must be string`);
  categories.add(it.category);
}

console.log(`[verify-news-db] OK: ${db.length} items, ${ids.size} unique ids, ${categories.size} categories`);
