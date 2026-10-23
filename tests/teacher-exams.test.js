const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const C = require('../js/teacher-exams-core.js');
const root = path.resolve(__dirname, '..'), D = C.data;
const all = D.exams.flatMap(C.tasks);
const strip = text => text.normalize('NFC').replace(/[\u064b-\u0652\u0670]/g,'');
test('All 10 uploaded originals retain exact bytes, all 26 pages have previews, and every page has new exercise coverage', () => {
 assert.equal(D.originals.length,10); assert.equal(D.exams.length,10); assert.equal(all.length,389);
 assert.equal(D.originals.reduce((n,o)=>n+o.pages,0),26);
 assert.equal(new Set(all.map(q=>q.id)).size,389);
 for (const o of D.originals) {
  const bytes=fs.readFileSync(path.join(root,o.pdf)); assert.equal(bytes.length,o.bytes);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),o.sha256);
  assert.equal(o.previews.length,o.pages); assert.equal(o.coverage.length,o.pages);
  for(const image of o.previews) assert.ok(fs.statSync(path.join(root,image)).size>1000);
  const e=D.exams.find(e=>e.source===o.id);assert.ok(e);
  assert.deepEqual([...new Set(e.sections.flatMap(s=>s.sourcePages))].sort(),Array.from({length:o.pages},(_,i)=>i+1));
 }
});
test('Every closed answer is solvable and incorrect or blank answers are rejected; manual responses never receive automatic marks',()=>{
 for(const q of all){
  if(q.kind==='manual'){assert.equal(C.correct(q,q.answer),false); assert.equal(q.rubric.length,3);continue;}
  assert.equal(C.correct(q,undefined),false,q.id);
  if(q.kind==='order'){
   const answer=q.tokens.map((_,i)=>i);assert.equal(C.correct(q,answer),true,q.id);
   assert.equal(C.correct(q,answer.map(()=>0)),false,q.id);
   assert.deepEqual([...q.displayOrder].sort((a,b)=>a-b),answer);
   for(const alt of q.acceptedOrders||[])assert.equal(C.correct(q,alt),true,q.id);
  }else{
   assert.equal(C.correct(q,q.answer),true,q.id);assert.equal(C.correct(q,'جواب غير صحيح'),false,q.id);
   if(q.kind==='choice'){assert.equal(new Set(q.options).size,q.options.length);for(const wrong of q.options.filter(o=>o!==q.answer))assert.equal(C.correct(q,wrong),false);}
   else assert.equal(C.correct(q,strip(q.answer)),true,q.id);
  }
 }
});
test('Optional vowels do not erase meaningful spelling, person or explicitly wrong vowels',()=>{
 assert.ok(C.matches('ترافقين','تُرَافِقِينَ')); assert.ok(!C.matches('ترافقون','تُرَافِقِينَ'));
 assert.ok(!C.matches('تُرافَقين','تُرَافِقِينَ'));
 assert.ok(!C.matches('مدرسه','مَدْرَسَة'));assert.ok(!C.matches('الي','إِلَى'));assert.ok(!C.matches('على','عَلِيّ'));
 assert.ok(!C.matches('تَكْتُبُ','تَكْتُبِينَ'));assert.ok(C.matches('كتاب','كِتَابْ'));
 assert.ok(!C.matches('كَتاب','كِتَابْ'));
 assert.ok(C.matches('عصراً','عَصْرًا'));
});
test('Shadda/vowels travel with their letters; valid authored adverb placements preserve all tokens',()=>{
 const spelling=D.exams.find(e=>e.id==='model-02').sections.find(s=>s.title==='أركب الحروف');
 for(const q of spelling.tasks)for(const token of q.tokens)assert.ok(!/^[\u064b-\u0652]/.test(token));
 const q=all.find(q=>q.kind==='order' && q.tokens.includes('غَدًا'));assert.ok(q.acceptedOrders.length>0);
 assert.ok(C.correct(q,q.acceptedOrders[0]));
});
test('Classroom semantic regressions: nominal sentence with verbal predicate, agreement, evening/afternoon clock, explicit contextual ح/ج',()=>{
 const q=all.find(q=>q.prompt.startsWith('الْأَطْفَالُ يَقْرَؤُونَ'));assert.equal(q.answer,'اِسْمِيَّةٌ');
 assert.equal(all.find(q=>q.prompt==='مَرْيَمُ ___ كِتَابًا.').answer,'تَقْرَأُ');
 assert.equal(all.find(q=>q.prompt.includes('مُهَنْدِسَةٌ تَعْمَلُ')).answer,'هِيَ');
 const time=all.find(q=>q.prompt.endsWith('16:00'));
 assert.ok(C.correct(time,'الرابعة عصرا')); assert.ok(!C.correct(time,'الرابعة صباحا'));
 const gap=all.find(q=>q.prompt.includes('يَسْكُنُ بِجَانِبِنَا'));assert.equal(gap.answer,'ج');
 const model7=D.exams.find(e=>e.id==='model-07'), model10=D.exams.find(e=>e.id==='model-10');
 assert.notEqual(model7.sections[1].passage,model10.sections[1].passage);
});
test('Only eligible closed questions enter the denominator; open work, audio exclusions, and unanswered tasks are reported separately',()=>{
 const e=D.exams.find(e=>e.id==='model-05'), a={answers:{},unavailable:{}};
 for(const q of C.tasks(e))a.answers[q.id]=q.kind==='order'?q.tokens.map((_,i)=>i):q.answer;
 let r=C.result(e,a);assert.equal(r.right,r.total);assert.equal(r.percent,100);
 const dictation=C.tasks(e).filter(q=>q.kind==='dictation');assert.equal(dictation.length,8);
 a.unavailable[dictation[0].id]=true;a.answers[dictation[1].id]='';r=C.result(e,a);
 assert.equal(r.skipped,1);assert.equal(r.unanswered,1);assert.equal(r.right,r.total-1);
 const open=D.exams.find(e=>e.id==='model-01');let result=C.result(open,{answers:{},unavailable:{}});assert.equal(result.manual,3);assert.equal(result.manualAnswered,0);
});
test('Draft and result updates preserve placement, vocabulary, reading, learning route and unknown future stats fields',()=>{
 const old={totalTests:8,placementV1:{attempts:{prior:{score:7}}},phonicsV1:{x:1},learningRouteV1:{lastStage:'reading'},future:{value:true}};
 const a={id:'x',examId:'model-01',updatedAt:1,answers:{q:'نص'},status:'draft'};
 const saved=C.saveAttempt(old,a);assert.deepEqual(old,{totalTests:8,placementV1:{attempts:{prior:{score:7}}},phonicsV1:{x:1},learningRouteV1:{lastStage:'reading'},future:{value:true}});
 for(const key of Object.keys(old))assert.deepEqual(saved[key],old[key]);
 assert.equal(saved.teacherExamsV1.attempts.x.answers.q,'نص');
 let many=saved;for(let i=2;i<25;i++)many=C.saveAttempt(many,{id:String(i),updatedAt:i});assert.equal(Object.keys(many.teacherExamsV1.attempts).length,10);assert.ok(!many.teacherExamsV1.attempts.x);
});
test('All eight dictation files and two writing illustrations are local; regeneration is deterministic',()=>{
 const dictation=all.filter(q=>q.kind==='dictation');assert.equal(dictation.length,8);
 for(const q of dictation)assert.ok(fs.statSync(path.join(root,q.audio)).size>500);
 const images=all.flatMap(q=>q.images||[]);assert.equal(images.length,2);for(const p of images)assert.ok(fs.existsSync(path.join(root,p)));
 assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root,'data/exams/bank.json'))),D);
});
test('The existing cloud merge retains separate exam drafts from two devices and a concurrent placement result',()=>{
 const sync=require('../js/cloud-sync-core.js');
 const base={totalTests:4};
 const local=C.saveAttempt(base,{id:'device-a',updatedAt:1,answers:{q1:'أَنَا'},status:'draft'});
 const remote={...C.saveAttempt(base,{id:'device-b',updatedAt:2,answers:{q2:'قَلَمٌ'},status:'finished'}),placementV1:{attempts:{placement:{score:5}}}};
 const merged=JSON.parse(sync.mergeValue('learningStats',{base:JSON.stringify(base),value:JSON.stringify(local)},JSON.stringify(remote)));
 assert.deepEqual(Object.keys(merged.teacherExamsV1.attempts).sort(),['device-a','device-b']);
 assert.deepEqual(merged.placementV1,remote.placementV1);assert.equal(merged.totalTests,4);
});
