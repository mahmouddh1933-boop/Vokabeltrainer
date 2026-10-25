const { test } = require("node:test");
const assert = require("node:assert/strict");
const { letters, audio } = require("../js/letter-data.js");
const { clips } = require("../audio/pronunciation-corrections.json");
const { clips: nameClips } = require("../audio/letter-name-waqf.json");
const revised = require("../audio/letter-pronunciation-revision.json").clips;
const fs = require("node:fs"), path = require("node:path"), crypto = require("node:crypto");

test("Requested pronunciation fixes use fresh extracted targets and preserve pause on the names and fata", () => {
  assert.equal(revised.length,11);
  for(const clip of revised){
    const bytes=fs.readFileSync(path.join(__dirname,'..',clip.path));
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),clip.sha256);
    assert.ok(clip.trimStart>0 && clip.trimEnd>clip.trimStart+.3);
    assert.ok(clip.seconds>.3 && clip.seconds<4);
  }
  for(const char of ['ج','و']) {
    const letter=letters.find(l=>l.char===char),clip=revised.find(c=>c.kind==='name'&&c.letter===char);
    assert.equal(audio[letter.spokenName],clip.path);
    assert.ok(clip.text.endsWith('ْ'));
    assert.ok(clip.path.includes('clear'));
  }
  const alif=letters[0];
  assert.deepEqual(alif.vowelForms,['أَ','إِ','أُ','أْ']);
  const kasra=revised.find(c=>c.kind==='vowel');
  assert.equal(kasra.text,'إِ');assert.equal(audio['إِ'],kasra.path);
  const related=require('../js/letter-related-data.js');
  const fata=related.groups['أ'].cards.find(c=>c.glyph==='ى');
  assert.equal(fata.word,'فَتَى');assert.ok(!fata.word.includes('ً'));
  assert.equal(related.audio[fata.word],revised.find(c=>c.kind==='related').path);
});

test("Ambiguous picture words have explicit, matching vocalized recordings", () => {
  for (const [char, expected] of Object.entries({
    ج: "جَمَل", ذ: "ذُرَة", ض: "ضِفْدَع", ظ: "ظَرْفٌ", ع: "عِنَبٌ", ر: "رُمَّان",
    د: "دُبٌّ", ف: "فِيلٌ", ل: "لَيْمُونٌ", ه: "هِلَالٌ", ي: "يَدٌ",
  })) {
    const letter = letters.find((l) => l.char === char);
    assert.equal(letter.spokenWord, expected);
    const file = audio[expected.normalize("NFC")];
    assert.equal(file, audio[letter.word]);
    assert.ok(clips.some((c) => c.path === file && c.text.normalize("NFC") === expected.normalize("NFC")));
  }
  assert.ok(nameClips.some((c) => c.path === audio["التاء"] && c.text === "التَّاءْ".normalize("NFC")));
  assert.equal(letters.find((l) => l.char === "ر").img, "images/letters/10.png");
});

test("All sukun recordings use a pronounceable context, including hamza, waw and ya", () => {
  for (const letter of letters) {
    const expected = letter.char === "أ" ? "اِقْرَأْ" : `أَ${letter.char}ْ`;
    assert.equal(letter.sukunSample, expected);
    const file = audio[expected.normalize("NFC")];
    assert.ok(file);
    assert.equal(file, audio[(letter.char + "ْ").normalize("NFC")]);
    assert.ok(clips.some((c) => c.path === file && c.text === expected));
  }
  assert.equal(new Set(clips.map((c) => c.path)).size, clips.length);
});
