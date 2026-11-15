const {test}=require('node:test'),assert=require('node:assert/strict');
const D=require('../js/youth-two-data.js'),bank=require('../data/youth-two/extra-exercises.json');
const ids=['a-p05-b1','a-p05-b2','a-p08-b1','a-p08-b2','b-p10-b1','b-p10-b2','b-p11-b1','b-p11-b2','b-p13-b1','b-p16-b1','c-p17-b1','c-p24-b2'];
test('Exactly the requested twelve activities each expose five distinct six-question exercises',()=>{
 assert.deepEqual(Object.keys(bank.activities).sort(),ids.sort());let count=0;
 for(const id of ids){const a=D.activities.find(a=>a.id===id);assert.ok(a);assert.equal(a.exercises.length,5);const seen=new Set();
  for(const [i,e]of a.exercises.entries()){assert.equal(e.id,'exercise-'+(i+1));assert.equal(e.tasks.length,6);assert.equal(new Set(e.tasks.map(q=>q.id)).size,6);
   for(const q of e.tasks){const signature=q.prompt+'\n'+(q.text||'');assert.ok(!seen.has(signature),id+' duplicate');seen.add(signature);assert.ok(q.explanation);
    if(q.kind==='mark'){const words=q.text.split(/\s+/);assert.ok(q.targets.length>0);assert.equal(new Set(q.targets).size,q.targets.length);assert.ok(q.targets.every(n=>n>=0&&n<words.length));assert.ok(D.isCorrect(q,q.targets));assert.ok(!D.isCorrect(q,[]));}
    else{assert.ok(D.isCorrect(q,q.answer),id+'/'+q.id);assert.ok(!D.isCorrect(q,'جواب غير مناسب'));if(q.kind==='choice'){assert.ok(q.options.includes(q.answer));assert.equal(new Set(q.options).size,q.options.length);}}
    count++;
   }
  }
  assert.equal(seen.size,30);
 }
 assert.equal(count,360);assert.equal(D.activities.length,53);assert.equal(D.activities.reduce((n,a)=>n+a.tasks.length,0),402);
});
function questions(id){return bank.activities[id].flatMap(e=>e.tasks)}
test('Independent lexical fixtures retain correct dual/plural forms and accept omitted vowel marks',()=>{
 const qs=questions('a-p05-b2');
 for(const [word,answer]of [['بَيْتٌ','بيتان'],['حَدِيقَةٌ','حدائق'],['حَقِيبَةٌ','حقائب'],['نَافِذَةٌ','نوافذ'],['كِتَابٌ','كتب']])assert.ok(qs.some(q=>q.prompt.includes(word)&&D.isCorrect(q,answer)),word);
 assert.ok(questions('b-p10-b2').some(q=>q.answer==='النُّفَايَاتِ'&&D.isCorrect(q,'النفايات')&&!D.isCorrect(q,'النفاياتَ')));
 assert.ok(questions('b-p10-b2').some(q=>q.answer==='الْيَدَيْنِ'&&D.isCorrect(q,'اليدين')&&!D.isCorrect(q,'اليدان')));
});
test('Gender and ownership distinguish explicitly wrong masculine/feminine pronoun vowels',()=>{
 const q=questions('b-p16-b1').find(q=>q.requiredPronoun);assert.ok(D.isCorrect(q,'أنتِ مدرسة'));assert.ok(D.isCorrect(q,'أنت مدرسة'));assert.ok(!D.isCorrect(q,'أنتَ مدرسة'));assert.ok(!D.isCorrect(q,'هو مدرس'));
 const own=questions('b-p11-b1');const feminine=own.find(q=>q.answer==='دفتركِ');assert.ok(D.isCorrect(feminine,'دفتركِ'));assert.ok(!D.isCorrect(feminine,'دفتركَ'));assert.ok(!D.isCorrect(feminine,'دفترك'));
 assert.ok(own.some(q=>q.answer==='مدرستي'));assert.ok(own.some(q=>q.answer==='نافذتنا'));
});
test('Verb conversion and marked-word fixtures have independent person/position expectations',()=>{
 const qs=questions('b-p11-b2');for(const [past,answer]of [['كَتَبَ','اكتب'],['فَتَحَ','افتح'],['اِنْتَظَرَ','ينتظر'],['رَتَّبَ','يرتب'],['سَاعَدَ','ساعد']])assert.ok(qs.some(q=>q.prompt.includes(past)&&D.isCorrect(q,answer)),past);
 const q=questions('a-p08-b1').find(q=>q.text==='اِغْسِلْ يَدَيْكَ قَبْلَ أَنْ تَأْكُلَ.');assert.deepEqual(q.targets,[0,4]);assert.ok(!D.isCorrect(q,[0,3]));
 const tense=questions('c-p17-b1');assert.ok(tense.some(q=>q.label==='سَيُسَاعِدُ'&&q.answer==='مضارع دال على المستقبل'));
});
