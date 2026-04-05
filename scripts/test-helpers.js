const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert');

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
const helpersPath = path.join(root, 'src', 'utils', 'helpers.js');

const App = loadGameApp([helpersPath]);

assert.equal(typeof App.formatTime, 'function');
assert.equal(App.formatTime(0), '00:00');
assert.equal(App.formatTime(9), '00:09');
assert.equal(App.formatTime(70), '01:10');

assert.equal(typeof App.shuffleArray, 'function');
const src = [1, 2, 3, 4, 5];
const out = App.shuffleArray(src);
assert.deepEqual(src, [1, 2, 3, 4, 5], 'shuffleArray should not mutate input');
assert.equal(out.length, src.length);
assert.deepEqual([...out].sort((a, b) => a - b), src);

assert.equal(typeof App.calcScore, 'function');
assert.ok(Number.isInteger(App.calcScore(100, 0, 'easy')));
assert.ok(App.calcScore(100, 0, 'hard') >= App.calcScore(100, 0, 'easy'));
assert.ok(App.calcScore(100, 0, 'easy', 6) > App.calcScore(100, 0, 'easy', 1));
assert.ok(App.calcScore(100, 0, 'easy', 6, 2) < App.calcScore(100, 0, 'easy', 6, 1));

console.log('[test-helpers] OK');
