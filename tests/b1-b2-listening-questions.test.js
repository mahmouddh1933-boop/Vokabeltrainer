const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
const data=require('../data/b1-b2-units.json');const norm=s=>s.normalize('NFD').replace(/\p{M}|[^\p{L}\p{N}]/gu,'');
test('All 40 units have two distinct, evidenced listening questions and varied correct positions',()=>{
 const prompts=[],answers=[];
 for(const u of data.units){assert.equal(u.listening.quizVersion,2);assert.equal(u.listening.quiz.length,2);
 for(const q of u.listening.quiz){assert.equal(q.opts.length,3);assert.equal(new Set(q.opts).size,3);assert.ok(Number.isInteger(q.a)&&q.a>=0&&q.a<3);assert.ok(norm(u.listening.script).includes(norm(q.evidence)));assert.ok(q.evidence.length>40);assert.ok(!q.q.includes('قبل اتخاذ القرار'));prompts.push(q.q);answers.push(q.a);}}
 assert.equal(new Set(prompts).size,80);assert.deepEqual([...new Set(answers)].sort(),[0,1,2]);
});
test('Standalone browser data matches the canonical quizzes',()=>{const context={window:{}};vm.runInNewContext(fs.readFileSync('js/b1-b2-units-data.js','utf8'),context);assert.equal(JSON.stringify(context.window.HuroofAdvancedUnits),JSON.stringify(data));});
