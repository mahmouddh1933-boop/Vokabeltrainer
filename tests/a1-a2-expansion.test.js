const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const base=process.env.HUROOF_BUILD_DIR||'/tmp/huroof-four-apps/a1-a2';
const verbs=require(path.join(base,'js/verb-data.js'));
const original=require('../js/verb-data.js');
const getData=file=>{const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(base,file),'utf8'),ctx);return ctx.window;};
const practice=getData('js/practice-data.js').ArabicPracticeData;
const grammar=getData('js/grammar-data.js').ArabicGrammarData;
const links=require('../data/a1-a2-unit-links.json');
const get=ar=>verbs.verbs.find(v=>verbs.conjugate(v,'past',verbs.pronouns[8])===ar);
test('All 51 original verbs plus 200 distinct additions have complete paradigms and six valid families',()=>{
 assert.equal(verbs.verbs.length,251);
 assert.equal(new Set(verbs.verbs.map(v=>v.id)).size,251);
 assert.equal(new Set(verbs.verbs.map(v=>verbs.conjugate(v,'past',verbs.pronouns[8]).normalize('NFC'))).size,251);
 for(const old of original.verbs)assert.deepEqual(verbs.verbs.find(v=>v.id===old.id),old);
 for(const v of verbs.verbs){
  assert.ok(['sound','hamzated','doubled','example','hollow','defective'].includes(v.family));
  assert.ok([3,4,5,6].includes(v.formLength));
  for(const tense of ['past','present','imperative'])for(const p of verbs.pronounsFor(tense)){
   const f=verbs.conjugate(v,tense,p);assert.ok(f&&!/undefined|null|[A-Za-z]/.test(f),v.id+': '+f);
  }
  for(const mode of ['past','present','past-lam','future','prohibition'])for(const p of mode==='prohibition'?verbs.imperativePronouns:verbs.pronouns){
   const f=verbs.negativeForm(v,mode,p);assert.ok(f&&!/undefined|null/.test(f));
  }
 }
});
test('Independent fixtures distinguish weak-letter deletion, feminine plural nun, hamza and gemination',()=>{
 const fixtures=[
  ['رَمَى','past',0,'رَمَيْتُ'],['رَمَى','past',12,'رَمَوْا'],['رَمَى','past-lam',8,'لَمْ يَرْمِ'],['رَمَى','future',8,'لَنْ يَرْمِيَ'],
  ['سَعَى','imperative',3,'اِسْعَيْ'],['سَعَى','past-lam',3,'لَمْ تَسْعَيْ'],['سَعَى','future',6,'لَنْ تَسْعَوْا'],
  ['رَجَا','past',0,'رَجَوْتُ'],['رَجَا','past-lam',8,'لَمْ يَرْجُ'],['رَجَا','future',8,'لَنْ يَرْجُوَ'],
  ['وَصَلَ','present',8,'يَصِلُ'],['وَضَعَ','imperative',2,'ضَعْ'],['وَثِقَ','present',8,'يَثِقُ'],
  ['بَاعَ','past',0,'بِعْتُ'],['بَاعَ','past-lam',8,'لَمْ يَبِعْ'],['خَافَ','present',13,'يَخَفْنَ'],
  ['زَارَ','imperative',3,'زُورِي'],['صَامَ','past-lam',8,'لَمْ يَصُمْ'],['طَارَ','future',8,'لَنْ يَطِيرَ'],
  ['أَمَرَ','present',0,'آمُرُ'],['أَمَرَ','imperative',2,'مُرْ'],['بَدَأَ','past',10,'بَدَآ'],['مَلَأَ','present',10,'يَمْلَآنِ'],
  ['رَدَّ','past',0,'رَدَدْتُ'],['رَدَّ','past-lam',8,'لَمْ يَرُدَّ'],['رَدَّ','present',13,'يَرْدُدْنَ'],
  ['ظَنَّ','past',1,'ظَنَنَّا'],['ظَنَّ','imperative',7,'اُظْنُنَّ'],['أَعْلَنَ','past',1,'أَعْلَنَّا'],
  ['دَرَّبَ','present',8,'يُدَرِّبُ'],['نَاقَشَ','present',8,'يُنَاقِشُ'],['أَنْجَزَ','imperative',2,'أَنْجِزْ'],
  ['تَدَرَّبَ','present',8,'يَتَدَرَّبُ'],['تَقَابَلَ','future',8,'لَنْ يَتَقَابَلَ'],
  ['اِنْكَسَرَ','past-lam',8,'لَمْ يَنْكَسِرْ'],['اِحْتَرَمَ','present',8,'يَحْتَرِمُ'],['اِسْتَكْشَفَ','imperative',2,'اِسْتَكْشِفْ']
  ,['نَزَلَ','imperative',2,'اِنْزِلْ'],['ضَحِكَ','present',8,'يَضْحَكُ'],['سَكَتَ','past',0,'سَكَتُّ'],['سَجَنَ','past',1,'سَجَنَّا'],
  ['سَخُنَ','present',8,'يَسْخُنُ'],['أَمِنَ','present',0,'آمَنُ'],['بَرِئَ','past',12,'بَرِئُوا'],
  ['دَلَّ','past',0,'دَلَلْتُ'],['عَضَّ','present',13,'يَعْضَضْنَ'],['شَمَّ','past-lam',8,'لَمْ يَشُمَّ'],
  ['وَرِثَ','past-lam',8,'لَمْ يَرِثْ'],['وَسِعَ','present',8,'يَسَعُ'],['مَاتَ','past',0,'مُتُّ'],['مَاتَ','future',8,'لَنْ يَمُوتَ'],['مَاتَ','past-lam',8,'لَمْ يَمُتْ'],
  ['عَاشَ','past',0,'عِشْتُ'],['سَارَ','imperative',2,'سِرْ'],['نَسِيَ','past',0,'نَسِيتُ'],['نَسِيَ','past',9,'نَسِيَتْ'],['نَسِيَ','past',12,'نَسُوا'],
  ['نَسِيَ','present',8,'يَنْسَى'],['نَسِيَ','future',6,'لَنْ تَنْسَوْا'],['نَسِيَ','past-lam',8,'لَمْ يَنْسَ'],['نَسِيَ','imperative',3,'اِنْسَيْ'],
  ['بَقِيَ','past',13,'بَقِينَ'],['بَقِيَ','present',10,'يَبْقَيَانِ'],['رَضِيَ','past',10,'رَضِيَا'],['هَدَى','imperative',2,'اِهْدِ'],
  ['فَكَّرَ','present',8,'يُفَكِّرُ'],['قَدَّمَ','present',1,'نُقَدِّمُ'],['اِنْتَظَرَ','present',8,'يَنْتَظِرُ'],['اِسْتَسْلَمَ','imperative',2,'اِسْتَسْلِمْ']
 ];
 for(const [ar,tense,person,expected] of fixtures){const v=get(ar);assert.ok(v,ar);const p=verbs.pronouns[person];assert.equal(['past','present','imperative'].includes(tense)?verbs.conjugate(v,tense,p):verbs.negativeForm(v,tense,p),expected,ar+' '+tense+' '+person);}
});
test('Each new story has its own scene rather than a reused old illustration',()=>{
 const added=practice.stories.filter(s=>s.illustration);
 assert.equal(added.length,18);
 assert.equal(new Set(added.map(s=>s.illustration+':'+s.art)).size,18);
 assert.deepEqual([...new Set(added.map(s=>s.illustration))].sort(),['images/stories/new-scenes-1.webp','images/stories/new-scenes-2.webp','images/stories/new-scenes-3.webp']);
 for(const s of added){assert.ok(fs.existsSync(path.join(base,s.illustration)));assert.ok(s.art>=0&&s.art<6);}
});
test('Each level has twelve different stories, 6 translated lines and 4 evidence-linked comprehension questions',()=>{
 assert.equal(practice.stories.length,24);
 for(const level of ['A1','A2'])assert.equal(practice.stories.filter(s=>s.level===level).length,12);
 assert.equal(new Set(practice.stories.map(s=>s.title.ar)).size,24);
 for(const s of practice.stories){
  assert.equal(s.lines.length,6);assert.equal(s.questions.length,4);
  assert.ok(s.lines.every(l=>l.ar&&l.de&&/[َُِّْ]/.test(l.ar)));
  for(const q of s.questions){assert.ok(s.lines[q.evidence]);assert.ok(q.options[q.correct]?.ar);assert.equal(new Set(q.options.map(o=>o.ar)).size,3);}
 }
});
test('Every unit links to specific, locally shipped lessons with an accurate first-unit pair',()=>{
 assert.deepEqual(links['a1-01'],['pronouns','interrogative-nouns']);
 assert.equal(Object.keys(links).length,12);
 for(const ids of Object.values(links))for(const id of ids)assert.ok(grammar.lessons.some(l=>l.id===id),id);
 for(const id of ['sequence-conjunctions','reason-result','comparison-basic','past-future-context'])assert.equal(grammar.lessons.find(l=>l.id===id).questions.length,8);
});
