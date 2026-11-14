const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),Smart=require('../js/smart-activities.js'),catalog=require('../data/smart-activities.json');
const WB={'youth-two':require('../js/youth-two-data.js'),'youth-book-two-part-one':require('../js/youth-book-two-part-one-data.js')};
test('Classification preserves repeated category choices; matching swaps without duplicating targets or losing identities',()=>{
 assert.deepEqual(Smart.move({a:'اسم',b:'اسم'},'c','اسم','classify'),{a:'اسم',b:'اسم',c:'اسم'});
 assert.deepEqual(Smart.move({a:'x',b:'y'},'a','y','match'),{a:'y',b:'x'});
 assert.deepEqual(Smart.move({b:'y'},'a','y','match'),{a:'y',b:''});
 assert.deepEqual(Smart.move({a:'x',b:'y',c:'y'},'a','y','match'),{a:'y',b:'x',c:''});
 assert.deepEqual(Smart.move({a:'x'},'a','','classify'),{a:''});
});
function validate(spec,tasks){
 assert.deepEqual(spec.items.map(i=>i.id),tasks.map(q=>q.id));assert.ok(spec.items.every(i=>i.label));
 assert.equal(new Set(spec.items.map(i=>i.label)).size,spec.items.length);
 for(const q of tasks){assert.equal(q.kind,'choice');assert.ok(spec.targets.some(t=>t.value===q.answer),q.id);}
 if(spec.kind==='match')assert.equal(new Set(tasks.map(q=>q.answer)).size,tasks.length);
}
test('Reviewed workbook conversions retain all question IDs and canonical answers',()=>{
 let n=0;for(const [key,items]of Object.entries(catalog.workbooks))for(const [id,spec]of Object.entries(items)){validate(spec,WB[key].activities.find(a=>a.id===id).tasks);n++;}assert.equal(n,20);
 const main=catalog.workbooks['youth-two']['c-p24-b2'];assert.equal(main.kind,'classify');assert.deepEqual(main.targets.map(t=>t.value),['اسم','فعل','حرف']);assert.equal(catalog.workbooks['youth-two']['c-p20-b1'].kind,'match');
});
test('Exam interactions leave the original task bank, scoring and printed questions intact',()=>{
 const data=require('../data/exams/bank.json'),core=require('../js/teacher-exams-core.js');let n=0;
 for(const [id,sections]of Object.entries(catalog.exams))for(const [index,spec]of Object.entries(sections)){
  const tasks=data.exams.find(e=>e.id===id).sections[index].tasks;validate(spec,tasks);for(const q of tasks){assert.ok(core.correct(q,q.answer));assert.ok(!core.correct(q,'إجابة لا تطابق المطلوب'));}n++;
 }
 assert.equal(n,21);assert.equal(catalog.inventory.reduce((n,a)=>n+(a.lessons||1),0),69);
});
