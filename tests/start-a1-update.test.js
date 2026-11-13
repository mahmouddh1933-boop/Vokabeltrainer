const {test} = require('node:test');
const assert = require('node:assert/strict');
const {choose} = require('../js/reading-self-check.js');
const data = require('../js/reading-exercises-data.js');
const grammar = require('../js/grammar-data.js');
test('Self-check samples five distinct activities, excludes the previous round and reaches all source questions', () => {
  let seed = 473;
  const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  let previous = [];
  const seen = new Set();
  for (let i = 0; i < 100; i++) {
    const round = choose(data.activities, previous, random);
    assert.equal(round.length, 5);
    assert.equal(new Set(round.map(q => q.source)).size, 5);
    for (const q of round) {
      assert.ok(!previous.includes(q.sourceKey));
      const source = data.activities.find(a => a.id === q.source);
      const index = Number(q.sourceKey.split(':')[1]);
      assert.deepEqual(q.options, source.questions[index].options);
      assert.equal(q.answer, source.questions[index].answer);
      seen.add(q.sourceKey);
    }
    previous = round.map(q => q.sourceKey);
  }
  assert.equal(seen.size, data.activities.filter(a => a.chapter === 'meaning').reduce((n,a) => n + a.questions.length, 0));
});
test('New A1–A2 grammar lessons preserve valid prerequisites, answer keys and grammatical distinctions', () => {
  for (const name of ['interrogatives','time-place']) {
    const lesson = require('../data/a1-a2-' + name + '.json');
    assert.equal(lesson.stage, 'build');
    assert.equal(lesson.questions.length, 20);
    for (const id of lesson.prerequisites) assert.ok(grammar.lessons.some(l => l.id === id));
    assert.ok(!grammar.lessons.some(l => l.id === lesson.id), 'Supplement stays scoped to A1–A2');
    for (const q of lesson.questions) {
      assert.ok(q.prompt.ar && q.prompt.de && q.explanation.ar && q.explanation.de);
      assert.ok(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.options.length);
      assert.equal(new Set(q.options).size, q.options.length);
    }
  }
  const lesson = require('../data/a1-a2-time-place.json');
  assert.equal(lesson.questions[12].options[lesson.questions[12].correct], 'مُبْتَدَأٌ');
  assert.equal(lesson.questions[13].options[lesson.questions[13].correct], 'اسْمٌ مَجْرُورٌ بِـ«فِي»');
});
