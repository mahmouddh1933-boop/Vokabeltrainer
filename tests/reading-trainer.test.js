const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const D = require('../js/reading-trainer-data');
const M = require('../audio/reading-trainer-manifest.json');
const normalized = (s) => s.normalize('NFC');
const word = (s) => D.words.find((w) => w.word === normalized(s));

test('150 distinct, vocalized useful words are divided into three curated banks of 50', () => {
  assert.equal(D.words.length, 150);
  assert.equal(new Set(D.words.map((w) => w.word)).size, 150);
  assert.equal(new Set(D.words.map((w) => w.id)).size, 150);
  for (const level of D.levels) {
    assert.equal(D.words.filter((w) => w.level === level.id).length, 50);
    assert(level.description.ar && level.description.de);
  }
  for (const w of D.words) {
    assert(w.de && /[\u064e-\u0652]/u.test(w.word));
    assert.equal(w.letters.map((l) => l.text).join(''), w.word);
    assert(w.letters.every((l) => l.name));
    const covered = new Set(w.syllables.flatMap((s) => s.letters));
    assert.deepEqual([...covered].sort((a,b) => a-b), w.letters.map((_,i) => i));
    for (const s of w.syllables) {
      assert(s.text && s.letters.length && new Set(s.letters).size === s.letters.length);
      assert(s.letters.every((i) => Number.isInteger(i) && i >= 0 && i < w.letters.length));
    }
  }
});

test('independent syllable and phoneme fixtures preserve vowels, long vowels, shadda, hamza and pause forms', () => {
  for (const [text, syllables, ipa] of [
    ['كَتَبَ', ['كَ','تَ','بَ'], 'kˈataba'],
    ['كِتَابْ', ['كِ','تَابْ'], 'kitˈaːb'],
    ['مَدْرَسَة', ['مَدْ','رَ','سَة'], 'mˈadrasah'],
    ['مُعَلِّمْ', ['مُ','عَلْ','لِمْ'], 'muʕˈallim'],
    ['هَدِيَّة', ['هَ','دِيْ','يَة'], 'hadˈijjah'],
    ['مَسْؤُولْ', ['مَسْ','ؤُولْ'], 'masʔˈuːl'],
  ]) {
    const w = word(text);
    assert.deepEqual(w.syllables.map((s) => s.text), syllables);
    assert.equal(M.clips.find((c) => c.id === w.id).wordPhonemes, ipa);
  }
  assert.deepEqual(word('مُعَلِّمْ').syllables.map((s) => s.letters), [[0],[1,2],[2,3]]);
  assert.deepEqual(word('كِتَابْ').syllables.map((s) => s.letters), [[0],[1,2,3]]);
  assert.equal(word('جَلَسَ').letters[0].name, 'جِيمْ');
  assert.equal(word('وَقَفَ').letters[0].name, 'وَاوْ');
  assert(word('مُسْتَشْفَى'));
});

test('all 150 local tracks have verified bytes and ordered real audio-clock events for all three stages', () => {
  assert.equal(M.clips.length, 150);
  assert.equal(new Set(M.clips.map((c) => c.path)).size, 150);
  for (const w of D.words) {
    const c = M.clips.find((c) => c.id === w.id);
    const bytes = fs.readFileSync(path.join(__dirname, '..', c.path));
    assert(bytes.length > 15000);
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), c.sha256);
    assert.equal(c.text, w.word);
    assert.deepEqual(w.events, c.events);
    assert(c.seconds > 3 && c.seconds < 25);
    assert.equal(c.events.length, w.letters.length + w.syllables.length + 1);
    assert.deepEqual(c.events.map((e) => e.stage), [
      ...w.letters.map(() => 'letters'), ...w.syllables.map(() => 'syllables'), 'word',
    ]);
    let end = 0;
    for (const e of c.events) {
      assert(e.start >= end && e.end > e.start && e.end < c.seconds);
      assert(e.end - e.start > 0.09);
      end = e.end;
    }
    assert.equal(c.events[0].index, 0);
    assert.equal(c.events.at(-1).index, 0);
  }
});
