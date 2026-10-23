const {test} = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {createHash} = require("node:crypto");
const {lessons,stages} = require("../js/grammar-data.js");
const pictures = require("../js/vocab-pictures.js");
const related = require("../js/letter-related-data.js");
const get = id => lessons.find(l=>l.id===id);
const answer = (id,index) => get(id).questions[index].options[get(id).questions[index].correct];

test("Four stages cover all 37 stable lesson IDs once and prerequisites precede each lesson",()=>{
  assert.equal(stages.length,4);
  const ids=stages.flatMap(s=>s.ids);
  assert.equal(ids.length,37); assert.equal(new Set(ids).size,37);
  assert.deepEqual(lessons.map(l=>l.id),ids);
  assert.equal(lessons[0].id,"word-classes");
  for(const l of lessons) {
    assert.ok(stages.some(s=>s.id===l.stage && s.ids.includes(l.id)));
    for(const id of l.prerequisites) assert.ok(ids.indexOf(id)>=0 && ids.indexOf(id)<ids.indexOf(l.id),l.id+" requires "+id);
  }
  assert.equal(lessons.filter(l=>l.id==="purpose-object").length,1);
  assert.equal(lessons.filter(l=>l.id==="absolute-object").length,1);
});
test("Independent spelling and syntax fixtures retain their distinct functions and accepted variants",()=>{
  assert.equal(answer("ta-endings",5),"لأن الراء لا تتصل بما بعدها");
  assert.equal(answer("ta-endings",8),"تاء مبسوطة");
  assert.equal(answer("alif-endings",6),"يحيى");
  assert.equal(answer("alif-endings",10),"همزةً يتلوها مدّ بالألف");
  assert.equal(answer("case-basics",10),"الكسرة");
  assert.equal(answer("subject-object",9),"مبتدأ");
  assert.equal(answer("circumstantial",5),"الياء");
  assert.equal(answer("circumstantial",7),"جملة اسمية في محل نصب");
  assert.equal(answer("tamyiz",6),"مفرد منصوب");
  assert.equal(answer("tamyiz",7),"مضاف إليه مجرور");
  assert.equal(answer("hamza-exceptions",4),"بيئة");
  assert.equal(answer("hamza-exceptions",7),"شيئان");
  assert.equal(answer("hamza-exceptions",8),"عبئان");
  assert.equal(answer("hamza-exceptions",11),"رسمان متداولان صحيحان والألف الزائدة لا تنطق");
  for(const id of ["ta-endings","alif-endings","case-basics","subject-object","circumstantial","tamyiz","hamza-exceptions"])
    assert.equal(get(id).questions.length,12);
});
test("Related letter forms have accurate seats, connected and disconnected ta examples, and real recordings",()=>{
  assert.deepEqual(related.groups["أ"].cards.map(c=>c.glyph),["أ","إ","آ","ا","ؤ","ئ","ء","ى"]);
  assert.deepEqual(related.groups["ت"].cards.map(c=>[c.glyph,c.word]),[["ت","بَيْتٌ"],["ـة","مَدْرَسَةٌ"],["ة","كُرَةٌ"]]);
  const clips=require("../audio/letter-related-manifest.json").clips;
  assert.equal(clips.length,11);
  for(const group of Object.values(related.groups))for(const card of group.cards){
    assert.ok(card.word.includes(card.target));
    const file=related.audio[card.word.normalize("NFC")];
    const clip=clips.find(c=>c.path===file); assert.equal(clip.text,card.word);
    assert.equal(createHash('sha256').update(fs.readFileSync(path.join(__dirname,'..',file))).digest('hex'),clip.sha256);
  }
});
test("Pictures are tiny local SVGs keyed to the exact bilingual meaning, with no atomic-corn confusion",()=>{
  assert.equal(Object.keys(pictures.mappings).length,112);
  for(const file of Object.values(pictures.mappings)){
    const payload=fs.readFileSync(path.join(__dirname,'..',file));
    assert.ok(payload.length<1400); assert.ok(payload.toString().startsWith('<svg'));
    assert.ok(!/href=|<script|<image|@import/.test(payload.toString()));
  }
  assert.ok(pictures.get('رُمَّانٌ','der Granatapfel'));
  assert.ok(pictures.get('ذُرَةٌ','der Mais'));
  assert.equal(pictures.get('ذَرَّةٌ','das Atom'),null);
  assert.ok(pictures.get('أحمر','rot'));
  assert.equal(pictures.get('أحمر','blau'),null);
  assert.equal(pictures.get('شيء غير معروف','unbekannt'),null);
});
