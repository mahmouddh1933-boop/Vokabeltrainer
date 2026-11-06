const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const D = require('../js/reading-trainer-data');
const M = require('../audio/reading-trainer-manifest.json');
const norm = (s) => s.normalize('NFC');
const word = (s) => D.words.find((w) => w.word === norm(s));

test('150 vocalized words retain three levels of 50 and contain sounds instead of letter names', () => {
  assert.equal(D.version, 3);
  assert.equal(D.words.length, 150);
  assert.equal(new Set(D.words.map((w) => w.word)).size, 150);
  assert.equal(new Set(D.words.map((w) => w.id)).size, 150);
  for (const level of D.levels) assert.equal(D.words.filter((w) => w.level === level.id).length, 50);
  for (const w of D.words) {
    assert(w.de && /[\u064e-\u0652]/u.test(w.word));
    assert.equal(w.letters.map((l) => l.text).join(''), w.word);
    assert.equal(w.sounds.length, w.letters.length);
    for (const [i,s] of w.sounds.entries()) {
      assert.equal(w.letters[i].name, undefined);
      assert.equal(s.text, w.letters[i].text);
      assert.equal(s.spokenText, s.letters.map((j) => w.letters[j].text).join(''));
      assert(s.letters.includes(i) && s.letters.every((j) => j <= i));
      assert.equal(s.context, s.letters.length > 1);
      assert(s.phonemes && !/[A-Z]/u.test(s.phonemes));
    }
  }
});

test('written sound references preserve ka/ki/ku, ja and wa without letter-name phones', () => {
  assert.deepEqual(word('كَتَبَ').sounds.map((s) => s.spokenText), ['كَ','تَ','بَ']);
  assert.deepEqual(word('كَتَبَ').sounds.map((s) => s.phonemes), ['kˈa','tˈa','bˈa']);
  assert.equal(word('كِتَابْ').sounds[0].phonemes, 'kˈi');
  assert.equal(word('كُرْسِيّْ').sounds[0].phonemes, 'kˈu');
  assert.equal(word('جَلَسَ').sounds[0].phonemes, 'dʒˈa');
  assert.equal(word('وَقَفَ').sounds[0].phonemes, 'wˈa');
  assert.equal(word('كِتَابْ').sounds[2].phonemes, 'tˈaː');
  assert.equal(word('كِتَابْ').sounds[3].spokenText, 'تَابْ');
  assert.deepEqual(word('كِتَابْ').sounds[3].letters, [1,2,3]);
  assert.equal(word('مَدْرَسَة').sounds[1].spokenText, 'مَدْ');
  assert.equal(word('مُعَلِّمْ').sounds[2].phonemes, 'ʕˈalli');
  assert.equal(word('مَدْرَسَة').sounds.at(-1).phonemes, 'sˈah');
  for (const w of D.words) for (const s of w.sounds) assert(!/كَاف|بَاء|تَاء|جِيم|وَاو/u.test(s.spokenText));
});

test('reported dahaba regression uses three distinct recordings and retains the acoustic diagnostic for the actual track', () => {
  const w = word('ذَهَبَ');
  const clip = M.clips.find((c) => c.id === w.id);
  assert.equal(new Set(clip.events.filter((e) => e.stage === 'letters').map((e) => e.sourceSha256)).size, 3);
  const report = require('../docs/READING-VOICE-AUDIT.json');
  const check = report.results.find((r) => r.id === w.id);
  assert.equal(check.word, w.word);
  assert.equal(typeof check.recognized, 'string');
  assert(check.recognized.length > 0);
  assert.equal(check.trackSha256, clip.sha256);
  assert.equal(check.sourceSha256, clip.events.at(-1).sourceSha256);
  assert.equal(report.humanPhoneticReview, false);
});

test('cumulative reading begins with the first two written letters and grows by exactly one to the full word', () => {
  for (const [text, expected] of [
    ['كَتَبَ', ['كَتَ','كَتَبَ']],
    ['كِتَابْ', ['كِتَ','كِتَا','كِتَابْ']],
    ['مَدْرَسَة', ['مَدْ','مَدْرَ','مَدْرَسَ','مَدْرَسَة']],
    ['مُعَلِّمْ', ['مُعَ','مُعَلِّ','مُعَلِّمْ']],
  ]) assert.deepEqual(word(text).prefixes.map((p) => p.text), expected.map(norm));
  for (const w of D.words) {
    assert.equal(w.prefixes.length, w.letters.length-1);
    for (const [i,p] of w.prefixes.entries()) {
      assert.equal(p.count, i+2);
      assert.deepEqual(p.letters, Array.from({length:i+2}, (_,j) => j));
      assert.equal(p.text, w.letters.slice(0,i+2).map((l) => l.text).join(''));
    }
    assert.equal(w.prefixes.at(-1).text, w.word);
    assert.equal(w.prefixes.at(-1).phonemes, w.wordPhonemes);
  }
  assert.deepEqual(word('كَتَبَ').prefixes.map((p) => p.phonemes), ['kˈata','kˈataba']);
  assert.equal(word('هَدِيَّة').wordPhonemes, 'hadˈijjah');
  assert.equal(word('مَسْؤُولْ').wordPhonemes, 'masʔˈuːl');
});

test('all corrected local tracks have new cache-safe URLs, verified bytes, and sound/prefix/word clock events', () => {
  assert.equal(M.version, 3);
  assert.equal(M.clips.length, 150);
  assert.equal(new Set(M.clips.map((c) => c.path)).size, 150);
  assert.equal(fs.readdirSync(path.join(__dirname,'../audio/reading-trainer')).filter((n) => n.endsWith('.mp3')).length, 150);
  for (const w of D.words) {
    const c = M.clips.find((c) => c.id === w.id);
    assert(c.path.endsWith('-voice-v3.mp3'));
    assert(!fs.existsSync(path.join(__dirname,'../audio/reading-trainer',w.id+'.mp3')));
    const bytes = fs.readFileSync(path.join(__dirname, '..', c.path));
    assert(bytes.length > 15000);
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), c.sha256);
    assert.equal(c.text, w.word);
    assert.match(M.provider,/Google Translate/);
    assert(c.events.every((e)=>/^[a-f0-9]{64}$/.test(e.sourceSha256)));
    assert.deepEqual(w.events, c.events);
    assert(c.seconds > 3 && c.seconds < 45);
    const expected=[...w.sounds.map((s)=>({stage:'letters',text:s.spokenText,ipa:s.phonemes})),
      ...w.prefixes.map((p)=>({stage:'prefixes',text:p.text,ipa:p.phonemes})),
      {stage:'word',text:w.word,ipa:w.wordPhonemes}];
    assert.equal(c.events.length, expected.length);
    let end=0;
    for (const [i,e] of c.events.entries()) {
      assert.equal(e.stage, expected[i].stage);
      assert.equal(e.spokenText, expected[i].text);
      assert.equal(e.phonemes, expected[i].ipa);
      assert(e.start >= end && e.end > e.start && e.end < c.seconds);
      assert(e.end-e.start > .09);
      end=e.end;
    }
  }
});
