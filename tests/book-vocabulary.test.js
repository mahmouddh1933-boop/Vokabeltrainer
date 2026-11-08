const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const source=require('../data/book-vocabulary-source.json');
const collection=require('../data/vocab_catalog.json').bookVocabulary;
const manifest=require('../audio/book-vocabulary-manifest.json');
const audio=require('../js/book-vocabulary-audio.js').audio;
const norm=s=>s.normalize('NFC');

test('all 53 photographed pages are represented and every reviewed form has a non-duplicated lexical card',()=>{
 assert.equal(source.sourceImageCount,53);
 assert.equal(source.pages.length,53);
 assert.deepEqual(source.pages.map(p=>p.image).sort((a,b)=>a-b),Array.from({length:53},(_,i)=>i));
 assert.match(source.sourceArchiveSha256,/^[a-f0-9]{64}$/);
 const byId=new Map(source.entries.map(w=>[w.id,w]));
 assert.equal(byId.size,340);
 assert.equal(new Set(source.entries.map(w=>norm(w.ar))).size,340);
 for(const page of source.pages){
  assert.match(page.sha256,/^[a-f0-9]{64}$/);
  assert(page.fileName.endsWith('.jpeg')&&page.observedForms.length&&page.entryIds.length);
  for(const form of page.observedForms)assert(page.entryIds.some(id=>byId.get(id).sourceForms.includes(form)),`${page.image}: ${form}`);
  for(const id of page.entryIds)assert(byId.get(id).sourceImages.includes(page.image));
 }
 for(const w of source.entries){
  assert.equal(w.ar,norm(w.ar));
  assert(/[\u064b-\u0652]/u.test(w.ar),w.ar);
  assert(w.de&&w.sourceImages.length&&w.sourceForms.length,w.ar);
 }
 const entry=ar=>source.entries.find(w=>w.ar===norm(ar));
 for(const ar of ['مَنْ','مِنْ','أَنْتَ','أَنْتِ','مُعِزٌّ','يَسْتَحِمُّ','فِرَاشٌ','مِبْرَاةٌ','فُطُورٌ'])assert(entry(ar),ar);
 assert.equal(entry('مَنْ').de,'wer');assert.equal(entry('مِنْ').de,'aus / von');
 assert(entry('حَقِيبَةٌ').sourceForms.includes('حقيبتي'));
 assert(entry('حَقِيبَةٌ').sourceForms.includes('حقيبتك'));
 assert(entry('غُرْفَةٌ').sourceForms.includes('غرف'));
 assert(entry('فُطُورٌ').sourceImages.includes(0));
 assert(entry('خَرِيطَةٌ').sourceImages.includes(24));
});

test('book vocabulary has seventeen complete lists of twenty, independent of CEFR',()=>{
 assert.equal(collection.id,'book-vocabulary');assert.equal(collection.count,340);
 assert.equal(collection.title,'مفردات الكتب');
 assert.deepEqual(collection.lists.map(l=>l.count),Array(17).fill(20));
 assert.equal(collection.lists[0].title,'القائمة الأولى');assert.equal(collection.lists[8].title,'القائمة التاسعة');
 const words=collection.lists.flatMap(l=>l.words);
 assert.deepEqual(words.map(w=>w.entryId),source.entries.map(w=>w.id));
 assert.deepEqual(words.map(({ar,de})=>({ar,de})),source.entries.map(({ar,de})=>({ar,de})));
 for(const l of collection.lists){
  assert.equal(l.collection,'book-vocabulary');assert.equal(l.level,undefined);
  assert.equal(l.words.length,l.count);assert.equal(new Set(l.words.map(w=>w.de)).size,l.count);
  assert(l.id.startsWith('books_20261107_'));
 }
 const catalog=require('../data/vocab_catalog.json');
 assert.equal(catalog.lists.length,120);assert.equal(catalog.levels.length,4);
 assert(catalog.levels.every(l=>l.listIds.length===30));
});

test('all book words have exact local audio, with vowel-sensitive keys and unchanged CEFR audio',()=>{
 assert.equal(manifest.complete,true);
 assert.equal(manifest.clips.length,340);
 assert.equal(manifest.sourceSha256,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'data/book-vocabulary-source.json'))).digest('hex'));
 assert.deepEqual(Object.keys(audio).sort(),source.entries.map(w=>w.ar).sort());
 for(const c of manifest.clips){
  assert.equal(audio[c.text],c.path);
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,c.path))).digest('hex'),c.sha256);
  assert(c.seconds>.2&&c.seconds<20);
 }
 assert.notEqual(audio[norm('مَنْ')],audio[norm('مِنْ')]);
 for(const name of ['lernseite','test4','review']){
  const html=fs.readFileSync(path.join(root,name+'.html'),'utf8');
  assert(html.indexOf('js/book-vocabulary-audio.js')>=0);
  assert(html.indexOf('js/book-vocabulary-audio.js')<html.indexOf('js/app.js'));
 }
});


test('second photo batch adds vocabulary without duplicating earlier inflections or inheriting ninth-list mastery',()=>{
 const old=require('../data/book-vocabulary-batches/20261107.json');
 assert.deepEqual(source.archives.map(a=>a.imageCount),[29,24]);
 assert.deepEqual(source.entries.slice(0,175).map(e=>[e.id,e.ar]),old.entries.map(e=>[e.id,e.ar]));
 const get=ar=>source.entries.find(e=>e.ar===norm(ar));
 for(const [ar,de] of [['جُبْنٌ','der Käse'],['صُوفِيَّةٌ','aus Wolle (weiblich)'],['أَحَدَ عَشَرَ','elf'],['سَبْعَةَ عَشَرَ','siebzehn'],['يَدْرُسُ','lernen; studieren'],['مُخَيَّمٌ','das Zeltlager; der Campingplatz']])assert.equal(get(ar)?.de,de);
 assert(get('لَذِيذٌ').sourceForms.includes('اللذيذة'));
 assert(!get('لَذِيذَةٌ'));
 assert(get('يُدَرِّسُ'));assert(get('وَرَقَةٌ').sourceForms.includes('الأوراق'));
 assert(get('يَأْكُلُ').sourceImages.includes(29));
 for(let i=0;i<8;i++)assert.equal(collection.lists[i].id,`books_20261107_${String(i+1).padStart(2,'0')}`);
 assert.equal(collection.lists[8].id,'books_20261107_09_v2');
 for(const page of source.pages.filter(p=>p.archiveId==='20261108'))assert.equal(page.image,29+page.localImage);
});
