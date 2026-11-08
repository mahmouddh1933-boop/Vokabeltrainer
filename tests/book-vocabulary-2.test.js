const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const review=require('../data/book-vocabulary-2-review.json');
const source=require('../data/book-vocabulary-2-source.json');
const first=require('../data/book-vocabulary-source.json');
const catalog=require('../data/vocab_catalog.json');
const B=catalog.bookVocabulary2;
const norm=s=>s.normalize('NFC');
const get=ar=>source.entries.find(e=>e.ar===norm(ar));

test('both new archives and all 46 manually read photos have traceable lexical coverage',()=>{
 assert.deepEqual(source.archives.map(a=>a.imageCount),[24,22]);
 assert.equal(source.sourceImageCount,46);assert.equal(source.pages.length,46);
 assert.deepEqual(source.pages.map(p=>p.image),Array.from({length:46},(_,i)=>i));
 assert.deepEqual(source.archives,review.archives);
 const byId=new Map(source.entries.map(e=>[e.id,e]));
 assert.equal(byId.size,644);assert.equal(new Set(source.entries.map(e=>e.ar)).size,644);
 for(const page of source.pages){
  assert.match(page.sha256,/^[a-f0-9]{64}$/);
  assert.equal(page.sha256,review.pages.find(p=>p.image===page.image).sha256);
  assert.equal(page.localImage,page.image-(page.image>=24?24:0));
  assert(page.observedForms.length&&page.entryIds.length);
  for(const form of page.observedForms)assert(page.entryIds.some(id=>byId.get(id).sourceForms.includes(form)),`${page.image}: ${form}`);
  for(const id of page.entryIds)assert(byId.get(id).sourceImages.includes(page.image));
 }
 for(const e of source.entries){
  assert.equal(e.ar,norm(e.ar));assert(/[\u064b-\u0652]/u.test(e.ar),e.ar);
  assert(e.de&&e.sourceImages.length&&e.sourceForms.length);
 }
});

test('review preserves meaning-relevant vowels, complete numbers and contextual German meanings',()=>{
 for(const [ar,de] of [['مَكْتَبٌ','der Schreibtisch; das Büro'],['مَكْتَبَةٌ','die Bibliothek; das Bücherregal'],['سَلِيمٌ','gesund; unversehrt'],['جَدٌّ','der Großvater'],['جِدٌّ','der Fleiß; die Ernsthaftigkeit'],['رَجُلٌ','der Mann'],['رِجْلٌ','das Bein; der Fuß'],['خَمْسَةٌ وَعِشْرُونَ','fünfundzwanzig'],['مَالِي','Mali (Land)'],['مَالِيٌّ','malisch; der Malier']])assert.equal(get(ar)?.de,de,ar);
 assert(get('تَفَضَّلْ'));assert(get('يُفَضِّلُ'));assert(get('أَفْضَلُ'));
 assert(get('شَقَّةٌ').sourceForms.includes('شقتي'));
 assert(get('يَشْتَرِي').sourceForms.includes('اشترى'));
 assert(get('مَكْتَبٌ').sourceForms.includes('مكتبي'));
 assert(get('مَكْتَبَةٌ').sourceForms.includes('مكتبتي'));
 assert(get('مِنْ').sourceForms.includes('مِنْ'));
});

test('books have independent lists and preserve the full first-book collection above unchanged CEFR levels',()=>{
 assert.equal(catalog.bookVocabulary.title,'مفردات الكتاب 1');assert.equal(catalog.bookVocabulary.count,340);
 assert.equal(B.title,'مفردات الكتاب 2');assert.equal(B.count,644);
 assert.equal(B.lists.length,33);assert.deepEqual(B.lists.map(l=>l.count),[...Array(32).fill(20),4]);
 assert.equal(B.lists[0].title,'القائمة الأولى');assert.equal(B.lists[32].title,'القائمة الثالثة والثلاثون');
 const ids=[...catalog.lists,...catalog.bookVocabulary.lists,...B.lists].map(l=>l.id);
 assert.equal(new Set(ids).size,170);
 assert.deepEqual(catalog.bookVocabulary.lists.flatMap(l=>l.words).map(w=>[w.entryId,w.ar,w.de]),first.entries.map(e=>[e.id,e.ar,e.de]));
 assert.deepEqual(B.lists.flatMap(l=>l.words).map(w=>[w.entryId,w.ar,w.de]),source.entries.map(e=>[e.id,e.ar,e.de]));
 assert(B.lists.every(l=>l.id.startsWith('book2_20261108_')&&new Set(l.words.map(w=>w.de)).size===l.count));
 assert.equal(catalog.lists.length,120);assert.deepEqual(catalog.cefrLevels,['A1','A2','B1','B2']);
});

test('every second-book word has exact bundled audio with a current source hash',()=>{
 const manifest=require('../audio/book-vocabulary-manifest.json');const audio=require('../js/book-vocabulary-audio.js').audio;
 const record=manifest.sources.find(s=>s.path==='data/book-vocabulary-2-source.json');
 assert(record);assert.equal(record.count,644);
 assert.equal(record.sha256,crypto.createHash('sha256').update(fs.readFileSync(record.path)).digest('hex'));
 for(const e of source.entries)assert(audio[e.ar],e.ar);
});
