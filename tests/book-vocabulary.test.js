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

test('all 29 photographed pages are represented and every reviewed form has a non-duplicated lexical card',()=>{
 assert.equal(source.sourceImageCount,29);
 assert.equal(source.pages.length,29);
 assert.deepEqual(source.pages.map(p=>p.image).sort((a,b)=>a-b),Array.from({length:29},(_,i)=>i));
 assert.match(source.sourceArchiveSha256,/^[a-f0-9]{64}$/);
 const byId=new Map(source.entries.map(w=>[w.id,w]));
 assert.equal(byId.size,175);
 assert.equal(new Set(source.entries.map(w=>norm(w.ar))).size,175);
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

test('book vocabulary has eight lists of twenty and an honest last list of fifteen, independent of CEFR',()=>{
 assert.equal(collection.id,'book-vocabulary');assert.equal(collection.count,175);
 assert.equal(collection.title,'مفردات الكتب');
 assert.deepEqual(collection.lists.map(l=>l.count),[20,20,20,20,20,20,20,20,15]);
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
 assert.equal(manifest.clips.length,175);
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
