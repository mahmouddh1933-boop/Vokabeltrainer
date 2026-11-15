const {test}=require('node:test');const assert=require('node:assert/strict');
const {lessons}=require('../js/grammar-data.js');
const examples=id=>lessons.find(l=>l.id===id).sections.flatMap(s=>s.examples||[]);
const marked=e=>e.annotations.map(a=>e.ar.slice(a.start,a.end));
test('Requested lessons annotate exact visible signs and keep text intact',()=>{
 for(const id of ['imperative-construction','present-inflection','five-verbs','defective-verbs','inna-particles','numerals','hamza-medial'])for(const e of examples(id)){
  assert.ok(e.annotations?.length,id+' '+e.ar);const ranges=[...e.annotations].sort((a,b)=>a.start-b.start);let end=0;
  for(const a of ranges){assert.ok(a.start>=end&&a.end>a.start&&a.end<=e.ar.length,e.ar);end=a.end;}
 }
 assert.deepEqual(marked(examples('five-verbs')[0]),['نِ']);
 assert.deepEqual(marked(examples('imperative-construction')[2]),['عَ','عُ','مِ']);
 assert.deepEqual(marked(examples('numerals')[0]),['وَاحِدٌ','اثْنَتَانِ']);
 assert.deepEqual(marked(examples('numerals')[6]),['مِئَةُ','أَلْفُ']);
});
test('Operators, subjects and predicates use three distinct roles',()=>{
 for(const id of ['defective-verbs','inna-particles'])for(const e of examples(id))assert.deepEqual(e.annotations.map(a=>a.role),['operator','subject','predicate']);
});
test('Medial hamza separates the two vowels, and long vowels share the highlight',()=>{
 const e=examples('hamza-medial')[0];assert.deepEqual(marked(e),['ئ','ُ','ِ','ؤ','ُ','ْ','أ','َ','َ']);
 assert.deepEqual(marked(examples('hamza-medial')[1]),['اءَ','وءَ']);
 assert.deepEqual(marked(examples('hamza-medial')[2]),['يْئَ','يئَ']);
});
